<template>
  <div class="group-container">
    <el-form ref="form"
             :rules="rules"
             label-width="110px"
             class="reg-form">
      <el-form-item required
                    class="shun-label">
        <div slot="label">
          <Info content="最多设置5个规则" />
          分群规则：
        </div>
        <el-form-item v-for="(conditionItem,i) of condition"
                      :key="i"
                      class="condition-item">
          <el-tooltip :content="conditionItem.conditionLabel||'请选择'"
                      placement="left">
            <el-select v-model="conditionItem.conditionSelect"
                       filterable
                       class="condition-item-input item"
                       @change="selectCondition($event,i)">
              <el-option v-for="optItem of tags"
                         :key="optItem.value"
                         :label="optItem.label"
                         :value="optItem.value" />
            </el-select>
          </el-tooltip>

          <!-- type:1 数字型 -->
          <template v-if="conditionItem.type===1">
            <el-select v-model="conditionItem.compare"
                       class="item"
                       style="width:90px">
              <el-option v-for="item in conditionItem.compareOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
            <Info class="item">
              <template v-slot:content>
                <div style="line-height:1.5">最小值：{{ conditionItem.min }}</div>
                <div style="line-height:1.5">最大值：{{ conditionItem.max||'不限' }}</div>
                <div style="line-height:1.5">精度：保留{{ conditionItem.precision? `${conditionItem.precision}位小数`:'整数' }}</div>
              </template>
            </Info>
            <div class="item">
              <el-input-number v-model="conditionItem.conditionValue"
                               placeholder="请输入值"
                               :precision="conditionItem.precision"
                               :min="conditionItem.min"
                               :max="conditionItem.max"
                               class="number-input"
                               controls-position="right" />
              <div class="unit">{{ conditionItem.unit }}</div>
            </div>
          </template>
          <!-- type:2 布尔型 -->
          <template v-if="conditionItem.type===2">
            <div class="item">
              <el-radio v-for="(item,x) of conditionItem.selectOpt"
                        :key="x"
                        v-model="conditionItem.conditionValue"
                        style="margin-right:0;"
                        border
                        :label="item.value">{{ item.label }}</el-radio>
            </div>
          </template>
          <!-- type:3 字符串型 -->
          <!-- type:4 枚举型 -->
          <template v-if="conditionItem.type===4">
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
          <template v-if="conditionItem.type===5">
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
          <i v-if="condition.length > 1"
             class="el-icon-delete delete"
             @click="delconditionItem(i)" />
          <div v-if="i!==0"
               class="and-or">
            <div class="text"
                 @click="andOr(i)">{{ conditionItem.andOrText }}</div>
          </div>
        </el-form-item>
        <!-- <el-button-group> -->
        <el-button v-if="condition.length<=4"
                   class="add"
                   style="width:300px;"
                   icon="el-icon-plus"
                   @click="addItem">
          添加规则
        </el-button>
        <slot name="button" />
        <!-- </el-button-group> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import Info from '@/components/Info'

export default {
  components: {
    Info
  },
  props: {
    // 每页显示条数
    originData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      condition: [{}],
      rules: {}
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
  },

  methods: {
    // 通过规则选中的值，返回一条规则应该展示的数据
    resetOpt(optValue) {
      if (!optValue) {
        return {
          andOrText: '且'
        }
      } else {
        let item
        this.originData.filter((n) => {
          if (n.id === optValue) {
            item = n
          }
        })
        const conditionValue = item.type.value === 5 ? { startDate: '', endDate: '' } : null
        const data = {
          // 规则选中选项的值
          conditionSelect: item.id,
          // 规则选中的名称
          conditionLabel: item.name,
          // 类型
          type: item.type.value,
          // 比较符号
          compareOpt: item.relations,
          // 比较值
          compare: '',
          // 可选项
          selectOpt: item.enumCandidateList,
          // 数字型-小数点精度
          precision: item.precision || 0,
          // 数字型-最小值
          min: item.min || 0,
          // 数字型-最大值
          max: item.max || undefined,
          // 数字型-单位
          unit: item.unit.label,
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
  .shun-label ::v-deep .el-form-item__label {
    display: flex;
    justify-content: flex-end;
  }
  .condition-item {
    position: relative;
    left: -5px;
    ::v-deep .el-form-item__content {
      display: flex;
      flex-wrap: wrap;
    }
    .item {
      margin: 5px;
      position: relative;
      .number-input {
        width: 200px;
        ::v-deep .el-input__inner {
          padding-right: 80px;
          text-align: left;
        }
      }
      .unit {
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
      // position: absolute;
      // right: -30px;
      // top: 0;
      &:hover {
        opacity: 0.8;
      }
    }
    .and-or {
      position: absolute;
      top: -30px;
      width: 2px;
      background: #e9ecf4;
      left: -13px;
      height: 40px;
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
    width: 50%;
    border-style: dashed;
  }
}
</style>
