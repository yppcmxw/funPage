<template>
    <div>
        <p>Count: {{ count }}</p>
        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCounterStore } from '../stores/counter'; // 引入 store

const counterStore = useCounterStore(); // 使用 store

// 访问 state 和 actions
const count = computed(() => counterStore.count);
const increment = counterStore.increment;
const decrement = counterStore.decrement;
</script>
