<template>
  <div class="container">
    <div class="main-container shun-card">
      <div class="header">
        <el-page-header content="事件详情"
                        @back="goBack" />
        <el-divider class="header-divider" />
        <div class="button-group">
<<<<<<< HEAD
          <el-button type="success">通过</el-button>
=======
          <el-popover v-model="approveEdit"
                      placement="top"
                      width="300">
            <el-input v-model.trim="approveText"
                      type="textarea"
                      :rows="5"
                      style="margin-bottom:10px;border-radius:10px;"
                      placeholder="请输入内容" />
            <div style="text-align: right; margin: 0">
              <el-button size="mini"
                         type="text"
                         @click="approveEdit = false">取消</el-button>
              <el-button type="primary"
                         size="mini"
                         @click="ensureApproveEdit(true)">确定</el-button>
            </div>
            <!-- <el-button v-if="roleJudge.canCheck && mainStatus=== 3"
                       slot="reference"
                       type="success"
                       @click="approveEdit = true">审核通过</el-button> -->
            <el-button v-if="roleJudge.canApprove && mainStatus=== 3"
                       slot="reference"
                       type="success"
                       @click="approveEdit = true">审批通过</el-button>
          </el-popover>
          <!-- <el-button v-if="true"
                     type="success"
                     @click="test">测试</el-button> -->
          <!-- <el-button v-if="roleJudge.canCheck && mainStatus=== 1"
                     type="success">审核通过</el-button> -->
          <!-- <el-button v-if="roleJudge.canApprove && mainStatus=== 2"
                     type="success">审批通过</el-button> -->
>>>>>>> 0b00403b4c872e4c481219f8d17a29941672931c
          <el-popover v-model="popoverEdit"
                      placement="top"
                      width="300">
            <el-input v-model.trim="rejectText"
                      type="textarea"
                      :rows="5"
                      style="margin-bottom:10px;"
                      placeholder="请输入内容" />
            <div style="text-align: right; margin: 0">
              <el-button size="mini"
                         type="text"
                         @click="popoverEdit = false">取消</el-button>
              <el-button type="primary"
                         size="mini"
                         @click="ensureApproveEdit(false)">确定</el-button>
            </div>
            <!-- <el-button v-if="roleJudge.canCheck && mainStatus=== 3"
                       slot="reference"
                       type="danger"
<<<<<<< HEAD
                       style="margin-left:20px;">驳回</el-button>

=======
                       style="margin-left:20px;"
                       @click="popoverEdit = true">审核驳回</el-button> -->
            <el-button v-if="roleJudge.canApprove && mainStatus=== 3"
                       slot="reference"
                       type="danger"
                       style="margin-left:20px;"
                       @click="popoverEdit = true">审批驳回</el-button>
>>>>>>> 0b00403b4c872e4c481219f8d17a29941672931c
          </el-popover>
        </div>
      </div>
      <el-steps :active="lickList?lickList.length:0"
                align-center>
        <template v-for="(item,i) of lickList">
          <el-step :key="i"
                   :title="item.status?item.status.label:''"
                   :description="item.comment" />
        </template>
      </el-steps>
      <Preview @getMainStatus="getMainStatus" />
    </div>
    <!-- <el-dialog title="审批通过"
               :before-close="closeDialog"
               :visible.sync="dialog">
      <el-input v-model.trim="approveText"
                type="textarea"
                :rows="5"
                style="margin-bottom:20px;"
                placeholder="请输入内容" />
      <div style="text-align: right; margin: 0">
        <el-button size="mini"
                   type="text"
                   @click="approveEdit = false">取消</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="approveEdit = false">确定</el-button>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>

</template>

<script>
import Preview from '@/views/createEvent/components/Preview'
import { isPass, getEventApprovalLink } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    Preview
  },
  data() {
    return {
      // dialog: false,
      mainStatus: null,
      roleJudge: {},
      popoverEdit: false,
      approveEdit: false,
      rejectText: '',
      approveText: '',
      lickList: []
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    baseId() {
      return this.$route.query.id
    }
  },
  watch: {},
  created() {
    this.roleJudge.canApprove = this.roles === '领导审批' || this.roles === '用例管理' || this.roles === 'admin'
    this.roleJudge.canCheck = this.roles === '用例管理' || this.roles === 'admin'
    this.getApprovalLink()
  },
  methods: {
    goBack() {
      this.$router.push('/eventBoard')
    },
    getMainStatus(data) {
      this.mainStatus = data
    },
    getApprovalLink() {
      getEventApprovalLink({ baseId: this.baseId }).then(res => {
        this.lickList = res.data
      })
    },
    // test() {
    //   console.log(this.approveText)
    // },
    ensureApproveEdit(pass) {
      if (pass) {
        this.$confirm(`是否确认审批通过？`)
          .then(_ => {
            const data = {}
            data.baseId = this.baseId
            data.pass = true
            data.comment = this.approveText
            isPass(data).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: '3000'
                })
                this.$router.push('/eventBoard')
              }
            })
          }).finally(() => { this.approveEdit = false })
      } else {
        this.$confirm(`是否确认驳回？`)
          .then(_ => {
            const data = {}
            data.baseId = this.baseId
            data.pass = pass
            data.comment = this.rejectText
            isPass(data).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: '3000'
                })
                this.$router.push('/eventBoard')
              }
            })
          }).finally(() => { this.approveEdit = false })
      }
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
    padding: 16px;
    .header-divider {
      margin: 15px 0;
    }
    .button-group {
      margin-top: 16px;
    }
  }
  .preview-container {
    padding: 0;
  }
}
</style>
