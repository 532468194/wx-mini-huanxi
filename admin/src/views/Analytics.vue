<template>
  <div>
    <el-row :gutter="16" style="margin-bottom: 16px;">
      <el-col>
        <el-radio-group v-model="days" @change="load">
          <el-radio-button :value="7">近7天</el-radio-button>
          <el-radio-button :value="30">近30天</el-radio-button>
          <el-radio-button :value="90">近90天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-bottom: 24px;">
      <el-col :span="12">
        <el-card :header="`近${days}日每日访问量`">
          <v-chart :option="trafficOpt" style="height: 260px;" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="页面访问分布">
          <v-chart :option="pageOpt" style="height: 260px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-card header="热门商品浏览量排行">
      <el-table :data="productViews" size="small">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="商品名称" prop="name" show-overflow-tooltip min-width="200" />
        <el-table-column label="分类" prop="category_id" width="80" />
        <el-table-column label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.is_inquiry_only ? 'warning' : 'success'" size="small">
              {{ row.is_inquiry_only ? '询价' : '直购' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" prop="views" width="100" align="right" sortable>
          <template #default="{ row }">
            <span class="gold-text" style="font-size: 15px;">{{ row.views }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { analyticsApi } from '@/api'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

const days = ref(30)
const trafficData = ref<any[]>([])
const pageData = ref<any[]>([])
const productViews = ref<any[]>([])

const chartBase = {
  backgroundColor: 'transparent',
  textStyle: { color: '#8a7a60' },
  tooltip: { backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', textStyle: { color: '#e8e0d0' } },
}

const trafficOpt = computed(() => ({
  ...chartBase,
  grid: { top: 10, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: trafficData.value.map(d => d.date.slice(5)), axisLabel: { color: '#5a4a30', fontSize: 11 }, axisLine: { lineStyle: { color: '#2a2a2a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#1a1a1a' } }, axisLabel: { color: '#5a4a30', fontSize: 11 } },
  series: [{ type: 'line', data: trafficData.value.map(d => d.views), smooth: true, lineStyle: { color: '#C9A84C', width: 2 }, itemStyle: { color: '#C9A84C' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(201,168,76,0.25)' }, { offset: 1, color: 'rgba(201,168,76,0)' }] } } }],
  tooltip: { ...chartBase.tooltip, trigger: 'axis' },
}))

const pageOpt = computed(() => ({
  ...chartBase,
  grid: { top: 10, right: 10, bottom: 30, left: 130 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: '#1a1a1a' } }, axisLabel: { color: '#5a4a30', fontSize: 11 } },
  yAxis: { type: 'category', data: pageData.value.map(d => d.page || '/').slice(0, 8).reverse(), axisLabel: { color: '#8a7a60', fontSize: 11 } },
  series: [{ type: 'bar', data: pageData.value.map(d => d.views).slice(0, 8).reverse(), itemStyle: { color: 'rgba(201,168,76,0.6)', borderRadius: [0, 2, 2, 0] } }],
  tooltip: { ...chartBase.tooltip, trigger: 'axis' },
}))

async function load() {
  const [t, p] = await Promise.all([analyticsApi.traffic(days.value), analyticsApi.products(days.value)])
  trafficData.value = t.data.daily
  pageData.value = t.data.pages
  productViews.value = p.data
}

onMounted(() => load())
</script>
