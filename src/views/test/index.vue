<template>
  <div class="container">
    <div class="block">
      {{ value1 }} {{ typeof value1 }}
      <span class="demonstration">默认</span>
      <el-date-picker v-model="value1"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" />
    </div>
  </div>
</template>

<script>
import { Funnel } from '@antv/g2plot'

export default {
  components: {
  },

  data() {
    return {
      value1: '',
      loading: false,
      tableData: [{
        address: '1111'
      }, {
        address: '2222'
      }, {
        address: '3333'
      }, {
        address: '4444'
      }]
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

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
