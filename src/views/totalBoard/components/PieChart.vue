<template>
  <div :id="id"
       class="chart" />
</template>

<script>
import { Pie } from '@antv/g2plot'
import { formatMoney } from '@/utils'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    id: {
      type: String,
      default: ''
    },
    unit: {
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
    data() {
      console.log(this.data)

      this.chart.changeData(this.data)
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      this.chart = new Pie(this.id, {
        appendPadding: 0,
        data: this.data,
        autoFit: true,
        angleField: 'value',
        colorField: 'label',
        radius: 0.9,
        label: {
          type: 'inner',
          offset: -50,
          // content: ({ percent }) => `${(percent * 100).toFixed(2)}%`
          // content: ({ percentage }) => `${(percentage * 100)}%`
          content: '{percentage}'
        },
        tooltip: {
          formatter: (datum) => {
            return {
              name: datum.label,
              value: formatMoney(datum.value)
            }
          }
        },
        interactions: [{ type: 'element-active' }]
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
