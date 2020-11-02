<template>
  <div class="container">
    <el-tabs tab-position="left"
             value="0"
             type="border-card"
             style="height: 100%;">
      <el-tab-pane label="防打扰">
        <NotDisturb />
      </el-tab-pane>
      <el-tab-pane label="分配比例">分配比例</el-tab-pane>
      <el-tab-pane label="优先级">优先级</el-tab-pane>
      <el-tab-pane label="分配角色">
        <Assign />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Assign from './assign'
import NotDisturb from './notDisturb'
export default {
  components: {
    Assign,
    NotDisturb
  },

  data() {
    return {

    }
  },
  watch: {},
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
}
</style>
