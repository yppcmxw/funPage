<template>
    <div class="shrine-container">
        <div class="ink-bg"></div>
        <div class="content-wrapper">
            <header class="zen-header">
                <h1>问卜 <span class="divider">·</span> 赛博灵签</h1>
                <p class="subtitle">心诚则灵，摇签问前程</p>
            </header>

            <div class="divination-area">
                <div class="cylinder-wrap" :class="{ 'is-shaking': isShaking, 'is-dimmed': isDrawn }"
                     @click="drawFortune">
                    <div class="cylinder">
                        <div class="stick-group">
                            <div v-for="i in 7" :key="i" class="stick-deco"
                                 :style="{ transform: `rotate(${i * 5 - 20}deg)` }"></div>
                        </div>
                        <div class="cylinder-body"><span>灵</span><span>签</span></div>
                    </div>
                    <div class="result-stick" :class="{ 'is-drawn': isDrawn }">
                        <div class="stick-content">
                            <span class="luck-type">{{ currentFortune?.title.split(' · ')[0] }}</span>
                        </div>
                    </div>
                </div>

                <transition name="zen-fade">
                    <div v-if="showDetail" class="fortune-detail">
                        <div class="detail-inner">
                            <div class="seal">御守</div>
                            <h2 :style="{ color: currentFortune?.color }">{{ currentFortune?.title }}</h2>
                            <div class="zen-divider"></div>
                            <p class="desc">{{ currentFortune?.desc }}</p>
                            <div class="zen-divider"></div>
                            <button class="reset-btn" @click="reset">谢签归位</button>
                        </div>
                    </div>
                </transition>
            </div>

            <div class="footer-hint">
                <p v-if="!isShaking && !isDrawn">{{ bottomHint }}</p>
                <p v-if="isShaking">聆听签鸣，因果流转...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Fortune {
  title: string;
  desc: string;
  color: string;
}

const fortuneLibrary: Fortune[] = [
  { title: '大吉 · 龙德耀辉', desc: '金穴忽开，财源滚滚。今日运势如虹，所求皆办，宜积极进取，大展宏图。', color: '#b2945e' },
  { title: '大吉 · 万象更新', desc: '枯木逢春，推陈出新。过往阴霾一扫而空，正是开启新计划的最佳时机。', color: '#b2945e' },
  { title: '大吉 · 贵人扶持', desc: '得道多助，左右逢源。事业上有长辈指引，情缘上有良人相伴，事半功倍。', color: '#b2945e' },
  { title: '上吉 · 锦鲤附体', desc: '诸事顺遂，身心怡然。会有意想不到的小惊喜降临，平凡日子亦有光芒。', color: '#c05640' },
  { title: '上吉 · 灵感喷涌', desc: '思维敏捷，妙笔生花。今日适合创作、学习或决策，直觉极度灵敏。', color: '#c05640' },
  { title: '上吉 · 姻缘暗动', desc: '桃花微风，暗香浮动。单身者易有良缘偶遇，有伴者感情升温，宜倾听。', color: '#c05640' },
  { title: '中吉 · 稳扎稳打', desc: '耕耘有时，收获在即。虽然节奏稍慢，但胜在根基深厚，循序渐进方为上策。', color: '#4a657a' },
  { title: '中吉 ·順水行舟', desc: '借力使力，事半功倍。不必急于强求，顺应大势而行，自会有满意的结果。', color: '#4a657a' },
  { title: '中吉 · 且慢且思', desc: '欲速则不达。今日宜停下脚步整理思路，在沉淀中蓄势，未来可期。', color: '#4a657a' },
  { title: '小吉 · 平安喜乐', desc: '虽无大波澜，胜在安稳从容。家中温馨，身体康泰，是休养生息的好日子。', color: '#5d7259' },
  { title: '小吉 · 聚沙成塔', desc: '莫以善小而不为。今日点滴积累，终将汇聚成海，适合处理繁琐小事。', color: '#5d7259' },
  { title: '小吉 · 遇简则美', desc: '生活化繁为简。今日适合断舍离，清理周遭环境，心情也会随之明朗。', color: '#5d7259' },
  { title: '平签 · 顺其自然', desc: '宠辱不惊，闲看花开。今日运势平稳，不宜大开大合，守成即是进步。', color: '#7a7a7a' },
  { title: '平签 · 宜静不宜动', desc: '静若子鼠，守志安常。适合深耕专业领域，不宜远行或做重大变更。', color: '#7a7a7a' },
  { title: '平签 · 自省吾身', desc: '反求诸己，内观自省。今日虽无外财，但却是精进内心、提升格局的好时机。', color: '#7a7a7a' }
];

const hints = ["点击签筒 · 开启今日运势", "心若诚，则灵响应", "万物守恒，静候吉时", "一签问前程，落定皆因缘"];
const bottomHint = ref(hints[0]);

const isShaking = ref(false);
const isDrawn = ref(false);
const showDetail = ref(false);
const currentFortune = ref<Fortune | null>(null);

