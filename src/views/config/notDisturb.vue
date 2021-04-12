<template>
  <!-- 分发规则参数 -->
  <div class="container">
    <el-form ref="fromRef"
             :model="form"
             label-width="300px"
             class="form">
      <div class="block">
        <div class="block-title">免打扰开关</div>
        <el-form-item prop="intervalDays"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时将逐条线索查询客户的CRM历史执行记录，若线索生效日距离上次CRM执行时间低于设置的防打扰间隔天数，且该线索的用例打开防打扰开关，则该线索跳过分发，直接弃用" />
            防打扰间隔天数：
          </div>
          <el-input-number v-model="form.intervalDays"
                           controls-position="right"
                           :min="1"
                           :max="1000"
                           :step="5" />
          <span class="unit">天</span>
        </el-form-item>
      </div>
      <div class="block">
        <div class="block-title">不营销客户</div>
        <el-form-item prop="minAge"
                      :rules="[{
                        validator: validateNumber,trigger: 'blur'
                      }]"
                      class="form-item">
          <div slot="label">
            <Info content="客户年龄低于该下限的线索，直接弃用" />
            年龄下限：
          </div>
          <el-input-number v-model="form.minAge"
                           controls-position="right"
                           :min="1"
                           :max="200" />
          <span class="unit">岁</span>
        </el-form-item>
        <el-form-item prop="maxAge"
                      class="form-item">
          <div slot="label">
            <Info content="客户年龄高于该上限的线索，直接弃用" />
            年龄上限：
          </div>
          <el-input-number v-model="form.maxAge"
                           controls-position="right"
                           :min="form.minAge||1"
                           :max="200"
                           @blur="handleBlurMaxAge" />
          <span class="unit">岁</span>
        </el-form-item>
        <el-form-item prop="hateSaleIntervalDays"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时将逐条线索查询客户的CRM历史执行记录，若客户上次执行记录为厌恶营销，且线索生效日距离上次CRM执行时间低于设置的防打扰间隔天数，则该线索跳过分发，直接弃用" />
            厌恶营销防打扰间隔天数：
          </div>
          <el-input-number v-model="form.hateSaleIntervalDays"
                           controls-position="right"
                           :min="1"
                           :max="1000"
                           :step="5" />
          <span class="unit">天</span>
        </el-form-item>
        <el-form-item prop="emptyNumbers"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时将逐条线索查询客户的CRM历史执行记录，若客户最近X次执行记录为空号，且线索生效日距离上次CRM执行时间低于设置的防打扰间隔天数，则该线索跳过分发，直接弃用" />
            勾选号码空号次数：
          </div>
          <el-input-number v-model="form.emptyNumbers"
                           controls-position="right"
                           :min="1"
                           :max="100" />
          <span class="unit">次</span>
        </el-form-item>
        <el-form-item prop="emptyNumbersIntervalDays"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时将逐条线索查询客户的CRM历史执行记录，若客户最近X次执行记录为空号，且线索生效日距离上次CRM执行时间低于设置的防打扰间隔天数，则该线索跳过分发，直接弃用" />
            号码空号防打扰间隔天数：
          </div>
          <el-input-number v-model="form.emptyNumbersIntervalDays"
                           controls-position="right"
                           :min="1"
                           :max="1000"
                           :step="5" />
          <span class="unit">天</span>
        </el-form-item>
        <el-form-item class="form-item"
                      prop="clark">
          <div slot="label">
            <Info content="设置为否，则客户标签“十大客群”为“行内员工”的线索跳过分发，直接弃用" />
            线索是否发送至行内员工：
          </div>
          <el-tooltip :content="form.clark?'发送':'不发送'"
                      placement="top">
            <el-switch v-model="form.clark"
                       :active-value="1"
                       :inactive-value="0" />
          </el-tooltip>
        </el-form-item>
      </div>
      <div class="block">
        <div class="block-title">分配数量</div>
        <el-form-item prop="adviserWeeklyDistribution"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时CRM岗位为理财顾问的员工可分配的线索上限，达到线索上线后，该员工不再分配线索，以该员工为挂靠人的线索直接弃用" />
            每周线索分配数量（理财顾问）：
          </div>
          <el-input-number v-model="form.adviserWeeklyDistribution"
                           controls-position="right"
                           :min="1"
                           :max="100" />
          <span class="unit">条</span>
        </el-form-item>
        <el-form-item prop="personalWeeklyDistribution"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时CRM岗位为个人客户经理的员工可分配的线索上限，达到线索上线后，该员工不再分配线索，以该员工为挂靠人的线索直接弃用" />
            每周线索分配数量（个人客户经理）：
          </div>
          <el-input-number v-model="form.personalWeeklyDistribution"
                           controls-position="right"
                           :min="1"
                           :max="100" />
          <span class="unit">条</span>
        </el-form-item>
        <el-form-item prop="networkManagerWeeklyDistribution"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时CRM岗位为网点经理的员工可分配的线索上限，达到线索上线后，该员工不再分配线索，以该员工为挂靠人的线索直接弃用" />
            每周线索分配数量（网点经理）：
          </div>
          <el-input-number v-model="form.networkManagerWeeklyDistribution"
                           controls-position="right"
                           :min="1"
                           :max="100" />
          <span class="unit">条</span>
        </el-form-item>
        <el-form-item prop="networkClerkWeeklyDistribution"
                      class="form-item">
          <div slot="label">
            <Info content="线索分发时CRM岗位为网点柜员的员工可分配的线索上限，达到线索上线后，该员工不再分配线索，以该员工为挂靠人的线索直接弃用" />
            每周线索分配数量（网点柜员）：
          </div>
          <el-input-number v-model="form.networkClerkWeeklyDistribution"
                           controls-position="right"
                           :min="1"
                           :max="100" />
          <span class="unit">条</span>
        </el-form-item>
      </div>

      <!-- <el-form-item prop="smsIntervalDays"
                    label="短信黑名单持续天数：">
        <el-input-number v-model="form.smsIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item> -->
      <div class="block">
        <el-form-item class="form-item">
          <el-button type="primary"
                     style="width:100px;"
                     icon="el-icon-document"
                     @click="onSubmit">保存</el-button>
          <el-button icon="el-icon-refresh"
                     style="width:100px;"
                     @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getNoDisturb, updateNoDisturb } from '@/api/api'
