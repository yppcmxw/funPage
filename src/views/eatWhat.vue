<template>
    <div class="app-container">
        <div class="content-card">
            <h1 class="title">🍱 今天吃什么</h1>

            <div class="province-navbar">
                <div class="scroll-container">
                    <button
                            v-for="(list, province) in foodData"
                            :key="province"
                            :class="['province-tab', { active: currentProvince === province }]"
                            @click="changeProvince(province as string)">
                        {{ province }}
                    </button>
                </div>
            </div>

            <p class="desc">正在探索：{{ currentProvince }} · {{ items.length }}道特色菜</p>

            <div class="lucky-wheel-stage">
                <div class="wheel-main" :style="wheelTransformStyle" @transitionend="handleFinish">
                    <div class="wheel-canvas" :style="wheelBgStyle">
                        <div
                             v-for="(text, i) in items"
                             :key="i"
                             class="segment-item"
                             :style="getSegmentRotate(i)">
                            <span class="segment-text">{{ text }}</span>
                        </div>
                    </div>
                </div>
                <div class="wheel-pointer"></div>
                <button class="spin-center-btn" :disabled="isRotating" @click="start">
                    <div class="btn-visual">{{ isRotating ? '...' : 'GO' }}</div>
                </button>
            </div>

            <div class="disclaimer-bar">
                <span class="icon">⚠️</span>
                声明：美食数据仅供娱乐参考，非官方权威统计。
            </div>
        </div>

        <Transition name="fade-pop">
            <div v-if="showResult" class="result-mask" @click.self="showResult = false">
                <div class="result-card">
                    <div class="result-tag">{{ currentProvince }}风味</div>
                    <p class="result-hint">命中今日美味</p>
                    <h2 class="result-name">{{ result }}</h2>
                    <button class="action-btn" @click="showResult = false">确定</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const foodData: Record<string, string[]> = {
  '四川': ['麻婆豆腐', '回锅肉', '宫保鸡丁', '夫妻肺片', '辣子鸡', '水煮鱼', '毛血旺', '蒜泥白肉', '鱼香肉丝', '钵钵鸡', '串串香', '自贡冷吃兔', '宜宾燃面', '冒菜', '甜水面', '乐山烧烤', '担担面', '红油抄手', '赖汤圆', '川式火锅'],
  '广东': ['白切鸡', '深井烧鹅', '蜜汁叉烧', '红烧乳鸽', '广式肠粉', '虾饺', '烧卖', '豉汁凤爪', '煲仔饭', '皮蛋瘦肉粥', '云吞面', '菠萝咕噜肉', '糯米鸡', '双皮奶', '顺德鱼生', '盐焗鸡', '干炒牛河', '潮州手打牛丸', '红米肠', '萝卜糕'],
  '香港': ['丝袜奶茶', '菠萝油', '咖喱鱼蛋', '避风塘炒蟹', '烧腊双拼', '鲜虾云吞面', '鸡蛋仔', '杨枝甘露', '艇仔粥', '滑蛋虾仁', '西多士', '酥皮蛋挞', '猪扒包', '碗仔翅', '车仔面', '港式打边炉', '桥底辣蟹', '瑞士鸡翼', '豉汁蒸排骨', '流沙包'],
  '西餐': ['惠灵顿牛排', '战斧牛排', '玛格丽特披萨', '意大利肉酱面', '凯撒沙拉', '奶油蘑菇汤', '芝士汉堡', '炸鱼薯条', '西班牙海鲜饭', '法式焗蜗牛', '德国烤猪肘', '墨西哥塔可', '班尼迪克蛋', '红酒炖牛肉', '罗宋汤', '提拉米苏', '舒芙蕾', '龙虾意面', '美式烤肋排', '培根三明治'],
  '日料': ['豚骨拉面', '刺身拼盘', '天妇罗', '鳗鱼饭', '寿喜烧', '大阪烧', '日式咖喱饭', '三文鱼寿司', '亲子丼', '炸猪排', '关东煮', '铁板烧', '乌冬面', '荞麦面', '纳豆拌饭', '日式烤肉', '章鱼小丸子', '铜锣烧', '茶碗蒸', '味噌汤'],
  '韩餐': ['韩式烤肉', '石锅拌饭', '泡菜汤', '炸酱面', '韩式炸鸡', '大酱汤', '辣炒年糕', '冷面', '参鸡汤', '紫菜包饭', '部队火锅', '海鲜葱饼', '辣白菜五花肉', '脊骨土豆汤', '芝士排骨', '炒杂菜', '辣牛肉汤', '鸡蛋卷', '生拌牛肉', '炒章鱼'],
  '东南亚': ['冬阴功汤', '越南河粉', '海南鸡饭', '肉骨茶', '泰式咖喱蟹', '芒果糯米饭', '越式春卷', '菠萝炒饭', '青木瓜沙拉', '娘惹菜', '印尼炒饭', '沙嗲肉串', '椰浆饭', '炭烧猪颈肉', '咖喱牛腩', '柠檬蒸鱼', '虾酱空心菜', '越南法棍', '泰式奶茶', '叻沙'],
  '东北': ['锅包肉', '地三鲜', '小鸡炖蘑菇', '猪肉炖粉条', '酸菜白肉', '地道杀猪菜', '大拉皮', '尖椒干豆腐', '酱骨架', '哈尔滨红肠', '拔丝地瓜', '延吉冷面', '烤冷面', '熏肉大饼', '溜肉段', '东北乱炖', '松仁小肚', '韭菜盒子', '酸菜饺子', '大酱蘸鲜菜'],
  '上海': ['生煎馒头', '南翔小笼', '红烧肉', '响油鳝丝', '四喜烤麸', '白斩鸡', '油爆虾', '腌笃鲜', '排骨年糕', '小馄饨', '糟溜鱼片', '桂花糖藕', '草头圈子', '红烧河鳗', '扣三丝', '八宝饭', '松江鲈鱼', '葱油拌面', '大饼油条', '青团'],
  '北京': ['北京烤鸭', '老北京炸酱面', '铜锅涮肉', '卤煮火烧', '炒肝', '豆汁焦圈', '爆肚', '豌豆黄', '驴打滚', '艾窝窝', '北京奶酪', '门框锅贴', '芥末墩', '酱肘子', '糖卷果', '炒疙瘩', '北京烤肉', '炸灌肠', '它似蜜', '冰糖葫芦'],
  '西北': ['羊肉泡馍', '凉皮', '肉夹馍', '兰州拉面', '大盘鸡', '手抓羊肉', '油泼面', '臊子面', '烤包子', '新疆炒米粉', '馕包肉', '丁丁炒面', '缸子肉', '胡辣汤', '羊杂碎', '酿皮', '烤羊蹄', '甄糕', '酸汤水饺', '葫芦鸡'],
  '湖南': ['剁椒鱼头', '小炒肉', '腊味合蒸', '酱板鸭', '外婆菜', '永州血鸭', '常德米粉', '臭豆腐', '糖油粑粑', '姊妹团子', '口味虾', '麻辣牛蛙', '东安鸡', '湘西排骨', '手撕包菜', '酸辣土豆丝', '剁椒金针菇', '安化腊肉', '擂辣椒皮蛋', '口味猪蹄'],
  '江苏': ['松鼠鳜鱼', '扬州狮子头', '盐水鸭', '水晶肴肉', '大煮干丝', '酱排骨', '扬州炒饭', '三鲜脱骨鱼', '梁溪脆鳝', '蟹粉小笼', '黄桥烧饼', '叫花鸡', '鸭血粉丝汤', '小笼汤包', '文思豆腐', '太湖银鱼', '奥灶面', '阳春面', '如皋火腿', '镜箱豆腐'],
  '浙江': ['西湖醋鱼', '东坡肉', '龙井虾仁', '叫花童子鸡', '宋嫂鱼羹', '嘉兴肉粽', '宁波汤圆', '温州瘦肉丸', '金华火腿', '缙云烧饼', '西湖莼菜汤', '片儿川', '嵊州小笼包', '绍兴黄酒煮虾', '冰糖甲鱼', '荷叶粉蒸肉', '油焖笋', '蜜汁灌藕', '梅干菜焖肉', '三丝敲鱼'],
  '福建': ['佛跳墙', '荔枝肉', '醉排骨', '蚵仔煎', '沙县扁肉', '拌面', '土笋冻', '肉燕', '鱼丸汤', '面线糊', '姜母鸭', '沙茶面', '五香卷', '鼎边糊', '四果汤', '莆田卤面', '烧肉粽', '海蛎饼', '润饼菜', '福州线面'],
  '湖北': ['热干面', '三鲜豆皮', '排骨藕汤', '武昌鱼', '小龙虾', '面窝', '鸭脖', '糊汤粉', '鱼糕', '煨汤', '糯米鸡', '欢喜坨', '汽水肉', '珍珠丸子', '粉蒸肉', '烧卖', '油饼包烧卖', '恩施炕土豆', '黄州东坡肉', '红烧鮰鱼'],
  '广西': ['柳州螺蛳粉', '桂林米粉', '老友面', '柠檬鸭', '荔浦芋扣肉', '五色糯米饭', '横县鱼生', '巴马香猪', '恭城油茶', '玉林牛巴', '梧州纸包鸡', '灵山大粽', '博白白切鸭', '酸嘢', '全州红油米粉', '槐花粉', '滤粉', '卷筒粉', '阳朔啤酒鱼', '北海沙虫'],
  '河南': ['郑州烩面', '胡辣汤', '开封灌汤包', '洛阳水席', '道口烧鸡', '新野板面', '焖饼', '洛阳牛肉汤', '炒凉粉', '灵宝肉夹馍', '汴京烤鸭', '高炉烧饼', '固始鹅块', '油茶', '杠子馍', '濮阳糟鱼', '大烩菜', '黄河大鲤鱼', '锅贴', '套四宝'],
  '山东': ['糖醋鲤鱼', '九转大肠', '葱烧海参', '德州扒鸡', '爆炒腰花', '一品豆腐', '四喜丸子', '油爆双脆', '锅塌豆腐', '红烧大虾', '泰山三美', '枣庄辣子鸡', '把子肉', '煎饼卷大葱', '朝天锅', '博山酥锅', '单县羊肉汤', '潍坊肉火烧', '胶东大包', '流亭猪蹄'],
  '天津': ['煎饼馃子', '狗不理包子', '十八街麻花', '耳朵眼炸糕', '锅巴菜', '熟梨糕', '糖炒栗子', '笃面筋', '八大碗', '老爆三', '贴饽饽熬鱼', '卷圈', '面茶', '大麻花', '酸奶', '石头门坎素包', '曾三面', '炸糕', '张记果仁', '羊汤']
};

