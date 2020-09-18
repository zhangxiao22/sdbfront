<template>
  <div class="shun-filter-container-box shun-card" />
</template>

<script>
export default {
  name: 'ShunFilter',
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    tableColumnList: {
      type: Array,
      default() {
        return []
      }
    }

  },
  data() {
    return {

    }
  },
  watch: {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.shun-filter-container {
}
</style>
