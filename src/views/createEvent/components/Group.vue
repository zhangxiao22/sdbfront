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
          <!-- {{ ci }}  -->
          <!-- {{ conditionItem.conditionSelect }} -->
          <el-form-item :prop="'condition.' + ci + '.conditionSelect'"
                        class="item"
                        :rules="[{
                          required: true, message: '请选择规则标签',trigger:'change'
                        }]">
            <el-tooltip :content="conditionItem.conditionLabel||'请选择'"
                        placement="left">
              <!-- <el-select v-model="conditionItem.conditionSelect"
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
                {{ tags }}
              </el-select> -->

              <el-cascader v-model="conditionItem.conditionSelect"
                           filterable
                           :show-all-levels="false"
                           :options="tags"
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
              <el-input v-model="conditionItem.conditionValue.stringVal"
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
import { getCustomerLabel, getPeopleCount, getGroup } from '@/api/api'
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
    totalDetail: {
      type: Array,
      default() {
        return []
      }
    },
    groupDetail: {
      type: Array,
      default() {
        return []
      }
    },

    maxLength: {
      type: Number,
      default: 5
    },
    minLength: {
      type: Number,
      default: 1
    },
    valDetail: {
      type: Array,
      default() {
        return []
      }
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
      // condition: [],
      group: [],
      groupAll: [],
      // totalDetail: [],
      // groupDetail: [],
      totalCondition: [],
      groupCondition: [],
      numberOptions: [],
      stringOptions: [],
      MAX_NUMBER,
      originData: [],
      numberFlat: {}
      // totalPeople: 0
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    },
    tags() {
      return this.originData.map((n) => {
        return {
          label: n.tagCtgryNm,
          value: n.id,
          children: [{
            label: n.tagScdClNm,
            value: n.id,
            children: [{
              label: n.name,
              value: n.id
            }]
          }
          ]
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
  mounted() {
    // console.log('parent', this.$parent.$parent)
    this.getRuleList().then(() => {
      setTimeout(() => {
        console.log('abcddddd', this.valDetail)
        // this.delayRun(this.getTagId(), 1000)
        this.delayRun(this.getAllData(), 1000)
      }, 300)
    })
  },
  created() {
    // this.tagsInit(0, 0)
    // console.log('parent', this.$parent.$parent)
    // this.getRuleList().then(() => {
    //   console.log('abcddddd', this.totalDetail)
    //   this.delayRun(this.getTagId(), 2000)
    // })
    // this.getRuleList()
  },

  methods: {
    reset() {
      // console.log('aaaaa')
      // this.$parent.getDetail()
    },
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
    init() {
    },
    chcekNumber(index) {
      this.$refs.form.validateField(`condition.${index}.conditionValue.minVal`)
    },
    // validateDate(rule, value, callback) {
    //   const index = rule.field.split('.')[1]
    //   if (!this.condition[index].conditionValue.startDate && !this.condition[index].conditionValue.endDate) {
    //     callback('请选择开始时间或结束时间')
    //   } else if (this.condition[index].conditionValue.startDate &&
    //     this.condition[index].conditionValue.endDate &&
    //     this.condition[index].conditionValue.startDate >= this.condition[index].conditionValue.endDate) {
    //     callback('开始时间不能早于结束时间')
    //   } else {
    //     callback()
    //   }
    // },
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
      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     this.$emit('check', this.transfer())
      //     this.filter()
      //   }
      // })
    },
    // 获取页面规则信息
    getTagId() {
      if (this.totalDetail) {
        let vals = []
        for (let i = 0; i < this.totalDetail.length; i++) {
          vals = [this.totalDetail[i], this.totalDetail[i], this.totalDetail[i]]
          this.condition.splice(i, 1, this.resetOpt(this.totalDetail[i], vals))
        }
      }
      // if (this.groupDetail) {
      //   let groupVals = []
      //   for (let i = 0; i < this.groupDetail.length; i++) {
      //     groupVals = [this.groupDetail[i], this.groupDetail[i], this.groupDetail[i]]
      //     this.condition.splice(i, 1, this.resetOpt(this.groupDetail[i], groupVals))
      //   }
      // }
    },
    getAllData() {
      if (this.totalDetail) {
        let vals = []
        for (let i = 0; i < this.totalDetail.length; i++) {
          vals = [this.totalDetail[i], this.totalDetail[i], this.totalDetail[i]]
          this.condition.splice(i, 1, this.setOpt(this.totalDetail[i], vals, this.valDetail[i]))
        }
      }
    },
    delayRun(code, time) {
      var t = setTimeout(code, time)
    },
    getRuleList() {
      return new Promise((resolve, reject) => {
        getCustomerLabel().then(res => {
          this.originData = res.data
          resolve()
        })
      })
    },
    // 数字型-非区间输入
    handleChangeNumberInput(val) {
      for (let i = val.length - 1; i >= 0; i--) {
        if (isNaN(val[i])) {
          val.splice(i, 1)
        }
      }
      // console.log(val)
      // this.numberOptions = val.map(n => {
      //   return {
      //     value: n,
      //     label: n
      //   }
      // })
    },
    handleChangeStringInput(val) {
      this.stringOptions = val.map(n => {
        return {
          value: n,
          label: n
        }
      })
    },

    setOpt(optValue, conditionSelectVal, valDetail) {
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
        if (item.type === '数值型') {
          conditionValue = {
            numberVal: valDetail[0].content
          }
        }
        if (item.type === '字符串型') {
          conditionValue = {
            stringVal: valDetail[0].content
          }
        }
        if (item.type === '枚举型') {
          conditionValue = {
            selectVal: valDetail[0].content.value
          }
        }
        if (item.type === '日期型') {
          conditionValue = {
            dateVal: valDetail[0].content
          }
        }
        const data = {
          // 规则选中选项的值
          conditionSelect: conditionSelectVal,
          // 规则选中的名称
          conditionLabel: item.name,
          // 类型
          type: item.type,
          // 比较符号的选项
          compareOpt: item.relations,
          // 比较符号的值
          compare: valDetail[0].compare.value,
          // 枚举型可选项
          selectOpt: item.enumCandidateList,
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
        if (item.type === '数值型') {
          conditionValue = {
            numberVal: null
          }
        }
        if (item.type === '字符串型') {
          conditionValue = {
            stringVal: ''
          }
        }
        if (item.type === '枚举型') {
          conditionValue = {
            selectVal: ''
          }
        }
        if (item.type === '日期型') {
          conditionValue = {
            dateVal: ''
          }
        }
        const data = {
          // 规则选中选项的值
          conditionSelect: conditionSelectVal,
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

    tagsInit(ci, optValue) {
      /**
       * ci: condition的index
         optValue: 选项的值
       */
      this.condition.splice(ci, 1, this.resetOpt(optValue))
    },
    selectCondition(val, i) {
      console.log(val[2], 'i===========', i)
      for (let j = 0; j < this.tags.length; j++) {
        if (this.tags[j].value === val[2]) {
          this.condition.splice(i, 1, this.resetOpt(val[2], val))
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
      // this.condition[i].andOrText = this.condition[i].andOrText === '且' ? '或' : '且'
      this.condition[i].andOrText = this.condition[i].andOrText.label === '且' ? { value: 2, label: '或' } : { value: 1, label: '且' }
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
