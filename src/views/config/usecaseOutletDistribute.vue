<template>
  <!-- 用例网点分配比例 -->
  <div class="container">
    <el-form ref="regFormRef"
             :model="form"
             label-width="200px"
             class="main-form">
      <el-form-item class="form-item">
        <div slot="label">
          <Info content="默认100%" />
          用例网点分配比例：
        </div>
        <div v-for="(caseOutletItem,i) of form.useCaseOutlets"
             :key="i"
             class="block-item">
          <el-form-item :prop="'useCaseOutlets.'+i+'.useCase'"
                        :rules="[{required: true, message: '请选择用例'},
                                 {validator: validateSame}]">
            <el-select v-model="caseOutletItem.useCase"
                       placeholder="请选择用例"
                       class="item-input"
                       @change="handleSelectUseCase($event,i)">
              <el-option v-for="optItem of useCaseOpt"
                         :key="optItem.value"
                         :disabled="optItem.disabled"
                         :label="optItem.label"
                         :value="optItem.value" />
            </el-select>
          </el-form-item>
          <el-form-item :prop="'useCaseOutlets.'+i+'.outlet'"
                        style="margin-left:20px;"
                        :rules="[{required: true, message: '请选择网点', trigger: 'change'},
                                 {validator: validateSame}]">
            <el-select v-model="caseOutletItem.outlet"
                       placeholder="请选择网点"
                       class="item-input"
                       @change="handleSelectUseCaseOutlet($event,i)">
              <el-option v-for="optItem of useCaseOutletOpt"
                         :key="optItem.value"
                         :disabled="optItem.disabled"
                         :label="optItem.label"
                         :value="optItem.value" />
            </el-select>
          </el-form-item>
          <span class="compare">:</span>
          <el-form-item :prop="'useCaseOutlets.'+i+'.value'"
                        :rules="{
                          required: true, message: '请输入分配比例', trigger: 'change'
                        }">
            <el-input-number v-model="caseOutletItem.value"
                             :disabled="!caseOutletItem.useCase || !caseOutletItem.outlet"
                             :min="0"
                             :max="200"
                             :step="10"
                             controls-position="right"
                             placeholder="请输入分配比例"
                             class="item-input number-input" />
            <div class="unit">%</div>
          </el-form-item>
          <i class="el-icon-delete delete"
             @click="delUseCaseOutletItem(i)" />
        </div>
        <el-button class="add"
                   icon="el-icon-plus"
                   @click="addUseCaseOutlet" />
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
import { getUseCaseForEvent, getOutletList, insertOutletAllotBatch, getOutletAllot } from '@/api/api'
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
        useCaseOutlets: [
          {
            useCase: '',
            outlet: '',
            value: 100
          }
        ]
      },
      useCaseOpt: [],
      useCaseOutletOpt: []
    }
  },
  computed: {
    // 获取数据
    getData() {
      const data = {}
      data.outletAllotList = this.form.useCaseOutlets.map(n => {
        return {
          useCaseId: n.useCase,
          outletId: n.outlet,
          proportion: n.value
        }
      })
      data.category = 1
      return data
    }
  },
  watch: {

  },
  created() {
    this.outletsList()
    this.useCaseList().then(() => {
      this.getDetail()
    })
  },
  mounted() {
  },
  methods: {
    reset() {
      this.form.useCaseOutlets = [{
        useCase: '',
        outlet: '',
        value: 100
      }]
      this.$nextTick(() => {
        this.$refs['regFormRef'].resetFields()
        this.$emit('update:loading', false)
      })
    },

    getDetail() {
      getOutletAllot({ category: 1 }).then(res => {
        // 获取用例-网点-分配比例值
        this.form.useCaseOutlets = res.data.map(item => {
          return {
            useCase: item.useCaseId,
            outlet: item.outletId,
            value: item.proportion
          }
        })
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
    // 获取用例
    useCaseList() {
      return new Promise((resolve, reject) => {
        getUseCaseForEvent().then(res => {
          this.useCaseOpt = res.data.map(n => {
            return {
              label: n.name,
              value: n.id,
              disabled: false
            }
          })
          resolve()
        })
      })
    },

    // 获取用例网点
    outletsList() {
      return new Promise(resolve => {
        // 全局网点 category:0
        getOutletList().then(res => {
          this.useCaseOutletOpt = res.data.map(n => {
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

    // 用例网点
    addUseCaseOutlet() {
      this.form.useCaseOutlets.push({
        useCase: '',
        outlet: '',
        value: 100
      })
    },

    delUseCaseOutletItem(i) {
      this.form.useCaseOutlets.splice(i, 1)
    },

    handleSelectUseCase(val, index) {
      this.$refs.regFormRef.validate()
    },
    handleSelectUseCaseOutlet(val, i) {
      this.$refs.regFormRef.validate()
    },

    validateSame(rule, value, callback) {
      const index = +rule.field.split('.')[1]
      let hasSame = false
      const arr = this.form.useCaseOutlets
      for (let i = 0; i < arr.length; i++) {
        // console.log('index:', index, arr[index].useCase, arr[index].outlet)
        // console.log('i:', i, '/////', arr[i].useCase, arr[i].outlet)
        if (
          (i !== index) &&
          (arr[i].useCase && arr[index].useCase) &&
          (arr[i].useCase === arr[index].useCase) &&
          (arr[i].outlet && arr[index].outlet) &&
          (arr[i].outlet === arr[index].outlet)
        ) {
          hasSame = true
          break
        }
      }
      if (hasSame) {
        callback(new Error('存在相同的用例和网点组合'))
      } else {
        // this.$refs['regFormRef'].clearValidate(`useCaseOutlets.${index}.useCase`)
        // this.$refs['regFormRef'].clearValidate(`useCaseOutlets.${index}.outlet`)
        callback()
      }
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
