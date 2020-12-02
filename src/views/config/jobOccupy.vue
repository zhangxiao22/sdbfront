<template>
  <!-- 岗位分配 -->
  <div class="job-container">
    <tree-transfer ref="transferRef"
                   :title="[' ', ' ']"
                   :button_text="['到右边','到左边']"
                   :from_data="leftData"
                   :to_data="rightData"
                   :default-props="{label:'label'}"
                   height="100%"
                   filter
                   :default-checked-keys="defaultCheckedKeys"
                   :render-content-left="renderContent"
                   :render-content-right="renderContent"
                   @left-check-change="leftCheckChange"
                   @right-check-change="rightCheckChange"
                   @addBtn="add"
                   @removeBtn="remove">
      <div slot="title-left"
           class="top-select">
        <!-- {{ JSON.stringify(leftPost) }} -->
        <el-select v-model="leftPost"
                   style="width:100%;flex:1;"
                   placeholder="请选择岗位"
                   @change="handleSelectLeftOpt">
          <el-option v-for="(item,i) in leftOptions"
                     :key="i"
                     :disabled="item.disabled"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <span class="count">{{ leftCheckedTotalCount }}/{{ leftTotalCount }}</span>
      </div>
      <div slot="title-right"
           class="top-select">
        <el-select v-model="rightPost"
                   style="width:100%;flex:1;"
                   placeholder="请选择岗位"
                   @change="handleSelectRightOpt">
          <el-option v-for="(item,index) in rightOptions"
                     :key="index"
                     :disabled="item.disabled"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <span class="count">{{ rightCheckedTotalCount }}/{{ rightTotalCount }}</span>
      </div>
    </tree-transfer>
  </div>
</template>

<script>
import { postPeopleList, getAllJob, occupyJob } from '@/api/api'
import { translate } from '@/utils'
import treeTransfer from 'el-tree-transfer' // 引入
import { Notification } from 'element-ui'

