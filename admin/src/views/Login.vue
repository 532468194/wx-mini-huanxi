<template>
  <div class="min-h-screen flex items-center justify-center" style="background: #0a0a0a;">
    <div style="width: 400px; border: 1px solid #1e1e1e; padding: 48px; background: #111;">
      <div style="text-align: center; margin-bottom: 36px;">
        <div style="font-size: 2rem; letter-spacing: 0.4em; color: #C9A84C; font-family: 'STSong', serif; margin-bottom: 8px;">欢喜</div>
        <div style="font-size: 11px; letter-spacing: 0.4em; color: #5a4a30; text-transform: uppercase;">Admin Dashboard</div>
      </div>

      <el-form :model="form" @submit.prevent="login">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-button
          type="primary"
          @click="login"
          :loading="loading"
          style="width: 100%; height: 48px; font-size: 14px; letter-spacing: 0.2em; margin-top: 8px;"
        >
          登 录
        </el-button>
      </el-form>

      <div v-if="error" style="margin-top: 12px; color: #f56c6c; text-align: center; font-size: 13px;">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = ref({ username: '', password: '' })

async function login() {
  if (!form.value.username || !form.value.password) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await authApi.login(form.value)
    localStorage.setItem('admin_token', res.data.token)
    localStorage.setItem('admin_user', JSON.stringify(res.data.admin))
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>
