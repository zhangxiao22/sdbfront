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
    average() {
      let count = 0
      this.data.forEach(n => {
        count += n.value
      })
      return (count / this.data.length).toFixed(2)
    }
  },

  watch: {
    data() {
      if (this.data.length) {
        this.chart.changeData(this.data)
      }
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    updete() {
      this.render()
    },
    clear() {
      this.chart.clear()
    },
    render() {
      this.chart = new Chart({
        container: this.id,
        autoFit: true
      })

      this.chart.data(this.data)
      this.chart.scale({
        value: {
          min: 0,
          max: 100,
          alias: '执行组'
        }
      })
      this.chart.tooltip({
        showCrosshairs: true,
        // tooltip合并展示
        shared: true,
        // showTitle: false,
        showMarkers: false,
        itemTpl: `<li class="g2-tooltip-list-item">
                    <span style="background-color:{color};" class="g2-tooltip-marker"></span>
                    {name}：{value}%
                  </li>`
      })
      this.chart.axis('value', {
        grid: {
          line: {
            style: {
              lineDash: [2, 2]
            }
          }
        },
        label: {
          formatter: (val) => {
            return val + '%'
          }
        }
      })
      this.chart.annotation().line({
        start: ['min', this.average],
        end: ['max', this.average],
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
          content: `平均值 ${this.average}%`,
          offsetY: -5
        }
      })

      this.chart
        .line()
        .position('label*value')
      // this.chart
      //   .point()
      //   .position('label*value')
      //   .shape('circle')

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
