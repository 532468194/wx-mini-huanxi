<template>
  <el-container class="admin-layout" style="min-height: 100vh;">
    <!-- Sidebar -->
    <el-aside :width="collapsed ? '64px' : '220px'" style="background: #0d0d0d; border-right: 1px solid #1e1e1e; transition: width 0.2s;">
      <!-- Logo -->
      <div style="padding: 20px 16px; border-bottom: 1px solid #1e1e1e; text-align: center;">
        <div v-if="!collapsed" style="font-size: 1.4rem; letter-spacing: 0.3em; color: #C9A84C; font-family: 'STSong', serif;">欢喜</div>
        <div v-else style="font-size: 1.4rem; color: #C9A84C; font-family: 'STSong', serif;">欢</div>
      </div>

      <el-menu
        :default-active="$route.path"
        router
        :collapse="collapsed"
        :collapse-transition="false"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据看板</template>
        </el-menu-item>
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <template #title>商品管理</template>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>
        <el-menu-item index="/analytics">
          <el-icon><TrendCharts /></el-icon>
          <template #title>数据分析</template>
        </el-menu-item>
        <el-menu-item index="/banners">
          <el-icon><Picture /></el-icon>
          <template #title>轮播图管理</template>
        </el-menu-item>
      </el-menu>

      <!-- Collapse button -->
      <div style="position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center;">
        <el-button link @click="collapsed = !collapsed" style="color: #5a4a30;">
          <el-icon :size="18"><DArrowLeft v-if="!collapsed" /><DArrowRight v-else /></el-icon>
        </el-button>
      </div>
    </el-aside>

    <el-container>
      <!-- Header -->
      <el-header style="background: #0d0d0d; border-bottom: 1px solid #1e1e1e; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 15px; color: #b0a080; letter-spacing: 0.1em;">{{ currentTitle }}</div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="http://localhost:5173" target="_blank" style="font-size: 12px; color: #5a4a30; text-decoration: none;">
            查看前台 →
          </a>
          <el-dropdown>
            <div style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #8a7a60; font-size: 13px;">
              <el-icon><User /></el-icon>
              {{ adminUser?.username }}
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main content -->
      <el-main style="background: #0a0a0a; padding: 24px;">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const adminUser = computed(() => {
  try { return JSON.parse(localStorage.getItem('admin_user') || '{}') } catch { return {} }
})
const currentTitle = computed(() => route.meta.title as string || '管理后台')

function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/login')
}
</script>
