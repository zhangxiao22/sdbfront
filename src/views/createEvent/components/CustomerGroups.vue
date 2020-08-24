<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="白名单上传"
                   name="1">
        <div class="whitelist">
          <el-upload class="upload"
                     drag
                     action="https://jsonplaceholder.typicode.com/posts/"
                     multiple>
            <!-- <i class="el-icon-upload" /> -->
            <svg-icon class="el-icon-upload"
                      icon-class="upload-file" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip"
                 class="el-upload__tip">
              只能上传xls/cvs文件
              <el-link type="primary">模版下载</el-link>
              <!-- <a class="download">模版下载</a> -->
            </div>
          </el-upload>
          <el-form ref="form"
                   :model="form"
                   :rules="rules"
                   label-width="100px"
                   class="reg-form">
            <el-form-item label="客户数量：">
              {{ form.customerNumber }}
            </el-form-item>
            <el-form-item label="上传时间：">
              {{ form.updateTime }}
            </el-form-item>
            <el-form-item class="target-form-item"
                          label="目标设置：">
              <div v-for="(targetItem,i) of form.target"
                   :key="i "
                   class="target-item">
                <el-form-item :prop="'target.'+i+'.targetSelect'"
                              :rules="{
                                required: true, message: '请选择目标名称', trigger: 'change'
                              }">
                  <el-select v-model="targetItem.targetSelect"
                             style="width:180px;"
                             placeholder="请选择目标名称"
                             @change="selectTarget($event,i)">
                    <el-option v-for="optItem of targetOpt"
                               :key="optItem.value"
                               :disabled="optItem.disabled"
                               :label="optItem.label"
                               :value="optItem.value" />
                  </el-select>
                </el-form-item>
                <span style="margin:0 10px;">:</span>

                <el-form-item :prop="'target.'+i+'.targetValue'"
                              :rules="{
                                required: true, message: '请输入正确的目标值', trigger: 'blur'
                              }">
                  <el-input v-model.number="targetItem.targetValue"
                            style="width:180px;"
                            :disabled="!targetItem.targetSelect"
                            type="number"
                            autocomplete="off"
                            placeholder="请输入目标值"
                            class="traget-input-with-select">
                    <div slot="suffix"
                         style="height:100%;"
                         class="center-center">{{ targetItem.unit }}</div>
                  </el-input>
                </el-form-item>
                <i class="el-icon-delete delete"
                   @click="delTargetItem(i)" />
              </div>

              <!-- <el-form-item
                            class="target-item">

              </el-form-item> -->

              <el-button v-show="form.target.length < targetOpt.length "
                         class="add"
                         icon="el-icon-plus"
                         @click="addTarget" />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="CRM导入"
                   name="second">CRM导入</el-tab-pane>
      <el-tab-pane label="模型导入"
                   name="third">模型导入</el-tab-pane> -->

    </el-tabs>
  </div>
</template>

<script>

export default {
  data() {
    return {
      age: '',
      activeName: '1',
      form: {
        fileName: 'dsafdasfasd.ss',
        customerNumber: '1000',
        updateTime: '2020-09-09 09:09:09',
        target: [{
          targetSelect: '',
          targetValue: '',
          unit: ''
        }]
      },
      targetForm: {},
      rules: {},

      targetOpt: [
        {
          label: 'AUM日均1',
          value: '1',
          unit: '元',
          disabled: false
        },
        {
          label: 'AUM日均2',
          unit: '万元',
          value: '2',
          disabled: false
        }, {
          label: 'AUM日均3',
          unit: '%',
          value: '3',
          disabled: false
        }, {
          label: 'AUM日均4',
          unit: '美元',
          value: '4',
          disabled: false
        }
      ]

    }
  },
  computed: {
  },
  watch: {

  },

  methods: {
    // testTargetValue(rule, value, callback) {
    //   console.log(value)
    //   if (value === '') {
    //     callback(new Error('目标值输入不正常'))
    //   } else {
    //     callback()
    //   }
    // },
    next(cb) {

    },
    addTarget() {
      this.form.target.push({
        targetSelect: '',
        targetValue: ''
      })
    },
    delTargetItem(i) {
      this.form.target.splice(i, 1)
      this.resetTargetOpt()
    },
    selectTarget(val, index) {
      // 清空输入
      this.form.target[index].targetValue = ''
      // 设置不可选项
      this.resetTargetOpt()
      // 显示单位
      this.targetOpt.forEach((n, i) => {
        if (n.value === val) {
          this.form.target[index].unit = n.unit
        }
      })
    },
    resetTargetOpt() {
      const temp = []
      this.form.target.forEach((n, i) => {
        n.targetSelect && temp.push(n.targetSelect)
      })
      this.targetOpt.forEach((n, i) => {
        n.disabled = temp.includes(n.value)
      })
    },
    checkTargetValue() { }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 0 20px;
  .whitelist {
    .upload {
      width: 360px;
      margin: 0 auto;
      .el-icon-upload {
        font-size: 58px;
      }
      .el-upload__tip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .download {
          color: $blue;
          text-decoration: underline;
        }
      }
    }
    .reg-form {
      width: 515px;
      margin: 10px auto 0;
      .target-form-item {
        .target-item {
          // margin-bottom: 18px;
          display: flex;
          // align-items: center;
          .delete {
            color: $red;
            display: inline-block;
            width: 20px;
            cursor: pointer;
            height: 32px;
            margin-left: 10px;
            font-size: 18px;
            line-height: 32px;
            &:hover {
              opacity: 0.8;
            }
          }
        }
        .add {
          width: 100%;
          width: calc(100% - 30px);
          border-style: dashed;
        }
      }
    }
  }
}
</style>
