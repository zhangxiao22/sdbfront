<template>
  <div :id="id" />
</template>

<script>
import { Chart } from '@antv/g2'
import { wholeNumberFormatter } from '@/utils'

export default {
  name: 'StackDodgeBarChart',
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
        appendPadding: [10, 50, 50, 0]
      })
      this.chart.axis('value', {
        label: {
          formatter: n => wholeNumberFormatter(null, null, +n)
        }
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
            value: wholeNumberFormatter(null, null, +item.value)
          }))
        }
      })
      this.chart.legend({
        position: 'right'
      })
      this.chart
        .interval()
        .position('label*value')
        .label('value', v => {
          return {
            content: wholeNumberFormatter(null, null, v),
            // rotate: -0.5,
            layout: {
              type: 'fixed-overlap'
            },
            position: 'middle',
            style: {
              fill: 'white'
            }
          }
        })
        .color('category')
        .adjust([{
          type: 'dodge',
          dodgeBy: 'type',
          marginRatio: 0
        }, {
          type: 'stack'
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
    }
  }
}
</script>
