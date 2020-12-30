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
          <el-form-item :prop="'condition.' + ci + '.conditionSelect'"
                        class="item"
                        :rules="[{
                          required: true, message: '请选择规则标签',trigger:'change'
                        }]">
            <el-tooltip :content="conditionItem.conditionLabel||'请选择'"
                        placement="left">
              <el-cascader v-model="conditionItem.conditionSelect"
                           filterable
                           :show-all-levels="false"
                           :options="ruleOpt"
                           @change="selectCondition($event,ci)" />
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
            <el-form-item :prop="'condition.' + ci + '.conditionValue.numberVal'"
                          class="item"
                          :rules="[{
                            required: true, message: '请填写'
                          }]">
              <el-input-number v-model="conditionItem.conditionValue.numberVal"
                               controls-position="right"
                               @change="handleChangeNumberInput" />
            </el-form-item>
          </template>
          <!-------------------------- 字符串型 -------------------------->
          <template v-if="conditionItem.type==='字符串型'">
            <el-form-item :prop="'condition.' + ci + '.conditionValue.stringVal'"
                          class="item"
                          :rules="[{
                            required: true, message: '请填写'
                          }]">
              <el-input v-model.trim="conditionItem.conditionValue.stringVal"
                        placeholder="请填写" />
            </el-form-item>
          </template>

          <!-------------------------- 枚举型 -------------------------->
          <template v-if="conditionItem.type==='枚举型'">
            <el-form-item :prop="'condition.' + ci + '.conditionValue.selectVal'"
                          class="item"
                          :rules="[{
                            required: true, message: '请选择选项'
                          }]">
              <el-select v-model="conditionItem.conditionValue.selectVal"
                         placeholder="请选择">
                <el-option v-for="item of conditionItem.selectOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>

          </template>
          <!-------------------------- 布尔型 -------------------------->
          <template v-if="conditionItem.type==='布尔型'">
            <el-form-item :prop="'condition.' + ci + '.conditionValue.booleanVal'"
                          class="item"
                          :rules="[{
                            required: true, message: '请选择选项'
                          }]">
              <el-select v-model="conditionItem.conditionValue.booleanVal"
                         placeholder="请选择">
                <el-option v-for="item of conditionItem.booleanOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>

          </template>
          <!-------------------------- 日期型 -------------------------->
          <template v-if="conditionItem.type==='日期型'">
            <el-form-item :prop="'condition.' + ci + '.conditionValue.dateVal'"
                          class="item"
                          :rules="[{
                            required: true, message: '请选择选项'
                          }]">
              <el-date-picker v-model="conditionItem.conditionValue.dateVal"
                              class="item mb-0"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="请填写" />
            </el-form-item>
          </template>
          <!-- 删除按钮 -->
          <i v-if="condition.length > minLength"
             class="el-icon-delete delete item"
             @click="delconditionItem(ci)" />
          <div v-if="ci !== condition.length - 1"
               class="and-or">
            <div class="text"
                 @click="andOr(ci)">{{ conditionItem.andOrText.label }}</div>
          </div>
        </div>
        <el-button v-if="totalGroupLength < maxLength"
                   class="add"
                   icon="el-icon-plus"
                   @click="addItem">
          添加规则
        </el-button>
        <el-button type="primary"
                   plain
                   :loading="buttonLoading"
                   @click="check">筛选客户</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
const _ = require('lodash')

import { } from '@/api/api'
import Info from '@/components/Info'
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
    ruleOpt: {
      type: Array,
      default() {
        return []
      }
    },
    originData: {
      type: Array,
      default() {
        return []
      }
    },

    maxLength: {
      type: Number,
      default: 5
    },
    // totalLength: {
    //   type: Number,
    //   default: 0
    // },
    totalGroupLength: {
      type: Number,
      default: 0
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
    },
    buttonLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      group: [],
      stringOptions: [],
      MAX_NUMBER
    }
  },
  computed: {
    $form() {
      return this.$refs.form
    },
    id() {
      return +this.$route.query.id
    },
    rules() {
      return [{
        required: this.required, message: '请选择规则', type: 'array'
      }]
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
  },

  methods: {
    reset() {
    },
    validateNumber(rule, value, callback) {
      const index = rule.field.split('.')[1]
      if (this.condition[index].conditionValue.minVal === undefined && this.condition[index].conditionValue.maxVal === undefined) {
        callback('请填写区间的最小值或最大值')
      } else if (this.condition[index].conditionValue.minVal >= this.condition[index].conditionValue.maxVal) {
        callback('区间的最小值必须小于最大值')
      } else {
        callback()
      }
    },
    init() {
    },
    chcekNumber(index) {
      this.$refs.form.validateField(`condition.${index}.conditionValue.minVal`)
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
    delayRun(code, time) {
      var t = setTimeout(code, time)
    },
    // 数字型-非区间输入
    handleChangeNumberInput(val) {
      for (let i = val.length - 1; i >= 0; i--) {
        if (isNaN(val[i])) {
          val.splice(i, 1)
        }
      }
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
    resetOpt(optValue, conditionSelectVal) {
      if (!optValue) {
        return {
          conditionSelect: [],
          andOrText: {
            value: 1,
            label: '且'
          }
        }
      } else {
        const item = this.originData.find((n) => {
          return n.id === optValue
        })
        let conditionValue
        let conditionCompare
        let compareDefault
        if (item.type === '数值型') {
          conditionValue = {
            numberVal: null
          }
          conditionCompare = item.relations
          compareDefault = item.relations[0].value
        }
        if (item.type === '字符串型') {
          conditionValue = {
            stringVal: ''
          }
          conditionCompare = item.relations
          compareDefault = item.relations[0].value
        }
        if (item.type === '枚举型') {
          conditionValue = {
            selectVal: ''
          }
          conditionCompare = [
            {
              value: 1,
              label: '是'
            }
          ]
          compareDefault = 1
        }
        if (item.type === '日期型') {
          conditionValue = {
            dateVal: ''
          }
          conditionCompare = item.relations
          compareDefault = item.relations[0].value
        }
        if (item.type === '布尔型') {
          conditionValue = {
            booleanVal: ''
          }
          conditionCompare = [
            {
              value: 1,
              label: '请选择'
            }
          ]
          compareDefault = 1
        }
        const data = {
          // 规则选中选项的值
          conditionSelect: conditionSelectVal,
          // 规则选中的名称
          conditionLabel: item.name,
          // 类型
          type: item.type,
          // 比较符号的选项
          compareOpt: conditionCompare,
          // 比较符号的值
          compare: compareDefault,
          // 枚举型可选项
          selectOpt: item.enumCandidateList,
          // 布尔型可选项
          booleanOpt: item.booleanOpt,
          // 数字型-单位
          unit: item.unit,
          // 规则的值
          conditionValue,
          // andOrText: '且'
          andOrText: {
            value: 1,
            label: '且'
          }
        }
        return data
      }
    },

    selectCondition(val, i) {
      for (let j = 0; j < this.originData.length; j++) {
        if (this.originData[j].id === val[3]) {
          this.condition.splice(i, 1, this.resetOpt(val[3], val))
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
      this.condition[i].andOrText = this.condition[i].andOrText.label === '且' ? { value: 2, label: '或' } : { value: 1, label: '且' }
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
