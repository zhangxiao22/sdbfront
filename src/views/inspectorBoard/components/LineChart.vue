<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'
import { percentFormatter } from '@/utils'

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
  created() {
    this.legendItem = ''
    this.isAnnotationShown = false
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
        showCrosshairs: true,
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
      this.chart.on('legend-item:click', (e) => {
        this.chart.annotation().clear(true)
        const legendItem = e.gEvent.target.cfg.delegateObject.item.id
        const filteredData = this.chart.getData()
        if (filteredData.length <= 0) {
          return
        }
        const yMax = Math.max(...filteredData.map(n => n.value))
        const annotate = () => {
          this.chart.annotation().line({
            start: ['min', yMax],
            end: ['max', yMax],
            style: {
              stroke: '#ff4d4f',
              lineWidth: 1,
              lineDash: [3, 3]
            }, text: {
              position: 'end',
              style: {
                fill: 'grey',
                fontWeight: 'normal'
              },
              content: percentFormatter(null, null, yMax),
              offsetY: -5
            }
          })
        }
        if (this.legendItem !== legendItem) {
          this.legendItem = legendItem
          this.isAnnotationShown = true
          annotate()
        } else {
          if (this.isAnnotationShown) {
            this.isAnnotationShown = false
          } else {
            this.isAnnotationShown = true
            annotate()
          }
        }
        this.chart.changeData(this.data)
      })
      this.chart.render()
    }
  }
}
</script>
