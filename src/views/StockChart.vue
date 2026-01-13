<template>
    <div class="financial-dashboard">
        <header class="stats-header">
            <div class="stat-group">
                <span class="label">资产净值 (RMB)</span>
                <div class="value main-value">¥ {{ currentBalance.toLocaleString() }}</div>
            </div>
            <div class="stat-group">
                <span class="label">当日变动</span>
                <div :class="['value', dailyChange >= 0 ? 'up' : 'down']">
                    {{ dailyChange >= 0 ? '+' : '' }}{{ dailyChange.toLocaleString() }}
                    <span class="rate">({{ dailyRate }}%)</span>
                </div>
            </div>
        </header>

        <main class="chart-wrapper">
            <div ref="chartRef" class="kline-chart"></div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';

// 数据格式：[日期, 昨日收盘(开盘), 今日余额(收盘)]
// 计算属性会自动补全 K 线所需的 [开, 收, 低, 高]
const rawData = [
  ['2026-01-04', 100000, 100000],
  ['2026-01-05', 100000, 100683.71],
  ['2026-01-06', 100683.71, 101353.40],
  ['2026-01-07', 101353.40, 103676.39],
  ['2026-01-08', 103676.39, 105233.23],
  ['2026-01-09', 105233.23, 105644.09],
  ['2026-01-12', 105644.09, 108296.73],
  ['2026-01-13', 108296.73, 102989.67],
];

const chartRef = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

// 核心计算逻辑
const currentBalance = computed(() => rawData[rawData.length - 1][2] as number);
const dailyChange = computed(() => (currentBalance.value) - (rawData[rawData.length - 1][1] as number));
const dailyRate = computed(() => ((dailyChange.value / (rawData[rawData.length - 1][1] as number)) * 100).toFixed(2));

const initChart = () => {
  if (!chartRef.value) return;
  myChart = echarts.init(chartRef.value);

  const option: echarts.EChartsOption = {
    backgroundColor: '#ffffff',
    grid: {
      top: '8%',
      left: '4%',
      right: '4%',
      bottom: '18%',
      containLabel: true
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', show: true, bottom: '4%', height: 20 }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      confine: true,
      // --- 关键优化：自定义提示框内容 ---
      formatter: (params: any) => {
        const p = params[0];
        const open = p.value[1];  // 昨日余额 (开盘)
        const close = p.value[2]; // 今日余额 (收盘)
        const change = close - open; // 波动金额
        
        // 计算收益率: (现值 - 原值) / 原值 * 100
        const rate = open !== 0 ? ((change / open) * 100).toFixed(2) : '0.00';
        const color = change >= 0 ? '#f5222d' : '#52c41a';
        const symbol = change >= 0 ? '+' : '';

        return `
          <div style="font-size:12px;color:#999;margin-bottom:8px">${p.name}</div>
          <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:4px">
            <span style="color:#666">当前余额:</span>
            <span style="font-weight:bold">¥${close.toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:20px;border-top:1px solid #eee;padding-top:4px">
            <span style="color:#666">当日收益:</span>
            <span style="color:${color};font-weight:bold">${symbol}${change.toLocaleString()} (${symbol}${rate}%)</span>
          </div>
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: rawData.map(item => item[0]),
      axisLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { color: '#999', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f8f8f8' } }
    },
    series: [
      {
        type: 'candlestick',
        data: rawData.map(item => {
          const open = item[1] as number;
          const close = item[2] as number;
          // K线展示：[开, 收, 低, 高]
          return [open, close, Math.min(open, close), Math.max(open, close)];
        }),
        itemStyle: {
          color: '#f5222d',
          color0: '#52c41a',
          borderColor: '#f5222d',
          borderColor0: '#52c41a'
        }
      }
    ]
  };

  myChart.setOption(option);
};


onMounted(() => {
  initChart();
  resizeObserver = new ResizeObserver(() => myChart?.resize());
  if (chartRef.value) resizeObserver.observe(chartRef.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  myChart?.dispose();
});
</script>

<style scoped>
.financial-dashboard {
    width: 100%;
    min-height: 100vh;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: -apple-system, sans-serif;
}

.stats-header {
    padding: 30px 40px;
    display: flex;
    gap: 60px;
    border-bottom: 1px solid #f0f0f0;
}

.stat-group .label {
    display: block;
    font-size: 13px;
    color: #999;
    margin-bottom: 6px;
}

.value {
    font-weight: 700;
}

.main-value {
    font-size: 32px;
    color: #1a1a1a;
    letter-spacing: -1px;
}

.up {
    color: #f5222d;
}

/* 正收益红色 */
.down {
    color: #52c41a;
}

/* 负收益绿色 */

.rate {
    font-size: 14px;
    margin-left: 6px;
}

.chart-wrapper {
    width: 100%;
    padding: 20px;
    flex: 1;
}

.kline-chart {
    width: 100%;
    height: 60vh;
}

@media (max-width: 768px) {
    .stats-header {
        padding: 20px;
        gap: 20px;
        flex-direction: column;
    }

    .main-value {
        font-size: 26px;
    }
}
</style>