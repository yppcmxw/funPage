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
// --- 常量与状态 ---
var MESSAGES = ["好好爱自己", "期待下次见面", "顺顺利利", "保持好心情", "早点休息", "多喝热水", "你是最棒的", "未来可期", "梦想成真", "元气满满", "生活明朗", "记得吃早餐", "天天开心", "好运连连", "万事胜意", "平安喜乐", "心想事成", "不负韶华", "工作顺利"];
var CARD_COUNT = 180;
var cards = (0, vue_1.ref)([]);
var state = (0, vue_1.ref)('forming');
var overlayActive = (0, vue_1.ref)(false);
var selectedMessage = (0, vue_1.ref)('');
var showHint = (0, vue_1.ref)(false);
var hintText = (0, vue_1.computed)(function () {
    return state.value === 'waiting' ? '点击屏幕，开启惊喜 ✨' : '点击抽取专属卡片 ✨';
});
// --- 逻辑实现 ---
// 初始化卡片初始位置（屏幕两侧穿插）
var initCards = function () {
    var tempCards = [];
    for (var i = 0; i < CARD_COUNT; i++) {
        var isRightSide = i % 2 !== 0;
        var startX = isRightSide ? window.innerWidth + 300 : -300;
        var startY = Math.random() * window.innerHeight;
        tempCards.push({
            message: MESSAGES[i % MESSAGES.length],
            colorClass: "c".concat((i % 4) + 1),
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
var startForming = function () {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var scale = Math.min(screenW * 0.85, screenH * 0.65) / 32;
    var centerX = screenW / 2;
    var centerY = screenH / 2 - (scale * 1.5);
    var totalTime = 10000;
    var interval = totalTime / CARD_COUNT;
    cards.value.forEach(function (_, i) {
        setTimeout(function () {
            var step = (i / CARD_COUNT) * 2 * Math.PI;
            // 心形参数方程
            var tx = 16 * Math.pow(Math.sin(step), 3);
            var ty = -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step));
            // 响应式卡片偏移量计算 (简单模拟 offsetWidth)
            var isMobile = screenW < 768;
            var cardW = isMobile ? 90 : 125;
            var cardH = isMobile ? 48 : 65;
            var targetX = centerX + tx * scale - cardW / 2;
            var targetY = centerY + ty * scale - cardH / 2;
            var rotation = tx * 1.1;
            if (Math.abs(tx) < 1.5)
                rotation = 0;
            // 更新响应式数据
            cards.value[i].opacity = 1;
            cards.value[i].transition = 'transform 2.5s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.8s ease';
            cards.value[i].x = targetX;
            cards.value[i].y = targetY;
            cards.value[i].rotate = rotation;
            cards.value[i].zIndex = i; // 叠层效果：后来的在上层
            if (i === CARD_COUNT - 1) {
                setTimeout(function () {
                    state.value = 'waiting';
                    showHint.value = true;
                }, 2500);
            }
        }, i * interval);
    });
};
// 爆炸效果
var explode = function () {
    state.value = 'exploding';
    showHint.value = false;
    cards.value.forEach(function (card, i) {
        var targetX = Math.random() * (window.innerWidth + 200) - 200;
        var targetY = Math.random() * (window.innerHeight + 200) - 200;
        var rotation = (Math.random() - 0.5) * 120;
        card.transition = 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        card.x = targetX;
        card.y = targetY;
        card.rotate = rotation;
        card.zIndex = Math.floor(Math.random() * CARD_COUNT);
    });
    setTimeout(function () {
        state.value = 'exploded';
        showHint.value = true;
    }, 1200);
};
// 全屏点击处理
var handleGlobalClick = function () {
    if (state.value === 'waiting') {
        explode();
    }
    else if (state.value === 'exploded') {
        selectedMessage.value = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        overlayActive.value = true;
    }
};
var closeOverlay = function () {
    overlayActive.value = false;
};
// 生命周期管理
(0, vue_1.onMounted)(function () {
    initCards();
    startForming();
    window.addEventListener('resize', function () {
        if (state.value === 'forming')
            location.reload();
    });
});
(0, vue_1.onUnmounted)(function () {
    window.removeEventListener('resize', function () { });
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var ___VLS_components;
var ___VLS_directives;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['c1']} */ ;
/** @type {__VLS_StyleScopedClasses['c2']} */ ;
/** @type {__VLS_StyleScopedClasses['c3']} */ ;
/** @type {__VLS_StyleScopedClasses['c4']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.handleGlobalClick) }, { class: "heart-wall-container" }));
/** @type {__VLS_StyleScopedClasses['heart-wall-container']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "container",
});
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.cards)); _i < _a.length; _i++) {
    var _b = _a[_i], card = _b[0], index = _b[1];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (index) }, { class: (['card', card.colorClass]) }), { style: ({
            transform: "translate3d(".concat(card.x, "px, ").concat(card.y, "px, 0) rotate(").concat(card.rotate, "deg)"),
            zIndex: card.zIndex,
            opacity: card.opacity,
            transition: card.transition
        }) }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (card.message);
    // @ts-ignore
    [handleGlobalClick, cards,];
}
if (__VLS_ctx.showHint) {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hint-overlay" }));
    /** @type {__VLS_StyleScopedClasses['hint-overlay']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hint-text" }));
    /** @type {__VLS_StyleScopedClasses['hint-text']} */ ;
    (__VLS_ctx.hintText);
}
var __VLS_0;
/** @ts-ignore @type {typeof ___VLS_components.Transition} */
Transition;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        name: "fade",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
if (__VLS_ctx.overlayActive) {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.closeOverlay) }, { class: "overlay" }));
    /** @type {__VLS_StyleScopedClasses['overlay']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "big-card" }));
    /** @type {__VLS_StyleScopedClasses['big-card']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-icon" }));
    /** @type {__VLS_StyleScopedClasses['card-icon']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-text" }));
    /** @type {__VLS_StyleScopedClasses['card-text']} */ ;
    (__VLS_ctx.selectedMessage);
}
// @ts-ignore
[showHint, hintText, overlayActive, closeOverlay, selectedMessage,];
var __VLS_3;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({});
exports.default = {};
