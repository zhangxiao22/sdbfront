<template>
  <div class="rule-container">
    {{ condition }}
    <el-button class="main-add"
               icon="el-icon-plus"
               @click="addRuleBox">
      添加规则
    </el-button>
    <div class="rule-box">
      <div v-for="(pitem,pi) of condition.list"
           :key="pi"
           class="rule-item-box">
        <div v-for="(conditionItem,i) of pitem.list"
             :key="i"
             class="condition-item"
             :class="{two:pitem.list.length > 1,one:condition.list.length > 1}">
          <!-- 标签选择 -->
          <el-tooltip :content="conditionItem.conditionLabel||'请选择'"
                      placement="left">
            <el-cascader v-model="conditionItem.conditionSelect"
                         class="item"
                         filterable
                         :show-all-levels="false"
                         :options="ruleOpt"
                         @change="selectCondition($event,ci)" />
          </el-tooltip>
          <!-- 比较符 -->
          <el-select v-model="conditionItem.compare"
                     class="item"
                     style="width:90px">
            <el-option v-for="item in conditionItem.compareOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
          <!-------------------------- 数字型 -------------------------->
          <template v-if="conditionItem.type==='数值型'">
            <el-form-item class="item">
              <el-input-number v-model="conditionItem.conditionValue.numberVal"
                               controls-position="right"
                               @change="handleChangeNumberInput" />
            </el-form-item>
          </template>
          <!-------------------------- 字符串型 -------------------------->
          <template v-if="conditionItem.type==='字符串型'">
            <el-form-item class="item">
              <el-input v-model.trim="conditionItem.conditionValue.stringVal"
                        placeholder="请填写" />
            </el-form-item>
          </template>

          <!-------------------------- 枚举型 -------------------------->
          <template v-if="conditionItem.type==='枚举型'">
            <el-form-item class="item">
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
            <el-form-item class="item">
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
            <el-form-item class="item">
              <el-date-picker v-model="conditionItem.conditionValue.dateVal"
                              class="item mb-0"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="请填写" />
            </el-form-item>
          </template>
          <!-- 按钮 -->
          <i v-if="condition.list.length"
             class="el-icon-close rule-delete"
             @click="delRuleItem(pi,i)" />
        </div>
        <div v-if="pitem.list.length > 1"
             class="and-or inside">
          <div class="text"
               @click="checkrRelation(pitem)">{{ pitem.relation ? '且' : '或' }}</div>
        </div>
        <el-button class="add-rule btn-item"
                   @click="addRuleItem(pi)">添加</el-button>
      </div>
      <div v-if="condition.list.length > 1"
           class="and-or root">
        <div class="text"
             @click="checkRelation(condition)">{{ condition.relation ? '且' : '或' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const _ = require('lodash')

import { } from '@/api/api'
import { MAX_NUMBER } from '@/utils'

export default {
  components: {
    // Info
  },
  props: {
    condition: {
      type: Object,
      default() {
        return {
          list: [],
          relation: true /* true: and; false: or*/
        }
      }
    },
    originData: {
      type: Array,
      default() {
        return []
      }
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
      MAX_NUMBER,
      ruleOpt: [{
        label: '1111',
        value: '1111',
        children: [{
          label: '字符串',
          value: '字符串',
          type: 'string'
        }, {
          label: '数字',
          value: '数字',
          type: 'number'
        }]
      }]
    }
  },
  computed: {
    firstRuleOption() {
      return [this.ruleOpt[0].value, this.ruleOpt[0].children[0].value]
    }
    // rules() {
    //   return [{
    //     required: this.required, message: '请选择规则', type: 'array'
    //   }]
    // }
  },
  watch: {
  },
  mounted() {
  },
  created() {
  },

  methods: {
    // validateNumber(rule, value, callback) {
    //   const index = rule.field.split('.')[1]
    //   if (this.condition[index].conditionValue.minVal === undefined && this.condition[index].conditionValue.maxVal === undefined) {
    //     callback('请填写区间的最小值或最大值')
    //   } else if (this.condition[index].conditionValue.minVal >= this.condition[index].conditionValue.maxVal) {
    //     callback('区间的最小值必须小于最大值')
    //   } else {
    //     callback()
    //   }
    // },

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
          conditionSelect: []
          // andOrText: {
          //   value: 1,
          //   label: '且'
          // }
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
      // for (let j = 0; j < this.originData.length; j++) {
      //   if (this.originData[j].id === val[3]) {
      //     this.condition.splice(i, 1, this.resetOpt(val[3], val))
      //     break
      //   }
      // }
    },
    // 添加规则（总）
    addRuleBox() {
      this.condition.list.push({
        list: [{
          list: [],
          relation: true
        }],
        relation: true
      })
    },
    // 添加规则（子）
    addRuleItem(pi) {
      this.condition.list[pi].list.push({
        list: []
        // relation: true
      })
    },
    // 删除规则（子）
    delRuleItem(pi, i) {
      this.condition.list[pi].list.splice(i, 1)
      if (this.condition.list[pi].list.length === 0) {
        this.condition.list.splice(pi, 1)
      }
    },
    checkRelation(item) {
      item.relation = !item.relation
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.rule-container {
  .rule-box {
    position: relative;
    .rule-item-box {
      // border: 1px solid;
      margin-bottom: 30px;
      position: relative;
      .condition-item {
        position: relative;
        margin-left: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        transition: margin 0.3s;
        margin-bottom: 10px;
        &.one {
          margin-left: 35px;
        }
        &.two {
          margin-left: 70px;
        }
        .item-box {
          max-width: 100%;
          display: flex;
          align-items: flex-start;
        }
        .item {
          margin-right: 10px;

          .unit {
            display: inline-block;
          }
        }
        .rule-delete {
          position: absolute;
          right: 0;
          top: 50%;
          font-size: 18px;
          color: $red;
          margin-left: 10px;
          cursor: pointer;
          width: 25px;
          height: 25px;
          transform: translateY(-50%);
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .add-rule {
        position: absolute;
        top: 3px;
        right: 35px;
        // font-size: 11px;
        // color: $blue;
        cursor: pointer;
        font-size: 10px;
        height: 24px;
        width: 46px;
        line-height: 24px;
        padding: 0;
        // transform: translateY(-50%);

        // width: 25px;
        // height: 25px;
        // &:hover {
        //   opacity: 0.8;
        // }
      }
    }
    .and-or {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 40px;
      @include center-center;
      &.root {
        left: 0;
        .text {
          background: #eee;
        }
      }
      &.inside {
        .text {
          position: relative;
          z-index: 2;
          width: 20px;
          height: 20px;
          background: #fff;
          @include center-center;
          cursor: pointer;
          color: $blue;
          font-weight: bold;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          font-size: 12px;
        }
      }
      .text {
        position: relative;
        z-index: 2;
        width: 25px;
        height: 25px;
        background: #fff;
        @include center-center;
        cursor: pointer;
        color: $blue;
        font-weight: bold;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        &:hover {
          color: #597cd6;
        }
      }
      &::before {
        position: absolute;
        content: "";
        width: 0;
        border-left: 2px dashed #dcdfe6;
        // background: #dcdfe6;
        top: 0;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
      // &::after {
      //   position: absolute;
      //   content: "";
      //   width: 0;
      //   height: 0;
      //   border-width: 5px;
      //   border-style: solid;
      //   border-color: #d3d9e9 transparent transparent transparent;
      //   bottom: -8px;
      //   left: auto;
      // }
    }
  }
}
</style>
