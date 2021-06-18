<template>
  <div class="edit-container">
    <el-dialog title="编辑事件"
               :visible="visible"
               @close="handleClose">
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
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      // this.$refs['formRef'].resetFields()
    },
    update(row) {
      console.log('row', row)
    }
  }
}

</script>

<style scoped>
</style>
