<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Column } from '@antv/g2plot'

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
        label: {
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
          value: {
            alias: this.metaValue

          },
          label: {
            formatter(val) {
              return val.slice(0, 5) + '...'
            }
          }
        },
        tooltip: {
          title: this.tooltipTitle,
          formatter: (datum) => {
            return {
              name: datum.label,
              value: datum.value
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
