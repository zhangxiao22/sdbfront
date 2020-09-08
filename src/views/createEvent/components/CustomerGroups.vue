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
              <el-link type="primary"
                       @click="download">模版下载</el-link>
              <!-- <a class="download">模版下载</a> -->
            </div>
          </el-upload>
          <el-form ref="form"
                   :model="form"
                   :rules="rules"
                   label-width="110px"
                   class="reg-form">
            <el-form-item label="客户数量：">
              {{ parseInt(form.customerCount).toLocaleString() }}
            </el-form-item>
            <el-form-item label="上传时间：">
              {{ form.updateTime }}
            </el-form-item>
            <el-form-item class="target-form-item"
                          label="目标设置："
                          prop="target"
                          :rules="{
                            required: true
                          }">
              <div v-for="(targetItem,i) of form.target"
                   :key="i"
                   class="target-item">
                <el-form-item :prop="'target.'+i+'.targetSelect'"
                              :rules="{
                                required: true, message: '请选择目标名称', trigger: 'change'
                              }">
                  <el-select v-model="targetItem.targetSelect"
                             placeholder="请选择目标名称"
                             class="target-item-input"
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
                            :disabled="!targetItem.targetSelect"
                            type="number"
                            autocomplete="off"
                            placeholder="请输入目标值"
                            class="target-item-input">
                    <div slot="suffix"
                         style="height:100%;"
                         class="center-center">{{ targetItem.unit }}</div>
                  </el-input>
                </el-form-item>
                <i v-if="form.target.length > 1"
                   class="el-icon-delete delete"
                   @click="delTargetItem(i)" />
              </div>

              <el-button v-if="form.target.length < targetOpt.length"
                         class="add"
                         icon="el-icon-plus"
                         @click="addTarget" />
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <Info content="维度不能超过10个" />
                维度补充：
              </div>
              <el-select v-model="form.paramValue"
                         style="width:100%;"
                         multiple
                         filterable
                         placeholder="请搜索选择">
                <el-option v-for="item in paramOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>

            </el-form-item>
            <el-divider />
            <el-form-item label="对照组：">
              <el-switch v-model="form.contrast"
                         active-text="开"
                         inactive-text="关" />
              <el-input-number v-model="form.contrastValue"
                               :disabled="!form.contrast"
                               style="margin-left:20px;"
                               controls-position="right"
                               :step="5"
                               :min="1"
                               :max="30" />
              %
            </el-form-item>
            <el-form-item label="抽样方式：">
              <el-radio-group v-model="form.sample">
                <el-radio label="1">随机抽样</el-radio>
                <el-radio disabled
                          label="2">分层抽样</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <Info content="客群先后顺序决定客群优先级（客群标签可拖拽排序）" />
                分群：
              </div>
              <el-button icon="el-icon-plus"
                         type="primary"
                         @click="addTab">
                添加客群
              </el-button>

            </el-form-item>
            <el-tabs id="group-tabs"
                     v-model="form.labelIndex"
                     type="card"
                     @tab-remove="removeTab">

              <el-tab-pane v-for="item of form.labelTabs"
                           :key="item.name"
                           :closable="item.closable"
                           :label="item.title"
                           :name="item.name">
                <el-form-item label="群组名称：">
                  <el-input v-model="item.title"
                            style="width:300px"
                            :disabled="!item.closable"
                            placeholder="请输入群组名称" />
                </el-form-item>
                <el-form-item label="群组描述：">
                  <el-input v-model="item.desc"
                            style="width:300px"
                            type="textarea"
                            :disabled="!item.closable"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入群组描述" />
                </el-form-item>
                <!-- <template v-if="item.closable"> -->
                <Group v-if="item.closable" />
                <!-- </template> -->
              </el-tab-pane>
            </el-tabs>
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
import Info from '@/components/Info'
import Group from './Group'
import Sortable from 'sortablejs'

export default {
  name: 'CustomerGroups',
  components: {
    Info, Group
  },
  data() {
    return {
      //

      age: '',
      activeName: '1',
      form: {
        fileName: 'dsafdasfasd.ss',
        customerCount: 1234566,
        updateTime: '2020-09-09 09:09:09',
        target: [{
          targetSelect: '',
          targetValue: '',
          unit: ''
        }],
        paramValue: '',
        contrast: true,
        contrastValue: 5,
        sample: '1',
        group: true,

        // editableTabsValue
        // 值
        labelIndex: '1',
        // editableTabs
        labelTabs: [{
          title: '其他',
          desc: '该群组为未被分入任何客群的客户集合，默认为全部，不可删除。',
          name: '1',
          closable: false
        }],
        // tabIndex
        // 用于计数 累加
        labelTabsCounts: 1
      },
      targetForm: {},
      rules: {

      },

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
      ],
      paramOpt: [
        {
          label: '性别',
          value: '1'
        },
        {
          label: '年龄',
          value: '2'
        },
        {
          label: '年龄2',
          value: '3'
        },
        {
          label: '年龄3',
          value: '4'
        }
      ]

    }
  },
  computed: {
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        // console.log(newVal, '??')
        const data = {
          customerCount: 0
        }
        data.customerCount = newVal.customerCount
        console.log(data)
        this.$emit('renderSteps', data)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.tabDrop()
  },
  methods: {
    next(cb) {

    },
    download() {
      console.log(123)
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
    // tab拖拽
    tabDrop() {
      const el = document.querySelector('#group-tabs .el-tabs__nav')
      console.log(el)
      const _this = this
      var sortable = Sortable.create(el, {
        // filter: '#tab-1',
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.form.labelTabs.splice(oldIndex, 1)[0] // 鼠标拖拽当前的el-tabs-pane
          _this.form.labelTabs.splice(newIndex, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
        }
      })
    },
    addTab() {
      const newTabName = ++this.form.labelTabsCounts + ''
      this.form.labelTabs.push({
        title: '新群组' + newTabName,
        desc: '',
        name: newTabName,
        closable: true
      })
      this.form.labelIndex = newTabName
    },
    removeTab(targetName) {
      const tabs = this.form.labelTabs
      let activeName = this.form.labelIndex
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.form.labelIndex = activeName
      this.form.labelTabs = tabs.filter(tab => tab.name !== targetName)
    }
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
      // width: 800px;
      // margin: 10px auto 0;
      .target-form-item {
        width: 600px;
        .target-item {
          display: flex;
          position: relative;
          .el-form-item {
            flex: 1;
          }
          .target-item-input {
            width: 100%;
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
    ::v-deep .sortable-drag {
      box-shadow: 0 0 1px 1px rgba(34, 65, 145, 0.1) inset;
    }
  }
}
</style>
