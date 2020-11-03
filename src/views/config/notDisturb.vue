<template>
  <div class="container">
    <el-form ref="regFormRef"
             :model="form"
             label-width="200px"
             class="reg-form">
      <el-form-item prop="intervalDay"
                    label="防打扰间隔天数：">
        <el-input-number v-model="form.intervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <el-form-item prop="intervalDay"
                    label="年龄下限：">
        <el-input-number v-model="form.lowerAge"
                         controls-position="right"
                         :min="1"
                         :max="200" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="intervalDay"
                    label="年龄上限：">
        <el-input-number v-model="form.upperAge"
                         controls-position="right"
                         :min="form.lowerAge"
                         :max="200" />
        <span class="unit">岁</span>
      </el-form-item>
      <el-form-item prop="intervalDay"
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
      <el-form-item prop="notOneself"
                    label="号码空号防打扰间隔天数：">
        <el-input-number v-model="form.notOneselfIntervalDays"
                         controls-position="right"
                         :min="1"
                         :max="1000"
                         :step="5" />
        <span class="unit">天</span>
      </el-form-item>
      <el-form-item prop="notOneself"
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
      form: {
        intervalDays: null,
        lowerAge: null,
        upperAge: null,
        hateIntervalDay: null,
        notOneself: null,
        notOneselfIntervalDays: null,
        smsIntervalDays: null
      },
      marks: {
        18: '18岁',
        30: '30岁',
        60: '60岁',
        90: '90岁'
      }
    }
  },
  computed: {

  },

  watch: {},
  created() {
  },
  methods: {
    onSubmit() { },
    reset() { }
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
