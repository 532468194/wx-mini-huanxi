<template>
  <div>
    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
      <el-input v-model="search" placeholder="搜索订单号/商品/手机号..." clearable style="width: 280px;" @clear="load" @keyup.enter="load">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-select v-model="statusFilter" placeholder="全部状态" clearable style="width: 140px;" @change="load">
        <el-option v-for="s in statuses" :key="s.value" :label="s.label" :value="s.value" />
      </el-select>
    </div>

    <el-table :data="orders" v-loading="loading">
      <el-table-column label="订单号" prop="order_no" width="180" />
      <el-table-column label="商品" prop="product_name" min-width="200" show-overflow-tooltip />
      <el-table-column label="金额" width="120">
        <template #default="{ row }">
          <span v-if="row.total_price" class="gold-text">¥{{ formatPrice(row.total_price) }}</span>
          <span v-else class="muted">面议</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" width="120">
        <template #default="{ row }">
          <div style="font-size: 12px;">{{ row.customer_name || '未填写' }}</div>
          <div style="font-size: 11px; color: #8a7a60;">{{ row.customer_phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="微信" prop="customer_wechat" width="140" show-overflow-tooltip />
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150">
        <template #default="{ row }">
          <span style="font-size: 12px; color: #8a7a60;">{{ formatDate(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-select
            :model-value="row.status"
            size="small"
            style="width: 120px;"
            @change="(val: string) => updateStatus(row, val)"
          >
            <el-option v-for="s in statuses" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <el-pagination v-model:current-page="page" :page-size="20" :total="total" layout="total, prev, pager, next" @current-change="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ordersApi } from '@/api'

const orders = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref('')
const page = ref(1)
const total = ref(0)

const statuses = [
  { value: 'pending', label: '待处理' },
  { value: 'confirmed', label: '已确认' },
  { value: 'paid', label: '已付款' },
  { value: 'shipped', label: '已发货' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

function statusLabel(s: string) { return statuses.find(x => x.value === s)?.label || s }
function statusType(s: string) {
  const map: Record<string, string> = { pending: 'warning', confirmed: 'primary', paid: 'success', completed: 'success', cancelled: 'danger' }
  return map[s] || 'info'
}
function formatPrice(p: number) { return p?.toLocaleString('zh-CN') }
function formatDate(d: string) { return d?.replace('T', ' ').slice(0, 16) }

async function load() {
  loading.value = true
  try {
    const res = await ordersApi.list({ page: page.value, limit: 20, search: search.value || undefined, status: statusFilter.value || undefined })
    orders.value = res.data.data
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function updateStatus(row: any, status: string) {
  await ordersApi.updateStatus(row.id, status)
  row.status = status
  ElMessage.success('状态已更新')
}

onMounted(() => load())
</script>
