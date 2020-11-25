<template>
  <!--  全局网点分配比例 -->
  <div class="container">
    <el-form ref="regFormRef"
             :model="form"
             label-width="200px"
             class="main-form">
      <el-form-item class="form-item">
        <div slot="label">
          <Info content="默认100%" />
          全局网点分配比例：
        </div>
        <div v-for="(outletItem,i) of form.outlets"
             :key="i"
             class="block-item">
          <el-form-item :prop="'outlets.'+i+'.item'"
                        :rules="{
                          required: true, message: '请选择网点', trigger: 'change'
                        }">
            <el-select v-model="outletItem.item"
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
          <span class="compare">:</span>
          <el-form-item :prop="'outlets.'+i+'.value'"
                        :rules="{
                          required: true, message: '请输入分配比例', trigger: 'change'
                        }">
            <el-input-number v-model="outletItem.value"
                             :disabled="!outletItem.item"
                             :min="0"
                             :max="200"
                             :step="10"
                             controls-position="right"
                             placeholder="请输入分配比例"
                             class="item-input number-input" />
            <div class="unit">%</div>
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
import Info from '@/components/Info'

export default {
  components: {
    Info
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        outlets: [
          {
            item: '',
            proportion: ''
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
          proportion: n.value
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
      this.form.outlets = [{
        item: '',
        value: 100
      }]
      this.$nextTick(() => {
        this.$refs['regFormRef'].resetFields()
        this.resetOutLet()
        this.$emit('update:loading', false)
      })
    },
    getDetail() {
      getOutletAllot({ category: 0 }).then(res => {
        // 获取网点加分配比例值
        this.form.outlets = res.data.map(item => {
          return {
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
    width: 700px;
    margin: 20px auto;

    .form-item {
      .block-item {
        display: flex;
        position: relative;
        .compare {
          width: 10px;
          margin: 0 10px;
          color: #888;
          text-align: center;
        }
        .el-form-item {
          flex: 1;
          position: relative;
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
