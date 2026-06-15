<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div style="display: flex; gap: 12px;">
        <el-input v-model="search" placeholder="搜索商品名称..." clearable style="width: 240px;" @clear="loadProducts" @keyup.enter="loadProducts">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="categoryFilter" placeholder="全部分类" clearable style="width: 140px;" @change="loadProducts">
          <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.slug" />
        </el-select>
      </div>
      <el-button type="primary" @click="$router.push('/products/new')">
        <el-icon><Plus /></el-icon> 新增商品
      </el-button>
    </div>

    <el-table :data="products" v-loading="loading" style="width: 100%;">
      <el-table-column label="图片" width="80">
        <template #default="{ row }">
          <img v-if="row.images[0]" :src="imgSrc(row.images[0])" style="width: 48px; height: 48px; object-fit: cover;" />
          <div v-else style="width: 48px; height: 48px; background: #151515; display: flex; align-items: center; justify-content: center; color: #3a3a3a; font-size: 10px;">无图</div>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" min-width="200" show-overflow-tooltip />
      <el-table-column label="分类" prop="category_name" width="100" />
      <el-table-column label="价格" width="140">
        <template #default="{ row }">
          <span v-if="row.is_inquiry_only" class="muted">面议</span>
          <span v-else class="gold-text">¥{{ formatPrice(row.price) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock" width="80" align="center" />
      <el-table-column label="精选" width="80" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.featured" size="small" type="warning">精选</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_active"
            :active-value="true"
            :inactive-value="false"
            @change="toggleActive(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="$router.push(`/products/${row.id}/edit`)">编辑</el-button>
          <el-button link type="danger" size="small" @click="deleteProduct(row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <el-pagination
        v-model:current-page="page"
        :page-size="20"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadProducts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { productsApi, categoriesApi } from '@/api'

const products = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const search = ref('')
const categoryFilter = ref('')
const page = ref(1)
const total = ref(0)

function imgSrc(path: string) {
  return path.split('/').map((seg: string, i: number) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}
function formatPrice(p: number) { return p?.toLocaleString('zh-CN') || '-' }

async function loadProducts() {
  loading.value = true
  try {
    const res = await productsApi.list({
      page: page.value, limit: 20,
      search: search.value || undefined,
      category: categoryFilter.value || undefined,
    })
    products.value = res.data.data
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function toggleActive(row: any) {
  await productsApi.update(row.id, { is_active: row.is_active })
  ElMessage.success(row.is_active ? '已上架' : '已下架')
}

async function deleteProduct(row: any) {
  await ElMessageBox.confirm(`确认下架"${row.name}"？`, '确认', { confirmButtonText: '下架', cancelButtonText: '取消', type: 'warning' })
  await productsApi.delete(row.id)
  ElMessage.success('已下架')
  loadProducts()
}

onMounted(async () => {
  const cats = await categoriesApi.list()
  categories.value = cats.data
  loadProducts()
})
</script>
