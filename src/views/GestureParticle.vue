<template>
    <div class="particle-system">
        <video ref="videoRef" class="hidden-video" autoplay playsinline muted></video>
        <canvas ref="canvasRef"></canvas>

        <div class="ui-overlay">
            <div class="stats">
                <span :class="{ 'low-fps': fps < 40 }">⚡ FPS: {{ fps }}</span>
                <span>💎 Particles: {{ particleCount }}</span>
            </div>

            <div class="controls-info">
                <div class="control-card left" :class="{ active: leftHandActive }">
                    <div class="hand-icon">✋ 左手</div>
                    <div class="label">预选内容</div>
                    <div class="value">{{ pendingText }}</div>
                </div>

                <div class="control-card right" :class="{ active: rightHandActive }">
                    <div class="hand-icon">✊ 右手</div>
                    <div class="label">聚合强度</div>
                    <div class="progress-bar">
                        <div class="fill" :style="{ width: (gatherFactor * 100) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!leftHandActive && !rightHandActive" class="guide-overlay">
            展示双手以开启 AI 交互
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

// --- 常量配置 ---
const CONFIG = {
  sampleStep: 4,
  fontSize: 150,
  particleSize: 2,
  lerpSpeed: 0.1,    // 坐标跟随速度
  handSmooth: 0.15,   // 手势平滑度
  maxDispersion: 500 // 散开半径
};

const gestureMap: Record<number, string> = {
  0: '等待手势...', 1: '你好', 2: '节日快乐', 3: '好久不见'
};

// --- 响应式状态 ---
const canvasRef = ref<HTMLCanvasElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const fps = ref(0);
const particleCount = ref(0);
const leftHandActive = ref(false);
const rightHandActive = ref(false);
const pendingGesture = ref(1);
const gatherFactor = ref(0); // 0: 散开, 1: 完全聚合

const pendingText = computed(() => gestureMap[pendingGesture.value]);

// --- 核心变量 (非响应式以保证性能) ---
let ctx: CanvasRenderingContext2D | null = null;
let pData: Float32Array; 
// Stride: 0:currX, 1:currY, 2:baseX, 3:baseY, 4:targetX, 5:targetY, 6:r, 7:g, 8:b, 9:randX, 10:randY
const STRIDE = 11;

let landmarker: HandLandmarker;
let rawGather = 0;
let lastTime = 0;
let animId: number;
let debounceCount = 0;
let lastPredict = 0;

