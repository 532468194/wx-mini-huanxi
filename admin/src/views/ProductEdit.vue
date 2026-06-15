<template>
  <div style="max-width: 900px;">
    <el-page-header @back="$router.back()" :title="isEdit ? '编辑商品' : '新增商品'" style="margin-bottom: 24px;" />

    <el-form :model="form" label-width="100px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="14">
          <el-form-item label="商品名称" required>
            <el-input v-model="form.name" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="form.subtitle" placeholder="简短描述，显示在名称下方" />
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="form.description" type="textarea" :rows="6" placeholder="详细描述商品特点、材质、工艺等" />
          </el-form-item>
          <el-form-item label="尺寸规格">
            <el-input v-model="form.size_info" placeholder="如：尺寸-36×15mm" />
          </el-form-item>
          <el-form-item label="标签">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <el-tag
                v-for="tag in form.tags"
                :key="tag"
                closable
                @close="removeTag(tag)"
                style="cursor: default;"
              >{{ tag }}</el-tag>
            </div>
            <div style="display: flex; gap: 8px;">
              <el-input v-model="newTag" placeholder="添加标签" style="width: 160px;" @keyup.enter="addTag" />
              <el-button @click="addTag">添加</el-button>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="商品分类" required>
            <el-select v-model="form.category_id" placeholder="选择分类" style="width: 100%;">
              <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-switch v-model="form.is_inquiry_only" active-text="面议询价" inactive-text="固定价格" style="margin-bottom: 8px;" />
            <el-input-number
              v-if="!form.is_inquiry_only"
              v-model="form.price"
              :min="0"
              :precision="0"
              style="width: 100%;"
              placeholder="商品价格（元）"
            />
          </el-form-item>
          <el-form-item label="库存">
            <el-input-number v-model="form.stock" :min="0" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort_order" :min="0" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="是否精选">
            <el-switch v-model="form.featured" />
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch v-model="form.is_active" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- Image management -->
      <el-form-item label="商品图片">
        <div style="width: 100%;">
          <!-- Current images -->
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            <div
              v-for="(img, idx) in form.images"
              :key="idx"
              style="position: relative; width: 100px; height: 100px;"
            >
              <img :src="imgSrc(img)" style="width: 100%; height: 100%; object-fit: cover; border: 1px solid #2a2a2a;" />
              <button
                @click="removeImage(idx)"
                style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: #fff; border: none; width: 20px; height: 20px; cursor: pointer; font-size: 12px;"
              >✕</button>
              <div
                style="position: absolute; bottom: 2px; left: 2px; background: rgba(0,0,0,0.6); color: #C9A84C; font-size: 10px; padding: 1px 4px; cursor: pointer;"
                @click="moveFirst(idx)"
              >{{ idx === 0 ? '封面' : '设封面' }}</div>
            </div>
          </div>

          <!-- Upload new image -->
          <div style="display: flex; gap: 8px;">
            <el-button @click="showFilePicker = true">从素材库选择</el-button>
            <el-upload
              :show-file-list="false"
              :before-upload="handleUpload"
              accept="image/*"
            >
              <el-button>上传本地图片</el-button>
            </el-upload>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save" :loading="saving" style="min-width: 120px;">
          {{ isEdit ? '保存修改' : '创建商品' }}
        </el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- File picker dialog -->
    <el-dialog v-model="showFilePicker" title="从素材库选择图片" width="800px">
      <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
        <el-button
          v-for="dir in dirs"
          :key="dir.path"
          size="small"
          @click="browseDir(dir.path)"
        >{{ dir.name }}</el-button>
        <el-button v-if="currentDir" size="small" @click="browseDir('')">← 返回根目录</el-button>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 400px; overflow-y: auto;">
        <div
          v-for="file in files"
          :key="file.url"
          @click="selectFile(file.url)"
          style="cursor: pointer; border: 1px solid #2a2a2a; overflow: hidden;"
        >
          <img :src="imgSrc(file.url)" style="width: 90px; height: 90px; object-fit: cover; display: block;" />
          <div style="font-size: 9px; color: #5a4a30; padding: 2px 4px; width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ file.name }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { productsApi, categoriesApi, filesApi, uploadApi } from '@/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const showFilePicker = ref(false)
const dirs = ref<any[]>([])
const files = ref<any[]>([])
const currentDir = ref('')
const categories = ref<any[]>([])
const newTag = ref('')

const isEdit = computed(() => !!route.params.id)

const form = ref<any>({
  category_id: null,
  name: '',
  subtitle: '',
  description: '',
  size_info: '',
  price: null,
  is_inquiry_only: false,
  stock: 1,
  featured: false,
  is_active: true,
  images: [],
  tags: [],
  sort_order: 0,
})

function imgSrc(path: string) {
  return path.split('/').map((seg: string, i: number) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

function addTag() {
  const t = newTag.value.trim()
  if (t && !form.value.tags.includes(t)) form.value.tags.push(t)
  newTag.value = ''
}
function removeTag(tag: string) { form.value.tags = form.value.tags.filter((t: string) => t !== tag) }
function removeImage(idx: number) { form.value.images.splice(idx, 1) }
function moveFirst(idx: number) {
  const img = form.value.images.splice(idx, 1)[0]
  form.value.images.unshift(img)
}

async function browseDir(dir: string) {
  currentDir.value = dir
  const res = await filesApi.browse(dir)
  dirs.value = res.data.dirs
  files.value = res.data.files
}

function selectFile(url: string) {
  if (!form.value.images.includes(url)) form.value.images.push(url)
  showFilePicker.value = false
}

async function handleUpload(file: File) {
  const res = await uploadApi.image(file)
  form.value.images.push(res.data.url)
  return false
}

async function save() {
  if (!form.value.name) { ElMessage.error('请输入商品名称'); return }
  if (!form.value.category_id) { ElMessage.error('请选择分类'); return }
  saving.value = true
  try {
    const data = { ...form.value, price: form.value.is_inquiry_only ? null : form.value.price }
    if (isEdit.value) {
      await productsApi.update(Number(route.params.id), data)
      ElMessage.success('保存成功')
    } else {
      await productsApi.create(data)
      ElMessage.success('商品创建成功')
    }
    router.push('/products')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const [cats] = await Promise.all([categoriesApi.list(), browseDir('')])
  categories.value = cats.data

  if (isEdit.value) {
    loading.value = true
    try {
      const res = await productsApi.get(Number(route.params.id))
      Object.assign(form.value, res.data.product)
    } finally {
      loading.value = false
    }
  }
})
</script>
