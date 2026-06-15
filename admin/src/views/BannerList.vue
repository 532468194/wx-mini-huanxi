<template>
  <div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
      <el-button type="primary" @click="openEdit()"><el-icon><Plus /></el-icon> 新增轮播图</el-button>
    </div>

    <el-table :data="banners" v-loading="loading">
      <el-table-column label="预览" width="120">
        <template #default="{ row }">
          <img :src="imgSrc(row.image_url)" style="width: 100px; height: 56px; object-fit: cover;" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="副标题" prop="subtitle" show-overflow-tooltip />
      <el-table-column label="排序" prop="sort_order" width="80" align="center" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.is_active" :active-value="1" :inactive-value="0" @change="updateBanner(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="deleteBanner(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" :title="editForm.id ? '编辑轮播图' : '新增轮播图'" width="520px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" placeholder="如：欢喜天珠" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="editForm.subtitle" placeholder="如：戴的是气场 求的是心安" />
        </el-form-item>
        <el-form-item label="图片地址" required>
          <el-input v-model="editForm.image_url" placeholder="/static/天珠/..." />
          <div style="margin-top: 8px;">
            <el-button size="small" @click="showFilePicker = true">从素材库选择</el-button>
          </div>
          <img v-if="editForm.image_url" :src="imgSrc(editForm.image_url)" style="width: 100%; max-height: 120px; object-fit: cover; margin-top: 8px;" />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="editForm.link" placeholder="/products/1" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sort_order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveBanner" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- File picker -->
    <el-dialog v-model="showFilePicker" title="选择图片" width="700px">
      <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
        <el-button v-for="dir in dirs" :key="dir.path" size="small" @click="browseDir(dir.path)">{{ dir.name }}</el-button>
        <el-button v-if="currentDir" size="small" @click="browseDir('')">← 返回</el-button>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 360px; overflow-y: auto;">
        <div v-for="file in files" :key="file.url" @click="pickFile(file.url)" style="cursor: pointer; border: 1px solid #2a2a2a;">
          <img :src="imgSrc(file.url)" style="width: 80px; height: 80px; object-fit: cover; display: block;" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bannersApi, filesApi } from '@/api'

const banners = ref<any[]>([])
const loading = ref(false)
const saving = ref(false)
const showDialog = ref(false)
const showFilePicker = ref(false)
const dirs = ref<any[]>([])
const files = ref<any[]>([])
const currentDir = ref('')
const editForm = ref<any>({ title: '', subtitle: '', image_url: '', link: '', sort_order: 0, is_active: 1 })

function imgSrc(path: string) {
  return path.split('/').map((seg: string, i: number) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

async function load() {
  loading.value = true
  try { banners.value = (await bannersApi.list()).data } finally { loading.value = false }
}

function openEdit(row?: any) {
  editForm.value = row ? { ...row } : { title: '', subtitle: '', image_url: '', link: '', sort_order: 0, is_active: 1 }
  showDialog.value = true
}

async function saveBanner() {
  if (!editForm.value.image_url) { ElMessage.error('请填写图片地址'); return }
  saving.value = true
  try {
    if (editForm.value.id) await bannersApi.update(editForm.value.id, editForm.value)
    else await bannersApi.create(editForm.value)
    ElMessage.success('保存成功')
    showDialog.value = false
    load()
  } finally { saving.value = false }
}

async function updateBanner(row: any) {
  await bannersApi.update(row.id, row)
}

async function deleteBanner(row: any) {
  await ElMessageBox.confirm('确认删除此轮播图？', '确认', { type: 'warning' })
  await bannersApi.delete(row.id)
  ElMessage.success('已删除')
  load()
}

async function browseDir(dir: string) {
  currentDir.value = dir
  const res = await filesApi.browse(dir)
  dirs.value = res.data.dirs
  files.value = res.data.files
}

function pickFile(url: string) {
  editForm.value.image_url = url
  showFilePicker.value = false
}

onMounted(() => { load(); browseDir('') })
</script>
