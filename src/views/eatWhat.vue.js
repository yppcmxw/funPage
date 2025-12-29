"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var foodData = {
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
var currentProvince = (0, vue_1.ref)('四川');
var items = (0, vue_1.computed)(function () { return foodData[currentProvince.value]; });
var isRotating = (0, vue_1.ref)(false);
var angle = (0, vue_1.ref)(0);
var result = (0, vue_1.ref)('');
var showResult = (0, vue_1.ref)(false);
var segAngle = (0, vue_1.computed)(function () { return 360 / items.value.length; });
var changeProvince = function (p) {
    if (isRotating.value)
        return;
    currentProvince.value = p;
    angle.value = 0;
};
var wheelBgStyle = (0, vue_1.computed)(function () {
    var step = 360 / items.value.length;
    var gradientParts = [];
    var hueOffset = currentProvince.value.split('').reduce(function (a, b) { return a + b.charCodeAt(0); }, 0) % 360;
    items.value.forEach(function (_, i) {
        var startAngle = i * segAngle.value;
        var endAngle = (i + 1) * segAngle.value;
        var color = "hsl(".concat((i * step + hueOffset) % 360, ", 65%, 75%)");
        gradientParts.push("white ".concat(startAngle, "deg"), "white ".concat(startAngle + 0.5, "deg"), "".concat(color, " ").concat(startAngle + 0.5, "deg"), "".concat(color, " ").concat(endAngle - 0.5, "deg"), "white ".concat(endAngle - 0.5, "deg"), "white ".concat(endAngle, "deg"));
    });
    return { background: "conic-gradient(".concat(gradientParts.join(', '), ")") };
});
var wheelTransformStyle = (0, vue_1.computed)(function () { return ({
    transform: "rotate(".concat(angle.value, "deg)"),
    transition: isRotating.value ? 'transform 7s cubic-bezier(0.15, 0, 0, 1)' : 'none'
}); });
var getSegmentRotate = function (i) { return ({
    transform: "rotate(".concat(i * segAngle.value + (segAngle.value / 2), "deg)")
}); };
var start = function () {
    if (isRotating.value)
        return;
    isRotating.value = true;
    showResult.value = false;
    var winIdx = Math.floor(Math.random() * items.value.length);
    var baseSpins = 360 * 12;
    var targetOffset = 360 - (winIdx * segAngle.value) - (segAngle.value / 2);
    angle.value += baseSpins + (targetOffset - (angle.value % 360) + 360) % 360;
};
var handleFinish = function () {
    isRotating.value = false;
    var finalAngle = (angle.value % 360 + 360) % 360;
    var index = Math.floor(((360 - finalAngle) % 360) / segAngle.value);
    result.value = items.value[index];
    setTimeout(function () { showResult.value = true; }, 400);
};
var __VLS_ctx = __assign(__assign({}, {}), {});
var ___VLS_components;
var ___VLS_directives;
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-card']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-container']} */ ;
/** @type {__VLS_StyleScopedClasses['province-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['disclaimer-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['disclaimer-bar']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "app-container" }));
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "content-card" }));
/** @type {__VLS_StyleScopedClasses['content-card']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "title" }));
/** @type {__VLS_StyleScopedClasses['title']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "province-navbar" }));
/** @type {__VLS_StyleScopedClasses['province-navbar']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "scroll-container" }));
/** @type {__VLS_StyleScopedClasses['scroll-container']} */ ;
var _loop_1 = function (list, province) {
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.changeProvince(province);
            // @ts-ignore
            [foodData, changeProvince,];
        } }, { key: (province) }), { class: (['province-tab', { active: __VLS_ctx.currentProvince === province }]) }));
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    /** @type {__VLS_StyleScopedClasses['province-tab']} */ ;
    (province);
    // @ts-ignore
    [currentProvince,];
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.foodData)); _i < _a.length; _i++) {
    var _b = _a[_i], list = _b[0], province = _b[1];
    _loop_1(list, province);
}
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "desc" }));
/** @type {__VLS_StyleScopedClasses['desc']} */ ;
(__VLS_ctx.currentProvince);
(__VLS_ctx.items.length);
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "lucky-wheel-stage" }));
/** @type {__VLS_StyleScopedClasses['lucky-wheel-stage']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ onTransitionend: (__VLS_ctx.handleFinish) }, { class: "wheel-main" }), { style: (__VLS_ctx.wheelTransformStyle) }));
/** @type {__VLS_StyleScopedClasses['wheel-main']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wheel-canvas" }, { style: (__VLS_ctx.wheelBgStyle) }));
/** @type {__VLS_StyleScopedClasses['wheel-canvas']} */ ;
for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.items)); _c < _d.length; _c++) {
    var _e = _d[_c], text = _e[0], i = _e[1];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (i) }, { class: "segment-item" }), { style: (__VLS_ctx.getSegmentRotate(i)) }));
    /** @type {__VLS_StyleScopedClasses['segment-item']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "segment-text" }));
    /** @type {__VLS_StyleScopedClasses['segment-text']} */ ;
    (text);
    // @ts-ignore
    [currentProvince, items, items, handleFinish, wheelTransformStyle, wheelBgStyle, getSegmentRotate,];
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "wheel-pointer" }));
/** @type {__VLS_StyleScopedClasses['wheel-pointer']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.start) }, { class: "spin-center-btn" }), { disabled: (__VLS_ctx.isRotating) }));
/** @type {__VLS_StyleScopedClasses['spin-center-btn']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "btn-visual" }));
/** @type {__VLS_StyleScopedClasses['btn-visual']} */ ;
(__VLS_ctx.isRotating ? '...' : 'GO');
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "disclaimer-bar" }));
/** @type {__VLS_StyleScopedClasses['disclaimer-bar']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }));
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof ___VLS_components.Transition} */
Transition;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade-pop",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        name: "fade-pop",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
if (__VLS_ctx.showResult) {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showResult))
                return;
            __VLS_ctx.showResult = false;
            // @ts-ignore
            [start, isRotating, isRotating, showResult, showResult,];
        } }, { class: "result-mask" }));
    /** @type {__VLS_StyleScopedClasses['result-mask']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "result-card" }));
    /** @type {__VLS_StyleScopedClasses['result-card']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "result-tag" }));
    /** @type {__VLS_StyleScopedClasses['result-tag']} */ ;
    (__VLS_ctx.currentProvince);
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "result-hint" }));
    /** @type {__VLS_StyleScopedClasses['result-hint']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "result-name" }));
    /** @type {__VLS_StyleScopedClasses['result-name']} */ ;
    (__VLS_ctx.result);
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showResult))
                return;
            __VLS_ctx.showResult = false;
            // @ts-ignore
            [currentProvince, showResult, result,];
        } }, { class: "action-btn" }));
    /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({});
exports.default = {};
