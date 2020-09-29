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
            <div class="name item elip">{{ baseInfoDetail.name }}</div>
            <!-- 事件类型 -->
            <el-tag v-show="baseInfoDetail.categoryValue"
                    class="item"
                    size="mini"
                    type="warning">{{ baseInfoDetail.categoryValue }}</el-tag>
            <!-- 起止日期 -->
            <div v-show="baseInfoDetail.startDate && baseInfoDetail.endDate"
                 class="item time-group"
                 style="display:flex;align-items:center;">
              <i class="el-icon-time"
                 style="margin-right:5px;" />
              <div class="time">{{ baseInfoDetail.startDate }} 至 {{ baseInfoDetail.endDate }}</div>
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
            <div v-show="stepDesc.customerCount"
                 class="customer-count">
              <svg-icon style="margin-right:5px;"
                        icon-class="group" />
              {{ parseInt(stepDesc.customerCount).toLocaleString() }}
            </div>
          </div>
        </el-step>
        <el-step title="策略配置"
                 description="策略配置描述">
          <div slot="icon">
            <svg-icon icon-class="_bulb" />
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
      <div class="bottom-container">
        <!-- <el-button icon="el-icon-document"
                   @click="save">保存</el-button> -->
        <el-button :disabled="stepActive===0"
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
        <el-button icon="el-icon-upload2"
                   type="success"
                   :disabled="stepActive!==3"
                   @click="publish">提交审批</el-button>
        <!-- {{ baseInfoDetail }} -->
      </div>
    </div>
  </div>
</template>

<script>

import { Register, CustomerGroups, Ploy, Preview } from './components'
import { mapGetters } from 'vuex'

export default {
  components: {
    Register,
    CustomerGroups,
    Ploy,
    Preview
  },
  data() {
    return {
      baseInfoDetail: {
        name: '',
        categoryValue: '',
        startDate: '',
        endDate: '',
        targetCount: '',
        trial: false,
        control: '',
        sampleValue: ''
      },
      groupDetail: {
        peopleNum: '',
        groupNum: ''
      },
      mainLoading: false,
      component: [
        {
          type: 'Register',
          ref: 'regRef'
        },
        {
          type: 'CustomerGroups',
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
      stepDesc: {
        name: '',
        type: '',
        time: [],
        customerCount: ''
      },
      stepActive: 3
    }
  },
  computed: {

  },
  created() {
  },
  methods: {
    // handleClick(i) {
    //   const ref = this.component[this.stepActive].ref
    //   this.$refs[ref].validateAndNext().then(() => {
    //     this.stepActive = i
    //   }).catch(() => {
    //     // console.log('err')
    //   })
    // },
    next() {
      const ref = this.component[this.stepActive].ref
      this.$refs[ref].validateAndNext().then(() => {
        this.stepActive++
        this.mainLoading = false
      }).catch(err => {
        this.mainLoading = false
        console.log(err)
      })
    },
    prev() {
      if (this.stepActive > 0) {
        this.stepActive--
      }
    },
    publish() {
      console.log(this.getData())
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  position: relative;

  .steps-container {
    width: 260px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 20px;
    overflow: auto;
    // .el-step {
    //   cursor: pointer;
    // }
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
    .register {
      display: flex;
      flex-flow: column;
      align-items: flex-start;

      .item {
        margin-top: 10px;
        &:first-child {
          margin-top: 0;
        }
      }

      .name {
        max-width: 200px;
        position: relative;
        box-shadow: 0 -10px #d9ecff inset;
        line-height: 18px;
        color: $blue;
      }
    }
    .customer-count {
      display: flex;
      align-items: center;
    }
  }
  .content-container {
    position: absolute;
    left: 270px;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
    }
  }
}
</style>
