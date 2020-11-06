<template>
  <div class="shun-drawer-container">
    <el-drawer :title="title"
               class="el-drawer_product"
               :visible="show"
               size="80%"
               direction="rtl"
               @open="handleOpen"
               @close="handleClose">
      <div class="drawer-container">
        <slot ref="tableSlot"
              name="container" />
      </div>
      <div class="drawer-bottom">
        <el-button type="primary"
                   style="width:200px"
                   @click="submit()">
          确 认
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'ShunDrawer',
  props: {
    title: {
      type: String,
      default() {
        return '请选择'
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
    // tableColumnList: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }

  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },

  methods: {
    submit() {
      this.$emit('submit')
    },
    handleOpen() {
      this.$emit('update:show', true)
    },
    handleClose() {
      this.$emit('update:show', false)
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.shun-drawer-container {
  .el-drawer_product {
    ::v-deep .el-drawer {
      background: #f8f8fa;
      .el-drawer__body {
        display: flex;
        flex-direction: column;
      }
    }
    .drawer-container {
      padding: 0 20px;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .drawer-bottom {
      margin-top: auto;
      padding: 20px;
      text-align: center;
    }
  }
}
</style>
