<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'

export default {
  name: 'LineChart',
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
        showCrosshairs: true,
        shared: true
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
        .line()
        .position('label*value')
        .color('category')
        .shape('smooth')
      this.chart
        .point()
        .position('label*value')
        .color('category')
        .shape('circle')
      this.chart.render()
    }
  }
}
</script>
