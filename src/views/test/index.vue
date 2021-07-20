<template>
  <div class="container">
    <div @tap="tap">222</div>
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
    tap() {
      console.log(222)
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
