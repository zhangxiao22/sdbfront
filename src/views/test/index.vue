<template>
  <div class="container">
    <UploadButton button-name="测试"
                  :upload-method="aaaa"
                  :upload-params="uploadParams"
                  @afterUploadSuccess="afterUploadSuccess" />
  </div>
</template>

<script>
import UploadButton from '@/components/UploadButton'
import { batchUploadFile } from '@/api/api'

export default {
  components: {
    UploadButton
  },

  data() {
    return {
      aaa: batchUploadFile,
      uploadParams: {
        category: 1,
        updateType: 1
      }
    }
  },
  computed: {

  },

  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    afterUploadSuccess() {
      alert('ok')
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
