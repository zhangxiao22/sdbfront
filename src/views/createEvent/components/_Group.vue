<template>
  <div class="group-container">
    <el-form ref="form"
             :model="{condition}"
             label-position="top"
             class="reg-form">
      <el-form-item prop="condition"
                    :rules="rules"
                    class="shun-label group-label">
        <div slot="label">
          <Info :content="`最多设置${maxLength}个规则`" />
          {{ label }}：
        </div>
        <div v-for="(conditionItem,ci) of condition"
             :key="ci"
             class="condition-item"
             :class="{single:condition.length===1}">
          <!-- {{ ci }} {{ conditionItem.conditionSelect }} -->
          <el-form-item :prop="'condition.' + ci + '.conditionSelect'"
                        class="item"
                        :rules="[{
                          required: true, message: '请选择规则标签'
                        }]">
            <el-tooltip :content="conditionItem.conditionLabel||'请选择'"
                        placement="left">
              <el-select v-model="conditionItem.conditionSelect"
                         filterable
                         class="condition-item-input"
                         @change="selectCondition($event,ci)">
                <el-option v-for="optItem of tags"
                           :key="optItem.value"
                           :label="optItem.label"
                           :value="optItem.value">
                  <svg-icon class="type-icon"
                            :icon-class="optItem.type" />
                  {{ optItem.label }}
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
          <!-- 比较符 -->
          <el-form-item :prop="'condition.' + ci + '.compare'"
                        class="item"
                        :rules="[{
                          required: true, message: '请选择比较方式', trigger:'change'
                        }]">
            <el-select v-model="conditionItem.compare"
                       style="width:90px">
              <el-option v-for="item in conditionItem.compareOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <!-------------------------- 数字型 -------------------------->
          <template v-if="conditionItem.type==='数值型'">

            <!-- 数字型-值 -->
            <div v-if="conditionItem.compare!==''"
                 class="item-box">
              <template v-if="conditionItem.compare===2">
                <!-- 区间 -->
                <Info class="item"
                      content="请输入数字并设置开闭区间" />
                <!-- ( -->
                <el-button class="item"
                           @click="conditionItem.conditionValue.leftSymbol=conditionItem.conditionValue.leftSymbol==='('?'[':'('">
                  {{ conditionItem.conditionValue.leftSymbol }}</el-button>
                <!-- 最小值 -->
                <el-form-item :prop="'condition.' + ci + '.conditionValue.minVal'"
                              class="item mb-0"
                              :rules="[{
                                validator: validateNumber,trigger: 'blur'
                              }]">
                  <el-input-number v-model="conditionItem.conditionValue.minVal"
                                   style="width:150px;"
                                   class="item mb-0"
                                   :min="-MAX_NUMBER"
                                   :max="MAX_NUMBER"
                                   placeholder="负无穷"
                                   controls-position="right" />
                  <b class="item mb-0">,</b>
                  <!-- 最大值 -->
                  <el-input-number v-model="conditionItem.conditionValue.maxVal"
                                   style="width:150px;"
                                   class="item mb-0"
                                   :min="-MAX_NUMBER"
                                   :max="MAX_NUMBER"
                                   placeholder="正无穷"
                                   controls-position="right" />
                  <el-button @click="conditionItem.conditionValue.rightSymbol=conditionItem.conditionValue.rightSymbol===')'?']':')'">
                    {{ conditionItem.conditionValue.rightSymbol }}</el-button>
                </el-form-item>
              </template>
              <template v-else>
                <!-- 非区间 -->
                <Info class="item"
                      content="请输入数字并选择或按回车键创建，可创建多个" />
                <el-form-item :prop="'condition.' + ci + '.conditionValue.numberArrVal'"
                              class="item"
                              :rules="[{
                                required: true, message: '请输入值'
                              }]">
                  <el-select v-model="conditionItem.conditionValue.numberArrVal"
                             class="long-text"
                             multiple
                             filterable
                             remote
                             allow-create
                             default-first-option
                             placeholder="请输入数字并创建条目"
                             @change="handleChangeNumberInput">
                    <el-option v-for="item in numberOptions"
                               :key="item.value"
                               style="max-width:300px;"
                               :title="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
              </template>
              <div class="unit item">{{ conditionItem.unit }}</div>
            </div>
          </template>
          <!-------------------------- 字符串型 -------------------------->
          <template v-if="conditionItem.type==='字符串型'">
            <div v-if="conditionItem.compare!==''"
                 class="item-box">
              <!-- 单个输入框 -->
              <template v-if="conditionItem.compare===0">
                <el-form-item :prop="'condition.' + ci + '.conditionValue.stringVal'"
                              class="item"
                              :rules="[{
                                required: true, message: '请输入内容'
                              }]">
                  <el-input v-model="conditionItem.conditionValue.stringVal"
                            placeholder="请输入内容" />
                </el-form-item>
              </template>
              <template v-else>
                <!-- 多个值 -->
                <Info class="item"
                      content="请输入内容并选择或按回车键创建，可创建多个" />
                <el-form-item :prop="'condition.' + ci + '.conditionValue.stringArrVal'"
                              class="item"
                              :rules="[{
                                required: true, message: '请输入内容'
                              }]">
                  <el-select v-model="conditionItem.conditionValue.stringArrVal"
                             class="long-text"
                             multiple
                             filterable
                             remote
                             allow-create
                             default-first-option
                             placeholder="请输入内容并创建条目"
                             @change="handleChangeStringInput">
                    <el-option v-for="item in stringOptions"
                               :key="item.value"
                               style="max-width:500px;"
                               :title="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
              </template>
            </div>
          </template>

          <!-------------------------- 枚举型 -------------------------->
          <template v-if="conditionItem.type==='枚举型'">
            <el-form-item :prop="'condition.' + ci + '.conditionValue.selectVal'"
                          class="item"
                          :rules="[{
                            required: true, message: '请选择选项'
                          }]">
              <el-select v-model="conditionItem.conditionValue.selectVal"
                         multiple
                         placeholder="请选择">
                <el-option v-for="item of conditionItem.selectOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>

          </template>
          <!-------------------------- 日期型 -------------------------->
          <template v-if="conditionItem.type==='日期型'">
            <el-form-item :prop="'condition.' + ci + '.conditionValue.startDate'"
                          class="item"
                          :rules="[{
                            validator: validateDate
                          }]">
              <el-date-picker v-model="conditionItem.conditionValue.startDate"
                              class="item mb-0"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="从前" />
              <span class="item mb-0">至</span>
              <el-date-picker v-model="conditionItem.conditionValue.endDate"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="未来" />
            </el-form-item>
          </template>
          <!-- 删除按钮 -->
          <i v-if="condition.length > minLength"
             class="el-icon-delete delete item"
             @click="delconditionItem(ci)" />
          <div v-if="ci !== condition.length - 1"
               class="and-or">
            <div class="text"
                 @click="andOr(ci)">{{ conditionItem.andOrText }}</div>
          </div>
        </div>
        <el-button v-if="condition.length < maxLength"
                   class="add"
                   icon="el-icon-plus"
                   @click="addItem">
          添加规则
        </el-button>
        <el-button type="primary"
                   plain
                   @click="check">筛选客户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCustomerLabel } from '@/api/api'
