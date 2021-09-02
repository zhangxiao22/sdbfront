<template>
  <div class="container">
    <div class="steps-container shun-card">
      <el-steps direction="vertical"
                :active="stepActive">
        <el-step title="事件注册">
          <div slot="icon">
            <svg-icon icon-class="_create" />
          </div>
          <div slot="description"
               class="register step-detail">
            <!-- 事件名称 -->
            <div v-show="baseInfoDetail.name"
                 class="name item">{{ baseInfoDetail.name }}</div>
            <!-- 用例 -->
            <div v-show="baseInfoDetail.useCaseName"
                 class="item"
                 size="mini">{{ baseInfoDetail.useCaseName }}
            </div>
            <!-- 事件类型 -->
            <!-- <el-tag v-show="baseInfoDetail.categoryValue"
                    class="item"
                    size="mini"
                    type="warning">{{ baseInfoDetail.categoryValue }}
            </el-tag> -->
            <!-- 起止日期 -->
            <div v-show="baseInfoDetail.startDate && baseInfoDetail.endDate"
                 class="item time-group"
                 style="display:flex;align-items:center;">
              <i class="el-icon-time"
                 style="margin-right:5px;" />
              <div class="time"
                   style="font-size:12px;">{{ baseInfoDetail.startDate }} 至 {{ baseInfoDetail.endDate }}</div>
            </div>
            <!-- 对照组 && 抽样方式 -->
            <div v-show="baseInfoDetail.trial"
                 class="shun-sibling-box item">
              <div class="value">{{ baseInfoDetail.control }}%</div>
              <div class="value">{{ baseInfoDetail.sampleValue }}</div>
            </div>
          </div>
        </el-step>
        <el-step title="客群配置">
          <div slot="icon">
            <svg-icon icon-class="_users" />
          </div>
          <div slot="description"
               class="group step-detail">
            <el-tag v-show="groupDetail.peopleNum"
                    class="item"
                    size="mini"
                    type="warning">
              总计 {{ groupDetail.peopleNum | formatMoney }} 人
            </el-tag>
            <el-tag v-show="groupDetail.comparePeopleNum"
                    class="item"
                    size="mini"
                    type="warning">
              对照组 {{ groupDetail.comparePeopleNum | formatMoney }} 人
            </el-tag>
            <div v-show="groupDetail.groupNum"
                 class="shun-sibling-box item">
              <div class="value">{{ groupDetail.groupNum }} 个客群</div>
              <div class="value">{{ groupDetail.realPeopleNum | formatMoney }} 人</div>
            </div>
          </div>
        </el-step>
        <el-step title="策略配置">
          <div slot="icon">
            <svg-icon icon-class="_bulb" />
          </div>
          <div slot="description"
               class="group step-detail">
            <el-tag v-show="ployDetail.ployCount"
                    class="item"
                    size="mini"
                    type="warning">
              {{ ployDetail.ployCount }} 个策略
            </el-tag>
          </div>
        </el-step>
        <el-step title="发布预览"
                 description="预览并发布">
          <div slot="icon">
            <svg-icon icon-class="_eye" />
          </div>
        </el-step>
      </el-steps>
    </div>
    <div v-loading="mainLoading"
         class="content-container shun-card">
      <div class="content">
        <component :is="component[stepActive].type"
                   :ref="component[stepActive].ref" />
      </div>
      <el-row class="bottom-container">
        <el-col :span="8"
                class="bottom-left">
          <el-button icon="el-icon-refresh-left"
                     @click="reset">重置</el-button>
          <!-- <el-button icon="el-icon-document"
                     @click="save">保存草稿</el-button> -->
        </el-col>
        <el-col :span="8"
                class="bottom-middle">
          <el-button :disabled="stepActive===0"
                     style="width:150px;"
                     icon="el-icon-arrow-left"
                     @click="prev">
            上一步
          </el-button>
          <el-button :disabled="stepActive===component.length-1"
                     type="primary"
                     @click="next">
            保存并进入下一步
            <i class="el-icon-arrow-right el-icon--right" />
          </el-button>
        </el-col>
        <el-col :span="8"
                class="bottom-right">
          <el-button icon="el-icon-upload2"
                     type="success"
                     :disabled="stepActive!==3"
                     @click="publish">提交审核</el-button>
        </el-col>
        <!-- {{ baseInfoDetail }} -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { Register, Customer, Ploy, Preview } from './components'
