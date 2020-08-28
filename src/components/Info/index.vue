<template>
  <div class="info-container">
    <el-tooltip class="item"
                :content="content"
                placement="top">
      <i class="el-icon-info" />
    </el-tooltip>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.info-container {
  display: inline-block;
  ::v-deep i {
    color: $blue;
  }
}
</style>
