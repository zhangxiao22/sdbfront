<template>
  <div class="group-container">
    <el-form ref="form"
             :model="{condition}"
             label-position="top"
             class="reg-form">
      <el-form-item required
                    class="shun-label group-label">
        <div slot="label">
          <Info content="最多设置5个规则" />
          分群规则：
        </div>
        <div v-for="(conditionItem,ci) of condition"
             :key="ci"
             class="condition-item">
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
                           :value="optItem.value" />
              </el-select>
            </el-tooltip>
          </el-form-item>
          <!-------------------------- 数字型 -------------------------->
          <template v-if="conditionItem.type==='数值型'">
            <!-- 比较符 -->
            <el-form-item :prop="'condition.' + ci + '.compare'"
                          class="item"
                          style="margin-bottom:0"
                          :rules="[{
                            required: true, message: '请选择比较方式'
                          }]">
              <el-select v-model="conditionItem.compare"
                         style="width:90px">
                <el-option v-for="item in conditionItem.compareOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
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
                              class="item"
                              style="margin-bottom:0"
                              :rules="[{
                                validator: validateNumberMin,trigger: 'blur'
                              }]">
                  <el-input-number v-model="conditionItem.conditionValue.minVal"
                                   style="width:150px;"
                                   :min="-MAX_NUMBER"
                                   :max="MAX_NUMBER"
                                   placeholder="负无穷"
                                   controls-position="right" />
                </el-form-item>

                <b class="item">,</b>
                <!-- 最大值 -->
                <el-input-number v-model="conditionItem.conditionValue.maxVal"
                                 class="item"
                                 style="width:150px;"
                                 :min="-MAX_NUMBER"
                                 :max="MAX_NUMBER"
                                 placeholder="正无穷"
                                 controls-position="right"
                                 @change="chcekNumber(ci)"
                                 @blur="chcekNumber(ci)" />
                <el-button class="item"
                           @click="conditionItem.conditionValue.rightSymbol=conditionItem.conditionValue.rightSymbol===')'?']':')'">
                  {{ conditionItem.conditionValue.rightSymbol }}</el-button>
              </template>
              <template v-else>
                <!-- 非区间 -->
                <Info class="item"
                      content="请输入数字并选择或按回车键创建，可创建多个" />
                <el-form-item :prop="'condition.' + ci + '.conditionValue.arrVal'"
                              class="item"
                              :rules="[{
                                required: true, message: '请输入值'
                              }]">
                  <el-select v-model="conditionItem.conditionValue.arrVal"
                             multiple
                             filterable
                             remote
                             allow-create
                             default-first-option
                             placeholder="请输入数字并创建条目"
                             @change="handleChangeNumberInput" />
                </el-form-item>
              </template>
              <div class="unit item">{{ conditionItem.unit }}</div>
            </div>
          </template>
          <!-- type:3 字符串型 -->
          <!-- type:4 枚举型 -->
          <template v-if="conditionItem.type==='枚举型'">
            <el-select v-model="conditionItem.conditionValue"
                       class="item"
                       placeholder="请选择">
              <el-option v-for="item of conditionItem.selectOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </template>
          <!-- type:5 日期型 -->
          <template v-if="conditionItem.type==='日期型'">
            <el-select v-model="conditionItem.compare"
                       class="item"
                       style="width:90px">
              <el-option label="包含于"
                         value="1" />
            </el-select>
            <el-date-picker v-model="conditionItem.conditionValue.startDate"
                            class="item"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="从前" />
            <div class="item">至</div>
            <el-date-picker v-model="conditionItem.conditionValue.endDate"
                            value-format="yyyy-MM-dd"
                            class="item"
                            type="date"
                            placeholder="现在" />
          </template>
          <!-- 删除按钮 -->
          <i v-if="condition.length > 1"
             class="el-icon-delete delete item"
             @click="delconditionItem(ci)" />
          <div v-if="ci!==condition.length-1"
               class="and-or">
            <div class="text"
                 @click="andOr(ci)">{{ conditionItem.andOrText }}</div>
          </div>
        </div>
        <el-button v-if="condition.length<=4"
                   class="add"
                   icon="el-icon-plus"
                   @click="addItem">
          添加规则
        </el-button>
      </el-form-item>
    </el-form>
    <el-button @click="check">check</el-button>
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

  },
  data() {
    return {
      MAX_NUMBER,
      originData: [],
      condition: [],
      rules: {},
      numberFlat: {}
    }
  },
  computed: {
    tags() {
      return this.originData.map((n) => {
        return {
          label: n.name,
          value: n.id
        }
      })
    }
  },
  watch: {

  },
  created() {
    // this.tagsInit(0, 0)
    this.getRuleList()
  },

  methods: {
    validateNumberMin(rule, value, callback) {
      const index = rule.field.split('.')[1]
      this.numberFlat[index] = false
      if (this.condition[index].conditionValue.minVal === undefined && this.condition[index].conditionValue.maxVal === undefined) {
        callback('请填写最小值或最大值')
      } else if (this.condition[index].conditionValue.minVal >= this.condition[index].conditionValue.maxVal) {
        callback('最小值须小于最大值')
      } else {
        // this.$refs.form.clearValidate(`condition.${index}.conditionValue.minVal`)
        callback()
      }
    },
    chcekNumber(index) {
      console.log(index)
      this.$refs.form.validateField(`condition.${index}.conditionValue.minVal`)
    },
    // validateNumberMax(rule, value, callback) {
    //   const index = rule.field.split('.')[1]
    //   if (this.condition[index].conditionValue.minVal === undefined && this.condition[index].conditionValue.maxVal === undefined) {
    //     callback('请填写最小值或最大值')
    //   } else if (this.condition[index].conditionValue.minVal >= this.condition[index].conditionValue.maxVal) {
    //     callback('最大值必须大于最小值')
    //   } else {
    //     this.$refs.form.clearValidate(`condition.${index}.conditionValue.minVal`)
    //     callback()
    //   }
    // },
    check() {
      this.$refs.form.validate((valid) => {
        console.log(valid)
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
            arrVal: [],
            // 区间值 objs
            leftSymbol: '(',
            minVal: undefined,
            maxVal: undefined,
            rightSymbol: ')'
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
          compare: '',
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
    },
    delconditionItem(i) {
      this.condition.splice(i, 1)
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
    .item-box {
      max-width: 100%;
      display: flex;
    }
    .item {
      margin: 0 10px 18px 0;
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
