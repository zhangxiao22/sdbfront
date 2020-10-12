<template>
  <div class="container">
    <el-form ref="regFormRef"
             :model="baseInfo"
             :rules="rules"
             label-width="110px"
             class="reg-form">
      <el-form-item label="事件名称："
                    prop="name">
        <el-input v-model="baseInfo.name"
                  show-word-limit
                  maxlength="50" />
      </el-form-item>
      <el-form-item label="事件类型："
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
                    prop="date">
        <el-date-picker v-model="baseInfo.date"
                        style="width:100%"
                        :clearable="false"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item class="target-form-item"
                    label="目标设置："
                    prop="target"
                    :rules="{
                      required: true, message: '请选择目标'
                    }">
        <div v-for="(targetItem,i) of baseInfo.target"
             :key="i"
             class="target-item">
          <el-form-item :prop="'target.'+i+'.targetSelect'"
                        :rules="{
                          required: true, message: '请选择目标名称', trigger: 'change'
                        }">
            <el-tooltip :content="targetItem.label||'请选择目标名称'"
                        placement="left">
              <el-select v-model="targetItem.targetSelect"
                         placeholder="请选择目标名称"
                         class="target-item-input"
                         @change="selectTarget($event,targetItem)">
                <el-option v-for="optItem of targetOpt"
                           :key="optItem.value"
                           :disabled="optItem.disabled"
                           :label="optItem.label"
                           :value="optItem.value" />
              </el-select>
            </el-tooltip>

          </el-form-item>
          <span class="compare">{{ targetItem.compare || ':' }}</span>
          <el-form-item :prop="'target.'+i+'.targetValue'"
                        :rules="{
                          required: true, message: '请输入目标值', trigger: 'change'
                        }">
            <el-input-number v-model="targetItem.targetValue"
                             :disabled="!targetItem.targetSelect"
                             :min="targetItem.min"
                             :max="targetItem.max"
                             :precision="targetItem.precision"
                             controls-position="right"
                             placeholder="请输入目标值"
                             class="target-item-input number-input" />
            <div class="target-unit">{{ targetItem.unit }}</div>
          </el-form-item>
          <i v-if="baseInfo.target.length > 1"
             class="el-icon-delete delete"
             @click="delTargetItem(i)" />
        </div>
        <el-button v-if="baseInfo.target.length < targetOpt.length"
                   class="add"
                   icon="el-icon-plus"
                   @click="addTarget" />
      </el-form-item>
      <el-form-item>
        <div slot="label">
          <Info content="不能超过30%" />
          对照组：
        </div>
        <el-tooltip :content="baseInfo.trial?'已开启':'已关闭'"
                    placement="top">
          <el-switch v-model="baseInfo.trial" />
        </el-tooltip>
        <template v-if="baseInfo.trial">
          <el-input-number v-model="baseInfo.control"
                           :disabled="!baseInfo.trial"
                           style="margin:0 5px 0 20px;"
                           controls-position="right"
                           :step="5"
                           :min="1"
                           :max="30"
                           @blur="handlerControlBlur" />%
        </template>
      </el-form-item>
      <el-form-item v-show="baseInfo.trial"
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
import { getEventCategory, getSampleList, saveEventBaseInfo, getEventBaseInfo, getTargetList } from '@/api/api'

