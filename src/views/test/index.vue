<template>
  <div>
    <el-input v-model="filterText"
              placeholder="输入关键字进行过滤" />
    <el-tree ref="tree"
             :data="data"
             show-checkbox
             :filter-node-method="filterNode"
             node-key="id" />
  </div>
</template>

<script>
const _ = require('lodash')
import { postPeopleList } from '@/api/api'
import { translate } from '@/utils'

export default {
  components: {
  },

  data() {
    return {
      filterText: '',
      data: []
    }
  },
  computed: {

  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getPostPeopleList()
  },
  mounted() {

  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getPostPeopleList() {
      return new Promise((resolve, reject) => {
        postPeopleList({ jobId: null }).then(res => {
          this.data = translate(res.data.orgGraphVOList)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
