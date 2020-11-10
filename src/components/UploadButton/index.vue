<template>
  <div class="button-container">
    <!-- <el-upload ref="uploadRef"
               :disabled="uploading"
               :on-change="handleFileChange"
               class="upload button"
               :http-request="file=>handleUploadFileAll(file,1)"
               :show-file-list="false"
               :accept="accept.map(n => `.${n}`).join(',')"
               action="">
      <el-button :loading="uploading"
                 :disabled="uploading"
                 icon="el-icon-upload2"
                 type="primary"
                 plain>
        全量更新
      </el-button> -->
    <el-button>{{ name }}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  watch: {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.button-container {
}
</style>
