<template>
  <div class="group-container">
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="100px"
             class="reg-form">
      <el-form-item label="分群规则：">
        <el-form-item v-for="(conditionItem,i) of form.condition"
                      :key="i"
                      class="condition-item">

          <el-tooltip :content="conditionItem.conditionLabel"
                      placement="left">
            <el-select v-model="conditionItem.conditionSelect"
                       filterable
                       class="condition-item-input"
                       @change="selectCondition($event,i)">
              <el-option v-for="optItem of tags"
                         :key="optItem.value"
                         :label="optItem.label"
                         :value="optItem.value" />
            </el-select>
          </el-tooltip>

          <template v-if="conditionItem.type==='boolean'">
            <el-select v-model="conditionItem.conditionValue"
                       class="item"
                       placeholder="请选择">
              <el-option label="是"
                         value="1" />
              <el-option label="否"
                         value="0" />
            </el-select>
          </template>
          <template v-if="conditionItem.type==='double'||conditionItem.type==='int'">
            <el-select v-model="conditionItem.compare"
                       class="item"
                       style="width:80px">
              <el-option v-for="item in compareOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
            <el-input-number v-model="conditionItem.conditionValue"
                             :precision="conditionItem.type==='int'?0:undefined"
                             style="width:200px;"
                             class="item"
                             controls-position="right" />
            <div class="item">{{ conditionItem.unit }}</div>
          </template>
          <template v-if="conditionItem.type==='date'">
            <el-date-picker v-model="conditionItem.conditionValue[0]"
                            class="item"
                            type="date"
                            placeholder="开始日期" />

            <div class="item">至</div>
            <el-date-picker v-model="conditionItem.conditionValue[1]"
                            class="item"
                            type="date"
                            placeholder="结束日期" />
          </template>
          <i v-if="form.condition.length > 1"
             class="el-icon-delete delete"
             @click="delconditionItem(i)" />
          <div v-if="i!==0"
               class="and-or">
            <div class="text"
                 @click="andOr(i)">{{ conditionItem.andOrText }}</div>
          </div>
        </el-form-item>
        <el-button v-if="form.condition.length < 5"
                   class="add"
                   icon="el-icon-plus"
                   @click="addItem" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      tags: [
        {
          label: '是否受薪客户',
          value: '1',
          type: 'boolean'
        },
        {
          label: 'AUM-余额',
          value: '2',
          type: 'double',
          unit: '元'
        },
        {
          label: '定期_当天 购买次数',
          value: '3',
          type: 'int',
          unit: '次'
        },
        {
          label: '不定期储蓄_当天购买利率',
          value: '4',
          type: 'double',
          unit: '%'
        },
        {
          label: '最近半年最大转入金额对应日期',
          value: '5',
          type: 'date'
        }
      ],
      compareOpt: [{
        value: '1',
        label: '>'
      }, {
        value: '2',
        label: '≥'
      }, {
        value: '3',
        label: '='
      }, {
        value: '4',
        label: '<'
      }, {
        value: '5',
        label: '≤'
      }],
      form: {
        condition: []
      },
      rules: {}
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.tagsInit(0, 0)
  },

  methods: {
    resetOpt(index) {
      const { value, label, type, unit } = this.tags[index]
      const compare = (type === 'double' || type === 'int') ? '1' : ''
      const conditionValue = (type === 'date') ? [] : ''
      return {
        conditionSelect: value,
        conditionValue,
        conditionLabel: label,
        type,
        compare,
        unit,
        andOrText: '且'
      }
    },
    tagsInit(gi, oi) {
      this.form.condition.splice(gi, 1, this.resetOpt(oi))
    },
    selectCondition(val, i) {
      for (let j = 0; j < this.tags.length; j++) {
        if (this.tags[j].value === val) {
          this.tagsInit(i, j)
          break
        }
      }
    },
    addItem() {
      this.form.condition.push(this.resetOpt(0))
    },
    delconditionItem(i) {
      this.form.condition.splice(i, 1)
    },
    andOr(i) {
      this.form.condition[i].andOrText = this.form.condition[i].andOrText === '且' ? '或' : '且'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.group-container {
  .condition-item {
    position: relative;
    ::v-deep .el-form-item__content {
      display: flex;
      flex-wrap: wrap;
    }
    .item {
      margin-left: 10px;
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
    width: 100%;
    border-style: dashed;
  }
}
</style>
