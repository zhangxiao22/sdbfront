<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    // y轴title
    alias: {
      type: String,
      default: ''
    }
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
      const _this = this
      const data = [
        { month: '5/1', city: 'App推送', temperature: 7 },
        { month: '5/1', city: '微信', temperature: 3.9 },
        { month: '5/5', city: 'App推送', temperature: 6.9 },
        { month: '5/5', city: '微信', temperature: 4.2 },
        { month: '5/10', city: 'App推送', temperature: 9.5 },
        { month: '5/10', city: '微信', temperature: 5.7 },
        { month: '5/15', city: 'App推送', temperature: 14.5 },
        { month: '5/15', city: '微信', temperature: 8.5 },
        { month: '5/20', city: 'App推送', temperature: 18.4 },
        { month: '5/20', city: '微信', temperature: 11.9 },
        { month: '5/30', city: 'App推送', temperature: 21.5 },
        { month: '5/30', city: '微信', temperature: 15.2 },
        { month: '6/5', city: 'App推送', temperature: 25.2 },
        { month: '6/5', city: '微信', temperature: 17 },
        { month: '6/10', city: 'App推送', temperature: 26.5 },
        { month: '6/10', city: '微信', temperature: 16.6 },
        { month: '6/15', city: 'App推送', temperature: 23.3 },
        { month: '6/15', city: '微信', temperature: 14.2 },
        { month: '6/20', city: 'App推送', temperature: 18.3 },
        { month: '6/20', city: '微信', temperature: 10.3 },
        { month: '6/25', city: 'App推送', temperature: 13.9 },
        { month: '6/25', city: '微信', temperature: 6.6 },
        { month: '6/30', city: 'App推送', temperature: 9.6 },
        { month: '6/30', city: '微信', temperature: 4.8 }
      ]

      const chart = new Chart({
        container: this.id,
        autoFit: true
      })

      chart.data(data)

      chart.scale({
        month: {
          range: [0, 1]
        },
        temperature: {
          nice: true,
          alias: this.alias
        }
      })

      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      chart.axis('temperature', {
        // label: {
        //   formatter: (val) => {
        //     return val + ' °C'
        //   }
        // }

        title: {
          offset: 40,
          style: {
            fill: '#888'
          }
        }
      })

      chart
        .line()
        .position('month*temperature')
        .color('city')
      // .shape('smooth')

      chart
        .point()
        .position('month*temperature')
        .color('city')
        .shape('circle')

      chart.render()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.chart {
  height: 100%;
  width: 100%;
}
</style>