let shakeAudio: HTMLAudioElement;
let drawAudio: HTMLAudioElement;

onMounted(() => {
  shakeAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  shakeAudio.loop = true;
  drawAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/607/607-preview.mp3');
});

const drawFortune = () => {
  if (isShaking.value || isDrawn.value) return;

  isShaking.value = true;
  shakeAudio.play().catch(() => {});

  if ('vibrate' in navigator) {
    navigator.vibrate([100, 30, 100, 30, 100]);
  }

  setTimeout(() => {
    isShaking.value = false;
    shakeAudio.pause();
    
    isDrawn.value = true;
    drawAudio.play();
    
    currentFortune.value = fortuneLibrary[Math.floor(Math.random() * fortuneLibrary.length)];
    
    setTimeout(() => {
      showDetail.value = true;
    }, 700);
  }, 1600);
};

const reset = () => {
  showDetail.value = false;
  setTimeout(() => {
    isDrawn.value = false;
    currentFortune.value = null;
    bottomHint.value = hints[Math.floor(Math.random() * hints.length)];
  }, 300);
};
</script>


<style scoped>
/* 容器设计 */
.shrine-container {
    min-height: 100vh;
    background-color: #f7f3ee;
    background-image: radial-gradient(#e8e3d9 1px, transparent 1px);
    background-size: 20px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif;
    color: #3e3a36;
    position: relative;
    overflow: hidden;
}

.content-wrapper {
    width: 100%;
    max-width: 400px;
    z-index: 2;
    text-align: center;
}

/* 头部样式 */
.zen-header {
    margin-bottom: 50px;
}

.zen-header h1 {
    font-size: 1.8rem;
    font-weight: 300;
    letter-spacing: 0.5rem;
    margin-bottom: 12px;
}

.zen-header .divider {
    color: #c05640;
}

.subtitle {
    font-size: 0.9rem;
    color: #a09a8e;
    letter-spacing: 0.2rem;
}

/* 抽签区域 */
.divination-area {
    position: relative;
    height: 380px;
    display: flex;
    justify-content: center;
}

.cylinder-wrap {
    position: relative;
    cursor: pointer;
    transition: opacity 0.5s;
}

.cylinder-wrap.is-dimmed {
    opacity: 0.3;
    pointer-events: none;
}

/* 签筒 UI */
.cylinder {
    position: relative;
    width: 110px;
    height: 170px;
    background: #3a3633;
    border-radius: 8px 8px 4px 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
}

.cylinder-body {
    border: 1px solid #b2945e;
    color: #b2945e;
    padding: 12px 6px;
    display: flex;
    flex-direction: column;
    font-size: 1.1rem;
    line-height: 1.2;
    letter-spacing: 2px;
}

.stick-group {
    position: absolute;
    top: -35px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.stick-deco {
    width: 6px;
    height: 70px;
    background: #4a4542;
    border-radius: 3px;
    margin: 0 1px;
}

/* 结果签条 */
.result-stick {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 220px;
    background: #b2945e;
    z-index: 4;
    transition: transform 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    padding-top: 15px;
}

.result-stick.is-drawn {
    transform: translateX(-50%) translateY(-220px);
}

.stick-content {
    writing-mode: vertical-rl;
    color: #fff;
    font-size: 0.8rem;
    letter-spacing: 3px;
    font-weight: bold;
}

/* 动画：摇晃 */
.is-shaking {
    animation: shake-animation 0.1s infinite;
}

@keyframes shake-animation {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }

    25% {
        transform: translate(2px, -2px) rotate(2deg);
    }

    50% {
        transform: translate(-2px, 2px) rotate(-2deg);
    }

    75% {
        transform: translate(2px, 2px) rotate(1deg);
    }

    100% {
        transform: translate(0, 0) rotate(0deg);
    }
}

/* 详情卡片 */
.fortune-detail {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
}

.detail-inner {
    background: #fff;
    width: 300px;
    padding: 50px 30px;
    border-radius: 2px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    position: relative;
    border: 1px solid #eee;
}

.seal {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    border: 2px solid #c05640;
    color: #c05640;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    transform: rotate(15deg);
    opacity: 0.6;
}

.detail-inner h2 {
    font-size: 1.6rem;
    margin-bottom: 20px;
    letter-spacing: 4px;
}

.zen-divider {
    width: 40px;
    height: 1px;
    background: #ddd;
    margin: 25px auto;
}

.desc {
    line-height: 2;
    font-size: 1rem;
    color: #666;
    text-align: justify;
}

.reset-btn {
    margin-top: 20px;
    background: transparent;
    border: 1px solid #333;
    padding: 10px 40px;
    color: #333;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 2px;
}

.reset-btn:hover {
    background: #333;
    color: #fff;
}

.footer-hint {
    margin-top: 30px;
    font-size: 0.85rem;
    color: #b6b0a6;
    letter-spacing: 1px;
}

/* 动画效果 */
.zen-fade-enter-active,
.zen-fade-leave-active {
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.zen-fade-enter-from,
.zen-fade-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>