<template>
  <div class="container">
    <div class="main-container shun-card">
      <div class="header">
        <el-page-header content="事件详情"
                        @back="goBack" />
        <el-divider class="header-divider" />
      </div>
      <div class="button-group">
        <el-button v-if="roleJudge.showApproveButton && roleJudge.canApprove"
                   type="success"
                   @click="resolveForm.resolveText='';showResolve=true;">{{ subStatus&&subStatus === 9 ? '审核通过': '审批通过' }}</el-button>
        <el-button v-if="roleJudge.showApproveButton && roleJudge.canApprove"
                   type="danger"
                   style="margin-left:20px;"
                   @click="resolveForm.rejectText='';showReject=true;">{{ subStatus&&subStatus === 9 ? '审核驳回': '审批驳回' }}</el-button>
        <el-button v-if="roleJudge.showCopyButton"
                   type="primary"
                   :loading="buttonLoadingCopy"
                   @click="handleCopy">复制事件</el-button>
      </div>
      <div v-if="roleJudge.showApproveList"
           class="timeline-container">
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
                <!-- <div class="border-line" /> -->

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
      <Preview :preview-data="previewData"
               not-auto-render />
    </div>
    <el-dialog title="通过"
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
</template>

<script>
import Preview from '@/views/createEvent/components/Preview'
import { getEventPreview, isPass, getEventApprovalLink, copyEvent } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    Preview
  },
  data() {
    return {
      // 权限判断
      roleJudge: {
        showApproveButton: '',
        showCopyButton: '',
        showApproveList: '',
        canApprove: ''
      },
      showButton: true,
      showHistory: false,
      copy_showHistory: false,
      list: [],
      mainStatus: '',
      subStatus: '',
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
      'roles'
    ]),
    id() {
      return +this.$route.query.id
    },
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
    this.getDetail().then(() => {
      console.log(this.roles)
      this.roleJudge.canApprove = this.roles === '领导审批' || this.roles === '用例管理' || this.roles === 'admin'
      this.roleJudge.showApproveButton = this.mainStatus === 3
      this.roleJudge.showCopyButton = this.roles === '事件注册' || this.roles === 'admin' && this.mainStatus === 4 || this.mainStatus === 5
      this.roleJudge.showApproveList = this.subStatus !== 1
      if (this.roleJudge.showApproveList) {
        this.getLinkList()
      }
    })
  },
  mounted() {
  },
  methods: {
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
      return new Promise((resolve) => {
        getEventPreview({ baseId: this.id }).then(res => {
          this.previewData = res.data
          this.mainStatus = res.data.eventBaseInfo.largeStatus.value
          this.subStatus = res.data.eventBaseInfo.status.value
          this.eventName = res.data.eventBaseInfo.name
          resolve()
        })
      })
    },
    getLinkList() {
      getEventApprovalLink({ baseId: this.id }).then(res => {
        this.list = res.data.map(n => {
          return {
            title: n.status.label,
            user: n.approverNameList,
            desc: n.comment,
            timestamp: n.modifyTime
          }
        }).reverse()
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
          this.$router.push('/eventBoard')
        }
      }).finally(() => {
        this.buttonLoadingResolve = false
        // this.showResolve = false
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
              this.$router.push('/eventBoard')
            }
          }).finally(() => {
            this.buttonLoadingReject = false
            // this.showReject = false
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
  .timeline-container {
    position: relative;
    padding-left: 20px;
    margin: 0 20px 10px;

    .item {
      width: 300px;
      margin-bottom: 15px;
      // border: 1px solid;
      position: relative;
      .border-line {
        position: absolute;
        content: "";
        left: -20px;
        width: 1px;
        top: 10px;
        bottom: -25px;
        background: #93a1c9;
        opacity: 0.5;
        transform: translateX(4px);
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
          left: -20px;
          width: 10px;
          height: 10px;
          top: 50%;
          background: #93a1c9;
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
}
</style>
