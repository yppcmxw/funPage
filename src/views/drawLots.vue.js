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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var fortuneLibrary = [
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
var hints = ["点击签筒 · 开启今日运势", "心若诚，则灵响应", "万物守恒，静候吉时", "一签问前程，落定皆因缘"];
var bottomHint = (0, vue_1.ref)(hints[0]);
var isShaking = (0, vue_1.ref)(false);
var isDrawn = (0, vue_1.ref)(false);
var showDetail = (0, vue_1.ref)(false);
var currentFortune = (0, vue_1.ref)(null);
var shakeAudio;
var drawAudio;
(0, vue_1.onMounted)(function () {
    shakeAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    shakeAudio.loop = true;
    drawAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/607/607-preview.mp3');
});
var drawFortune = function () {
    if (isShaking.value || isDrawn.value)
        return;
    isShaking.value = true;
    shakeAudio.play().catch(function () { });
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 30, 100, 30, 100]);
    }
    setTimeout(function () {
        isShaking.value = false;
        shakeAudio.pause();
        isDrawn.value = true;
        drawAudio.play();
        currentFortune.value = fortuneLibrary[Math.floor(Math.random() * fortuneLibrary.length)];
        setTimeout(function () {
            showDetail.value = true;
        }, 700);
    }, 1600);
};
var reset = function () {
    showDetail.value = false;
    setTimeout(function () {
        isDrawn.value = false;
        currentFortune.value = null;
        bottomHint.value = hints[Math.floor(Math.random() * hints.length)];
    }, 300);
};
var __VLS_ctx = __assign(__assign({}, {}), {});
var ___VLS_components;
var ___VLS_directives;
/** @type {__VLS_StyleScopedClasses['zen-header']} */ ;
/** @type {__VLS_StyleScopedClasses['zen-header']} */ ;
/** @type {__VLS_StyleScopedClasses['cylinder-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['result-stick']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-btn']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "shrine-container" }));
/** @type {__VLS_StyleScopedClasses['shrine-container']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ink-bg" }));
/** @type {__VLS_StyleScopedClasses['ink-bg']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "content-wrapper" }));
/** @type {__VLS_StyleScopedClasses['content-wrapper']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "zen-header" }));
/** @type {__VLS_StyleScopedClasses['zen-header']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "divider" }));
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtitle" }));
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "divination-area" }));
/** @type {__VLS_StyleScopedClasses['divination-area']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ onClick: (__VLS_ctx.drawFortune) }, { class: "cylinder-wrap" }), { class: ({ 'is-shaking': __VLS_ctx.isShaking, 'is-dimmed': __VLS_ctx.isDrawn }) }));
/** @type {__VLS_StyleScopedClasses['cylinder-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['is-shaking']} */ ;
/** @type {__VLS_StyleScopedClasses['is-dimmed']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cylinder" }));
/** @type {__VLS_StyleScopedClasses['cylinder']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stick-group" }));
/** @type {__VLS_StyleScopedClasses['stick-group']} */ ;
for (var _i = 0, _e = __VLS_getVForSourceType((7)); _i < _e.length; _i++) {
    var i = _e[_i][0];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (i) }, { class: "stick-deco" }), { style: ({ transform: "rotate(".concat(i * 5 - 20, "deg)") }) }));
    /** @type {__VLS_StyleScopedClasses['stick-deco']} */ ;
    // @ts-ignore
    [drawFortune, isShaking, isDrawn,];
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cylinder-body" }));
/** @type {__VLS_StyleScopedClasses['cylinder-body']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "result-stick" }, { class: ({ 'is-drawn': __VLS_ctx.isDrawn }) }));
/** @type {__VLS_StyleScopedClasses['result-stick']} */ ;
/** @type {__VLS_StyleScopedClasses['is-drawn']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stick-content" }));
/** @type {__VLS_StyleScopedClasses['stick-content']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "luck-type" }));
/** @type {__VLS_StyleScopedClasses['luck-type']} */ ;
((_a = __VLS_ctx.currentFortune) === null || _a === void 0 ? void 0 : _a.title.split(' · ')[0]);
var __VLS_0;
/** @ts-ignore @type {typeof ___VLS_components.transition | typeof ___VLS_components.Transition} */
transition;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "zen-fade",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        name: "zen-fade",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
if (__VLS_ctx.showDetail) {
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "fortune-detail" }));
    /** @type {__VLS_StyleScopedClasses['fortune-detail']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "detail-inner" }));
    /** @type {__VLS_StyleScopedClasses['detail-inner']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "seal" }));
    /** @type {__VLS_StyleScopedClasses['seal']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ style: ({ color: (_b = __VLS_ctx.currentFortune) === null || _b === void 0 ? void 0 : _b.color }) }));
    ((_c = __VLS_ctx.currentFortune) === null || _c === void 0 ? void 0 : _c.title);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "zen-divider" }));
    /** @type {__VLS_StyleScopedClasses['zen-divider']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "desc" }));
    /** @type {__VLS_StyleScopedClasses['desc']} */ ;
    ((_d = __VLS_ctx.currentFortune) === null || _d === void 0 ? void 0 : _d.desc);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "zen-divider" }));
    /** @type {__VLS_StyleScopedClasses['zen-divider']} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.reset) }, { class: "reset-btn" }));
    /** @type {__VLS_StyleScopedClasses['reset-btn']} */ ;
}
// @ts-ignore
[isDrawn, currentFortune, currentFortune, currentFortune, currentFortune, showDetail, reset,];
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "footer-hint" }));
/** @type {__VLS_StyleScopedClasses['footer-hint']} */ ;
if (!__VLS_ctx.isShaking && !__VLS_ctx.isDrawn) {
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.bottomHint);
}
if (__VLS_ctx.isShaking) {
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
// @ts-ignore
[isShaking, isShaking, isDrawn, bottomHint,];
var __VLS_export = (await Promise.resolve().then(function () { return __importStar(require('vue')); })).defineComponent({});
exports.default = {};
