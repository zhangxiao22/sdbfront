<template>
  <div class="container">
    <el-form ref="formRef"
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
      <el-form-item class="form-item">
        <div slot="label">
          <Info content="默认100%" />
          用例网点分配比例：
        </div>
        <div v-for="(caseOutletItem,i) of form.useCaseOutlets"
             :key="i"
             class="block-item">
          <el-form-item :prop="'useCaseOutlets.'+i+'.useCase'"
                        :rules="[{required: true, message: '请选择用例', trigger: 'change'},
                                 {validator: validateSame}]">
            <el-select v-model="caseOutletItem.useCase"
                       placeholder="请选择用例"
                       class="item-input"
                       @change="handleSelectUseCase($event,caseOutletItem)">
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
import { } from '@/api/api'
import Info from '@/components/Info'

export default {
  components: {
    Info
  },
  data() {
    return {
      form: {
        outlets: [],
        useCaseOutlets: []
      },
      outletOpt: [{
        value: '选项1',
        label: '黄金糕',
        disabled: false
      }, {
        value: '选项2',
        label: '双皮奶',
        disabled: false
      }, {
        value: '选项3',
        label: '蚵仔煎',
        disabled: false
      }, {
        value: '选项4',
        label: '龙须面',
        disabled: false
      }, {
        value: '选项5',
        label: '北京烤鸭',
        disabled: false
      }],
      useCaseOpt: [{
        value: '选项1',
        label: '黄金糕',
        disabled: false
      }, {
        value: '选项2',
        label: '双皮奶',
        disabled: false
      }, {
        value: '选项3',
        label: '蚵仔煎',
        disabled: false
      }, {
        value: '选项4',
        label: '龙须面',
        disabled: false
      }, {
        value: '选项5',
        label: '北京烤鸭',
        disabled: false
      }],
      useCaseOutletOpt: [{
        value: '选项1',
        label: '黄金糕',
        disabled: false
      }, {
        value: '选项2',
        label: '双皮奶',
        disabled: false
      }, {
        value: '选项3',
        label: '蚵仔煎',
        disabled: false
      }, {
        value: '选项4',
        label: '龙须面',
        disabled: false
      }, {
        value: '选项5',
        label: '北京烤鸭',
        disabled: false
      }]
    }
  },
  computed: {
    // 获取数据
    getData() {
      const data = {}

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
    reset() {

    },
    getDetail() {

    },
    save() {

    },

    addOutlet() {
      this.form.outlets.push({
        item: '',
        value: 100
      })
    },
    delOutletItem(i) {
      this.form.outlets.splice(i, 1)
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
    },

    // 用例网点
    addUseCaseOutlet() {
      this.form.useCaseOutlets.push({
        useCase: '',
        outlet: '',
        value: 100
      })
    },
    handleSelectUseCase(val, i) {
      this.$refs.formRef.validateField(`useCaseOutlets.${i}.useCase`)
    },
    handleSelectUseCaseOutlet(val, i) { },
    delUseCaseOutletItem(i) {
      this.form.useCaseOutlets.splice(i, 1)
    },
    validateSame(rule, value, callback) {
      let hasSame = false
      const arr = this.form.useCaseOutlets
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (
            (arr[i].useCase && arr[j].useCase) &&
            (arr[i].useCase === arr[j].useCase) &&
            (arr[i].outlet && arr[j].outlet) &&
            (arr[i].outlet === arr[j].outlet)
          ) {
            hasSame = true
            break
          }
        }
      }
      if (hasSame) {
        callback(new Error('存在相同的用例和网点组合'))
      } else {
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
