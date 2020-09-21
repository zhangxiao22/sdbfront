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
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json')
        .then(res => res.json())
        .then(data => {
          const chart = new Chart({
            container: this.id,
            autoFit: true
          })
          // 数据格式： [{"gender":"female","height":161.2,"weight":51.6}]
          chart.data(data)
          chart.scale({
            height: { nice: true },
            weight: { nice: true }
          })
          chart.tooltip({
            showTitle: false,
            showCrosshairs: true,
            crosshairs: {
              type: 'xy'
            },
            itemTpl: '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">' +
              '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
              '{name}<br/>' +
              '{value}' +
              '</li>'
          })
          chart
            .point()
            .position('height*weight')
            .color('gender')
            .shape('circle')
            .tooltip('gender*height*weight', (gender, height, weight) => {
              return {
                name: gender,
                value: height + '(cm), ' + weight + '(kg)'
              }
            })
            .style({
              fillOpacity: 0.85
            })
          chart.interaction('legend-highlight')
          chart.render()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.chart {
  height: 100%;
  width: 100%;
}
</style>