import { Loading } from 'element-ui'
import Info from '@/components/Info'

export default {
  components: {
    Info
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        intervalDays: null,
        minAge: null,
        maxAge: null,
        hateSaleIntervalDays: null,
        emptyNumbers: null,
        emptyNumbersIntervalDays: null,
        adviserWeeklyDistribution: null,
        personalWeeklyDistribution: null,
        networkManagerWeeklyDistribution: null,
        networkClerkWeeklyDistribution: null,
        clark: 0
      }
    }
  },
  computed: {
    getData() {
      const data = JSON.parse(JSON.stringify(this.form))
      return data
    }
  },

  watch: {},
  created() {
  },
  methods: {
    init() {
      this.getList()
    },
    validateNumber(rule, value, callback) {
      if (this.form.maxAge < this.form.minAge) {
        callback(new Error('年龄下限必须小于或等于年龄上限'))
      } else {
        callback()
      }
    },
    handleBlurMaxAge() {
      this.$refs.fromRef.validateField('minAge')
    },
    getList() {
      getNoDisturb().then((res) => {
        this.form = res.data
      })
    },
    onSubmit() {
      this.$refs['fromRef'].validate((valid) => {
        if (valid) {
          this.$emit('update:loading', true)
          updateNoDisturb(this.getData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
            }
          }).finally(() => {
            this.$emit('update:loading', false)
          })
        }
      })
    },
    reset() {
      this.$refs['fromRef'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .form {
    // width: 600px;
    margin: 20px auto;
    .block {
      border-bottom: 1px solid #eee;
      padding-top: 18px;
      &:first-of-type {
        padding-top: 0;
      }
      &:last-of-type {
        border-bottom: none;
      }
      .block-title {
        color: #aaa;
        font-weight: bold;
        font-size: 14px;
      }
      .form-item {
        width: 600px;
        margin: 0 auto 18px;
      }
    }
    .unit {
      margin-left: 10px;
    }
  }
}
</style>
