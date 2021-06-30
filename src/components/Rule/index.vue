<template>
  <div class="rule-container">
    <!-- {{ condition }} -->
    <!-- <el-dropdown @command="handelAddRuleBox">
      <el-button class="main-add"
                 icon="el-icon-plus">
        添加规则<i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="attribute">用户属性</el-dropdown-item>
        <el-dropdown-item command="action">用户行为</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <el-button class="main-add"
               icon="el-icon-plus"
               @click="handelAddRuleBox">
      添加规则
    </el-button>
    <el-form ref="form"
             :model="{conditionList: condition.list}"
             label-position="top"
             class="rule-box">
      <div v-for="(pitem,pi) of condition.list"
           :key="pi"
           :class="{last:pi===condition.list.length-1}"
           class="rule-item-box">
        <div v-for="(conditionItem,i) of pitem.list"
             :key="i"
             class="condition-item"
             :class="{two:pitem.list.length > 1,one:condition.list.length > 1}">
          <!-- 标签选择 -->
          <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionSelect'"
                        class="item"
                        :rules="[{
                          required: true, message: '请选择规则标签',trigger:'change'
                        }]">
            <el-tooltip :content="conditionItem.conditionLabel||'请选择'"
                        placement="left">
              <el-cascader v-model="conditionItem.conditionSelect"
                           filterable
                           style="width:200px"
                           :show-all-levels="false"
                           :options="ruleOpt"
                           @change="selectCondition($event,conditionItem)">
                <template slot-scope="{ node, data }">
                  <svg-icon v-if="node.isLeaf"
                            style="margin-right:5px;"
                            :icon-class="data.type" />
                  <span>{{ data.label }}</span>
                </template>
              </el-cascader>
            </el-tooltip>
          </el-form-item>
          <!-- 比较符 -->
          <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.compare'"
                        class="item"
                        :rules="[{
                          required: true, message: '请选择比较方式', trigger:'change'
                        }]">
            <el-select v-model="conditionItem.compare"
                       placeholder="请选择比较方式"
                       style="width:150px"
                       @change="handleChangeCompare(conditionItem)">
              <el-option v-for="item in conditionItem.compareOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- {{ conditionItem.conditionValue }} -->
          <!-- {{ conditionItem.extraCompare }} -->
          <!-------------------------- 数字型 -------------------------->
          <template v-if="conditionItem.type==='number'">
            <!-- 等于||不等于 -->
            <template v-if="conditionItem.compare==='equal'||conditionItem.compare==='notEqual'">
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue'"
                            class="item"
                            :rules="[{
                              required: true, message: '请输入值',trigger: 'change'
                            }]">
                <el-select v-model="conditionItem.conditionValue"
                           class="long-text"
                           multiple
                           filterable
                           remote
                           allow-create
                           default-first-option
                           placeholder="请输入数字并创建条目"
                           @change="handleChangeNumberInput" />
              </el-form-item>
              <Info class="middle-line"
                    content="请输入关键字并选择或按回车创建" />
            </template>
            <!-- 小于||大于 -->
            <template v-else-if="conditionItem.compare==='less'||conditionItem.compare==='greater'">
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue.0'"
                            class="item"
                            :rules="[{
                              required: true, message: '请输入值',trigger: 'blur'
                            }]">
                <el-input-number v-model="conditionItem.conditionValue[0]"
                                 style="width:150px;"
                                 :min="-MAX_NUMBER"
                                 :max="MAX_NUMBER"
                                 controls-position="right" />
              </el-form-item>
            </template>
            <!-- 区间 -->
            <template v-else-if="conditionItem.compare==='between'">
              <el-form-item class="item"
                            :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue'"
                            :rules="[{
                              validator: validateNumber,trigger: 'blur'
                            }]">
                <!-- 最小值 -->
                <el-input-number v-model="conditionItem.conditionValue[0]"
                                 style="width:150px;"
                                 class="item"
                                 :min="-MAX_NUMBER"
                                 :max="MAX_NUMBER"
                                 placeholder="起始值"
                                 controls-position="right" />
                <span class="item">于</span>
                <!-- 最大值 -->
                <el-input-number v-model="conditionItem.conditionValue[1]"
                                 class="item"
                                 style="width:150px;"
                                 :min="-MAX_NUMBER"
                                 :max="MAX_NUMBER"
                                 placeholder="结束值"
                                 controls-position="right" />
                <span>之间</span>
              </el-form-item>
              <Info class="middle-line"
                    content="区间包含起始和结束值" />
            </template>
          </template>
          <!-------------------------- 字符串型 -------------------------->
          <template v-if="conditionItem.type==='string'">
            <!-- 等于||不等于 -->
            <template v-if="conditionItem.compare==='equal'||conditionItem.compare==='notEqual'">
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue'"
                            class="item"
                            :rules="[{
                              required: true, message: '请输入内容',trigger: 'change'
                            }]">
                <el-select v-model="conditionItem.conditionValue"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           placeholder="请选择文章标签">
                  <el-option v-for="item in conditionItem.options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <Info style="line-height:32px;"
                    content="提示选项为最近7天的属性关键词（最多展示 20 条），非所有关键词。可直接输入关键词，回车完成。" />
            </template>
            <!-- 包含||不包含 -->
            <template v-if="conditionItem.compare==='contain'||conditionItem.compare==='notContain'">
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue[0]'"
                            :rules="[{
                              required: true, message: '请输入内容',trigger: 'blur'
                            }]">
                <el-input v-model="conditionItem.conditionValue[0]"
                          placeholder="请输入内容"
                          clearable />
              </el-form-item>
            </template>
          </template>
          <!-------------------------- 布尔型 -------------------------->
          <template v-if="conditionItem.type==='boolean'" />
          <!-------------------------- 日期型 -------------------------->
          <template v-if="conditionItem.type==='date'">
            <!-- 绝对时间 -->
            <template v-if="conditionItem.compare==='absolute'">
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.extraCompare.0'"
                            class="item"
                            :rules="[{
                              required: true, message: '请选择', trigger:'change'
                            }]">
                <el-select v-model="conditionItem.extraCompare[0]"
                           style="width:100px">
                  <el-option v-for="item in dateOptions.absolute"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <template v-if="conditionItem.extraCompare[0]">
                <!-- 绝对时间 - 区间 -->
                <el-form-item v-if="conditionItem.extraCompare[0]==='between'"
                              class="item"
                              :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue'"
                              :rules="[{
                                validator: validateAbsoluteBetween, trigger:'change'
                              }]">
                  <span class="item middle-line">在</span>
                  <el-date-picker v-model="conditionItem.conditionValue[0]"
                                  class="item"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  type="datetime"
                                  placeholder="请选择起始日期时间"
                                  default-time="00:00:00" />
                  <span class="item middle-line">到</span>
                  <el-date-picker v-model="conditionItem.conditionValue[1]"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  type="datetime"
                                  class="item"
                                  placeholder="请选择结束日期时间"
                                  default-time="00:00:00" />
                  <span class="item middle-line">之间</span>
                  <Info class="middle-line"
                        content="区间包含起始和结束时间" />
                </el-form-item>
                <!-- 绝对时间 - 非区间 -->
                <el-form-item v-else
                              :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue.0'"
                              class="item"
                              :rules="[{
                                required: true, message: '请选择日期时间', trigger:'change'
                              }]">
                  <el-date-picker v-model="conditionItem.conditionValue[0]"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  type="datetime"
                                  placeholder="请选择日期时间"
                                  default-time="00:00:00" />
                </el-form-item>

              </template>
            </template>
            <!-- 相对当前时间点 -->
            <template v-if="conditionItem.compare==='relative'">
              <span class="item middle-line">在</span>
              <!-- 过去、未来 -->
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.extraCompare.0'"
                            class="item"
                            :rules="[{
                              required: true, message: '请选择', trigger:'change'
                            }]">
                <el-select v-model="conditionItem.extraCompare[0]"
                           style="width:100px"
                           @change="conditionItem.extraCompare.splice(1,1,null)">
                  <el-option v-for="item in dateOptions.relative"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <!-- 天数 -->
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue.0'"
                            class="item"
                            :rules="[{
                              required: true, message: '请填写', trigger:'blur'
                            }]">
                <el-input-number v-model="conditionItem.conditionValue[0]"
                                 style="width:100px;"
                                 :min="1"
                                 :max="MAX_NUMBER"
                                 step-strictly
                                 controls-position="right" />
              </el-form-item>
              <span class="item middle-line">天</span>
              <!-- 之内、之前、之后 -->
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.extraCompare.1'"
                            class="item"
                            :rules="[{
                              required: true, message: '请选择', trigger:'change'
                            }]">
                <el-select v-model="conditionItem.extraCompare[1]"
                           style="width:100px">
                  <el-option v-for="item in getDateRelativeOpts(conditionItem.extraCompare[0])"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <Info class="middle-line"
                    content="时间范围：xxxx-xx-xx 至 xxxx-xx-xx 包含开始和结束时间" />
            </template>
            <!-- 相对当前时间区间 -->
            <div v-if="conditionItem.compare==='relativeBetween'"
                 style="display:flex;width:100%;">
              <span class="item middle-line">在</span>
              <!-- 过去、未来 -->
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.extraCompare.0'"
                            class="item"
                            :rules="[{
                              required: true, message: '请选择', trigger:'change'
                            }]">
                <el-select v-model="conditionItem.extraCompare[0]"
                           style="width:100px">
                  <el-option v-for="item in dateOptions.relative"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item :prop="'conditionList.' + pi + '.list.' + i + '.conditionValue'"
                            :rules="[{
                              validator: validateRelativeBetween, trigger:'change'
                            }]">
                <!-- 天数 -->
                <el-input-number v-model="conditionItem.conditionValue[0]"
                                 class="item"
                                 style="width:100px;"
                                 :min="1"
                                 :max="MAX_NUMBER"
                                 step-strictly
                                 controls-position="right" />
                <span class="item middle-line">天</span>
                <span class="item middle-line">至</span>
                <!-- 过去、未来 -->
                <span class="item middle-line">{{ dateText(conditionItem.extraCompare[0]) }}</span>
                <el-input-number v-model="conditionItem.conditionValue[1]"
                                 style="width:100px;"
                                 class="item"
                                 :min="1"
                                 :max="MAX_NUMBER"
                                 step-strictly
                                 controls-position="right" />
                <span class="item middle-line">天</span>
                <span class="item middle-line">之内</span>
              </el-form-item>
            </div>
          </template>
          <!-- 按钮 -->
          <i v-if="condition.list.length"
             class="el-icon-close rule-delete"
             @click="delRuleItem(pi,i)" />
        </div>
        <div v-if="pitem.list.length > 1"
             class="and-or inside">
          <div class="text"
               @click="checkRelation(pitem)">{{ pitem.relation ? '且' : '或' }}</div>
        </div>
        <el-button class="add-rule btn-item"
                   @click="addRuleItem(pi)">添加</el-button>
      </div>
      <div v-if="condition.list.length > 1"
           class="and-or root">
        <div class="text"
             @click="checkRelation(condition)">{{ condition.relation ? '且' : '或' }}</div>
      </div>
    </el-form>
  </div>