const currentProvince = ref('四川');
const items = computed(() => foodData[currentProvince.value]);
const isRotating = ref(false);
const angle = ref(0);
const result = ref('');
const showResult = ref(false);
const segAngle = computed(() => 360 / items.value.length);

const changeProvince = (p: string) => {
  if (isRotating.value) return;
  currentProvince.value = p;
  angle.value = 0;
};

const wheelBgStyle = computed(() => {
  const step = 360 / items.value.length;
  let gradientParts: string[] = [];
  const hueOffset = currentProvince.value.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 360;

  items.value.forEach((_, i) => {
    const startAngle = i * segAngle.value;
    const endAngle = (i + 1) * segAngle.value;
    const color = `hsl(${(i * step + hueOffset) % 360}, 65%, 75%)`;
    gradientParts.push(
      `white ${startAngle}deg`,
      `white ${startAngle + 0.5}deg`,
      `${color} ${startAngle + 0.5}deg`,
      `${color} ${endAngle - 0.5}deg`,
      `white ${endAngle - 0.5}deg`,
      `white ${endAngle}deg`
    );
  });
  return { background: `conic-gradient(${gradientParts.join(', ')})` };
});

const wheelTransformStyle = computed(() => ({
  transform: `rotate(${angle.value}deg)`,
  transition: isRotating.value ? 'transform 7s cubic-bezier(0.15, 0, 0, 1)' : 'none'
}));

