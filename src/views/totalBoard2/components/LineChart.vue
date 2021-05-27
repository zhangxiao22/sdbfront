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
    // average() {
    //   let count = 0
    //   this.data.forEach(n => {
    //     count += n.value
    //   })
    //   return (count / this.data.length).toFixed(2)
    // }
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
        // padding: [0, 0, 70, 'auto']
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

      this.chart
        .line()
        .position('label*value')
        .color('category', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF', '#FF3366'])
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
