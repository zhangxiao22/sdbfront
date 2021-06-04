<template>
  <div class="rule-item-container">
    <div>
      <el-form-item class="item">
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
      <el-form-item class="item">
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
      <!-- 删除按钮 -->
      <div class="icon-btns">
        <i class="el-icon-plus add btn-item"
           @click="addConditionItem(ci)" />
        <i v-if="condition.list.length > minLength"
           class="el-icon-close delete btn-item"
           @click="delConditionItem(ci)" />
      </div>
    </div>
    <div v-if="condition.list.length > 1"
         class="and-or root">
      <div class="text"
           @click="checkrRelation(condition)">{{ condition.relation ? '且' : '或' }}</div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      MAX_NUMBER
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  created() {
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.rule-item-container {
  .condition-item {
    position: relative;
    margin-left: 40px;
    // top: -5px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    transition: margin 0.3s;
    &.single {
      margin-left: 0;
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
    .icon-btns {
      position: absolute;
      right: 0;
      font-size: 18px;

      .add {
        color: $blue;
        border-radius: 50%;
      }
      .delete {
        color: $red;
      }
      .btn-item {
        // border: 1px solid;
        margin-left: 10px;
        cursor: pointer;
        width: 25px;
        height: 25px;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .and-or {
    position: absolute;
    top: 0;
    bottom: 18px;
    left: 0;
    @include center-center;
    &.root {
      .text {
        background: #eee;
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
      border-left: 1px dashed #dcdfe6;
      // background: #e9ecf4;
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
</style>