const getSegmentRotate = (i: number) => ({
  transform: `rotate(${i * segAngle.value + (segAngle.value / 2)}deg)`
});

const start = () => {
  if (isRotating.value) return;
  isRotating.value = true;
  showResult.value = false;
  const winIdx = Math.floor(Math.random() * items.value.length);
  const baseSpins = 360 * 12; 
  const targetOffset = 360 - (winIdx * segAngle.value) - (segAngle.value / 2);
  angle.value += baseSpins + (targetOffset - (angle.value % 360) + 360) % 360;
};

const handleFinish = () => {
  isRotating.value = false;
  const finalAngle = (angle.value % 360 + 360) % 360;
  const index = Math.floor(((360 - finalAngle) % 360) / segAngle.value);
  result.value = items.value[index];
  setTimeout(() => { showResult.value = true; }, 400);
};
</script>

<style scoped>
/* 变量控制 */
:host,
.app-container {
    --stage-size: 480px;
    --wheel-size: 450px;
    --font-size: 13px;
}

@media (max-width: 600px) {
    .app-container {
        --stage-size: 350px;
        --wheel-size: 330px;
        --font-size: 11px;
    }
}

/* 适配矮屏幕，防止高度溢出产生滚动条 */
@media (max-height: 800px) {
    .content-card {
        transform: scale(0.92);
        transform-origin: top center;
    }

    .disclaimer-bar {
        margin-top: 10px;
    }
}

