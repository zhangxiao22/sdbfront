<template>
  <div v-loading="mainLoading"
       class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="白名单上传"
                   name="1">
        <WhiteList ref="whiteList" />
      </el-tab-pane>
      <el-tab-pane label="规则导入"
                   name="2">
        <Rule ref="rule" />
      </el-tab-pane>
      <el-tab-pane label="模型导入"
                   name="3">
        <Model ref="model" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { } from '@/api/api'
import WhiteList from './WhiteList'
import Rule from './Rule'
import Model from './Model'
import { getGroup } from '@/api/api'

export default {
  name: 'Customer',
  components: {
    WhiteList,
    Rule,
    Model
  },
  data() {
    return {
      mainLoading: false,
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
    // activeName() {
    //   if (this.activeName === '3') {
    //     this.$router.push('/model')
    //   }
    // }
  },
  mounted() {
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 获取详情
    getDetail() {
      this.mainLoading = true
      getGroup({ baseId: this.id }).then(res => {
        // this.activeName = res.data.abstractDetail.lodeType.value + ''
        if (res.code === 200) {
          if (res.data.abstractDetail.lodeType) {
            const lodeType = res.data.abstractDetail.lodeType.value
            if (lodeType === 1) {
              // 白名单
              this.activeName = '1'
            } else if (lodeType === 2) {
              // 规则
              this.activeName = '2'
            }
          } else {
            // 默认白名单
            this.activeName = '1'
          }
          this.$refs['whiteList'].init(res.data)
          this.$refs['rule'].init(res.data)
        }
      }).finally(() => {
        this.mainLoading = false
      })
    },
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