import bus from './bus'
// import { mapGetters } from 'vuex'
import {
  eventPublish,
  askForApproval,
  getEventInfo,
  getUseCaseDetailById
} from '@/api/api'
const DEFAULT_DATA = {
  baseInfoDetail: {
    // 事件名称
    name: '',
    // 用例名称
    useCaseName: '',
    // 类型
    // categoryValue: '',
    // 开始日期
    startDate: '',
    // 结束日期
    endDate: '',
    // 是否对照组
    trial: false,
    // 试点比例
    control: '',
    // 试点抽样样式
    sampleValue: ''
  },
  groupDetail: {
    // 总人数
    peopleNum: 0,
    // 对照组人数
    comparePeopleNum: 0,
    // 实际人数
    realPeopleNum: 0,
    // 客群数
    groupNum: 0
  },
  ployDetail: {
    ployCount: 0
  }
}
export default {
  components: {
    Register,
    Customer,
    Ploy,
    Preview
  },
  data() {
    return {
      baseInfoDetail: JSON.parse(JSON.stringify(DEFAULT_DATA.baseInfoDetail)),
      groupDetail: JSON.parse(JSON.stringify(DEFAULT_DATA.groupDetail)),
      ployDetail: JSON.parse(JSON.stringify(DEFAULT_DATA.ployDetail)),
      mainLoading: false,
      component: [
        {
          type: 'Register',
          ref: 'regRef'
        },
        {
          type: 'Customer',
          ref: 'customerRef'
        },
        {
          type: 'Ploy',
          ref: 'ployRef'
        },
        {
          type: 'Preview',
          ref: 'previewRef'
        }
      ],
      stepActive: process.env.NODE_ENV === 'development' ? 0 : 0
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
  },
  mounted() {},
  created() {
    bus.$on('setBaseInfoDetail', this.setBaseInfoDetail)
    bus.$on('setGroupDetail', this.setGroupDetail)
    bus.$on('setPloyDetail', this.setPloyDetail)
    if (this.id) {
      this.getStepDetail()
    }
  },
  methods: {
    reset() {
      const ref = this.component[this.stepActive].ref
      this.$refs[ref].reset()
      if (this.id) {
        this.getStepDetail()
      } else {
        this.baseInfoDetail = JSON.parse(
          JSON.stringify(DEFAULT_DATA.baseInfoDetail)
        )
        this.groupDetail = JSON.parse(JSON.stringify(DEFAULT_DATA.groupDetail))
        this.ployDetail = JSON.parse(JSON.stringify(DEFAULT_DATA.ployDetail))
      }
    },
    setBaseInfoDetail(data) {
      this.baseInfoDetail = JSON.parse(JSON.stringify(data))
    },
    setGroupDetail(data) {
      this.groupDetail = JSON.parse(JSON.stringify(data))
    },
    setPloyDetail(data) {
      this.ployDetail = JSON.parse(JSON.stringify(data))
    },
    save() {
      this.$message('还没做')
    },

    getStepDetail() {
      getEventInfo({ id: this.id }).then(res => {
        const baseInfo = res.data.eventBaseInfo
        const customer = res.data.customer
        const ploy = res.data.strategy
        // console.log(baseInfo)
        // 基本信息
        this.baseInfoDetail.name = baseInfo.name
        // this.baseInfoDetail.categoryValue = baseInfo.category.label
        this.baseInfoDetail.useCaseName = baseInfo.useCaseName
        this.baseInfoDetail.startDate = baseInfo.startDate
        this.baseInfoDetail.endDate = baseInfo.endDate
        this.baseInfoDetail.trial = baseInfo.trial
        this.baseInfoDetail.sampleValue = baseInfo.sample.label
        this.baseInfoDetail.control = baseInfo.control
        // 客群
        this.groupDetail.peopleNum = customer.recordCount
        this.groupDetail.comparePeopleNum =
          customer.recordCount - customer.filterCount
        this.groupDetail.realPeopleNum = customer.filterCount
        this.groupDetail.groupNum = customer.groupCount
        // 策略
        this.ployDetail.ployCount = ploy.strategyCount
      })
    },
    next() {
      const ref = this.component[this.stepActive].ref
      this.mainLoading = true
      this.$refs[ref]
        .validateAndNext()
        .then(() => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: '3000'
          })
          this.stepActive++
          this.mainLoading = false
        })
        .catch(err => {
          this.mainLoading = false
          console.log('err:', err)
        })
    },
    prev() {
      if (this.stepActive > 0) {
        this.stepActive--
      }
    },
    publish() {
      const data = { baseId: this.id }
      // eventPublish(data).then(res => {
      //   if (res.code === 200) {
      //     this.$router.replace('/eventBoard')
      //   }
      // })
      askForApproval(data).then(res => {
        if (res.code === 200) {
          this.$router.replace('/eventBoard')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  position: relative;

  .steps-container {
    width: 240px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 20px;
    padding-right: 0;
    overflow: auto;
    // .el-step {
    //   cursor: pointer;
    // }
    ::v-deep .el-step__title {
      padding-bottom: 15px;
    }
    ::v-deep .el-step__title.is-process,
    ::v-deep .el-step__head.is-process {
      color: $blue;
      font-size: 17px;
      transition: font-size 0.1s;
      .el-step__icon.is-text {
        filter: grayscale(0);
        opacity: 1;
      }
    }
    ::v-deep .el-step__icon.is-text {
      // border: 1px solid;
      font-size: 24px;
      border: none;
      filter: grayscale(100%);
      opacity: 0.4;
    }
    ::v-deep .el-step__description {
      padding-right: 0;
      padding-bottom: 10px;
    }
    ::v-deep .el-step__description.is-success {
      color: initial;
    }
    ::v-deep .el-step__line {
      width: 1px;
      top: 32px;
      bottom: 8px;
    }

    ::v-deep .el-step__head.is-success {
      color: #090;
      .el-step__icon {
        // border-radius: 50%;
        // border: 2px solid #090;
        border: none;
        transition: color 0.3s;
      }
    }
    ::v-deep.el-step__title.is-success {
      color: #090;
    }
    .step-detail {
      color: #666;
      font-size: 12px;
    }
    .step-detail {
      display: flex;
      flex-flow: column;
      align-items: flex-start;

      .item {
        margin-bottom: 10px;
        &:last-child {
          margin-top: 0;
        }
      }

      .name {
        // max-width: 200px;
        position: relative;
        // box-shadow: 0 -10px #d9ecff inset;
        line-height: 1.5;
        color: $blue;
        word-break: break-all;
      }
    }
  }
  .content-container {
    position: absolute;
    left: 250px;
    right: 0;
    bottom: 0;
    top: 0;
    .content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 70px;
      overflow: auto;
      // padding: 20px;
    }
    .bottom-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 70px;
      border-top: 1px solid #f0f2f5;
      background: #fcfcfc;
      padding: 0 20px;
      display: flex;
      align-items: center;
      .bottom-left {
        display: flex;
      }
      .bottom-middle {
        display: flex;
        justify-content: center;
      }
      .bottom-right {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
