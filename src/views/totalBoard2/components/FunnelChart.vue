<template>
  <div :id="id"
       class="chart" />
</template>

<script>
// import DataSet from '@antv/data-set'
// import { Chart } from '@antv/g2'
import { Funnel } from '@antv/g2plot'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
    // xField: {
    //   type: String,
    //   default: ''
    // },
    // yField: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
    }
  },
  computed: {
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
      this.chart = new Funnel(this.id, {
        data: this.data,
        appendPadding: [0, 80, 0, 0],
        autoFit: true,
        xField: 'label',
        yField: 'value',
        dynamicHeight: true,
        legend: false,
        theme: {
          // colors10: ['#6600CC', '#6633FF', '#6666FF', '#6699FF']
          colors10: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']
        }
      })
      this.chart.render()
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
