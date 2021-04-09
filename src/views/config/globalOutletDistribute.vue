<template>
  <!--  全局网点分配比例 -->
  <div class="container">
    <el-form ref="regFormRef"
             :model="form"
             class="main-form">
      <el-form-item class="form-item">
        <div class="form-header">
          <el-form-item required
                        class="item"
                        label="网点："
                        style="flex:1;" />
          <el-form-item required
                        class="item"
                        label="比例："
                        style="width:200px;" />
          <el-form-item required
                        class="item"
                        label="有效期："
                        style="width:300px;" />
        </div>
        <div v-for="(outletItem,i) of form.outlets"
             :key="i"
             class="block-item">
          <el-form-item :prop="'outlets.'+i+'.item'"
                        :rules="{
                          required: true, message: '请选择网点', trigger: 'change'
                        }">
            <el-select v-model="outletItem.item"
                       filterable
                       placeholder="请选择网点"
                       class="item-input"
                       @change="handleSelectOutlet($event,outletItem)">
              <el-option v-for="optItem of outletOpt"
                         :key="optItem.value"
                         :disabled="optItem.disabled"
                         :label="optItem.label"
                         :value="optItem.value" />
            </el-select>
          </el-form-item>
          <el-form-item :prop="'outlets.'+i+'.value'"
                        :rules="{
                          required: true, message: '请输入分配比例', trigger: 'change'
                        }">
            <el-input-number v-model="outletItem.value"
                             style="width:200px;"
                             :disabled="!outletItem.item"
                             :min="0"
                             :max="200"
                             :step="10"
                             controls-position="right"
                             placeholder="请输入分配比例"
                             class="item-input number-input" />
            <div class="unit">%</div>
          </el-form-item>
          <el-form-item :prop="'outlets.'+i+'.dateRange'"
                        :rules="[{
                          required: true, message: '请输入有效期', trigger: 'blur'
                        }]">
            <el-date-picker v-model="outletItem.dateRange"
                            style="width:300px;"
                            value-format="yyyy-MM-dd"
                            class="item-date"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" />
          </el-form-item>
          <i class="el-icon-delete delete"
             @click="delOutletItem(i)" />
        </div>
        <el-button v-if="form.outlets.length < outletOpt.length"
                   class="add"
                   icon="el-icon-plus"
                   @click="addOutlet" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-document"
                   type="primary"
                   style="width:100px;"
                   @click="save">保存</el-button>
        <el-button icon="el-icon-refresh"
                   style="width:100px;"
                   @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOutletAllot, insertOutletAllotBatch, getOutletList } from '@/api/api'
import { parseTime } from '@/utils'

export default {
  components: {
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const testStartTime = parseTime(new Date(), '{y}-{m}-{d}')
          const dateTime = parseTime(time, '{y}-{m}-{d}')
          return dateTime < testStartTime
        }
      },
      form: {
        outlets: [
          {
            item: '',
            value: '',
            dateRange: []
          }
        ]
      },
      outletOpt: []
    }
  },
  computed: {
    // 获取数据
    getData() {
      const data = {}
      data.outletAllotList = this.form.outlets.map(n => {
        return {
          outletId: n.item,
          proportion: n.value,
          startDate: n.dateRange[0],
          endDate: n.dateRange[1]
        }
      })
      data.category = 0
      return data
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
    init() {
      this.outletsList().then(() => {
        this.getDetail()
      })
    },
    reset() {
      // this.form.outlets = [{
      //   item: '',
      //   value: 100
      // }]
      // this.$nextTick(() => {
      //   this.$refs['regFormRef'].resetFields()
      //   this.resetOutLet()
      //   this.$emit('update:loading', false)
      // })
      this.getDetail()
    },
    getDetail() {
      getOutletAllot({ category: 0 }).then(res => {
        // 获取网点加分配比例值
        this.form.outlets = res.data.map(item => {
          return {
            dateRange: item.startDate ? [item.startDate, item.endDate] : [],
            item: item.outletId,
            value: item.proportion
          }
        })
        this.resetOutLet()
      })
    },
    save() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.$emit('update:loading', true)
          insertOutletAllotBatch(this.getData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
            }
          }).finally(() => {
            this.$emit('update:loading', false)
          })
        }
      })
    },

    // 获取网点
    outletsList() {
      return new Promise(resolve => {
        // 全局网点 category:0
        getOutletList().then(res => {
          this.outletOpt = res.data.map(n => {
            return {
              label: n.orgName,
              value: n.id,
              disabled: false
            }
          })
          resolve()
        })
      })
    },

    addOutlet() {
      this.form.outlets.push({
        item: '',
        value: 100
      })
    },
    delOutletItem(i) {
      this.form.outlets.splice(i, 1)
      this.resetOutLet()
    },
    resetOutLet() {
      const temp = []
      this.form.outlets.forEach((n, i) => {
        n.item && temp.push(n.item)
      })
      this.outletOpt.forEach((n, i) => {
        n.disabled = temp.includes(n.value)
      })
    },

    handleSelectOutlet(val, item) {
      this.outletOpt.find((n, i) => {
        if (n.value === val) {
          item.value = 100
          return true
        }
      })
      // 设置不可选项
      this.resetOutLet()
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .main-form {
    margin: 20px auto;
    width: 715px;
    .form-item {
      .form-header {
        display: flex;
        .item {
          margin-right: 10px;
          margin-bottom: 0;
          // border: 1px solid;
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
      .block-item {
        display: flex;
        position: relative;
        margin-bottom: 2px;
        .el-form-item {
          position: relative;
          margin-right: 10px;
          &:last-of-type {
            margin-right: 0;
          }
          .item-input {
            width: 100%;
            position: relative;
            &.number-input {
              ::v-deep .el-input__inner {
                padding-right: 80px;
                text-align: left;
              }
            }
          }
          .unit {
            position: absolute;
            bottom: 0;
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
