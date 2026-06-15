<template>
  <div>
    <!-- Stat cards -->
    <el-row :gutter="16" style="margin-bottom: 24px;">
      <el-col :span="6" v-for="stat in statCards" :key="stat.key">
        <div class="stat-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <el-icon :size="20" :style="{ color: stat.color }"><component :is="stat.icon" /></el-icon>
            <span style="font-size: 11px; color: #5a4a30; letter-spacing: 0.1em;">{{ stat.period }}</span>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- Charts row -->
    <el-row :gutter="16" style="margin-bottom: 24px;">
      <!-- Traffic chart -->
      <el-col :span="16">
        <el-card header="近7日访问量" style="height: 320px;">
          <v-chart
            v-if="trafficOption"
            :option="trafficOption"
            style="height: 240px;"
            autoresize
          />
        </el-card>
      </el-col>

      <!-- Orders by status -->
      <el-col :span="8">
        <el-card header="订单状态分布" style="height: 320px;">
          <v-chart
            v-if="orderStatusOption"
            :option="orderStatusOption"
            style="height: 240px;"
            autoresize
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- Bottom row -->
    <el-row :gutter="16">
      <!-- Orders chart -->
      <el-col :span="12">
        <el-card header="近7日成交量">
          <v-chart
            v-if="ordersOption"
            :option="ordersOption"
            style="height: 220px;"
            autoresize
          />
        </el-card>
      </el-col>

      <!-- Top products -->
      <el-col :span="12">
        <el-card header="热门商品（近30日浏览）">
          <el-table :data="topProducts" size="small" style="background: transparent;">
            <el-table-column label="商品" prop="name" show-overflow-tooltip />
            <el-table-column label="类型" width="80">
              <template #default="{ row }">
                <el-tag v-if="row.is_inquiry_only" size="small">询价</el-tag>
                <el-tag v-else size="small" type="success">直购</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="浏览量" prop="views" width="80" align="right">
              <template #default="{ row }">
                <span class="gold-text">{{ row.views }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, MarkLineComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { analyticsApi } from '@/api'

use([CanvasRenderer, LineChart, BarChart, PieChart,
     GridComponent, TooltipComponent, LegendComponent, TitleComponent, MarkLineComponent])

const overview = ref<any>(null)
const topProducts = ref<any[]>([])

const statCards = computed(() => {
  if (!overview.value) return []
  const { today, total } = overview.value
  return [
    { key: 'todayViews', value: today.views, label: '今日访问量', period: 'TODAY', icon: 'View', color: '#C9A84C' },
    { key: 'totalViews', value: total.views.toLocaleString(), label: '累计访问量', period: 'TOTAL', icon: 'DataAnalysis', color: '#9AA0A6' },
    { key: 'todayOrders', value: today.orders, label: '今日订单', period: 'TODAY', icon: 'List', color: '#67C23A' },
    { key: 'totalRevenue', value: '¥' + (total.revenue / 10000).toFixed(1) + 'w', label: '累计成交额', period: 'TOTAL', icon: 'Money', color: '#E6A23C' },
  ]
})

const chartStyle = {
  textStyle: { color: '#8a7a60' },
  backgroundColor: 'transparent',
}

const trafficOption = computed(() => {
  if (!overview.value?.dailyTraffic) return null
  const data = overview.value.dailyTraffic
  return {
    ...chartStyle,
    grid: { top: 10, right: 10, bottom: 30, left: 40 },
    xAxis: {
      type: 'category',
      data: data.map((d: any) => d.date.slice(5)),
      axisLine: { lineStyle: { color: '#2a2a2a' } },
      axisLabel: { color: '#5a4a30', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1a1a1a' } },
      axisLabel: { color: '#5a4a30', fontSize: 11 },
    },
    series: [{
      type: 'line',
      data: data.map((d: any) => d.views),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#C9A84C', width: 2 },
      itemStyle: { color: '#C9A84C' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(201,168,76,0.3)' }, { offset: 1, color: 'rgba(201,168,76,0)' }] } },
    }],
    tooltip: { trigger: 'axis', backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', textStyle: { color: '#e8e0d0' } },
  }
})

const ordersOption = computed(() => {
  if (!overview.value?.dailyOrders) return null
  const data = overview.value.dailyOrders
  return {
    ...chartStyle,
    grid: { top: 10, right: 10, bottom: 30, left: 40 },
    xAxis: {
      type: 'category',
      data: data.map((d: any) => d.date.slice(5)),
      axisLine: { lineStyle: { color: '#2a2a2a' } },
      axisLabel: { color: '#5a4a30', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1a1a1a' } },
      axisLabel: { color: '#5a4a30', fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: data.map((d: any) => d.orders),
      itemStyle: { color: 'rgba(201,168,76,0.7)', borderRadius: [2, 2, 0, 0] },
    }],
    tooltip: { trigger: 'axis', backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', textStyle: { color: '#e8e0d0' } },
  }
})

const orderStatusOption = computed(() => {
  if (!overview.value?.ordersByStatus) return null
  const statusLabels: Record<string, string> = {
    pending: '待处理', confirmed: '已确认', paid: '已付款',
    shipped: '已发货', completed: '已完成', cancelled: '已取消',
  }
  const data = overview.value.ordersByStatus.map((s: any) => ({
    name: statusLabels[s.status] || s.status,
    value: s.count,
  }))
  return {
    ...chartStyle,
    legend: { orient: 'vertical', right: 0, top: 'center', textStyle: { color: '#8a7a60', fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data,
      label: { show: false },
      itemStyle: {
        borderColor: '#111',
        borderWidth: 2,
      },
    }],
    color: ['#C9A84C', '#67C23A', '#409EFF', '#9AA0A6', '#E6A23C', '#F56C6C'],
    tooltip: { trigger: 'item', backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', textStyle: { color: '#e8e0d0' } },
  }
})

onMounted(async () => {
  try {
    const [ov, tp] = await Promise.all([
      analyticsApi.overview(),
      analyticsApi.products(30),
    ])
    overview.value = ov.data
    topProducts.value = tp.data.slice(0, 8)
  } catch {}
})
</script>