// --- 初始化粒子 ---
const initSystem = (text: string) => {
  if (!canvasRef.value || !ctx) return;
  const { width: w, height: h } = canvasRef.value;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "white";
  ctx.font = `bold ${CONFIG.fontSize}px "Microsoft YaHei"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);

  const pixels = ctx.getImageData(0, 0, w, h).data;
  const temp = [];

  for (let y = 0; y < h; y += CONFIG.sampleStep) {
    for (let x = 0; x < w; x += CONFIG.sampleStep) {
      if (pixels[(y * w + x) * 4 + 3] > 128) {
        const angle = Math.random() * Math.PI * 2;
        temp.push({
          x: x, y: y,
          r: 100 + (x / w) * 155,
          g: 150 + (y / h) * 105,
          b: 255,
          dx: Math.cos(angle), dy: Math.sin(angle)
        });
      }
    }
  }

  particleCount.value = temp.length;
  pData = new Float32Array(temp.length * STRIDE);
  
  for (let i = 0; i < temp.length; i++) {
    const o = i * STRIDE;
    const p = temp[i];
    pData[o] = pData[o + 2] = pData[o + 4] = p.x;
    pData[o + 1] = pData[o + 3] = pData[o + 5] = p.y;
    pData[o + 6] = p.r; pData[o + 7] = p.g; pData[o + 8] = p.b;
    pData[o + 9] = p.dx; pData[o + 10] = p.dy;
  }
};

// --- 更新目标坐标 (左手触发) ---
const updateTargetLayout = (text: string) => {
  if (!canvasRef.value || !ctx) return;
  const w = canvasRef.value.width;
  const h = canvasRef.value.height;

  const offCanvas = document.createElement('canvas');
  offCanvas.width = w; offCanvas.height = h;
  const offCtx = offCanvas.getContext('2d')!;
  offCtx.fillStyle = "white";
  offCtx.font = `bold ${CONFIG.fontSize}px "Microsoft YaHei"`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(text, w / 2, h / 2);

  const pixels = offCtx.getImageData(0, 0, w, h).data;
  let pIdx = 0;
  const count = particleCount.value;

  for (let y = 0; y < h && pIdx < count; y += CONFIG.sampleStep) {
    for (let x = 0; x < w && pIdx < count; x += CONFIG.sampleStep) {
      if (pixels[(y * w + x) * 4 + 3] > 128) {
        const o = pIdx * STRIDE;
        pData[o + 4] = x; 
        pData[o + 5] = y;
        pIdx++;
      }
    }
  }
};

// --- 渲染循环 ---
const render = (time: number) => {
  if (!ctx || !canvasRef.value) return;

  // FPS
  fps.value = Math.round(1000 / (time - lastTime));
  lastTime = time;

  // 平滑右手聚合度
  gatherFactor.value += (rawGather - gatherFactor.value) * CONFIG.handSmooth;

  const w = canvasRef.value.width;
  const h = canvasRef.value.height;
  const gf = gatherFactor.value;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < particleCount.value; i++) {
    const o = i * STRIDE;

    // 计算当前应该去的位置
    // 右手张开(gf->0): 目标是 baseX + 随机位移
    // 右手握拳(gf->1): 目标是 targetX (左手选中的文字坐标)
    const scatterX = pData[o + 2] + pData[o + 9] * CONFIG.maxDispersion;
    const scatterY = pData[o + 3] + pData[o + 10] * CONFIG.maxDispersion;
    
    const targetX = scatterX * (1 - gf) + pData[o + 4] * gf;
    const targetY = scatterY * (1 - gf) + pData[o + 5] * gf;

    // 坐标平滑追随
    pData[o] += (targetX - pData[o]) * CONFIG.lerpSpeed;
    pData[o + 1] += (targetY - pData[o + 1]) * CONFIG.lerpSpeed;

    ctx.fillStyle = `rgb(${pData[o+6]},${pData[o+7]},${pData[o+8]})`;
    ctx.fillRect(pData[o], pData[o+1], CONFIG.particleSize, CONFIG.particleSize);
  }

  animId = requestAnimationFrame(render);
};

// --- AI 手势识别 ---
const setupAI = async () => {
  const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
  landmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { 
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU" 
    },
    runningMode: "VIDEO", numHands: 2
  });

  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
  videoRef.value!.srcObject = stream;
  videoRef.value!.onloadeddata = predict;
};

const predict = () => {
  const results = landmarker.detectForVideo(videoRef.value!, performance.now());
  
  leftHandActive.value = false;
  rightHandActive.value = false;

  results.handedness.forEach((hand, idx) => {
    const label = hand[0].categoryName; 
    const marks = results.landmarks[idx];

    // 逻辑分工：此处根据镜像习惯，通常画面左侧(识别为Right)控文字，右侧控聚合
    if (label === 'Right') { 
      leftHandActive.value = true;
      const count = [marks[8], marks[12], marks[16]].filter((m, i) => m.y < marks[[6, 10, 14][i]].y).length;
      if (count > 0 && count === lastPredict) {
        if (++debounceCount > 15) {
          if (pendingGesture.value !== count) {
            pendingGesture.value = count;
            updateTargetLayout(gestureMap[count]);
          }
        }
      } else {
        lastPredict = count; debounceCount = 0;
      }
    } else {
      rightHandActive.value = true;
      const dist = Math.hypot(marks[0].x - marks[12].x, marks[0].y - marks[12].y);
      // 0.12(握拳)->1, 0.35(张开)->0
      let f = 1 - (dist - 0.12) / 0.23;
      rawGather = Math.max(0, Math.min(1, f));
    }
  });

  requestAnimationFrame(predict);
};

onMounted(() => {
  const cvs = canvasRef.value!;
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  ctx = cvs.getContext('2d', { alpha: false });
  initSystem(gestureMap[1]);
  render(0);
  setupAI();
});

onUnmounted(() => {
  cancelAnimationFrame(animId);
});
</script>

<style scoped>
.particle-system {
    width: 100vw;
    height: 100vh;
    background: #000;
    position: relative;
    overflow: hidden;
}

.hidden-video {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
}

.ui-overlay {
    position: absolute;
    top: 30px;
    left: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    pointer-events: none;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.stats {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #0f0;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 12px;
    border-radius: 4px;
}

.low-fps {
    color: #f33;
}

.controls-info {
    display: flex;
    gap: 15px;
}

.control-card {
    background: rgba(20, 25, 30, 0.8);
    border: 1px solid #333;
    padding: 15px;
    border-radius: 12px;
    width: 150px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-card.active {
    border-color: #0ff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
    transform: translateY(-5px);
}

.hand-icon {
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
}

.label {
    font-size: 10px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.value {
    font-size: 20px;
    color: #0ff;
    margin-top: 5px;
    font-weight: bold;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: #222;
    border-radius: 3px;
    margin-top: 10px;
    overflow: hidden;
}

.fill {
    height: 100%;
    background: #0ff;
    transition: width 0.1s linear;
}

.guide-overlay {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    color: #555;
    letter-spacing: 4px;
    font-size: 14px;
}
</style>