.app-container {
    width: 100vw;
    height: 100vh;
    background: #fdfaf5;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    /* 强制消除所有潜在滚动条 */
    margin: 0;
    padding: 0;
}

.content-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
}

.title {
    color: #2d3436;
    margin: 0 0 10px 0;
    font-size: 1.6rem;
}

.province-navbar {
    width: 95%;
    margin-bottom: 12px;
}

.scroll-container {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 5px;
    scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
    display: none;
}

.province-tab {
    flex: 0 0 auto;
    padding: 6px 14px;
    border-radius: 15px;
    border: none;
    background: white;
    color: #666;
    font-size: 0.85rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.province-tab.active {
    background: #333;
    color: white;
}

.desc {
    color: #999;
    margin: 0 0 15px 0;
    font-size: 0.85rem;
}

/* 转盘 */
.lucky-wheel-stage {
    position: relative;
    display: grid;
    place-items: center;
    width: var(--stage-size);
    height: var(--stage-size);
    z-index: 1;
}

.wheel-main {
    grid-area: 1 / 1;
    width: var(--wheel-size);
    height: var(--wheel-size);
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #fff;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.wheel-canvas {
    width: 100%;
    height: 100%;
    position: relative;
}

.segment-item {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0px;
    height: 50%;
    transform-origin: bottom center;
}

.segment-text {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    writing-mode: vertical-rl;
    font-size: var(--font-size);
    font-weight: bold;
    color: #444;
    white-space: nowrap;
}

.wheel-pointer {
    grid-area: 1 / 1;
    align-self: start;
    margin-top: -10px;
    width: 34px;
    height: 42px;
    background: #ff7675;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    z-index: 5;
}

.spin-center-btn {
    grid-area: 1 / 1;
    width: 76px;
    height: 76px;
    background: white;
    border-radius: 50%;
    border: none;
    z-index: 10;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-visual {
    width: 62px;
    height: 62px;
    margin: 7px auto;
    background: #333;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
}

/* 免责声明样式 */
.disclaimer-bar {
    margin-top: 25px;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 20px;
    font-size: 0.75rem;
    color: #bbb;
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 90%;
    text-align: center;
}

.disclaimer-bar .icon {
    font-size: 0.9rem;
    opacity: 0.6;
}

/* 弹窗遮罩 */
.result-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.result-card {
    background: #fff;
    width: 80%;
    max-width: 300px;
    padding: 35px 20px;
    border-radius: 28px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.result-tag {
    display: inline-block;
    background: #fdfaf5;
    color: #ff7675;
    padding: 4px 12px;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 8px;
}

.result-name {
    font-size: 2.3rem;
    color: #333;
    margin: 15px 0 25px;
    font-weight: 900;
}

.action-btn {
    width: 100%;
    background: #333;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
}

/* 动画效果 */
.fade-pop-enter-active {
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-pop-leave-active {
    animation: popIn 0.3s reverse ease-in;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.7);
        opacity: 0;
    }

    to {
        opacity: 1;
        transform: scale(1);
        opacity: 1;
    }
}
</style>