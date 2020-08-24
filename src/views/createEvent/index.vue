<template>
  <div class="container">
    <div class="steps-container">
      <el-steps direction="vertical"
                finish-status="success"
                :active="stepActive">
        <el-step title="事件注册"
                 @click.native="handleClick">
          <div slot="icon">
            <i class="el-icon-edit-outline" />
          </div>
          <div slot="description"
               class="register">
            <div v-show="stepDesc.name"
                 class="name item elip">{{ stepDesc.name }}</div>
            <el-tag v-show="stepDesc.type"
                    class="item"
                    size="mini"
                    type="success">{{ stepDesc.type }}</el-tag>
            <div v-show="stepDesc.time.length"
                 class="item time-group"
                 style="display:flex;">
              <b>
                <i class="el-icon-time"
                   style="font-weight:bold;" />
                起止日期：
              </b>
              <div class="time">
                <div class="time-item">{{ stepDesc.time[0] }}</div>
                <div class="time-item">{{ stepDesc.time[1] }}</div>
              </div>
            </div>
          </div>
        </el-step>
        <el-step title="客群配置">
          <div slot="icon">
            <svg-icon icon-class="users" />
          </div>

          <div slot="description">123</div>
        </el-step>
        <el-step title="步骤 3"
                 description="这是一段很长很长很长的描述性文字" />
        <el-step title="步骤 4"
                 description="这是一段很长很长很长的描述性文字" />
        <el-step title="步骤 5"
                 description="这是一段很长很长很长的描述性文字" />
      </el-steps>
    </div>
    <div class="content-container">
      <div class="content">
        <Register v-show="stepActive===0"
                  ref="contentRef"
                  @renderSteps="renderSteps" />
        <CustomerGroups v-show="stepActive===1"
                        ref="contentRef"
                        @renderSteps="renderSteps" />
      </div>
      <div class="bottom-container">
        <el-button :disabled="preDisabled"
                   icon="el-icon-arrow-left"
                   @click="prev">上一步</el-button>
        <el-button type="primary"
                   @click="next">下一步<i class="el-icon-arrow-right el-icon--right" /></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Register, CustomerGroups } from './components'

export default {
  components: {
    Register,
    CustomerGroups
  },
  data() {
    return {
      stepDesc: {
        time: []
      },
      stepActive: 1,
      preDisabled: false

    }
  },
  computed: {
  },
  methods: {
    handleClick() {
    },
    next() {
      // this.$refs.contentRef[this.stepActive].next(() => {
      //   if (this.stepActive < 4) {
      //     this.stepActive++
      //   }
      // })
      this.stepActive++
    },
    prev() {
      if (this.stepActive > 0) {
        this.stepActive--
      }
    },
    renderSteps(data) {
      this.stepDesc = Object.assign({}, this.stepDesc, data)
      // console.log(this.stepDesc)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  position: relative;

  .steps-container {
    width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    overflow: auto;
    ::v-deep .el-step__icon.is-text {
      border: 1px solid;
    }
    ::v-deep .el-step__description.is-success {
      color: initial;
    }

    ::v-deep .el-step__head.is-success {
      color: #090;
      .el-step__icon {
        border-radius: 50%;
        border: 2px solid #090;
        transition: color 0.3s;
      }
    }
    ::v-deep.el-step__title.is-success {
      color: #090;
    }
    .register {
      display: flex;
      flex-flow: column;
      align-items: flex-start;

      .item {
        margin-top: 5px;
      }

      .name {
        max-width: 200px;
        position: relative;
        box-shadow: 0 -10px #d9ecff inset;
        line-height: 18px;
        color: $blue;
      }

      .type {
      }

      .time-group {
        .time {
          color: #888;
          position: relative;

          &::before {
            position: absolute;
            content: "";
            left: 2px;
            top: 10px;
            bottom: 10px;
            width: 1px;
            background: #409eff;
            transform: translateX(-50%) scaleX(0.5);
          }

          .time-item {
            position: relative;
            padding-left: 10px;

            &::before {
              position: absolute;
              content: "";
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #409eff;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }
    }
  }
  .content-container {
    background: #fff;
    border-radius: 4px;
    position: absolute;
    left: 296px;
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
      border-top: 1px solid #dcdfe6;
      @include center-center;
    }
  }
}
</style>
