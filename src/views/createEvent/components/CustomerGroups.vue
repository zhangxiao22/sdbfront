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

            <el-form-item>
              <div slot="label">
                <Info content="维度不能超过10个" />
                维度补充：
              </div>
              <el-select v-model="form.paramValue"
                         style="width:800px;"
                         multiple
                         filterable
                         placeholder="可输入匹配项并搜索选择">
                <el-option v-for="item in paramOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>

            </el-form-item>
            <el-divider />

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
                <Group v-if="item.closable" />
                <el-form-item label="客户人数：">12,344</el-form-item>
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
          title: '其他群组',
          desc: '该群组为未被分入任何客群的客户集合，默认为全部，不可修改或删除。',
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
    validateAndNext() {
      return new Promise(resolve => {
        resolve()
      })
    },
    download() {
      console.log(123)
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
  padding: 5px 20px;
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
    }
    ::v-deep .sortable-drag {
      box-shadow: 0 0 1px 1px rgba(34, 65, 145, 0.1) inset;
    }
  }
}
</style>
