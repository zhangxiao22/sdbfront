<template>
  <div class="container">
    <div class="main-container shun-card">
      <div class="header">
        <el-page-header content="事件详情"
                        @back="goBack" />
        <el-divider class="header-divider" />
      </div>
      <div v-if="mainStatus===2"
           class="button-group">
        <el-button type="success"
                   @click="resolveForm.resolveText='',showResolve=true;">审批通过</el-button>
        <el-button type="danger"
                   style="margin-left:20px;"
                   @click="resolveForm.rejectText='',showReject=true;">审批驳回</el-button>
      </div>
      <Preview :preview-data="previewData"
               not-auto-render />
    </div>
    <el-dialog title="审批通过"
               :visible.sync="showResolve">
      <el-form ref="regFormRef"
               label-width="110px"
               :model="resolveForm">
        <el-form-item label="审批意见："
                      prop="resolveText">
          <el-input v-model="resolveForm.resolveText"
                    style="width:90%;"
                    type="textarea"
                    :rows="10"
                    resize="none"
                    placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showResolve=false">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoadingResolve"
                   @click="ensureResolve">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批驳回"
               :visible.sync="showReject">
      <el-form ref="formRef"
               label-width="110px"
               :model="resolveForm">
        <el-form-item label="审批意见："
                      :rules="[{
                        required: true, message: '请输入驳回内容', trigger: 'blur'
                      }]"
                      prop="rejectText">
          <el-input v-model="resolveForm.rejectText"
                    style="width:90%;"
                    type="textarea"
                    :rows="10"
                    resize="none"
                    placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showReject=false">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoadingReject"
                   @click="ensureReject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Preview from '@/views/createEvent/components/Preview'
import { getEventPreview, isPass, getEventApprovalLink } from '@/api/api'
export default {
  components: {
    Preview
  },
  data() {
    return {
      mainStatus: '',
      previewData: {},
      showResolve: false,
      showReject: false,
      resolveForm: {
        resolveText: '',
        rejectText: ''
      },
      buttonLoadingResolve: false,
      buttonLoadingReject: false
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
  },
  watch: {},
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getEventPreview({ baseId: this.id }).then(res => {
        this.previewData = res.data
        this.mainStatus = 2
      })
    },
    goBack() {
      this.$router.push('/eventBoard')
    },
    ensureResolve() {
      const data = {
        baseId: this.id,
        pass: true,
        comment: this.resolveForm.resolveText
      }
      this.buttonLoadingResolve = true
      isPass(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: '3000'
          })
        }
      }).finally(() => {
        this.buttonLoadingResolve = false
        this.showResolve = false
        this.getDetail()
      })
    },
    ensureReject() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          const data = {
            baseId: this.id,
            pass: false,
            comment: this.resolveForm.rejectText
          }
          this.buttonLoadingReject = true
          isPass(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
            }
          }).finally(() => {
            this.buttonLoadingReject = false
            this.showReject = false
            this.getDetail()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  .main-container {
    min-height: 100%;
  }
  .header {
    padding: 16px 16px 0;
    .header-divider {
      margin: 15px 0;
    }
  }
  .button-group {
    padding: 0 16px;
    margin-bottom: 16px;
  }
  .preview-container {
    padding: 0;
  }
}
</style>
