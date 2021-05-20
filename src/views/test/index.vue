<template>
  <div class="container">
    <div>222</div>
    <div class="box">
      <span>12341324</span>
      <span>21341234123412341324</span>
      <span>31243124123</span>
      <span>213413413241324</span>
    </div>
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
