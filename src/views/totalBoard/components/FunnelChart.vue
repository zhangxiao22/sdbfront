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
        appendPadding: [0, 80],
        autoFit: true,
        xField: 'label',
        yField: 'value',
        dynamicHeight: true,
        legend: false
      })
      this.chart.render()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
