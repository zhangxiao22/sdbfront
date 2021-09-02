<template>
  <el-dialog class="edit-container"
             fullscreen
             :visible="visible"
             append-to-body
             @close="handleClose"
             @open="openDialog">
    <Ploy ref="ployRef"
          :key="ployKey"
          :passed-id="updateRow.id"
          is-update />
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 :loading="syncLoading"
                 @click="handleSyncProduct">应用并同步</el-button>
      <el-button type="primary"
                 :loading="buttonLoading"
                 @click="ensureSave">应 用</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Ploy } from '@/views/createEvent/components'
import { updateStrategy, syncProduct } from '@/api/api'

export default {
  components: {
    Ploy
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    updateRow: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ployKey: new Date().getTime(),
      buttonLoading: false,
      syncLoading: false
    }
  },
  methods: {
    openDialog() {
      this.ployKey = new Date().getTime()
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('afterClose')
    },
    handleSyncProduct() {
      this.$refs.ployRef.beforeValidateAndNext((data, resolve, reject) => {
        const param = {
          // baseId: this.id,
          strategySaveCriteriaList: data
        }
        this.$confirm('提示', {
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `同步时间较长，请勿重复点击，<br />是否确认事件【${this.updateRow.name}】同步？`,
          type: 'warning'
        }).then(() => {
          this.syncLoading = true
          updateStrategy(param).then(res => {
            if (res.code === 200) {
              syncProduct({ eventId: this.updateRow.id }).then(res => {
                if (res.code === 200) {
                  this.$message({
                    message: '应用并同步成功',
                    type: 'success',
                    duration: '3000'
                  })
                  this.$emit('update:visible', false)
                }
              }).finally(() => {
                this.syncLoading = false
              })
            }
          })
        })
      })
    },
    // 应用
    ensureSave() {
      this.$refs.ployRef.beforeValidateAndNext((data, resolve, reject) => {
        const param = {
          // baseId: this.id,
          strategySaveCriteriaList: data
        }
        this.buttonLoading = true
        updateStrategy(param).then(res => {
          this.$emit('update:visible', false)
          resolve(param)
        }).finally(() => {
          this.buttonLoading = false
          // reject()
        })
      })
    }
  }
}
</script>

<style>
</style>
