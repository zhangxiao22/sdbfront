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
    data: {
      type: Array,
      default() {
        return []
      }
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
    data() {
      this.render()
    }
  },
  mounted() {
  },
  methods: {
    render() {
      const _this = this
      const data = this.data
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
