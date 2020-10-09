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
                      required: true
                    }">
        <div v-for="(targetItem,i) of baseInfo.target"
             :key="i"
             class="target-item">
          <el-form-item :prop="'target.'+i+'.targetSelect'"
                        :rules="{
                          required: true, message: '请选择目标名称', trigger: 'change'
                        }">
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
          </el-form-item>
          <span class="compare">:</span>
          <el-form-item :prop="'target.'+i+'.targetValue'"
                        :rules="{
                          required: true, message: '请输入目标值', trigger: 'change'
                        }">
            <el-input-number v-model="targetItem.targetValue"
                             :disabled="!targetItem.targetSelect"
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
                           @blur="handlerControlBlur" />
          %
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
      targetOpt: [
        // {
        //   label: 'AUM日均1',
        //   value: '1',
        //   compare: '大于',
        //   unit: '元',
        //   disabled: false
        // },
        // {
        //   label: 'AUM日均2',
        //   unit: '万元',
        //   compare: '高于',
        //   value: '2',
        //   disabled: false
        // }, {
        //   label: '流失率',
        //   compare: '小于',
        //   unit: '%',
        //   value: '3',
        //   disabled: false
        // }, {
        //   label: '流失金额2',
        //   compare: '低于',
        //   unit: '美元',
        //   value: '4',
        //   disabled: false
        // }
      ],
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
          head: 'AUM',
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
        //  targetSelect: '',
        // targetValue: ''
        // this.$parent.baseInfoDetail.targetCount = this.baseInfo.target.forEach
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
    this.targetList()
    if (this.id) {
      this.getDetail()
    }
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
        this.baseInfo.target = []
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
      getTargetList().then(res => {
        this.targetOpt = res.data.achieveTagBOList.map(n => {
          return {
            label: n.name,
            unit: n.unit.label,
            value: n.id,
            disabled: false
          }
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
      // 清空输入
      item.targetValue = ''
      // 设置不可选项
      this.resetTargetOpt()
      // 显示单位
      this.targetOpt.forEach((n, i) => {
        if (n.value === val) {
          item.unit = n.unit
          item.compare = n.compare
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
    .target-form-item {
      width: 600px;
      .target-item {
        display: flex;
        position: relative;
        .compare {
          // width: 30px;
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
