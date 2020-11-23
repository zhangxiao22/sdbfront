<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="白名单上传"
                   name="1">
        <WhiteList ref="whiteList" />
      </el-tab-pane>
      <el-tab-pane label="规则导入"
                   name="2">
        <Rule ref="rule" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { } from '@/api/api'
import WhiteList from './WhiteList'
import Rule from './Rule'

export default {
  name: 'Customer',
  components: {
    WhiteList,
    Rule
  },
  data() {
    return {
      activeName: '2'
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
      } else if (this.activeName === '2') {
        return this.$refs['rule'].validateAndNext()
      }
    },
    reset() {
      if (this.activeName === '1') {
        return this.$refs['whiteList'].reset()
      } else if (this.activeName === '2') {
        return this.$refs['rule'].reset()
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
