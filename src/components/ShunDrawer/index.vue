<template>
  <div class="shun-drawer-container">
    <el-drawer class="el-drawer_box"
               :visible="show"
               v-bind="$attrs"
               :size="size"
               append-to-body
               v-on="$listeners"
               @open="handleOpen"
               @close="handleClose">
      <div class="drawer-container">
        <slot ref="tableSlot"
              name="container" />
      </div>
      <div class="drawer-bottom">
        <el-button type="primary"
                   :loading="loading"
                   style="max-width:400px;width:100%;"
                   @click="submit">
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
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    size: {
      type: String,
      default: '80%'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
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
.el-drawer_box {
  ::v-deep .el-drawer {
    background: #f8f8fa;
    .el-drawer__body {
      display: flex;
      flex-direction: column;
    }
  }
  .drawer-container {
    padding: 0 20px 20px;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
  .drawer-bottom {
    margin-top: auto;
    background: #fff;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #eee;
  }
}
</style>
