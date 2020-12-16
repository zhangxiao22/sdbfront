<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Area } from '@antv/g2plot'
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
    // xField: {
    //   type: String,
    //   default: ''
    // },
    // yField: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {

    }
  },
  computed: {
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
      this.chart = new Area(this.id, {
        data: this.data,
        smooth: true,
        yAxis: {
          grid: {
            line: {
              style: {
                lineDash: [2, 2]
              }
            }
          }
        },
        xAxis: false,
        xField: 'label',
        yField: 'value',
        tooltip: {
          showTitle: false,
          formatter: (datum) => {
            return {
              name: datum.label,
              value: datum.value + this.unit
            }
          }
        },
        areaStyle: () => {
          return {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
          }
        }
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
