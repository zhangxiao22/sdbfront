<template>
  <div id="container" />
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  props: {

  },
  data() {
    return {

    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      const data = [
        { name: '对照组', type: 'AUM增长率', value: 0.1 },
        { name: '对照组', type: '储蓄存储增长率', value: 0.8 },
        { name: '对照组', type: '成功购买率', value: 0.9 },
        { name: '试点结果', type: 'AUM增长率', value: 0.4 },
        { name: '试点结果', type: '储蓄存储增长率', value: 0.2 },
        { name: '试点结果', type: '成功购买率', value: 0.5 },
        { name: '正式推广', type: 'AUM增长率', value: 0.4 },
        { name: '正式推广', type: '储蓄存储增长率', value: 0 },
        { name: '正式推广', type: '成功购买率', value: 0.5 }
      ]
      let maxValue = 0
      data.forEach((n, i) => {
        if (n.value > maxValue) {
          maxValue = n.value
        }
      })
      console.log(maxValue)
      const chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 350,
        appendPadding: [0, 0, 10]
      })

      chart.data(data)
      chart.scale('value', {
        min: 0,
        max: maxValue,
        nice: true,
        formatter: (val) => `${val * 100}%`
      })

      chart.tooltip({
        showMarkers: false,
        shared: true
      })

      chart
        .interval()
        .position('type*value')
        .color('name')
        .adjust([
          {
            type: 'dodge',
            marginRatio: 0
          }
        ])

      chart.interaction('active-region')
      chart.render()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
