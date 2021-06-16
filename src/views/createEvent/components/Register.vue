<template>
  <div class="container">
    <el-form ref="regFormRef"
             :model="baseInfo"
             label-width="130px"
             class="reg-form">
      <el-form-item label="事件名称："
                    :rules="[{
                      required: true, message: '请输入事件名称', trigger: 'blur'
                    }]"
                    prop="name">
        <el-input v-model.trim="baseInfo.name"
                  show-word-limit
                  maxlength="50" />
      </el-form-item>
      <el-form-item label="所属用例："
                    :rules="[{
                      required: true, message: '请选择所属用例', trigger: 'change'
                    }]"
                    prop="useCaseId">
        <el-select v-model="baseInfo.useCaseId"
                   :disabled="!!id&&baseInfo.statusValue!==1"
                   style="width:100%"
                   placeholder="请选择所属用例">
          <el-option v-for="item in useCaseOpt"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="起止日期："
                    :rules="[{
                      required: true, message: '请选择起止日期', trigger: 'change'
                    }]"
                    prop="date">
        <el-date-picker v-model="baseInfo.date"
                        style="width:100%"
                        :clearable="false"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item prop="trial">
        <div slot="label">
          <Info content="不能超过30%" />
          对照组：
        </div>
        <div style="display:flex;">
          <el-form-item style="margin-bottom:0;">
            <el-tooltip :content="baseInfo.trial?'已开启':'已关闭'"
                        placement="top">
              <el-switch v-model="baseInfo.trial" />
            </el-tooltip>
          </el-form-item>
          <el-form-item v-show="baseInfo.trial"
                        prop="control"
                        style="margin-bottom:0;">
            <el-input-number v-model="baseInfo.control"
                             :disabled="!baseInfo.trial"
                             style="margin:0 5px 0 20px;"
                             controls-position="right"
                             :step="5"
                             :min="1"
                             :max="30"
                             :precision="0"
                             @blur="handlerControlBlur" />%
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item v-show="baseInfo.trial"
                    prop="sample"
                    label="抽样方式：">
        <el-radio-group v-model="baseInfo.sample">
          <el-radio v-for="(item,i) of sampleOpt"
                    :key="i"
                    :disabled="item.value===2"
                    :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="effectDay"
                    :rules="{required: true, message: '请输入线索有效期', trigger: 'change'}"
                    class="shun-label">
        <div slot="label">
          <Info content="线索有效期不超过营销事件截止日期，线索有效期为线索发送至CRM日期加上有效期或截止日期中有效期较短的日期" />
          线索有效期：
        </div>
        <el-input-number v-model.trim="baseInfo.effectDay"
                         style="margin-right:10px;"
                         controls-position="right"
                         :min="1"
                         :max="10000" />天
      </el-form-item>
      <el-form-item label="事件描述："
                    prop="desc">
        <el-input v-model.trim="baseInfo.desc"
                  :autosize="{ minRows: 8, maxRows: 16}"
                  placeholder="请输入内容"
                  maxlength="500"
                  show-word-limit
                  type="textarea" />
      </el-form-item>
      <!-- {{ targetOpt }} -->
      <!-- {{ $parent.baseInfoDetail }} -->
    </el-form>
  </div>
</template>

<script>
import bus from '../bus'
import Info from '@/components/Info'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import {
  getSampleList,
  saveEventBaseInfo,
  getEventBaseInfo,
  getUseCaseICanChoose
} from '@/api/api'

