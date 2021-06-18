<template>
  <div class="edit-container">
    <el-dialog title="编辑事件"
               :visible="visible">
      123
    </el-dialog>
  </div>

</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    }
  }
}

</script>

<style scoped>
</style>
