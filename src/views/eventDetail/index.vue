<template>
  <div class="container">
    <div class="main-container shun-card">
      <div class="header">
        <el-page-header content="事件详情"
                        @back="goBack" />
        <el-divider class="header-divider" />
      </div>
      <div v-if="mainStatus===3"
           class="button-group">
        <el-button type="success"
                   @click="resolveForm.resolveText='',showResolve=true;">审批通过</el-button>
        <el-button type="danger"
                   style="margin-left:20px;"
                   @click="resolveForm.rejectText='',showReject=true;">审批驳回</el-button>
      </div>
      <div v-if="mainStatus===3"
           class="timeline-container">
        <div v-for="(item,i) of visibleList"
             :key="i"
             :class="{last:!copy_showHistory&&i === visibleList.length-1}"
             class="item">
          <div class="content-box">
            <b class="title">{{ item.title }}</b>
            <span class="user">{{ `（${item.user.join(',')}）` }}</span>
            <span class="time">{{ item.timestamp }}</span>
          </div>
          <div class="desc">{{ item.desc }}</div>
        </div>
        <div>
          <el-collapse-transition>
            <div v-show="showHistory">
              <div v-for="(item,i) of hiddenList"
                   :key="i"
                   :class="{last:copy_showHistory&&i === hiddenList.length-1}"
                   class="item">
                <div class="content-box">
                  <b class="title">{{ item.title }}</b>
                  <span class="user">{{ `（${item.user.join(',')}）` }}</span>
                  <span class="time">{{ item.timestamp }}</span>
                </div>
                <div class="desc">{{ item.desc }}</div>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <el-button class="more"
                   type="text"
                   @click="showHistory=!showHistory">{{ showHistory?'收起':'查看更多' }}
          <i :class="showHistory?'el-icon-arrow-up':'el-icon-arrow-down'"
             style="margin-left:5px;" />
        </el-button>
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
      showHistory: true,
      copy_showHistory: true,
      list: [],
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
      setTimeout(() => {
        this.copy_showHistory = this.showHistory
      }, this.showHistory ? 300 : 0)
    }
  },
  created() {
    this.getDetail()
    this.getLinkList()
  },
  methods: {
    getDetail() {
      getEventPreview({ baseId: this.id }).then(res => {
        this.previewData = res.data
        this.mainStatus = res.data.eventBaseInfo.largeStatus.value
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
        })
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
  .timeline-container {
    position: relative;
    padding-left: 20px;
    .item {
      width: 500px;
      margin-bottom: 15px;
      // border: 1px solid;
      position: relative;
      &::after {
        position: absolute;
        content: "";
        left: -20px;
        width: 1px;
        top: 10px;
        bottom: -25px;
        background: $blue;
        transform: translateX(4px);
      }
      &.last {
        margin-bottom: 0;
        &::after {
          content: none;
        }
      }
      .content-box {
        display: flex;
        height: 16px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          left: -20px;
          width: 10px;
          height: 10px;
          top: 50%;
          background: $blue;
          border-radius: 50%;
          transform: translateY(-50%);
        }
        .title {
          font-size: 14px;
        }
        .user {
        }
        .time {
          margin-left: auto;
        }
      }
      .desc {
        font-size: 11px;
        margin-top: 5px;
        color: #888;
      }
    }
    .more {
      // position: absolute;
    }
  }
}
</style>
