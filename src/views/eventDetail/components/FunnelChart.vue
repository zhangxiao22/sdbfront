<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {

    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      console.log(document.getElementById(this.id))
      const { DataView } = DataSet
      const dv = new DataView().source([
        { action: '线索下发', pv: 50000 },
        { action: '线索执行', pv: 35000 },
        { action: '触达客户', pv: 25000 },
        { action: '转化客户', pv: 15000 }
      ])
      dv.transform({
        type: 'map',
        callback(row) {
          row.percent = row.pv / 50000
          return row
        }
      })
      const data = dv.rows
      const chart = new Chart({
        container: this.id,
        autoFit: true,
        height: this.height,
        padding: [0, 120, 0]
      })
      chart.data(data)
      chart.axis(false)
      chart.tooltip({
        showTitle: false,
        showMarkers: false,
        itemTpl:
          '<li style="margin-bottom:4px;list-style-type:none;padding: 0;">' +
          '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
          '{name}<br/>' +
          '<span style="padding-left: 16px;line-height: 16px;">初试人数：{pv}</span><br/>' +
          '<span style="padding-left: 16px;line-height: 16px;">占比：{percent}</span><br/>' +
          '</li>'
      })
      chart
        .coordinate('rect')
        .transpose()
        .scale(1, -1)
      chart
        .interval()
        .adjust('symmetric')
        .position('action*percent')
        .shape('funnel')
        .color('action', ['#6e95f2', '#87d7ae', '#61708f', '#ecbe45'])
        .label(
          'action*percent',
          (action, percent) => {
            return {
              content: `转化率：${percent * 100}%`
            }
          },
          {
            offset: 35,
            labelLine: {
              style: {
                lineWidth: 1,
                stroke: 'rgba(0, 0, 0, 0.15)'
              }
            }
          }
        )
        .tooltip('action*pv*percent', (action, pv, percent) => {
          return {
            name: action,
            percent: +percent * 100 + '%',
            pv
          }
        })
        .animate({
          appear: {
            animation: 'fade-in'
          },
          update: {
            annotation: 'fade-in'
          }
        })

      chart.interaction('element-active')

      chart.on('beforepaint', () => {
        chart.annotation().clear(true)
        const chartData = chart.getData()
        // 中间标签文本
        chartData.forEach((obj) => {
          chart.annotation().text({
            top: true,
            position: {
              action: obj.action,
              percent: 'median'
            },
            content: `${obj.action}：${obj.pv}`, // 显示的文本内容
            style: {
              stroke: null,
              fill: '#fff',
              textAlign: 'center'
            }
          })
        })
      })
      chart.legend(false)
      chart.render()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