const DEFAULT_BASEINFO = {
  name: '',
  useCaseId: '',
  statusValue: '',
  date: [],
  // 对照组
  trial: false,
  // 比例
  control: 5,
  // 抽样方式
  sample: 1,
  effectDay: 7,
  desc: ''
}
export default {
  name: 'Register',
  components: {
    Info
  },
  data() {
    return {
      baseInfoDetail: {},
      baseInfo: JSON.parse(JSON.stringify(DEFAULT_BASEINFO)),
      // 时间选择范围
      pickerOptions: {
        disabledDate(time) {
          const testStartTime = parseTime(new Date(), '{y}-{m}-{d}')
          const dateTime = parseTime(time, '{y}-{m}-{d}')
          return dateTime < testStartTime
        }
      },
      // 用例
      useCaseOpt: [],
      // 类型
      // categoryOpt: [],
      // 目标
      targetOpt: [],
      // 抽样方式
      sampleOpt: []
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    },
    // 获取数据
    getData() {
      const data = {}
      data.id = this.id
      data.name = this.baseInfo.name
      data.useCaseId = this.baseInfo.useCaseId
      // data.category = this.baseInfo.category
      data.startDate = this.baseInfo.date[0]
      data.endDate = this.baseInfo.date[1]
      // 是否对照组
      data.trial = this.baseInfo.trial
      // 比例
      data.control = this.baseInfo.control
      // 抽样方式
      data.sample = this.baseInfo.sample
      data.effectDay = this.baseInfo.effectDay
      data.desc = this.baseInfo.desc
      return data
    }
  },
  watch: {
    baseInfo: {
      handler(newVal, oldVal) {
        // 名称
        this.baseInfoDetail.name = this.baseInfo.name
        // 用例
        this.changeUseCase()
        // 起止日期
        this.changePicker()
        // 对照组
        this.baseInfoDetail.trial = this.baseInfo.trial
        // 百分比
        this.baseInfoDetail.control = this.baseInfo.control
        // 抽样方式
        this.changeSample()
        bus.$emit('setBaseInfoDetail', this.baseInfoDetail)
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.sampleList()
    this.useCase()
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      if (this.id) {
        this.getDetail()
        this.$nextTick(() => {
          this.$refs['regFormRef'].clearValidate()
        })
      } else {
        this.baseInfo = JSON.parse(JSON.stringify(DEFAULT_BASEINFO))
        // console.log(DEFAULT_BASEINFO.target)
        this.$nextTick(() => {
          this.$refs['regFormRef'].clearValidate()
        })
        // this.$refs['regFormRef'].resetFields()
      }
    },
    // 获取详情
    getDetail() {
      this.mainLoading = true
      return new Promise(resolve => {
        getEventBaseInfo({ id: this.id }).then(res => {
          this.mainLoading = false
          const data = res.data
          this.baseInfo.name = data.name
          this.baseInfo.useCaseId = data.useCaseId
          this.baseInfo.statusValue = data.status.value
          this.baseInfo.date = [data.startDate, data.endDate]
          this.baseInfo.trial = data.trial
          this.baseInfo.sample = data.sample.value
          this.baseInfo.control = data.control
          this.baseInfo.effectDay = data.effectDay
          this.baseInfo.desc = data.desc
        }).finally(() => {
          this.mainLoading = false
          resolve()
        })
      })
    },
    // 获取用例
    useCase() {
      return new Promise((resolve, reject) => {
        getUseCaseICanChoose().then(res => {
          this.useCaseOpt = res.data.map(n => {
            return {
              label: n.name,
              value: n.id
            }
          })
          resolve()
        })
      })
    },
    // 获取抽样方式
    sampleList() {
      getSampleList().then(res => {
        this.sampleOpt = res.data.eventSampleEnumList
      })
    },

    // 试点值为空时置为1
    handlerControlBlur() {
      if (!this.baseInfo.control) {
        this.baseInfo.control = 1
      }
    },

    // 下一步，供父组件调用
    validateAndNext() {
      return new Promise((resolve, reject) => {
        this.$refs.regFormRef.validate((valid) => {
          if (valid) {
            // this.mainLoading = true
            saveEventBaseInfo(this.getData).then(res => {
              if (res.code === 200) {
                this.$router.replace({
                  path: '/createEvent',
                  query: {
                    id: res.data.id
                  }
                })
                resolve()
              } else {
                reject()
              }
            }).catch(() => {
              reject()
            })
          } else {
            reject()
          }
        })
      })
    },
    // 用例
    changeUseCase() {
      this.useCaseOpt.some((n, i) => {
        if (n.value === this.baseInfo.useCaseId) {
          this.baseInfoDetail.useCaseName = n.label
          return true
        }
      })
    },
    // 选择时间
    changePicker() {
      if (this.baseInfo.date) {
        [this.baseInfoDetail.startDate, this.baseInfoDetail.endDate] = this.baseInfo.date
      } else {
        this.baseInfoDetail.startDate = ''
        this.baseInfoDetail.endDate = ''
      }
    },
    // 选择抽样方式
    changeSample() {
      this.sampleOpt.some((n, i) => {
        if (n.value === this.baseInfo.sample) {
          this.baseInfoDetail.sampleValue = n.label
          return true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 50px 20px;
  .reg-form {
    width: 600px;
    margin: 0 auto;
    .target-form-item {
      width: 600px;
      .target-item {
        display: flex;
        position: relative;
        .compare {
          width: 10px;
          margin: 0 10px;
          color: #888;
          text-align: center;
        }
        .el-form-item {
          flex: 1;
          position: relative;
          .target-item-input {
            width: 100%;
            position: relative;

            &.number-input {
              ::v-deep .el-input__inner {
                padding-right: 80px;
                text-align: left;
              }
            }
          }
          .target-unit {
            position: absolute;
            top: 0;
            right: 42px;
          }
        }

        .delete {
          color: $red;
          display: inline-block;
          width: 20px;
          cursor: pointer;
          height: 32px;
          margin-left: 10px;
          font-size: 18px;
          line-height: 32px;
          position: absolute;
          right: -30px;
          top: 0;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .add {
        width: 100%;
        border-style: dashed;
      }
    }
  }
}
</style>
