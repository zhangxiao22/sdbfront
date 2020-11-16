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
                   :loading="buttonLoading"
                   @click="save">保存</el-button>
        <el-button icon="el-icon-refresh"
                   style="width:100px;"
                   @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOutletsList } from '@/api/api'
import Info from '@/components/Info'

export default {
  components: {
    Info
  },
  data() {
    return {
      buttonLoading: false,
      form: {
        outlets: [
          {
            item: '',
            value: ''
          }
        ]
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
      }]
    }
  },
  computed: {
    // 获取数据
    getData() {
      const data = {}
      data.globalOutletList = this.form.outlets.map(n => {
        return {
          select: n.item,
          value: n.value
        }
      })
      return data
    }
  },
  watch: {

  },
  created() {
    this.outletsList().then(() => {
      if (this.id) {
        this.getDetail()
      }
    })
  },
  mounted() {
  },
  methods: {
    reset() {
      this.form.outlets = [{
        item: '',
        value: 100
      }]
      this.$nextTick(() => {
        this.$refs['regFormRef'].resetFields()
        this.resetOutLet()
        this.buttonLoading = false
      })
    },
    getDetail() {
      // getGlobalOutletDistribute({ id: this.id }).then(res => {
      //   // 获取网点加分配比例值
      //   this.form.outlets = res.data.achieveList.map(item => {
      //     let obj = this.outletOpt.find(n => {
      //       if (n.value === item.select) {
      //         obj = n
      //         return true
      //       }
      //     })
      //     return Object.assign({}, obj, {
      //       item: item.select,
      //       value: item.value
      //     })
      //   })
      //   this.resetOutLet()
      // })
    },
    save() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          let ajax

          ajax(this.getData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
            }
          })
        }
      })
    },

    // 获取网点
    outletsList() {
      return new Promise(resolve => {
        // getOutletsList().then(res => {
        //   this.targetOpt = res.data.globalOutletList.map(n => {
        //     return {
        //       // 目标名称
        //       label: n.name,
        //       // 目标值
        //       value: n.id,
        //       // 是否可选
        //       disabled: false
        //     }
        //   })
        //   resolve()
        // })
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
