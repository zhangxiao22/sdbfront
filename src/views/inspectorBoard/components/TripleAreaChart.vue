<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'

export default {
  name: 'TripleAreaChart',
  props: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      default() { return [] }
    },
    categoryList: {
      type: Array,
      required: true,
      validator: n => n.length === 3
    },
    colorList: {
      type: Array,
      required: true,
      validator: n => n.length === 3
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
      this.chart.scale('label', {
        range: [0.02, 0.98]
      })
      this.chart.scale('value1', {
        nice: true,
        sync: true
      })
      this.chart.scale('value2', {
        sync: 'value1'
      })
      this.chart.axis('value2', {
        grid: null,
        label: null
      })
      this.chart.axis('value3', {
        grid: null,
        label: {
          formatter: n => `${Math.floor(n * 100)}%`
        }
      })
      this.chart.legend({
        position: 'right',
        custom: true,
        items: this.categoryList.map((n, i) => ({
          value: `value${i + 1}`,
          name: this.categoryList[i],
          marker: {
            symbol: 'square',
            style: {
              fill: this.colorList[i],
              r: 5
            }
          }
        }))
      })
      this.chart.tooltip({
        shared: true,
        showCrosshairs: true,
        customItems: items => {
          return items.map((n, i) => {
            const item = {
              ...n,
              name: this.categoryList[i]
            }
            return i === items.length - 1
              ? {
                ...item,
                value: `${Math.floor(+n.value * 100)}%`
              }
              : item
          })
        }
      })
      this.categoryList.forEach((n, i) => {
        const p = `label*value${i + 1}`
        const c = this.colorList[i]
        const s = 'smooth'
        this.chart.area().position(p).color(c).shape(s)
        this.chart.line().position(p).color(c).shape(s)
        this.chart.point().position(p).color(c)
      })
      this.chart.removeInteraction('legend-filter')
      this.chart.render()
    }
  }
}
</script>
