<template>
  <div class="container">
    <Group ref="totalRuleRef"
           :condition="totalCondition"
           :min-length="0"
           label="整体规则"
           @check="checkAll" />

    <el-form ref="form"
             :model="{labelTabs}"
             label-width="100px"
             class="form">
      <el-form-item class="shun-label"
                    prop="labelTabs"
                    :rules="[{
                      required: true, message: '请分客群', type: 'array'
                    }]">
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
      <el-tabs v-show="labelTabs.length"
               id="group-tabs"
               v-model="labelIndex"
               type="card"
               @tab-remove="removeTab">

        <el-tab-pane v-for="(item, ti) of labelTabs"
                     :key="item.name"
                     :closable="item.closable"
                     :label="item.title"
                     :name="item.name">
          <el-form-item :prop="'labelTabs.' + ti + '.title'"
                        :rules="[{
                          required: true, message: '请填写客群名称', trigger:'blur'
                        }]"
                        label="客群名称：">
            <el-input v-model.trim="item.title"
                      style="width:300px"
                      :disabled="!item.closable"
                      placeholder="请输入客群名称" />
          </el-form-item>
          <el-form-item label="客群描述：">
            <el-input v-model.trim="item.desc"
                      style="width:300px"
                      type="textarea"
                      :disabled="!item.closable"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入客群描述" />
          </el-form-item>
          <Group v-if="item.closable"
                 ref="groupRuleRef"
                 required
                 :condition="item.condition" />
          <el-form-item label="客户人数：">{{ item.people === '' ? '' : parseInt(item.people).toLocaleString() }}</el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </div>
</template>

<script>
import Info from '@/components/Info'
import Group from './Group'
import bus from '../bus'
import Sortable from 'sortablejs'
import { } from '@/api/api'

export default {
  name: 'WhiteList',
  components: {
    Group,
    Info
  },
  data() {
    return {
      labelTabs: [
        //   {
        //   title: '其他客群',
        //   desc: '该客群为未被分入任何客群的客户集合，默认为全部，不可修改或删除。',
        //   name: '1',
        //   closable: false,
        //   people: ''
        // }
      ],
      // 值
      labelIndex: '0',
      // 用于计数 累加
      labelTabsCounts: 0,
      totalCondition: []
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
  },
  watch: {

  },
  mounted() {
    this.tabDrop()
  },
  created() {
  },
  methods: {
    reset() {
      this.getDetail()
    },
    getDetail() {
      // todo
    },
    validateAndNext() {
      return new Promise((resolve, reject) => {
        // 校验整体规则
        this.$refs.totalRuleRef.validate((valid) => {
          if (!valid) reject()
        })
        // 校验客群
        this.$refs.form.validate((valid) => {
          if (!valid) reject()
        })
        // 校验客群中的规则
        let index = 0
        let flaf = false
        this.labelTabs.forEach((n, i) => {
          this.$refs.groupRuleRef[i].validate((valid) => {
            if (!valid && !flaf) {
              index = i
              flaf = true
              this.labelIndex = i + 1 + ''
              reject()
            }
          })
        })
      })
    },
    // tab拖拽
    tabDrop() {
      const el = document.querySelector('#group-tabs .el-tabs__nav')
      // console.log(el)
      const _this = this
      var sortable = Sortable.create(el, {
        // filter: '#tab-1',
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.labelTabs.splice(oldIndex, 1)[0] // 鼠标拖拽当前的el-tabs-pane
          _this.labelTabs.splice(newIndex, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
        }
      })
    },
    addTab() {
      const newTabName = ++this.labelTabsCounts + ''
      this.labelTabs.push({
        title: '新客群' + newTabName,
        desc: '',
        name: newTabName,
        closable: true,
        // 规则
        condition: [],
        people: ''
      })
      this.labelIndex = newTabName
      // 校验
      this.$refs.form.validateField('labelTabs')
    },
    removeTab(targetName) {
      const tabs = this.labelTabs
      let activeName = this.labelIndex
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

      this.labelIndex = activeName
      this.labelTabs = tabs.filter(tab => tab.name !== targetName)

      // 校验
      this.$nextTick(() => {
        this.$refs.form.validateField('labelTabs')
      })
    },
    checkAll(val) {
      console.log(val)
      console.log(JSON.stringify(val))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  overflow: auto;
}
</style>