export default {
  name: 'Register',
  components: {
    Info
  },
  data() {
    return {
      mainLoading: this.$parent.mainLoading,
      // parent: this.$parent,
      baseInfo: {
        name: '',
        category: '',
        // categoryValue: '',
        target: [
          {
            targetSelect: '',
            targetValue: ''
            // compare: '',
            // nuit: ''
          }
        ],
        date: null,
        // startDate: '',
        // endDate: '',
        // 是否试点
        trial: false,
        // 比例
        control: 5,
        // 抽样方式
        sample: 1,
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入事件名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择起止日期', trigger: 'change' }
        ]
      },
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
      data.category = this.baseInfo.category
      data.startDate = this.baseInfo.date[0]
      data.endDate = this.baseInfo.date[1]
      // 目标
      data.eventAchieveBOList = this.baseInfo.target.map(n => {
        return {
          id: n.targetSelect,
          value: n.targetValue
        }
      })
      // 是否试点
      data.trial = this.baseInfo.trial
      // 比例
      data.control = this.baseInfo.control / 100
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
        // 事件类型
        this.changeEventCategory()
        // 起止日期
        this.changePicker()
        // 目标
        this.$parent.baseInfoDetail.targetCount = this.baseInfo.target.filter(n => {
          return n.targetSelect
        }).length
        // 对照组
        this.$parent.baseInfoDetail.trial = this.baseInfo.trial
        // 百分比
        this.$parent.baseInfoDetail.control = this.baseInfo.control
        // 抽样方式
        this.changeSample()
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    this.eventCategoryList()
    this.sampleList()
    this.targetList().then(() => {
      if (this.id) {
        this.getDetail()
      }
    })
  },
  mounted() {
  },
  methods: {
    // 获取详情
    getDetail() {
      getEventBaseInfo({ id: this.id }).then(res => {
        const data = res.data
        this.baseInfo.name = data.name
        this.baseInfo.category = data.category.value
        this.baseInfo.date = [data.startDate, data.endDate]
        this.baseInfo.target = [{ id: 1, value: 1 }, { id: 2, value: 2 }].map(item => {
          let obj = this.targetOpt.find(n => {
            if (n.value === item.id) {
              obj = n
              return true
            }
          })
          console.log(obj)
          return Object.assign(obj, {
            targetSelect: item.id,
            targetValue: item.value
          })
        })
        this.resetTargetOpt()
        this.baseInfo.trial = data.trial
        this.baseInfo.sample = data.sample.value
        this.baseInfo.control = data.control * 100
        this.baseInfo.desc = data.desc
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
    // 获取目标
    targetList() {
      return new Promise(resolve => {
        getTargetList().then(res => {
          this.targetOpt = res.data.achieveTagBOList.map(n => {
            return {
              // 目标名称
              label: n.name,
              // 单位
              unit: n.unit.label,
              // 目标值
              value: n.id,
              // 是否可选
              disabled: false,
              // 目标值-小数点精度
              precision: n.unit.value === 4 ? 2 : 0,
              // 目标值-最小值
              min: n.unit.value === 4 ? 0.01 : 1,
              // 目标值-最大值
              max: n.unit.value === 4 ? 100 : Infinity,
              // 比较符号
              compare: '≥'
            }
          })
          resolve()
        })
      })
    },
    // 试点值为空时置为1
    handlerControlBlur() {
      if (!this.baseInfo.control) {
        this.baseInfo.control = 1
      }
    },

    addTarget() {
      this.baseInfo.target.push({
        targetSelect: '',
        targetValue: ''
      })
    },
    delTargetItem(i) {
      this.baseInfo.target.splice(i, 1)
      this.resetTargetOpt()
    },
    resetTargetOpt() {
      const temp = []
      this.baseInfo.target.forEach((n, i) => {
        n.targetSelect && temp.push(n.targetSelect)
      })
      this.targetOpt.forEach((n, i) => {
        n.disabled = temp.includes(n.value)
      })
    },
    // 下一步，供父组件调用
    validateAndNext() {
      return new Promise((resolve, reject) => {
        this.$refs.regFormRef.validate((valid) => {
          if (valid) {
            this.mainLoading = true
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
          }
        })
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
    },
    selectTarget(val, item) {
      this.targetOpt.find((n, i) => {
        if (n.value === val) {
          Object.assign(item, n, {
            // 清空输入
            targetValue: ''
          })
          return true
        }
      })
      // 设置不可选项
      this.resetTargetOpt()
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
