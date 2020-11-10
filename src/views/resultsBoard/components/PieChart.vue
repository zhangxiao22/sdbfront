<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
import { parse } from 'path-to-regexp'
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
      // const data = [{ 'item': 'Matilda', 'count': 93, 'percent': 0.31 }, { 'item': 'Mister Miyagi', 'count': 15, 'percent': 0.05 }, { 'item': 'Lloyd', 'count': 97, 'percent': 0.32 }, { 'item': 'Dobby', 'count': 22, 'percent': 0.07 }, { 'item': 'Hairy Paw-ter', 'count': 68, 'percent': 0.23 }]
      const data = this.data
      this.chart = new Chart({
        container: this.id,
        autoFit: true
      })
      this.chart.data(data)
      this.chart.scale('percent', {
        formatter: (val) => {
          val = parseFloat((val * 100).toFixed(2)) + '%'
          return val
        }
      })
      this.chart.coordinate('theta', {
        radius: 0.75
        // innerRadius: 0.6
      })
      this.chart.tooltip({
        showTitle: false,
        showMarkers: false,
        itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      })

      this.chart
        .interval()
        .adjust('stack')
        .position('percent')
        .color('item')
        .label('percent', {
          offset: -40,
          style: {
            textAlign: 'center',
            fontSize: 12,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, .45)',
            fill: '#fff'
          }
        })
        .tooltip('item*percent', (item, percent) => {
          percent = percent * 100 + '%'
          return {
            name: item,
            value: percent
          }
        })

      this.chart.interaction('element-active')

      this.chart.render()
    },
    update() {
      this.chart.changeData(this.data)
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
