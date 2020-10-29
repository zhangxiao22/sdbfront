<template>
  <div class="container">
    <el-form ref="regFormRef"
             :model="baseInfo"
             label-width="110px"
             class="reg-form">
      <el-form-item label="事件名称："
                    :rules="[{
                      required: true, message: '请输入事件名称', trigger: 'blur'
                    }]"
                    prop="name">
        <el-input v-model="baseInfo.name"
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
      <el-form-item label="事件类型："
                    :rules="[{
                      required: true, message: '请选择事件类型', trigger: 'change'
                    }]"
                    prop="category">
        <el-select v-model="baseInfo.category"
                   style="width:100%"
                   placeholder="请选择事件类型">
          <el-option v-for="item in categoryOpt"
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
      <el-form-item label="事件描述："
                    prop="desc">
        <el-input v-model="baseInfo.desc"
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
import Info from '@/components/Info'
import { mapGetters } from 'vuex'
import { parseTime, MAX_NUMBER } from '@/utils'
import { getEventCategory, getSampleList, saveEventBaseInfo, getEventBaseInfo, getTargetList, getUseCaseForEvent } from '@/api/api'

const DEFAULT_BASEINFO = {
  name: '',
  useCaseId: '',
  statusValue: '',
  category: '',
  // categoryValue: '',
  date: [],
  // startDate: '',
  // endDate: '',
  // 是否试点
  trial: false,
  // 比例
  control: 5,
  // 抽样方式
  sample: 1,
  desc: ''
}
export default {
  name: 'Register',
  components: {
    Info
  },
  data() {
    return {
      // mainLoading: this.$parent.mainLoading,
      // parent: this.$parent,
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
      categoryOpt: [],
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
      data.category = this.baseInfo.category
      data.startDate = this.baseInfo.date[0]
      data.endDate = this.baseInfo.date[1]

      // 是否试点
      data.trial = this.baseInfo.trial
      // 比例
      data.control = this.baseInfo.control
      // 抽样方式
      data.sample = this.baseInfo.sample
      data.desc = this.baseInfo.desc
      return data
    }
  },
  watch: {
    baseInfo: {
      handler(newVal, oldVal) {
        // 名称
        this.$parent.baseInfoDetail.name = this.baseInfo.name
        // 用例
        this.changeUseCase()
        // 事件类型
        this.changeEventCategory()
        // 起止日期
        this.changePicker()

        // 对照组
        this.$parent.baseInfoDetail.trial = this.baseInfo.trial
        // 百分比
        this.$parent.baseInfoDetail.control = this.baseInfo.control
        // 抽样方式
        this.changeSample()
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.useCase()
    this.eventCategoryList()
    this.sampleList()
    if (this.id) {
      this.getDetail()
    }
    window.vue = this
  },
  mounted() {
  },
  methods: {
    reset() {
      if (this.id) {
        this.getDetail()
      } else {
        this.baseInfo = JSON.parse(JSON.stringify(DEFAULT_BASEINFO))
        // console.log(DEFAULT_BASEINFO.target)
        // this.baseInfo.target = JSON.parse(JSON.stringify(DEFAULT_BASEINFO.target))
        this.$nextTick(() => {
          this.$refs['regFormRef'].clearValidate()
          this.resetTargetOpt()
        })
        // this.$refs['regFormRef'].resetFields()
      }
    },
    // 获取详情
    getDetail() {
      this.$parent.mainLoading = true
      getEventBaseInfo({ id: this.id }).then(res => {
        this.$parent.mainLoading = false
        const data = res.data
        this.baseInfo.name = data.name
        this.baseInfo.useCaseId = data.useCaseId
        this.baseInfo.statusValue = data.status.value
        this.baseInfo.category = data.category.value
        this.baseInfo.date = [data.startDate, data.endDate]

        this.resetTargetOpt()
        this.baseInfo.trial = data.trial
        this.baseInfo.sample = data.sample.value
        this.baseInfo.control = data.control
        this.baseInfo.desc = data.desc
      }).catch(() => {
        this.$parent.mainLoading = false
      })
    },
    // 获取用例
    useCase() {
      getUseCaseForEvent().then(res => {
        this.useCaseOpt = res.data.map(n => {
          return {
            label: n.name,
            value: n.id
          }
        })
      })
    },
    // 获取类型
    eventCategoryList() {
      getEventCategory().then(res => {
        this.categoryOpt = res.data.eventCategoryEnumList
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
          this.$parent.baseInfoDetail.useCaseName = n.label
          return true
        }
      })
    },
    // 类型值
    changeEventCategory() {
      this.categoryOpt.some((n, i) => {
        if (n.value === this.baseInfo.category) {
          this.$parent.baseInfoDetail.categoryValue = n.label
          return true
        }
      })
    },
    // 选择时间
    changePicker() {
      if (this.baseInfo.date) {
        [this.$parent.baseInfoDetail.startDate, this.$parent.baseInfoDetail.endDate] = this.baseInfo.date
      } else {
        this.$parent.baseInfoDetail.startDate = ''
        this.$parent.baseInfoDetail.endDate = ''
      }
    },
    // 选择抽样方式
    changeSample() {
      this.sampleOpt.some((n, i) => {
        if (n.value === this.baseInfo.sample) {
          this.$parent.baseInfoDetail.sampleValue = n.label
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
