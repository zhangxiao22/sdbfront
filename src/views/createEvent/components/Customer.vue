<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="白名单上传"
                   name="1">
        <WhiteList ref="whiteList" />
      </el-tab-pane>
      <el-tab-pane label="模型导入"
                   name="2">模型导入</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { } from '@/api/api'
import WhiteList from './WhiteList'

export default {
  name: 'Customer',
  components: {
    WhiteList
  },
  data() {
    return {
      activeName: '1'
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
    // groupId() {
    //   return this.labelIndex - 1
    // }
  },
  watch: {

  },
  mounted() {
  },
  created() {

  },
  methods: {
    validateAndNext() {
      if (this.activeName === '1') {
        return this.$refs['whiteList'].validateAndNext()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 5px 20px;
}
</style>
