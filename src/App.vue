<script setup lang="ts">
// 移除直接导入的组件，使用路由视图
</script>

<template>
    <div id="app">
        <!-- 路由出口 -->
        <router-view />
    </div>
</template>

<style scoped>
/* 可以添加全局样式 */
#app {
    height: 100vh;
    width: 100vw;
}
</style>