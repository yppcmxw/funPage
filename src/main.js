"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var App_vue_1 = __importDefault(require("./App.vue"));
var router_1 = __importDefault(require("./router"));
var pinia_1 = require("pinia"); // 导入 Pinia
require("./style.css");
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use((0, pinia_1.createPinia)()); // 注册 Pinia
app.use(router_1.default);
app.mount('#app');
