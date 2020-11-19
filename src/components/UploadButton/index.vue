<template>
  <div class="button-container">
    <el-upload ref="uploadRef"
               :disabled="uploading"
               :on-change="handleFileChange"
               class="upload"
               :http-request="handleUploadFileAll"
               :show-file-list="false"
               :accept="accept.map(n => `.${n}`).join(',')"
               action="">
      <el-button :loading="uploading"
                 :disabled="uploading"
                 icon="el-icon-upload2"
                 type="primary"
                 plain>
        {{ buttonName }}
      </el-button>
    </el-upload>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  props: {
    // 上传文件格式
    accept: {
      type: Array,
      default() {
        return ['xls', 'xlsx']
      }
    },
    // 按钮名字
    buttonName: {
      type: String,
      default: ''
    },
    // 上传文件调用的接口
    uploadMethod: {
      type: Function,
      default() {
        return
      }
    },
    // 上传文件传的参数
    uploadParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 按钮是否加载中
      uploading: false
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
        // 文件格式不正确
        this.$message({
          message: '请上传正确的文件格式',
          type: 'error',
          duration: '5000'
        })
        this.resetFile()
        return
      } else {
        // 文件格式正确 开始上传
        const formData = new FormData()
        formData.append('file', this.file)
        for (const key in this.uploadParams) {
          formData.append(key, this.uploadParams[key])
        }
        this.uploading = true
        Notification.closeAll()
        this.uploadMethod(formData).then(res => {
          if (res.data.length) {
            this.$notify({
              title: '数据错误',
              message: res.data.join('<br/>'),
              dangerouslyUseHTMLString: true,
              type: 'warning',
              duration: 0
            })
          } else {
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: '3000'
            })
          }
          // 上传成功后
          this.$emit('afterUploadSuccess')
        }).catch(() => {
          // 上传失败
          this.$emit('afterUploadFail')
          this.resetFile()
        }).finally(() => {
          this.uploading = false
        })
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
</style>
