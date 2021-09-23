<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'

export default {
  name: 'DoubleBarChart',
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
      this.chart.scale('value1', {
        nice: true
      })
      this.chart.legend({
        position: 'right'
      })
      this.chart.axis('value2', {
        grid: null,
        label: {
          formatter: n => `${Math.floor(n * 100)}%`
        }
      })
      this.chart.tooltip({
        showMarkers: false,
        shared: true,
        customItems: items => {
          const [item, ...rest] = items
          const arr = rest.map(n => ({
            ...n,
            value: `${Math.floor(+n.value * 100)}%`
          }))
          arr.splice(0, 0, item)
          return arr
        }
      })
      const a = [1, 2]
      a.forEach(i => {
        this.chart.interval().position(`label*value${i}`).color('category').adjust([{
          type: 'dodge',
          marginRatio: 0.1
        }])
      })
      this.chart.interaction('active-region')
      this.chart.render()
    }
  }
}
</script>
