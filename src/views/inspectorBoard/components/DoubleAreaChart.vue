<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'

export default {
  name: 'DoubleAreaChart',
  props: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      default() { return [] }
    },
    dataTitleList: {
      type: Array,
      required: true,
      validator: n => n.length === 2
    }
  },
  data() {
    return {
      colors: ['#6395f9', '#61d9aa']
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
        appendPadding: [0, 20, 20, 0]
      })
      this.chart.data(this.data)
      this.chart.scale('label', {
        range: [0.02, 0.98]
      })
      this.chart.scale('value1', {
        nice: true
      })
      this.chart.scale('value2', {
        nice: true
      })
      this.chart.axis('value2', {
        grid: null,
        label: {
          formatter: n => `${Math.floor(n * 100)}%`
        }
      })
      this.chart.legend({
        position: 'right',
        custom: true,
        items: [{
          value: 'value1',
          name: this.dataTitleList[0],
          marker: {
            symbol: 'square',
            style: {
              fill: this.colors[0],
              r: 5
            }
          }
        }, {
          value: 'value2',
          name: this.dataTitleList[1],
          marker: {
            symbol: 'square',
            style: {
              fill: this.colors[1],
              r: 5
            }
          }
        }]
      })
      this.chart.tooltip({
        shared: true,
        showCrosshairs: true,
        customItems: items => {
          return items.map(item => ({
            ...item,
            value: item.name === 'value2' ? `${Math.floor(+item.value * 100)}%` : item.value,
            name: this.dataTitleList[item.name === 'value1' ? 0 : 1]
          }))
        }
      })
      this.chart.area().position('label*value1').color(this.colors[0]).shape('smooth')
      this.chart.area().position('label*value2').color(this.colors[1]).shape('smooth')
      this.chart.line().position('label*value1').color(this.colors[0]).shape('smooth')
      this.chart.line().position('label*value2').color(this.colors[1]).shape('smooth')
      this.chart.point().position('label*value1').color(this.colors[0])
      this.chart.point().position('label*value2').color(this.colors[1])
      this.chart.removeInteraction('legend-filter')
      this.chart.render()
    }
  }
}
</script>
