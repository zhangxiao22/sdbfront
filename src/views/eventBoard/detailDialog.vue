<template>
  <el-dialog v-loading="loading"
             fullscreen
             class="edit-container"
             :visible="visible"
             :append-to-body="true"
             @close="closeDialog"
             @open="openDialog">
    <div class="container">
      <div class="main-container">
        <div class="header">
          <div class="header-left"
               @click="closeDialog">
            <i class="el-icon-back" />
            <span class="title">返回</span>
          </div>
          <div class="header-right">
            <div class="content-title">事件详情</div>
            <div class="button-group">
              <el-popover v-if="roleJudge.showApproveList"
                          width="400"
                          trigger="hover">
                <div class="timeline-container">
                  <div v-for="(item,i) of visibleList"
                       :key="i"
                       :class="{last:!copy_showHistory&&i === visibleList.length-1}"
                       class="item">
                    <div class="border-line" />
                    <div class="content-box">
                      <div class="circle" />
                      <b class="title">{{ item.title }}</b>
                      <span class="user">{{ `（${item.user.join(',')}）` }}</span>
                      <span class="time">{{ item.timestamp }}</span>
                    </div>
                    <div class="desc">{{ item.desc }}</div>
                  </div>
                  <div>
                    <el-collapse-transition>
                      <div v-show="showHistory"
                           class="hide-list-group"
                           :class="{show:showHistory}">
                        <div v-for="(item,i) of hiddenList"
                             :key="i"
                             :class="{last:copy_showHistory&&i === hiddenList.length-1}"
                             class="item">
                          <transition name="el-fade-in-linear">
                            <div v-show="copy_showHistory"
                                 class="border-line" />
                          </transition>
                          <div class="content-box">
                            <transition name="el-fade-in-linear">
                              <div v-show="copy_showHistory"
                                   class="circle" />
                            </transition>
                            <b class="title">{{ item.title }}</b>
                            <span class="user">({{ item.user.join(',') }})</span>
                            <span class="time">{{ item.timestamp }}</span>
                          </div>
                          <div class="desc">{{ item.desc }}</div>
                        </div>
                      </div>
                    </el-collapse-transition>
                  </div>
                  <el-button v-show="hiddenList.length"
                             class="more"
                             type="text"
                             @click="showHistory=!showHistory">{{ showHistory?'收起':'查看更多' }}
                    <i :class="showHistory?'el-icon-arrow-up':'el-icon-arrow-down'"
                       style="margin-left:5px;" />
                  </el-button>
                </div>
                <el-button slot="reference"
                           type="text">审批动态<i class="el-icon-arrow-down el-icon--right" /></el-button>
              </el-popover>
              <el-button v-if="roleJudge.showApproveList&&roleJudge.canApprove"
                         type="success"
                         @click="resolveForm.resolveText='';showResolve=true;">{{ subStatus&&subStatus === 9 ? '审核通过': '审批通过' }}</el-button>
              <el-button v-if="roleJudge.showApproveList&&roleJudge.canApprove"
                         type="danger"
                         @click="resolveForm.rejectText='';showReject=true;">{{ subStatus&&subStatus === 9 ? '审核驳回': '审批驳回' }}</el-button>
              <el-button v-if="roleJudge.showCopyButton"
                         type="primary"
                         :loading="buttonLoadingCopy"
                         @click="handleCopy">复制事件</el-button>
            </div>
          </div>
        </div>
        <Preview :preview-data="previewData"
                 not-auto-render />
      </div>
      <el-dialog title="通过"
                 append-to-body
                 :visible.sync="showResolve">
        <el-form ref="regFormRef"
                 label-width="110px"
                 :model="resolveForm">
          <el-form-item label="意见："
                        prop="resolveText">
            <el-input v-model.trim="resolveForm.resolveText"
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
      <el-dialog title="驳回"
                 append-to-body
                 :visible.sync="showReject">
        <el-form ref="formRef"
                 label-width="110px"
                 :model="resolveForm">
          <el-form-item label="意见："
                        :rules="[{
                          required: true, message: '请输入驳回内容', trigger: 'blur'
                        }]"
                        prop="rejectText">
            <el-input v-model.trim="resolveForm.rejectText"
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
  </el-dialog>
</template>

