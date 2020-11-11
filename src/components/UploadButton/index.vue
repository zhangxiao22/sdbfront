<template>
  <div class="button-container">
    <el-upload ref="uploadRef"
               :disabled="uploading"
               :on-change="handleFileChange"
               class="upload button"
               :http-request="handleUploadFileAll"
               :show-file-list="false"
               :accept="accept.map(n => `.${n}`).join(',')"
               action="">
      <el-button :loading="uploading"
                 :disabled="uploading"
                 icon="el-icon-upload2"
                 type="primary"
                 plain>
        {{ name }}
      </el-button>
    </el-upload>
  </div>
</template>

<script>
import { Notification } from 'element-ui'

export default {
  props: {
    uploadMethod: {
      type: Function,
      default: console.log('noData')
    },
    category: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    isAllUpload: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      uploading: false,
      accept: ['xls', 'xlsx', 'csv']
    }
  },
  watch: {

  },

  methods: {
    handleFileChange(file) {
      this.file = file.raw
    },
    resetFile() {
      this.file = ''
      this.$refs.uploadRef.clearFiles()
    },
    handleUploadFileAll() {
      const index = this.file.name.lastIndexOf('.')
      const suffix = this.file.name.substr(index + 1)
      if (!this.accept.includes(suffix)) {
        this.$message({
          message: '请上传正确的文件格式',
          type: 'error',
          duration: '5000'
        })
        this.resetFile()
        return
      } else {
        const formData = new FormData()
        formData.append('file', this.file)
        if (this.category !== -1) {
          formData.append('category', this.category)
        }
        if (this.isAllUpload !== -1) {
          formData.append('updateType', this.isAllUpload)
        }
        this.uploading = true
        Notification.closeAll()
        this.setUploading(formData)
      }
    },
    setUploading(formData) {
      this.uploading = false
      this.uploadMethod(formData)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.button-container {
}
</style>
