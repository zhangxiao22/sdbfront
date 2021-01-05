<template>
  <div class="test">
    <div v-for="(item,i) of arr"
         :key="i">
      <el-input v-model="item.val"
                placeholder="请输入内容" />
    </div>
    <el-button @click="add">add</el-button>
  </div>
</template>
<script>
import { Funnel } from '@antv/g2plot'

export default {
  components: {
  },
  data() {
    return {
      arr: []
    }
  },
  computed: {

  },

  watch: {

  },
  created() {
  },
  mounted() {
  },
  methods: {
    add() {
      this.arr.push({
        val: ''
      })
    }
  }

}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.test {
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
</style>
