<template>
  <!-- 防打扰 -->
  <div class="container">
    <el-form ref="regFormRef"
             :model="form"
             label-width="200px"
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
      <el-form-item prop="lowerAge"
                    label="年龄下限：">
        <el-input-number v-model="form.lowerAge"
                         controls-position="right"
                         :min="1"
                         :max="200" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="upperAge"
                    label="年龄上限：">
        <el-input-number v-model="form.upperAge"
                         controls-position="right"
                         :min="form.lowerAge"
                         :max="200" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="hateIntervalDay"
                    label="厌恶营销防打扰间隔天数：">
        <el-input-number v-model="form.hateIntervalDay"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <el-form-item prop="notOneself"
                    label="勾选号码空号次数：">
        <el-input-number v-model="form.notOneself"
                         controls-position="right"
                         :min="1"
                         :max="100" />
        <span class="unit">次</span>
      </el-form-item>
      <el-form-item prop="notOneselfIntervalDays"
                    label="号码空号防打扰间隔天数：">
        <el-input-number v-model="form.notOneselfIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <el-form-item prop="smsIntervalDays"
                    label="短信黑名单持续天数：">
        <el-input-number v-model="form.smsIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
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
import { } from '@/api/api'

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
        lowerAge: null,
        upperAge: null,
        hateIntervalDay: null,
        notOneself: null,
        notOneselfIntervalDays: null,
        smsIntervalDays: null
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
      const data = {}
      data.intervalDays = this.form.intervalDays
      data.lowerAge = this.form.lowerAge
      data.upperAge = this.form.upperAge
      data.hateIntervalDay = this.form.hateIntervalDay
      data.notOneself = this.form.notOneself
      data.notOneselfIntervalDays = this.form.notOneselfIntervalDays
      data.smsIntervalDays = this.form.smsIntervalDays
      return data
    }
  },

  watch: {},
  created() {
  },
  methods: {
    onSubmit() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          // addCustomerToBlackList([this.getData]).then(res => {
          //   this.buttonLoading = false
          //   if (res.code === 200) {
          //     this.$message({
          //       message: '保存成功',
          //       type: 'success',
          //       duration: '3000'
          //     })
          //     this.resetAll()
          //   }
          // }).catch(() => {
          //   this.buttonLoading = false
          // })
        }
      })
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
