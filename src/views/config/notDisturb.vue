<template>
  <!-- 分发规则参数 -->
  <div class="container">
    <el-form ref="fromRef"
             :model="form"
             label-width="300px"
             class="reg-form">
      <el-form-item prop="intervalDays"
                    label="防打扰间隔天数：">
        <el-input-number v-model="form.intervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <el-form-item prop="minAge"
                    :rules="[{
                      validator: validateNumber,trigger: 'blur'
                    }]"
                    label="年龄下限：">
        <el-input-number v-model="form.minAge"
                         controls-position="right"
                         :min="1"
                         :max="200" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="maxAge"
                    label="年龄上限：">
        <el-input-number v-model="form.maxAge"
                         controls-position="right"
                         :min="form.minAge||1"
                         :max="200"
                         @blur="handleBlurMaxAge" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="hateSaleIntervalDays"
                    label="厌恶营销防打扰间隔天数：">
        <el-input-number v-model="form.hateSaleIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <el-form-item prop="emptyNumbers"
                    label="勾选号码空号次数：">
        <el-input-number v-model="form.emptyNumbers"
                         controls-position="right"
                         :min="1"
                         :max="100" />
        <span class="unit">次</span>
      </el-form-item>
      <el-form-item prop="emptyNumbersIntervalDays"
                    label="号码空号防打扰间隔天数：">
        <el-input-number v-model="form.emptyNumbersIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <!-- <el-form-item prop="smsIntervalDays"
                    label="短信黑名单持续天数：">
        <el-input-number v-model="form.smsIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item> -->
      <el-form-item prop="adviserWeeklyDistribution"
                    label="每周线索分配数量（理财顾问）：">
        <el-input-number v-model="form.adviserWeeklyDistribution"
                         controls-position="right"
                         :min="1"
                         :max="100" />
        <span class="unit">条</span>
      </el-form-item>
      <el-form-item prop="personalWeeklyDistribution"
                    label="每周线索分配数量（个人客户经理）：">
        <el-input-number v-model="form.personalWeeklyDistribution"
                         controls-position="right"
                         :min="1"
                         :max="100" />
        <span class="unit">条</span>
      </el-form-item>
      <el-form-item prop="networkManagerWeeklyDistribution"
                    label="每周线索分配数量（网点经理）：">
        <el-input-number v-model="form.networkManagerWeeklyDistribution"
                         controls-position="right"
                         :min="1"
                         :max="100" />
        <span class="unit">条</span>
      </el-form-item>
      <el-form-item prop="networkClerkWeeklyDistribution"
                    label="每周线索分配数量（网点柜员）：">
        <el-input-number v-model="form.networkClerkWeeklyDistribution"
                         controls-position="right"
                         :min="1"
                         :max="100" />
        <span class="unit">条</span>
      </el-form-item>
      <el-form-item label="行内员工："
                    prop="clark">
        <el-tooltip :content="form.clark?'发送':'不发送'"
                    placement="top">
          <el-switch v-model="form.clark"
                     :active-value="1"
                     :inactive-value="0" />
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   style="width:100px;"
                   icon="el-icon-document"
                   @click="onSubmit">保存</el-button>
        <el-button icon="el-icon-refresh"
                   style="width:100px;"
                   @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getNoDisturb, updateNoDisturb } from '@/api/api'
import { Loading } from 'element-ui'

export default {
  components: {
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
  .reg-form {
    width: 600px;
    margin: 20px auto;
    .unit {
      margin-left: 10px;
    }
  }
}
</style>