<script>
import Preview from '@/views/createEvent/components/Preview'
import { getEventPreview, isPass, getEventApprovalLink, copyEvent } from '@/api/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    Preview
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    id: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      // 权限判断
      roleJudge: {
        showApproveButton: false,
        showCopyButton: false,
        showApproveList: false,
        canApprove: false
      },
      showButton: true,
      showHistory: false,
      copy_showHistory: false,
      list: [],
      mainStatus: '',
      subStatus: '',
      approverListId: '',
      previewData: {},
      eventName: '',
      showResolve: false,
      showReject: false,
      resolveForm: {
        resolveText: '',
        rejectText: ''
      },
      buttonLoadingCopy: false,
      buttonLoadingResolve: false,
      buttonLoadingReject: false
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'user'
    ]),
    visibleList() {
      return this.list.slice(0, 3)
    },
    hiddenList() {
      return this.list.slice(3)
    }
  },
  watch: {
    showHistory() {
      if (this.showHistory) {
        setTimeout(() => {
          this.copy_showHistory = this.showHistory
        }, 300)
      } else {
        this.copy_showHistory = this.showHistory
      }
    }
  },
  created() {
  },
  methods: {
    init() {
      if (this.id) {
        this.getDetail().then(() => {
          this.roleJudge.showCopyButton = (this.mainStatus === 4 || this.mainStatus === 5) && (this.roles === '事件注册' || this.roles === '用例管理')
          // 是否展示审批动态根据是否事件有审批动态ID
          this.roleJudge.showApproveList = this.approverListId
          if (this.roleJudge.showApproveList) {
            this.getLinkList().then(() => {
              this.roleJudge.canApprove = this.list[0].user.includes(this.user.userName) && this.mainStatus === 3
            })
          }
        })
      }
    },
    openDialog() {
      this.init()
    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.$emit('afterClose')
    },
    handleCopy() {
      this.$confirm(`确定复制事件（${this.eventName}）？`)
        .then(() => {
          this.buttonLoadingCopy = true
          copyEvent({ baseId: this.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: '3000'
              })
            }
          })
        })
        .catch(() => { })
        .finally(() => {
          this.buttonLoadingCopy = false
        })
    },
    getDetail() {
      this.loading = true
      return new Promise((resolve) => {
        getEventPreview({ baseId: this.id }).then(res => {
          // this.loading = false
          this.previewData = res.data
          this.mainStatus = res.data.eventBaseInfo.largeStatus.value
          this.subStatus = res.data.eventBaseInfo.status.value
          // 审批动态的Id
          this.approverListId = res.data.eventBaseInfo.firstNodeId
          this.eventName = res.data.eventBaseInfo.name
          this.$nextTick(() => {
            this.loading = false
          })
          resolve()
        })
      })
    },
    getLinkList() {
      return new Promise((resolve) => {
        getEventApprovalLink({ baseId: this.id }).then(res => {
          this.list = res.data.map(n => {
            return {
              title: n.status.label,
              user: n.approverNameList,
              desc: n.comment,
              timestamp: n.modifyTime
            }
          }).reverse()
          resolve()
        })
      })
    },
    goBack() {
      this.$router.replace('/eventBoard')
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
          // this.$router.push('/eventBoard')
        }
      }).finally(() => {
        this.buttonLoadingResolve = false
        this.showResolve = false
        this.init()
        // this.getDetail()
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
              // this.$router.push('/eventBoard')
            }
          }).finally(() => {
            this.buttonLoadingReject = false
            this.showReject = false
            this.init()
            // this.getDetail()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.edit-container {
  ::v-deep .el-dialog__header {
    display: none;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
.container {
  .main-container {
    min-height: 100%;
    // border-top: 1px solid #ebeef5;
  }
  .header {
    padding: 15px;
    display: flex;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      left: 15px;
      right: 15px;
      bottom: 0;
      background-color: #ebeef5;
    }
    .header-left {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-right: 40px;
      position: relative;
      color: #888;

      &:hover {
        color: $blue;
      }
      &:after {
        content: "";
        position: absolute;
        width: 1px;
        height: 20px;
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
        background-color: #dcdfe6;
      }
      .el-icon-back {
        font-size: 18px;
        margin-right: 6px;
      }
      .title {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .header-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .content-title {
        font-size: 16px;
      }
      .button-group {
        .el-button {
          margin-left: 20px;
        }
      }
    }
  }

  .preview-container {
    margin-top: 20px;
    padding: 0;
  }
}
.timeline-container {
  position: relative;
  padding-left: 30px;
  padding-top: 10px;
  padding-right: 20px;
  max-height: 600px;
  overflow: auto;
  // width: 320px;
  margin: 0 auto;
  // margin: 0 20px 10px;

  .item {
    // width: 300px;
    margin-bottom: 15px;
    // border: 1px solid;
    position: relative;
    .border-line {
      position: absolute;
      content: "";
      left: -20px;
      // width: 1px;
      top: 10px;
      bottom: -25px;
      // background: #cdd7f5;
      opacity: 0.5;
      transform: translateX(4px);
      border-left: 1px dashed#cdd7f5;
    }
    &.last {
      // margin-bottom: 0;
      .border-line {
        display: none;
      }
    }
    .content-box {
      display: flex;
      height: 16px;
      position: relative;
      .circle {
        position: absolute;
        content: "";
        left: -18px;
        width: 5px;
        height: 5px;
        top: 50%;
        background: #cdd7f5;
        border-radius: 50%;
        transform: translateY(-50%);
      }
      .title {
        font-size: 14px;
      }
      .user {
        color: #888;
      }
      .time {
        margin-left: auto;
        color: #888;
      }
    }
    .desc {
      font-size: 11px;
      margin-top: 5px;
      color: #888;
    }
  }
  .more {
    padding-top: 0;
    // position: absolute;
  }
}
</style>
