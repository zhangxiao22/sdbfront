<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'

export default {
  name: 'BarChart',
  props: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      default() { return [] }
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
        autoFit: true,
        height: 300,
        appendPadding: [0, 50, 50, 0]
      })
      this.chart.data(this.data)
      this.chart.scale('value', {
        nice: true
      })
      this.chart.tooltip({
        showMarkers: false,
        shared: true,
        customItems: items => {
          return items.map(item => ({
            ...item,
            value: `${Math.floor(+item.value * 100)}%`
          }))
        }
      })
      this.chart.legend({
        position: 'right'
      })
      this.chart.axis('value', {
        label: {
          formatter: n => `${Math.floor(n * 100)}%`
        }
      })
      this.chart
        .interval()
        .position('label*value')
        .color('category')
        .adjust([{
          type: 'dodge',
          marginRatio: 0
        }])
      this.chart.interaction('active-region')
      this.chart.render()
    }
  }
}
</script>
