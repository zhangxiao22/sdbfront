<template>
  <div v-loading="mainLoading"
       class="container">
    <el-form>
      <Group ref="totalRuleRef"
             :condition="totalCondition"
             :total-detail="totalDetail"
             :val-detail="valDetail"
             :rule-opt="ruleOpt"
             required
             :min-length="0"
             label="整体规则"
             @check="checkAll" />
      <!-- {{ totalCondition }} -->
      <el-form-item label="客户人数：">{{ totalPeople }}</el-form-item>
    </el-form>
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
          <!-- {{ labelTabs }} -->
          <Group v-if="item.closable"
                 ref="groupRuleRef"
                 required
                 :condition="item.condition"
                 :val-detail="item.valDetail"
                 :total-detail="item.groupDetail"
                 :rule-opt="ruleOpt"
                 @check="checkGroup(item, ti)" />
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
import { getPeopleCount, saveGroup, getGroup, getCustomerLabel } from '@/api/api'
import { valid } from 'mockjs'
const _ = require('lodash')

export default {
  name: 'WhiteList',
  components: {
    Group,
    Info
  },
  data() {
    return {
      mainLoading: false,
      ruleOpt: [],
      totalDetail: [],
      valDetail: [],
      totalPeople: '',
      fileId: null,
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
      people: '0',
      // 用于计数 累加
      labelTabsCounts: 0,
      totalCondition: [],
      supplyIdList: []
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
    // this.getDetail()
  },
  methods: {
    init(data) {
      this.render(data)
      this.getRuleOpt()
    },
    reset() {
      this.labelTabsCounts = 0
      this.getDetail()
    },
    render(data) {
      this.labelTabs = data.infoDetailList.map((n) => {
        return {
          title: n.name,
          name: ++this.labelTabsCounts + '',
          desc: n.desc,
          people: n.count,
          closable: true,
          condition: [],
          // 传递客群规则ID以及且或符号
          groupDetail: n.tagList.map((m) => {
            return { tagId: m.tagId, combineRelation: m.combineRelation }
          }),
          // 传递客群规则比较符号和值
          valDetail: n.tagList.map((m) => {
            return m.tagContentUnitVOList.map((k) => {
              return { content: k.content, compare: k.tagRelation }
            })
          })
        }
      })
      this.labelIndex = '1'
      // 传递整体规则ID以及且或符号
      this.totalDetail = data.abstractDetail.tagList.map(n => {
        return { tagId: n.tagId, combineRelation: n.combineRelation }
      })
      // 传递整体规则比较符号和值
      this.valDetail = data.abstractDetail.tagList.map(n => {
        return n.tagContentUnitVOList.map((m) => {
          return { content: m.content, compare: m.tagRelation }
        })
      })
    },
    // 获取规则信息
    getDetail() {
      this.mainLoading = true
      getGroup({ baseId: this.id }).then(res => {
        this.render(res.data)
      }).finally(() => {
        this.mainLoading = false
      })
    },
    getOriginOptData() {
      return new Promise((resolve, reject) => {
        getCustomerLabel().then(res => {
          this.originOptData = res.data.map(n => {
            return {
              first: n.tagCtgryNm,
              second: n.tagPrimClNm,
              third: n.tagScdClNm,
              fourth: n.name,
              id: n.id
            }
          })
          resolve()
        })
      })
    },
    // 整理数据
    getList() {
      var tempList = []
      this.originOptData.forEach((n, i) => {
        tempList.push({
          value: n.first,
          pid: { Fid: '', Cid: n.first, FFid: '', FFFid: '' },
          label: n.first
        }, {
          value: n.second,
          pid: { Fid: n.first, Cid: n.second, FFid: '', FFFid: '' },
          label: n.second
        }, {
          value: n.third,
          pid: { Fid: n.second, Cid: n.third, FFid: n.first, FFFid: '' },
          label: n.third
        }, {
          value: n.id,
          pid: { Fid: n.third, Cid: n.fourth, FFid: n.second, FFFid: n.first },
          label: n.fourth
        })
      })
      return tempList
      // console.log(tempList)
    },
    // 列表转tree
    listToTree(oldArr) {
      oldArr.forEach(element => {
        // console.log(element)
        const pid = element.pid
        if (pid.Fid !== '') {
          oldArr.forEach(ele => {
            if (ele.value === pid.Fid && ele.pid.Fid === pid.FFid && ele.pid.FFid === pid.FFFid) { // 当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
              if (!ele.children) {
                ele.children = []
              }
              ele.children.push(element)
            }
          })
        }
      })
      //   console.log(oldArr) //此时的数组是在原基础上补充了children;
      oldArr = oldArr.filter(ele => ele.pid.Fid === '') // 这一步是过滤，按树展开，将多余的数组剔除；
      return oldArr
    },
    getRuleOpt() {
      this.getOriginOptData().then(() => {
        this.listChange = _.uniqWith(
          this.getList(),
          _.isEqual
        )
        this.listChangeAgain = _.uniqBy(
          this.listChange, 'pid'
        )
        this.ruleOpt = this.listToTree(this.listChangeAgain)
      })
      // todo
      // console.log(this.ruleOpt)
    },
    transferDataByType(val) {
      const data = val.map((n) => {
        return {
          tagId: n.conditionSelect[3],
          // contentWithRelation: n.conditionSelect
          contentWithRelation: [{ content: JSON.stringify(n.conditionValue.numberVal) || n.conditionValue.stringVal || n.conditionValue.selectVal || n.conditionValue.dateVal || n.conditionValue.booleanVal || 0, tagRelation: n.compare }],
          combineRelation: n.andOrText.value
        }
      })
      return data
    },
    checkAll(val) {
      getPeopleCount({ baseId: this.id, rawSearchRuleList: this.transferDataByType(val) }).then(res => {
        this.totalPeople = res.data.count
      })
    },
    checkGroup(item, ti) {
      console.log(item, ti)
      getPeopleCount({ baseId: this.id, rawSearchRuleList: this.transferDataByType(item.condition) }).then(res => {
        this.labelTabs[ti].people = res.data.count
      })
    },

    validateAndNext() {
      const fn = () => {
        const data = {
          baseId: this.id,
          loadType: 2,
          fileId: this.fileId,
          supplyIdList: this.supplyIdList,
          userId: 1,
          subBranchId: 1000,
          rawGroup: {
            count: this.totalPeople,
            tagList: this.transferDataByType(this.totalCondition)
          },
          groupSaveCriteriaList: this.labelTabs.map((n, i) => {
            return {
              name: n.title,
              count: n.people,
              desc: n.desc,
              tagList: this.transferDataByType(n.condition)
            }
          })
        }
        // console.log(data)
        return new Promise((resolve, reject) => {
          saveGroup(data).then(res => {
            if (res.code === 200) {
              resolve()
            } else {
              reject()
            }
          }).catch(() => {
            reject()
          })
        })
      }
      return new Promise((resolve, reject) => {
        const promiseArray = [
          // 校验整体规则
          this.$refs.totalRuleRef.$form.validate(),
          // 校验客群
          this.$refs.form.validate(),
          // 校验客群中的规则
          ...this.labelTabs.map((n, i) => {
            return this.$refs.groupRuleRef[i].$form.validate()
          })
        ]
        Promise.allSettled(promiseArray).then((result) => {
          if (result.every(n => n.status === 'fulfilled')) {
            fn().then(() => {
              resolve()
            }).catch(() => {
              reject()
            })
          } else {
            const index = result.slice(2).findIndex(r => r.status === 'rejected')
            this.labelIndex = index + 1 + ''
            reject()
          }
        }).catch(() => {
          reject()
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