import Info from '@/components/Info'
import { DATA } from './json'
import { MAX_NUMBER } from '@/utils'
export default {
  components: {
    Info
  },
  props: {
    condition: {
      type: Array,
      default() {
        return []
      }
    },
    maxLength: {
      type: Number,
      default: 10
    },
    minLength: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: '分群规则'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      numberOptions: [],
      stringOptions: [],
      MAX_NUMBER,
      originData: [],
      numberFlat: {}
    }
  },
  computed: {
    tags() {
      return this.originData.map((n) => {
        return {
          label: n.name,
          value: n.id,
          type: n.type
        }
      })
    },
    rules() {
      return [{
        required: this.required, message: '请选择规则', type: 'array'
      }]
    }
  },
  watch: {
    // value() {
    //   this.$emit('update:condition', this.value)
    // }
  },
  created() {
    // this.tagsInit(0, 0)
    this.getRuleList()
  },

  methods: {
    validateNumber(rule, value, callback) {
      const index = rule.field.split('.')[1]
      if (this.condition[index].conditionValue.minVal === undefined && this.condition[index].conditionValue.maxVal === undefined) {
        callback('请填写区间的最小值或最大值')
      } else if (this.condition[index].conditionValue.minVal >= this.condition[index].conditionValue.maxVal) {
        callback('区间的最小值必须小于最大值')
      } else {
        // this.$refs.form.clearValidate(`condition.${index}.conditionValue.minVal`)
        callback()
      }
    },
    chcekNumber(index) {
      this.$refs.form.validateField(`condition.${index}.conditionValue.minVal`)
    },
    validateDate(rule, value, callback) {
      const index = rule.field.split('.')[1]
      if (!this.condition[index].conditionValue.startDate && !this.condition[index].conditionValue.endDate) {
        callback('请选择开始时间或结束时间')
      } else if (this.condition[index].conditionValue.startDate &&
        this.condition[index].conditionValue.endDate &&
        this.condition[index].conditionValue.startDate >= this.condition[index].conditionValue.endDate) {
        callback('开始时间不能早于结束时间')
      } else {
        callback()
      }
    },
    validate(cb) {
      this.$refs.form.validate((valid) => {
        cb(valid)
      })
    },
    check() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('check', this.condition)
        }
      })
    },
    getRuleList() {
      getCustomerLabel().then(res => {
        // this.originData = res.data
        this.originData = DATA
      })
    },
    // 数字型-非区间输入
    handleChangeNumberInput(val) {
      for (let i = val.length - 1; i >= 0; i--) {
        if (isNaN(val[i])) {
          val.splice(i, 1)
        }
      }
      this.numberOptions = val.map(n => {
        return {
          value: n,
          label: n
        }
      })
    },
    handleChangeStringInput(val) {
      this.stringOptions = val.map(n => {
        return {
          value: n,
          label: n
        }
      })
    },

    // 通过规则选中的值，返回一条规则应该展示的数据
    resetOpt(optValue) {
      if (!optValue) {
        return {
          andOrText: '且'
        }
      } else {
        const item = this.originData.find((n) => {
          return n.id === optValue
        })
        let conditionValue
        if (item.type === '数值型') {
          conditionValue = {
            // 非区间的值（数组）
            numberArrVal: [],
            // 区间值 objs
            leftSymbol: '(',
            minVal: undefined,
            maxVal: undefined,
            rightSymbol: ')'
          }
        }
        if (item.type === '字符串型') {
          conditionValue = {
            stringVal: ''
          }
        }
        if (item.type === '枚举型') {
          conditionValue = {
            selectVal: []
          }
        }
        if (item.type === '日期型') {
          conditionValue = {
            startDate: '',
            endDate: ''
          }
        }
        // const conditionValue = item.type === '日期型' ? { startDate: '', endDate: '' } : null
        const data = {
          // 规则选中选项的值
          conditionSelect: item.id,
          // 规则选中的名称
          conditionLabel: item.name,
          // 类型
          type: item.type,
          // 比较符号的选项
          compareOpt: item.relations,
          // 比较符号的值
          compare: 0,
          // 枚举型可选项
          selectOpt: item.enumCandidateList,
          // // 数字型-小数点精度
          // precision: item.precision || 0,
          // // 数字型-最小值
          // min: item.min || 0,
          // // 数字型-最大值
          // max: item.max || undefined,
          // 数字型-单位
          unit: item.unit,
          // 规则的值
          conditionValue,
          andOrText: '且'
        }
        return data
      }
    },
    tagsInit(gi, optValue) {
      /**
       * gi: 客群的index
         optValue: 选项的值
       */
      this.condition.splice(gi, 1, this.resetOpt(optValue))
    },
    selectCondition(val, i) {
      for (let j = 0; j < this.tags.length; j++) {
        if (this.tags[j].value === val) {
          this.tagsInit(i, val)
          break
        }
      }
    },
    addItem() {
      this.condition.push(this.resetOpt())
      // 校验
      this.$refs.form.clearValidate('condition')
    },
    delconditionItem(i) {
      this.condition.splice(i, 1)
      // 校验
      this.$refs.form.clearValidate('condition')
    },
    andOr(i) {
      this.condition[i].andOrText = this.condition[i].andOrText === '且' ? '或' : '且'
    },
    getVal() {
      return this.condition
      // const data = this.condition.map((n, i) => {
      //   console.log(this.condition)
      // })
      // return data
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.group-container {
  // min-width: 850px;
  .group-label ::v-deep .el-form-item__label {
    display: flex;
    justify-content: flex-start;
  }
  .condition-item {
    position: relative;
    left: 20px;
    // top: -5px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    transition: left 0.3s;
    &.single {
      left: 0;
    }
    .item-box {
      max-width: 100%;
      display: flex;
      align-items: flex-start;
    }
    .item {
      margin: 0 10px 18px 0;
      &.mb-0 {
        margin-bottom: 0;
      }
      .unit {
        display: inline-block;
      }
    }
    .delete {
      color: $red;
      display: inline-block;
      width: 20px;
      cursor: pointer;
      height: 32px;
      // margin-left: 10px;
      font-size: 18px;
      line-height: 32px;
      // position: absolute;
      // right: -30px;
      // top: 0;
      &:hover {
        opacity: 0.8;
      }
    }
    .and-or {
      position: absolute;
      top: 20px;
      bottom: -10px;
      width: 2px;
      background: #e9ecf4;
      left: -15px;
      // height: 40px;
      @include center-center;
      .text {
        width: 20px;
        height: 20px;
        background: #fff;
        @include center-center;
        cursor: pointer;
        color: $blue;
        font-weight: bold;
        &:hover {
          color: #597cd6;
        }
      }
      &::after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: #d3d9e9 transparent transparent transparent;
        bottom: -8px;
        left: auto;
      }
    }
  }
  .add {
    border-style: dashed;
  }
}
</style>
