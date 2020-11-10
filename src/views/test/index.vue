<template>
  <div class="container">
    <div id="canvas"
         style="width:300px;height:500px;"
         class="chart" />
  </div>
</template>

<script>
import { Funnel } from '@antv/g2plot'

export default {
  components: {
  },

  data() {
    return {
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
    this.getList()
  },
  mounted() {
    const data = [
      { stage: '简历筛选', number: 253 },
      { stage: '初试人数', number: 151 },
      { stage: '复试人数', number: 113 },
      { stage: '录取人数', number: 87 },
      { stage: '入职人数', number: 59 }
    ]

    const funnelPlot = new Funnel('canvas', {
      data: data,
      xField: 'stage',
      yField: 'number',
      dynamicHeight: true,
      legend: false
    })

    funnelPlot.render()
  },
  methods: {
    rowKey(row) {
      return row.address
    },
    getList() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
