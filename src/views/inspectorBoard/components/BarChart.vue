<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'
import { percentFormatter } from '@/utils'

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
    },
    filter: {
      type: String,
      required: true
    }
  },
  watch: {
    data() {
      this.chart.changeData(this.data)
    },
    filter() {
      this.reset()
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
        appendPadding: [10, 50, 50, 0]
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
            value: percentFormatter(null, null, item.value)
          }))
        }
      })
      this.chart.legend({
        position: 'right'
      })
      this.chart.axis('value', {
        label: {
          formatter: n => percentFormatter(null, null, n)
        }
      })
      this.chart
        .interval()
        .position('label*value')
        .color('category')
        .label('value', v => ({
          content: percentFormatter(null, null, v),
          layout: {
            type: 'overlap'
          },
          position: 'top',
          rotate: -0.8,
          offsetX: 15,
          style: {
            fill: 'grey'
          }
        }))
        .adjust([{
          type: 'dodge',
          marginRatio: 0
        }])
      this.chart.interaction('active-region')
      this.chart.interaction('legend-filter', {
        showEnable: [
          { trigger: 'legend-item:mouseenter', action: 'cursor:pointer' },
          { trigger: 'legend-item:mouseleave', action: 'cursor:default' }
        ],
        start: [
          { trigger: 'legend-item:click', action: 'list-checked:toggle' },
          { trigger: 'legend-item:click', action: 'data-filter:filter' }
        ]
      })
      this.chart.render()
    },
    reset() {
      this.chart?.destroy()
      this.render()
    }
  }
}
</script>
