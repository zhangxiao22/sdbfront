<template>
  <div class="container">
    <el-cascader ref="ref1"
                 v-model="value1"
                 :props="{multiple: true}"
                 :options="options" />

    <el-cascader ref="ref2"
                 v-model="value2"
                 :props="{multiple: true}"
                 :options="childOptions" />

    <el-button @click="handleClick">CLICK ME</el-button>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList, getStragetyList, fuzzySearch } from '@/api/api'

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      value1: [],
      value2: [],
      options: [{
        label: '汉',
        value: 0,
        children: [{
          label: '刘备',
          value: '刘备'
        }, {
          label: '关羽',
          value: '关羽'
        }]
      }, {
        label: '魏',
        value: 1,
        children: [{
          label: '曹操',
          value: '曹操'
        }, {
          label: '司马懿',
          value: '司马懿'
        }]
      }],
      childOptions: [{
        label: '汉',
        value: 0,
        children: [{
          label: '刘备',
          value: '刘备'
        }, {
          label: '关羽',
          value: '关羽'
        }]
      }, {
        label: '魏',
        value: 1,
        children: [{
          label: '曹操',
          value: '曹操'
        }, {
          label: '司马懿',
          value: '司马懿'
        }]
      }]
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    handleClick() {
      const nodes = this.$refs.ref1.getCheckedNodes(true)
      if (nodes?.length > 0) {
        const pSet = new Set(nodes.map(n => n.parent))
        const options = Array.from(pSet, n => ({ ...n.data }))
        Array.from(pSet).forEach((p, i) => {
          options[i].children = nodes.filter(n => new Set(p.children).has(n)).map(n => ({ ...n.data }))
        })
        console.log(options)
        this.childOptions = options
      } else {
        this.childOptions = this.options
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .box {
    width: 400px;
    display: inline-flex;
    flex-wrap: wrap;
    span {
      height: 30px;
      border: 1px solid;
      margin: 0 20px;
    }
  }
}
</style>
