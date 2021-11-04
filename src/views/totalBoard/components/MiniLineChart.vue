<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Area } from '@antv/g2plot'
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
    }
    // // value字段别名
    // metaValue: {
    //   type: String,
    //   default: ''
    // },
    // tooltipTitle: {
    //   type: String,
    //   default: ''
    // },
    // hideXAxis: {
    //   type: Boolean,
    //   default: false
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
        padding: [5, 0, 0, 0],
        appendPadding: 0,
        xField: 'label',
        yField: 'value',
        yAxis: false,
        xAxis: false,
        smooth: true,
        color: '#61DDAA',
        areaStyle: {
          fillOpacity: 1
        },
        tooltip: {
          showTitle: false,
          // 不显示十字线
          showCrosshairs: false,
          formatter: (datum) => {
            return {
              name: datum.label,
              value: formatMoney(datum.value / 10000) + '万元'
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
