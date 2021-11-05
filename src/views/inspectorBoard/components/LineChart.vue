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
  created() {
    this.line = null
    this.controlGroupLine = null
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
      this.chart.scale({
        value: {
          nice: true,
          sync: true
        },
        controlGroupValue: {
          sync: 'value',
          nice: true
        }
      })
      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
        customItems: items => {
          return items.map(item => ({
            ...item,
            value: percentFormatter(null, null, item.value),
            name: item.name === 'controlGroupValue' ? '对照组' : item.name
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
      // 隐藏对照组y轴
      this.chart.axis('controlGroupValue', false)
      // 线
      this.chart.line().position('label*value').color('category').shape('smooth')
      // 用来控制labels显示隐藏的线
      this.line = this.chart.line().position('label*value').color('category').shape('smooth').label(false)
      // 点
      this.chart.point().position('label*value').color('category').shape('circle')

      // 修改legend-filter默认行为：点击一个消失一个 -> 点击哪个就只显示哪个
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

      this.chart.on('legend-item:click', (e) => {
        const legendItemsList = e.gEvent.delegateObject.legend.cfg.items
        const checkedNumber = legendItemsList.filter(n => !n.unchecked).length
        // 清楚所有 标注
        this.chart.annotation().clear(true)
        if (checkedNumber === 1) {
          const filteredData = this.chart.getData()
          const yMax = Math.max(...filteredData.map(n => n.value))
          // 画最大值辅助线 标注
          if (yMax !== 0) {
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
                // content: percentFormatter(null, null, yMax),
                content: '最大值',
                offsetY: -5
              }
            })
          }
          // 显示label 线
          this.line.label('value', value => ({
            content: percentFormatter(null, null, value),
            layout: {
              type: 'overlap'
            },
            style: {
              fill: 'grey'
            }
          }))
          // 画对照组 文字标注
          if (this.filter === '实际购买率') {
            this.chart.annotation().text({
              content: '对照组',
              position: filteredData.slice(-1)[0],
              offsetX: 20,
              offsetY: -10
            })
          }
          // 对照组 线
          if (this.controlGroupLine) {
            this.controlGroupLine.paint()
          } else {
            this.controlGroupLine = this.chart.line().position('label*controlGroupValue').color('#ff4d4f50').shape('smooth')
          }
          this.chart.render(true)
        } else {
          // 隐藏label 线
          this.line.clear()
          // 隐藏对照组 线
          this.controlGroupLine.clear()
        }
      })
    },
    reset() {
      this.line = null
      this.controlGroupLine = null
      this.chart?.destroy()
      this.render()
    }
  }
}
</script>
