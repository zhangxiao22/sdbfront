<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Bar } from '@antv/g2plot'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    },
    data: {
      type: Array,
      default() {
        return []
      }
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
  },
  watch: {
    data: {
      handler() {
        this.chart.changeData(this.data)
      }
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.chart = new Bar(this.id, {
        data: this.data,
        xField: 'value',
        yField: 'label',
        xAxis: {
          grid: {
            line: {
              style: {
                lineDash: [2, 2]
              }
            }
          },
          label: {
            formatter: (v) => v + this.unit
          }
        },
        tooltip: {
          showTitle: false,
          formatter: (datum) => {
            return {
              name: datum.label,
              value: datum.value + this.unit
            }
          }
        }
        // barWidthRatio: 0.8
        // meta: {
        //   type: {
        //     alias: '类别'
        //   },
        //   sales: {
        //     alias: '销售额'
        //   }
        // }
      })
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
