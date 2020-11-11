<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Chart } from '@antv/g2'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    id: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    implementAverage() {
      let count = 0
      let x = 0
      this.data.forEach(n => {
        if (n.category === '执行组') {
          count += n.value
          x += 1
        }
      })
      return (count / x).toFixed(2)
    },
    compareAverage() {
      let count = 0
      let x = 0
      this.data.forEach(n => {
        if (n.category === '对照组') {
          count += n.value
          x += 1
        }
      })
      return (count / x).toFixed(2)
    }
  },

  watch: {
    data() {
      this.chart.changeData(this.data)
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.chart = new Chart({
        container: this.id,
        autoFit: true
      })

      this.chart.data(this.data)
      this.chart.scale({
        value: {
          min: 0,
          max: 100
        }
      })
      this.chart.tooltip({
        showCrosshairs: true,
        // tooltip合并展示
        shared: true,
        // showTitle: false,
        showMarkers: false,
        itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}：{value}%</li>'
      })
      this.chart.annotation().line({
        start: ['min', this.implementAverage],
        end: ['max', this.implementAverage],
        style: {
          stroke: '#6495f9',
          lineWidth: 1,
          lineDash: [3, 3]
        },
        text: {
          position: 'start',
          style: {
            fill: '#6495f9',
            // fontSize: 15,
            fontWeight: 'normal'
          },
          content: `执行组平均值 ${this.implementAverage}%`,
          offsetY: -5
        }
      })
      // this.chart.annotation().line({
      //   start: ['min', this.compareAverage],
      //   end: ['max', this.compareAverage],
      //   style: {
      //     stroke: '#59d8a7',
      //     lineWidth: 1,
      //     lineDash: [3, 3]
      //   },
      //   text: {
      //     position: 'start',
      //     style: {
      //       fill: '#444',
      //       // fontSize: 15,
      //       fontWeight: 'normal'
      //     },
      //     content: `对照组平均值 ${this.compareAverage}%`,
      //     offsetY: -5,
      //     offsetX: 500
      //   }
      // })

      this.chart.axis('value', {
        label: {
          formatter: (val) => {
            return val + '%'
          }
        }
      })

      this.chart
        .line()
        .position('label*value')
        .color('category')
      this.chart
        .point()
        .position('label*value')
        .color('category')
        .shape('circle')

      this.chart.render()
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
