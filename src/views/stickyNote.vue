<template>
    <div class="heart-wall-container" @click="handleGlobalClick">
        <div id="container">
            <div
                 v-for="(card, index) in cards"
                 :key="index"
                 :class="['card', card.colorClass]"
                 :style="{
          transform: `translate3d(${card.x}px, ${card.y}px, 0) rotate(${card.rotate}deg)`,
          zIndex: card.zIndex,
          opacity: card.opacity,
          transition: card.transition
        }">
                <span>{{ card.message }}</span>
            </div>
        </div>

        <div v-if="showHint" class="hint-overlay">
            <div class="hint-text">{{ hintText }}</div>
        </div>

        <Transition name="fade">
            <div v-if="overlayActive" class="overlay" @click.stop="closeOverlay">
                <div class="big-card">
                    <div class="card-icon">❤</div>
                    <div class="card-text">{{ selectedMessage }}</div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

// --- 类型定义 ---
interface Card {
  message: string;
  colorClass: string;
  x: number;
  y: number;
  rotate: number;
  zIndex: number;
  opacity: number;
  transition: string;
}

type State = 'forming' | 'waiting' | 'exploding' | 'exploded';

// --- 常量与状态 ---
const MESSAGES = ["好好爱自己", "期待下次见面", "顺顺利利", "保持好心情", "早点休息", "多喝热水", "你是最棒的", "未来可期", "梦想成真", "元气满满", "生活明朗", "记得吃早餐", "天天开心", "好运连连", "万事胜意", "平安喜乐", "心想事成", "不负韶华","工作顺利"];
const CARD_COUNT = 180;

const cards = ref<Card[]>([]);
const state = ref<State>('forming');
const overlayActive = ref(false);
const selectedMessage = ref('');
const showHint = ref(false);

const hintText = computed(() => 
  state.value === 'waiting' ? '点击屏幕，开启惊喜 ✨' : '点击抽取专属卡片 ✨'
);

// --- 逻辑实现 ---

// 初始化卡片初始位置（屏幕两侧穿插）
const initCards = () => {
  const tempCards: Card[] = [];
  for (let i = 0; i < CARD_COUNT; i++) {
    const isRightSide = i % 2 !== 0;
    const startX = isRightSide ? window.innerWidth + 300 : -300;
    const startY = Math.random() * window.innerHeight;
    
    tempCards.push({
      message: MESSAGES[i % MESSAGES.length],
      colorClass: `c${(i % 4) + 1}`,
      x: startX,
      y: startY,
      rotate: isRightSide ? 90 : -90,
      zIndex: i,
      opacity: 0,
      transition: 'none'
    });
  }
  cards.value = tempCards;
};

// 开始 10 秒慢速拼心
const startForming = () => {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const scale = Math.min(screenW * 0.85, screenH * 0.65) / 32;
  const centerX = screenW / 2;
  const centerY = screenH / 2 - (scale * 1.5);
  
  const totalTime = 10000;
  const interval = totalTime / CARD_COUNT;

  cards.value.forEach((_, i) => {
    setTimeout(() => {
      const step = (i / CARD_COUNT) * 2 * Math.PI;
      // 心形参数方程
      const tx = 16 * Math.pow(Math.sin(step), 3);
      const ty = -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step));

      // 响应式卡片偏移量计算 (简单模拟 offsetWidth)
      const isMobile = screenW < 768;
      const cardW = isMobile ? 90 : 125;
      const cardH = isMobile ? 48 : 65;

      const targetX = centerX + tx * scale - cardW / 2;
      const targetY = centerY + ty * scale - cardH / 2;
      
      let rotation = tx * 1.1;
      if (Math.abs(tx) < 1.5) rotation = 0;

      // 更新响应式数据
      cards.value[i].opacity = 1;
      cards.value[i].transition = 'transform 2.5s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.8s ease';
      cards.value[i].x = targetX;
      cards.value[i].y = targetY;
      cards.value[i].rotate = rotation;
      cards.value[i].zIndex = i; // 叠层效果：后来的在上层

      if (i === CARD_COUNT - 1) {
        setTimeout(() => {
          state.value = 'waiting';
          showHint.value = true;
        }, 2500);
      }
    }, i * interval);
  });
};

// 爆炸效果
const explode = () => {
  state.value = 'exploding';
  showHint.value = false;

  cards.value.forEach((card, i) => {
    const targetX = Math.random() * (window.innerWidth + 200) - 200;
    const targetY = Math.random() * (window.innerHeight + 200) - 200;
    const rotation = (Math.random() - 0.5) * 120;

    card.transition = 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
    card.x = targetX;
    card.y = targetY;
    card.rotate = rotation;
    card.zIndex = Math.floor(Math.random() * CARD_COUNT);
  });

  setTimeout(() => {
    state.value = 'exploded';
    showHint.value = true;
  }, 1200);
};

// 全屏点击处理
const handleGlobalClick = () => {
  if (state.value === 'waiting') {
    explode();
  } else if (state.value === 'exploded') {
    selectedMessage.value = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    overlayActive.value = true;
  }
};

const closeOverlay = () => {
  overlayActive.value = false;
};

// 生命周期管理
onMounted(() => {
  initCards();
  startForming();
  window.addEventListener('resize', () => {
    if (state.value === 'forming') location.reload();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {});
});
</script>

<style scoped>
.heart-wall-container {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    overflow: hidden;
    position: relative;
    cursor: pointer;
}

#container {
    position: relative;
    width: 100%;
    height: 100%;
}

.card {
    position: absolute;
    width: 90px;
    height: 48px;
    padding: 8px 4px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
    color: #444;
    border: 1px solid rgba(0, 0, 0, 0.02);
    background: linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%);
    box-sizing: border-box;
    pointer-events: none;
    /* 卡片不阻挡背景点击 */
}

@media (min-width: 768px) {
    .card {
        width: 125px;
        height: 65px;
        font-size: 14px;
    }
}

.card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
}

.c1::after {
    background: #ffadad;
}

.c1 {
    border-left: 3px solid #ffadad;
}

.c2::after {
    background: #9bf6ff;
}

.c2 {
    border-left: 3px solid #9bf6ff;
}

.c3::after {
    background: #ffd6a5;
}

.c3 {
    border-left: 3px solid #ffd6a5;
}

.c4::after {
    background: #caffbf;
}

.c4 {
    border-left: 3px solid #caffbf;
}

.hint-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    text-align: center;
    pointer-events: none;
}

.hint-text {
    color: #ff758c;
    font-size: 18px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.7);
    display: inline-block;
    padding: 12px 28px;
    border-radius: 40px;
    backdrop-filter: blur(8px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    animation: breathe 2s infinite ease-in-out;
}

@keyframes breathe {

    0%,
    100% {
        opacity: 0.7;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.05);
    }
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(15px);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.big-card {
    width: 85%;
    max-width: 350px;
    height: 180px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    text-align: center;
    border-left: 10px solid #ff758c;
}

.card-icon {
    font-size: 40px;
    color: #ff758c;
    margin-bottom: 10px;
}

.card-text {
    font-size: 24px;
    color: #333;
    font-weight: bold;
}

/* Vue 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>