</template>

<script>
// const _ = require('lodash')

import { ruleTag } from '@/api/api'
import { MAX_NUMBER } from '@/utils'
import Info from '@/components/Info'

const DEFAULT_CONDITION = {
  list: [],
  relation: true /* true: and; false: or*/
}
export default {
  components: {
    Info
  },
  props: {
    ruleOpt: {
      type: Array,
      default() {
        return []
      }
    },
    originData: {
      type: Object,
      default() {
        return {}
      }
    },
    buttonLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      condition: DEFAULT_CONDITION,
      group: [],
      stringOptions: [],
      MAX_NUMBER,
      defaultObj: {
        conditionSelect: [],
        compare: null,
        extraCompare: [],
        type: null,
        compareOpt: [],
        conditionValue: []
      },
      relations: [{
        type: 'number',
        options: [{
          label: '等于',
          value: 'equal'
        }, {
          label: '不等于',
          value: 'notEqual'
        }, {
          label: '小于',
          value: 'less'
        }, {
          label: '大于',
          value: 'greater'
        }, {
          label: '区间',
          value: 'between'
        }, {
          label: '有值',
          value: 'isSet'
        }, {
          label: '没值',
          value: 'notSet'
        }]
      },
      {
        type: 'string',
        options: [{
          label: '等于',
          value: 'equal'
        }, {
          label: '不等于',
          value: 'notEqual'
        }, {
          label: '包含',
          value: 'contain'
        }, {
          label: '不包含',
          value: 'notContain'
        }, {
          label: '有值',
          value: 'isSet'
        }, {
          label: '没值',
          value: 'notSet'
        }]
      },
      {
        type: 'boolean',
        options: [{
          label: '为真',
          value: 'isTrue'
        }, {
          label: '为假',
          value: 'isFalse'
        }, {
          label: '有值',
          value: 'isSet'
        }, {
          label: '没值',
          value: 'notSet'
        }]
      },
      {
        type: 'date',
        options: [{
          label: '绝对时间',
          value: 'absolute'
        }, {
          label: '相对当前时间点',
          value: 'relative'
        }, {
          label: '相对当前时间区间',
          value: 'relativeBetween'
        }, {
          label: '有值',
          value: 'isSet'
        }, {
          label: '没值',
          value: 'notSet'
        }]
      }],
      dateOptions: {
        absolute: [{
          label: '=',
          value: 'equal'
        }, {
          label: '≠',
          value: 'notEqual'
        }, {
          label: '<',
          value: 'less'
        }, {
          label: '≤',
          value: 'most'
        }, {
          label: '>',
          value: 'greater'
        }, {
          label: '≥',
          value: 'least'
        }, {
          label: '区间',
          value: 'between'
        }],
        relative: [{
          label: '过去',
          value: 'past',
          opt: [{
            label: '之内',
            value: 'within'
          }, {
            label: '之前',
            value: 'before'
          }]
        }, {
          label: '未来',
          value: 'future',
          opt: [{
            label: '之内',
            value: 'within'
          }, {
            label: '之后',
            value: 'after'
          }]
        }]
      }
      // ruleOpt: [
      // {
      //   label: '1111',
      //   value: '1111',
      //   children: [{
      //     label: '数字',
      //     value: '数字',
      //     type: 'number'
      //   }, {
      //     label: '字符串',
      //     value: '字符串',
      //     type: 'string',
      //     options: [{
      //       label: 'aaa',
      //       value: 'aaa'
      //     }, {
      //       label: 'bbb',
      //       value: 'bbb'
      //     }, {
      //       label: 'ccc',
      //       value: 'ccc'
      //     }]
      //   }, {
      //     label: '布尔',
      //     value: '布尔',
      //     type: 'boolean'
      //   }, {
      //     label: '日期',
      //     value: '日期',
      //     type: 'date'
      //   }]
      // }
      // ]
    }
  },
  computed: {
    // 取值
    finalData() {
      return {
        list: this.condition.list.map(pitem => {
          return {
            list: pitem.list.map(item => {
              return {
                tagId: item.conditionSelect,
                compare: [item.compare, ...item.extraCompare].join('_'),
                params: item.conditionValue
              }
            }),
            relation: pitem.relation ? 'and' : 'or'
          }
        }),
        relation: this.condition.relation ? 'and' : 'or'
      }
    },
    getDateRelativeOpts() {
      return function (val) {
        return val ? this.dateOptions.relative.find(n => n.value === val).opt : []
      }
    },
    dateText() {
      return function (val) {
        return val ? this.dateOptions.relative.find(n => n.value === val).label : ''
      }
    }
  },
  watch: {
    originData(nval, oval) {
      // console.log('nval?????', nval)
      // console.log(this.condition)
      const data = Object.assign({}, DEFAULT_CONDITION, nval)
      // console.log(data.list)
      this.condition = {
        list: data.list.map(a => {
          return {
            list: a.list.map(b => {
              // console.log('b,', b)
              const [compare, ...extraCompare] = b.compare.split('_')
              const leafItem = this.findLeaf(b.tagId)
              // console.log('leafItem', leafItem)
              const compareOpt = this.relations.find(n => {
                return n.type === leafItem.type
              }).options
              return {
                conditionSelect: b.tagId,
                compare,
                extraCompare,
                type: leafItem.type,
                compareOpt: compareOpt,
                conditionValue: b.params,
                options: leafItem.options
              }
            }),
            relation: a.relation === 'and'
          }
        }),
        relation: data.relation === 'and'
      }
    }
  },
  mounted() {
  },
  created() {
    // this.getRuleTags()
  },

  methods: {
    // 数字区间
    validateNumber(rule, value, callback) {
      const [min, max] = value
      if (min === undefined && max === undefined) {
        callback('请选择区间的起始值或结束值')
      } else if (min >= max) {
        callback('区间的起始值必须小于结束值')
      } else {
        callback()
      }
    },
    // 绝对日期区间
    validateAbsoluteBetween(rule, value, callback) {
      const [startDate, endDate] = value
      if (!startDate || !endDate) {
        callback('请选择区间的起始日期时间和结束日期时间')
      } else if (startDate >= endDate) {
        callback('区间的起始日期时间必须早于结束日期时间')
      } else {
        callback()
      }
    },
    // 相对当前时间区间
    validateRelativeBetween(rule, value, callback) {
      const [startDay, endDay] = value
      if (!startDay || !endDay) {
        callback('请选择区间的起始天数和结束天数')
      } else if (startDay >= endDay) {
        callback('区间的起始天数必须小于结束天数')
      } else {
        callback()
      }
    },
    validate(cb) {
      this.$refs.form.validate((valid) => {
        cb(valid)
      })
    },
    // 获取总数据
    getData() {
      return this.condition
    },
    // 数字型-非区间输入
    handleChangeNumberInput(val) {
      for (let i = val.length - 1; i >= 0; i--) {
        if (isNaN(val[i])) {
          val.splice(i, 1)
        }
      }
    },
    // 获取标签
    // getRuleTags() {
    //   ruleTag().then(res => {
    //     this.ruleOpt = res.data
    //   })
    // },
    getCompareOpt(type) {
      return this.relations.find(n => {
        return n.type === type
      }).options
    },
    /**
     * 通过值找到叶子节点数据
     * val : 及联选择的值，如：[1,2,3]
     */
    findLeaf(val) {
      let obj
      for (let i = 0; i < val.length; i++) {
        const temp = i === 0 ? this.ruleOpt : obj.children
        obj = temp.find(n => n.value === val[i])
      }
      return obj
    },
    selectCondition(val, item) {
      const type = this.findLeaf(val).type
      item.type = type
      item.compareOpt = this.getCompareOpt(type)
      item.compare = null
      item.extraCompare = []
      item.conditionValue = []
      item.options = this.findLeaf(val).options || []
    },
    handleChangeCompare(item) {
      item.conditionValue = []
      item.extraCompare = []
    },
    // 添加规则（总）
    handelAddRuleBox(val) {
      // console.log(val)
      // if (val === 'attribute') {
      this.condition.list.push({
        list: [JSON.parse(JSON.stringify(this.defaultObj))],
        relation: true
      })
      // } else if (val === 'action') {

      // }
    },
    // 添加规则（子）
    addRuleItem(pi) {
      this.condition.list[pi].list.push(JSON.parse(JSON.stringify(this.defaultObj)))
    },
    // 删除规则（子）
    delRuleItem(pi, i) {
      this.condition.list[pi].list.splice(i, 1)
      if (this.condition.list[pi].list.length === 0) {
        this.condition.list.splice(pi, 1)
      }
    },
    // 且或切换
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
    margin-top: 20px;
    .rule-item-box {
      // border: 1px solid;
      margin-bottom: 15px;
      position: relative;
      &.last {
        margin-bottom: 0;
      }
      .condition-item {
        position: relative;
        margin-left: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        transition: margin 0.1s;
        padding-right: 90px;
        // margin-bottom: 10px;
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
        .middle-line {
          line-height: 32px;
        }
        .rule-delete {
          position: absolute;
          right: 0;
          top: 4px;
          font-size: 18px;
          color: $red;
          margin-left: 10px;
          cursor: pointer;
          width: 25px;
          height: 25px;
          @include center-center;

          &:hover {
            opacity: 0.8;
          }
        }
      }
      .add-rule {
        position: absolute;
        top: 4px;
        right: 35px;
        // font-size: 11px;
        // color: $blue;
        cursor: pointer;
        font-size: 10px;
        height: 24px;
        width: 46px;
        line-height: 22px;
        padding: 0;
        // transform: translateY(-50%);
      }
    }
    .and-or {
      position: absolute;
      top: 0;
      bottom: 18px;
      left: 40px;
      @include center-center;
      &.root {
        left: 0;
        .text {
          // background: #eee;
        }
      }
      &.inside {
        .text {
          position: relative;
          z-index: 2;
          width: 22px;
          height: 22px;
          background: #fff;
          @include center-center;
          cursor: pointer;
          color: $blue;
          font-weight: bold;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          font-size: 12px;
        }
        &::before {
          border-left-width: 1px;
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
        border-left: 2px solid #dcdfe6;
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
