<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Column } from '@antv/g2plot'
import { formatMoney } from '@/utils'
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
    // value字段别名
    metaValue: {
      type: String,
      default: ''
    },
    tooltipTitle: {
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
      this.chart.changeData(this.data)
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.chart = new Column(this.id, {
        data: this.data,
        xField: 'label',
        yField: 'value',
        yAxis: {
          grid: {
            line: {
              style: {
                lineDash: [2, 2]
              }
            }
          },
          label: {
            // 数值格式化为千分位
            formatter: (v) => formatMoney(v)
          }
        },
        xAxis: null,
        label: {
          formatter: ({ value }) => formatMoney(value),
          // 可手动配置 label 数据标签位置
          position: 'middle',
          // 配置样式
          style: {
            fill: '#FFFFFF',
            shadowColor: 'black',
            shadowBlur: 3
            // opacity: 0.6
          },
          autoRotate: true
        },
        meta: {
          // value: {
          //   alias: this.metaValue
          // },
          label: {
            // formatter(val) {
            //   return val.slice(0, 5) + '...'
            // }
          }
        },
        tooltip: {
          showTitle: false,
          formatter: (datum) => {
            return {
              name: datum.label,
              value: formatMoney(datum.value)
            }
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