export default {
  name: 'JobOccupy',
  components: {
    treeTransfer
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultCheckedKeys: [],
      // 岗位
      options: [],
      // 左边选的岗位
      leftPost: '',
      // 右边选的岗位
      rightPost: '',
      leftData: [
        //  {id: '1',
        //   pid: 0,
        //   label: '一级 1',
        //   children: []}
      ],
      rightData: [],
      leftTotalCount: 0,
      leftCheckedTotalCount: 0,
      rightTotalCount: 0,
      rightCheckedTotalCount: 0
    }
  },
  computed: {
    leftOptions() {
      return this.options.map(n => {
        return Object.assign({}, n, {
          disabled: n.value === this.rightPost
        })
      })
    },
    rightOptions() {
      return this.options.map(n => {
        return Object.assign({}, n, {
          disabled: n.value === this.leftPost
        })
      })
    }
  },

  watch: {},
  created() {
    // console.log(this.loading, '???')
  },
  mounted() {
  },
  methods: {
    init() {
      this.getJobOpt()
    },
    resetLeft() {
      // 清空全选按钮
      this.$refs.transferRef.clearChecked('left')
      // 清空已选项
      this.$refs.transferRef.from_check_keys = []
      // 清空筛选
      this.$refs.transferRef.filterFrom = ''
      // 清空源数据
      this.leftData = []
      // 清空已选人数
      this.leftCheckedTotalCount = 0
    },
    resetRight() {
      this.$refs.transferRef.clearChecked('right')
      this.$refs.transferRef.to_check_keys = []
      this.$refs.transferRef.filterTo = ''
      this.rightData = []
      this.rightCheckedTotalCount = 0
    },
    checkBtn() {
      // console.log(this.$refs.transferRef.from_check_keys, this.$refs.transferRef.to_check_keys)\
      if (this.leftPost === '' || this.rightPost === '') {
        this.$nextTick(() => {
          this.$refs.transferRef.from_disabled = true
          this.$refs.transferRef.to_disabled = true
        })
      } else {
        this.$refs.transferRef.from_disabled = !this.$refs.transferRef.from_check_keys.length
        this.$refs.transferRef.to_disabled = !this.$refs.transferRef.to_check_keys.length
      }
    },
    getTotalPeopleCounts(list) {
      let count = 0
      const refn = (data) => {
        data.forEach(n => {
          if (n.children.length) {
            refn(n.children)
          } else {
            count += 1
          }
        })
      }
      refn(list)
      return count
    },
    getCheckPeopleCounts(treeObj) {
      return treeObj.checkedNodes.filter(n => {
        return !n.children.length
      }).length
    },
    leftCheckChange(nodeObj, treeObj, checkAll) {
      // console.log(nodeObj, treeObj, checkAll)
      if (checkAll) {
        this.leftCheckedTotalCount = this.leftTotalCount
      } else {
        if (treeObj) {
          this.leftCheckedTotalCount = this.getCheckPeopleCounts(treeObj)
        } else {
          this.leftCheckedTotalCount = 0
        }
      }
      this.checkBtn()
    },
    rightCheckChange(nodeObj, treeObj, checkAll) {
      // console.log(nodeObj, treeObj, checkAll)
      if (checkAll) {
        this.rightCheckedTotalCount = this.rightTotalCount
      } else {
        if (treeObj) {
          this.rightCheckedTotalCount = this.getCheckPeopleCounts(treeObj)
        } else {
          this.rightCheckedTotalCount = 0
        }
      }
      this.checkBtn()
    },
    renderContent(h, { node, data, store }) {
      if (node.isLeaf) {
        return (
          <span class='custom-tree-node'>
            <svg-icon style='color:#999;margin-right:5px;' icon-class='user2' />
            <span>{node.label}</span>
          </span>)
      } else {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
          </span>)
      }
    },
    async handleSelectLeftOpt() {
      this.resetLeft()
      this.checkBtn()
      // console.log(this.leftPost)
      this.$emit('update:loading', true)
      this.leftData = await this.getPostPeopleList(this.leftPost)
      this.$emit('update:loading', false)
      // this.leftTotalCount = Math.random()
      this.leftTotalCount = this.getTotalPeopleCounts(this.leftData)
    },
    async handleSelectRightOpt() {
      this.resetRight()
      this.checkBtn()
      // console.log(this.rightPost)
      this.$emit('update:loading', true)
      this.rightData = await this.getPostPeopleList(this.rightPost)
      this.$emit('update:loading', false)
      this.rightTotalCount = this.getTotalPeopleCounts(this.rightData)
    },
    // 获取岗位下拉
    getJobOpt() {
      getAllJob().then(res => {
        this.options = [{
          label: '未分配',
          value: null
        }]
        res.data.forEach(n => {
          this.options.push({
            value: n.id,
            label: n.name,
            disabled: false
          })
        })
      })
    },
    // 获取岗位下的人员
    getPostPeopleList(jobId) {
      return new Promise((resolve, reject) => {
        postPeopleList({ jobId }).then(res => {
          resolve(translate(res.data.orgGraphVOList))
        })
      })
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
      // console.log('obj:', obj)

      this.$emit('update:loading', true)
      const users = obj.nodes.filter(n => {
        return !n.children.length
      }).map(m => m.userId)
      const data = {}
      data.userIdList = users
      data.jobId = this.rightPost
      // console.log(data)
      Notification.closeAll()
      occupyJob(data).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.$notify({
              title: '数据错误',
              message: res.data.join('<br/>'),
              dangerouslyUseHTMLString: true,
              type: 'warning',
              duration: 0
            })
          } else {
            this.leftTotalCount -= this.leftCheckedTotalCount
            this.rightTotalCount += this.leftCheckedTotalCount
            this.leftCheckedTotalCount = 0
            this.rightCheckedTotalCount = 0
            this.$message({
              message: '分配成功',
              type: 'success',
              duration: '3000'
            })
          }
        }
      }).finally(() => {
        this.$emit('update:loading', false)
        this.resetLeft()
        this.resetRight()
      })
      // console.log('users>>>>>>>>>>>>>>>>>>>>>>>', users, '<<<<<<<<<<<<<<<<<<<<<users')
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      this.$emit('update:loading', true)
      const users = obj.nodes.filter(n => {
        return !n.children.length
      }).map(m => m.userId)
      const data = {}
      data.userIdList = users
      data.jobId = this.leftPost
      // console.log(data)
      Notification.closeAll()
      occupyJob(data).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.$notify({
              title: '数据错误',
              message: res.data.join('<br/>'),
              dangerouslyUseHTMLString: true,
              type: 'warning',
              duration: 0
            })
          } else {
            this.leftTotalCount += this.rightCheckedTotalCount
            this.rightTotalCount -= this.rightCheckedTotalCount
            this.leftCheckedTotalCount = 0
            this.rightCheckedTotalCount = 0
            this.$message({
              message: '分配成功',
              type: 'success',
              duration: '3000'
            })
          }
        }
      }).finally(() => {
        this.resetLeft()
        this.resetRight()
        this.$emit('update:loading', false)
      })
      // console.log('users>>>>>>>>>>>>>>>>>>>>>>>', users, '<<<<<<<<<<<<<<<<<<<<<users')
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
      // console.log('obj:', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.job-container {
  // background: #fff;
  height: 100%;
  padding: 20px;
  ::v-deep .wl-transfer {
    .transfer-left,
    .transfer-right {
      overflow: hidden;
    }
    .transfer-title {
      // padding-right: 5px;
      // background: #fff;
      display: flex;
      align-items: center;
      .top-select {
        flex: 1;
        display: flex;
        .count {
          width: 100px;
          text-align: right;
          font-size: 14px;
          margin-left: 10px;
          color: #888;
        }
      }
    }
  }

  .left-select {
    display: inline-block;
  }
}
</style>
<style>
body {
  line-height: 1.15 !important;
  color: #444 !important;
}
</style>
