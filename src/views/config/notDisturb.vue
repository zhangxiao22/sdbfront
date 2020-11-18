<template>
  <!-- 防打扰 -->
  <div class="container">
    <el-form ref="regFormRef"
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
                    label="年龄下限：">
        <el-input-number v-model="form.minAge"
                         controls-position="right"
                         :min="1"
                         :max="200" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="maxAge"
                    :rules="[{
                      validator: validateNumber,trigger: 'blur'
                    }]"
                    label="年龄上限：">
        <el-input-number v-model="form.maxAge"
                         controls-position="right"
                         :min="form.minAge"
                         :max="200" />
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
                    label="每周线索分配数量(网点经理）：">
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
      <el-form-item>
        <el-button type="primary"
                   style="width:100px;"
                   icon="el-icon-document"
                   :loading="buttonLoading"
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

export default {
  components: {
  },
  props: {

  },
  data() {
    return {
      buttonLoading: false,
      form: {
        intervalDays: null,
        minAge: null,
        maxAge: 0,
        hateSaleIntervalDays: null,
        emptyNumbers: null,
        emptyNumbersIntervalDays: null,
        adviserWeeklyDistribution: null,
        personalWeeklyDistribution: null,
        networkManagerWeeklyDistribution: null,
        networkClerkWeeklyDistribution: null
      }
      // marks: {
      //   18: '18岁',
      //   30: '30岁',
      //   60: '60岁',
      //   90: '90岁'
      // }
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
    this.getList()
  },
  methods: {
    getList() {
      getNoDisturb().then((res) => {
        this.form = res.data
      })
    },
    onSubmit() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateNoDisturb(this.getData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.resetAll()
            }
          }).catch(() => {
          }).finally(() => {
            this.buttonLoading = false
          })
        }
      })
    },
    validateNumber(rule, value, callback) {
      if (Number(value) < this.form.minAge) {
        callback(new Error('年龄上限必须大于或等于年龄下限'))
      } else {
        callback()
      }
    },
    reset() {
      this.$refs['regFormRef'].resetFields()
      this.buttonLoading = false
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
