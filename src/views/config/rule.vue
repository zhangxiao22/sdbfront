<template>
  <div class="container">
    <shun-table ref="table"
                title="分配规则"
                :loading="loading"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :is-card="false"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:main-buttons>
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新建规则
        </el-button>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEditRule(scope.row)">分配规则</div>
          <div v-if="scope.row.status.value!==1"
               class="btn"
               style="color:#1890FF;"
               @click="handleRunButton(scope.row)">运行</div>
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEditButton(scope.row)">编辑</div>
          <div v-if="scope.row.status.value!==1"
               class="btn"
               style="color:#f56c6c;"
               @click="handleDeleteButton(scope.row)">删除</div>
        </div>
      </template>
    </shun-table>
    <!-- 右侧边 -->
    <el-drawer title="分配规则"
               size="80%"
               class="el-drawer-customer"
               :visible.sync="showDrawer">
      <div class="drawer-container">
        <!-- {{ rules }} -->
        <div class="rule-container">
          <el-button type="primary"
                     class="add-outside"
                     icon="el-icon-plus"
                     @click="handleAddOutside">添加网点规则</el-button>
          <div class="rule-list">
            <div v-for="(item,pi) of rules"
                 :key="item.id"
                 class="p-item">
              <div class="item-header">
                <div class="el-icon-rank drag-handle center-center" />
                <span class="num center-center">{{ String(pi + 1).padStart(2,'0') }}</span>

                <span class="name">
                  <el-tooltip class="item"
                              effect="dark"
                              content="强制退出"
                              placement="top">
                    <svg-icon icon-class="stop"
                              class="remove icon" />
                    <!-- <i v-show="item.forceClose"
                       class="el-icon-remove" /> -->
                  </el-tooltip>
                  <el-tooltip class="item"
                              effect="dark"
                              content="强制匹配"
                              placement="top">
                    <i v-show="item.forceMatch"
                       class="el-icon-lock icon" />
                  </el-tooltip>
                  <!-- <el-tooltip class="item"
                              effect="dark"
                              :content="item.desc||'无描述'"
                              placement="top"> -->
                  <div>{{ item.name }}</div>
                  <!-- </el-tooltip> -->
                </span>
                <div class="right">
                  <el-tooltip class="item"
                              effect="dark"
                              content="编辑"
                              placement="top">
                    <div class="btn touch-tap el-icon-edit"
                         @click="handleOutsideEdit(pi)" />
                  </el-tooltip>
                  <el-popover v-model="item.showPop"
                              placement="top"
                              width="160">
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini"
                                 type="text"
                                 @click="item.showPop = false">取消</el-button>
                      <el-button type="primary"
                                 size="mini"
                                 @click="handleOutsideDel(pi);item.showPop = false">确定</el-button>
                    </div>
                    <el-tooltip slot="reference"
                                class="item"
                                :disabled="item.showPop"
                                effect="dark"
                                content="删除"
                                placement="top">
                      <div class="btn touch-tap el-icon-delete" />
                    </el-tooltip>
                  </el-popover>
                </div>
              </div>
              <div class="item-content">
                <div :key="item.key"
                     class="inside-box"
                     :pindex="pi">
                  <div v-for="(child,i) of item.children"
                       :key="child.name"
                       class="c-item-box">
                    <div class="c-item bg">
                      <div class="el-icon-rank item-handle center-center" />
                      <div class="c-item-content"
                           @mouseover="child.hover=true"
                           @mouseout="child.hover=false">
                        <div class="num">{{ String(i + 1).padStart(2,'0') }}</div>
                        <div class="name">
                          <svg-icon v-show="child.forceClose"
                                    icon-class="stop"
                                    class="remove icon" />
                          <!-- <i v-show="child.forceClose"
                             class="el-icon-remove icon" /> -->
                          <i v-show="child.forceMatch"
                             class="el-icon-lock icon" />
                          {{ child.name }}
                        </div>
                        <transition name="el-fade-in-linear">
                          <div v-show="child.hover"
                               class="right abs">
                            <div class="btn el-icon-view"
                                 @click="handleInsideEdit(pi,i)" />
                            <el-popover v-model="child.showPop"
                                        placement="top"
                                        width="160">
                              <p>确定删除吗？</p>
                              <div style="text-align: right; margin: 0">
                                <el-button size="mini"
                                           type="text"
                                           @click="child.showPop = false">取消</el-button>
                                <el-button type="primary"
                                           size="mini"
                                           @click="handleInsideDel(pi,i);child.showPop = false">确定</el-button>
                              </div>
                              <div slot="reference"
                                   class="btn el-icon-delete" />
                            </el-popover>
                          </div>
                          <!-- <div v-show="show"
                               class="transition-box">.el-fade-in-linear</div> -->
                        </transition>
                      </div>
                    </div>
                    <div class="el-icon-right arrow" />
                  </div>
                  <el-button v-if="!item.dragging"
                             class="add-inside ignore-elements"
                             size="mini"
                             icon="el-icon-plus"
                             @click="handleAddInside(pi)" />
                </div>
              </div>
              <div class="item-bottom">
                <svg-icon class="arrow"
                          icon-class="down-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-bottom">
        <el-button type="primary"
                   :loading="drawerButtonLoading"
                   :disabled="rowStatus===1"
                   style="max-width:400px;width:100%;"
                   @click="handleSureDrawer">
          确 认
        </el-button>
      </div>
    </el-drawer>
    <!-- dialog -->
    <el-dialog title="规则"
               :visible.sync="showDialog"
               @close="handleCloseDialog">
      <el-form ref="dialogFormRef"
               style="width:500px;margin:0 auto;"
               label-width="100px"
               :model="dialogForm">
        <el-form-item label="名称："
                      prop="name"
                      :rules="[{required: true, message: '请填写名称', trigger: 'blur'}]">
          <el-input v-model.trim="dialogForm.name"
                    placeholder="请填写名称"
                    clearable
                    style="width:90%;" />
        </el-form-item>
        <el-form-item label="调用类："
                      prop="clazz"
                      :rules="[{required: true, message: '请选择调用类', trigger: 'change'}]">
          <el-select v-model="dialogForm.clazz"
                     placeholder="请选择">
            <el-option v-for="item in dialogStatus.position === 'outside' ? parentOptions : childOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="强制匹配："
                      prop="forceMatch">
          <el-switch v-model="dialogForm.forceMatch" />
        </el-form-item>
        <el-form-item label="强制退出："
                      prop="forceClose">
          <el-switch v-model="dialogForm.forceClose" />
        </el-form-item>
        <!-- <el-form-item label="描述："
                      prop="desc">
          <el-input v-model="dialogForm.desc"
                    type="textarea"
                    style="width:90%;"
                    :rows="2"
                    placeholder="请输入描述" />
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary"
                   :loading="dialogButtonLoading"
                   @click="ensureDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!-- dialog2 -->
    <el-dialog title="规则"
               :visible.sync="showTableDialog"
               @close="handleCloseTableDialog">
      <el-form ref="dialogTableFormRef"
               style="width:500px;margin:0 auto;"
               label-width="100px"
               :model="dialogTableForm">
        <el-form-item label="名称："
                      prop="name"
                      :rules="[{required: true, message: '请填写名称', trigger: 'blur'}]">
          <el-input v-model.trim="dialogTableForm.name"
                    placeholder="请填写名称"
                    clearable
                    style="width:90%;" />
        </el-form-item>
        <el-form-item label="描述："
                      prop="desc">
          <el-input v-model="dialogTableForm.desc"
                    type="textarea"
                    style="width:90%;"
                    :rows="2"
                    placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showTableDialog = false">取 消</el-button>
        <el-button type="primary"
                   :loading="dialogButtonTableLoading"
                   @click="ensureTableDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import Sortable from 'sortablejs'

import {
  getRuleList,
  addRule,
  editRule,
  delRule,
  runRule,
  getRuleDetail,
  ruleClassList,
  updateRule
} from '@/api/api'
export default {
  name: 'Rule',
  components: {
    ShunTable
  },
  props: {
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDrawer: false,
      showDialog: false,
      showTableDialog: false,
      dialogButtonLoading: false,
      dialogButtonTableLoading: false,
      drawerButtonLoading: false,
      rowStatus: '',
      dialogStatus: {},
      filterForm: {
      },
      form: {
      },
      searchForm: {
      },
      parentOptions: [],
      childOptions: [],
      rules: [
        // {
        //   id: '1',
        //   name: 'sdfasfasdf',
        //   dragging: false,
        //   key: 1,
        //   children: [{
        //     id: '1',
        //     name: '111111111111'
        //   }, {
        //     id: '2',
        //     name: '22222222222'
        //   }, {
        //     id: '3',
        //     name: '333333333'
        //   }, {
        //     id: '4',
        //     name: '4444444444'
        //   }, {
        //     id: '5',
        //     name: '5555555555'
        //   }]
        // }, {
        //   id: '2',
        //   name: '222',
        //   dragging: false,
        //   children: []
        // }, {
        //   id: '3',
        //   name: '333',
        //   dragging: false,
        //   children: []
        // }
      ],
      dialogTableForm: {
        id: '',
        name: '',
        desc: ''
      },
      dialogForm: {
        name: '',
        forceMatch: false,
        forceClose: false,
        clazz: ''
        // desc: ''
      },
      tableColumnList: [
        {
          prop: 'id',
          label: 'ID',
          width: 50
        },
        {
          prop: 'name',
          label: '名称',
          width: 200
        },
        {
          prop: 'status.label',
          label: '状态',
          width: 100
        },
        {
          prop: 'mtime',
          label: '更新时间',
          width: 180
        },
        {
          prop: 'detail',
          label: '描述'
        },
        {
          prop: 'operate',
          label: '操作',
          width: 250,
          fixed: 'right',
          slot: true
        }
      ],
      tableData: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },
  watch: {},
  created() {
  },
  methods: {
    init() {
      this.search()
      this.getRuleClassOpt()
      // setTimeout(() => {
      //   this.renderOutSideSortable()
      // }, 3000)
      // const el = document.querySelectorAll('.inside-box')[0]
      // this.renderInSideSortable(el)
    },
    resetAll() {
      this.reset()
      // this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    dictionary(obj) {
      return {
        name: obj.name,
        forceMatch: obj.forceMatch,
        forceClose: obj.forceClose,
        clazz: obj.clazz
      }
    },
    renderOutSideSortable() {
      const _this = this
      const el = document.querySelector('.rule-list')
      Sortable.create(el, {
        animation: 150,
        handle: '.drag-handle',
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.rules.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.rules.splice(newIndex, 0, currRow) // 添加至指定位置
          // console.log(_this.aaa.toArray())
        },
        onChoose: function (/** Event*/evt) {
          console.log('choose')
          // evt.oldIndex // element index within parent
        },
        onChange: function (/** Event*/evt) {
          console.log('onChange')
          // evt.newIndex // most likely why this event is used is to get the dragging element's current index
          // same properties as onEnd
        }
        // onStart: function (/** Event*/evt) {
        //   evt.oldIndex // element index within parent
        // }
      })
    },
    renderInSideSortable(el) {
      const _this = this
      // const el = document.querySelectorAll('.inside-box')
      // console.log('el>>>>???', el)
      Sortable.create(el, {
        animation: 150,
        handle: '.item-handle',
        filter: '.ignore-elements',
        draggable: '.c-item-box',
        onStart: function (evt) {
          // console.log(evt.oldIndex)
          _this.rules[0].dragging = true
          // evt.oldIndex // element index within parent
        },
        onEnd(event) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          // console.log(event)
          const { oldIndex, newIndex, target } = event
          const pindex = event.target.getAttribute('pindex')
          // console.log(this.$refs[])
          const currRow = _this.rules[pindex].children.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.rules[pindex].children.splice(newIndex, 0, currRow) // 添加至指定位置
          _this.rules[pindex].dragging = false
          // 重新渲染组件
          _this.rules[pindex].key += 1
          _this.$nextTick(() => {
            _this.renderInSideSortable(document.querySelectorAll('.inside-box')[pindex])
          })
        }
      })
    },
    handleCloseTableDialog() {
      this.$refs['dialogTableFormRef'].resetFields()
      this.dialogTableForm.id = ''
    },
    ensureTableDialog() {
      // dialogTableFormRef
      this.$refs['dialogTableFormRef'].validate((valid) => {
        if (valid) {
          // console.log(this.dialogTableForm)
          const ajax = this.dialogTableForm.id ? editRule : addRule
          const data = {
            name: this.dialogTableForm.name,
            detail: this.dialogTableForm.desc,
            id: this.dialogTableForm.id
          }
          this.dialogButtonTableLoading = true
          ajax(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showTableDialog = false
              this.getList()
            }
          }).finally(() => {
            this.dialogButtonTableLoading = false
          })
        }
      })
    },
    handleCloseDialog() {
      this.resetDialog()
    },
    handleAddOutside() {
      this.dialogStatus = {
        position: 'outside',
        status: 'new'
      }
      this.showDialog = true
    },
    handleAddInside(pi) {
      this.dialogStatus = {
        position: 'inside',
        status: 'new'
      }
      this.outsideIndex = pi
      this.showDialog = true
    },
    handleOutsideEdit(pi) {
      // console.log(pi)
      this.dialogStatus = {
        position: 'outside',
        status: 'edit'
      }
      this.outsideIndex = pi
      this.dialogForm = JSON.parse(JSON.stringify(this.rules[pi]))
      this.showDialog = true
    },
    handleOutsideDel(pi) {
      // console.log(pi)
      this.rules.splice(pi, 1)
    },
    handleInsideEdit(pi, i) {
      console.log(pi, i)
      this.dialogStatus = {
        position: 'inside',
        status: 'edit'
      }
      this.outsideIndex = pi
      this.insideIndex = i
      this.dialogForm = JSON.parse(JSON.stringify(this.rules[pi].children[i]))
      this.showDialog = true
    },
    handleInsideDel(pi, i) {
      // console.log(pi, i)
      this.rules[pi].children.splice(i, 1)
    },
    ensureDialog() {
      this.$refs['dialogFormRef'].validate((valid) => {
        if (valid) {
          console.log(this.dialogForm)
          if (this.dialogStatus.position === 'outside') {
            if (this.dialogStatus.status === 'new') {
              // outside new
              this.rules.push(
                Object.assign({}, this.dictionary(this.dialogForm), {
                  id: new Date().getTime(), /* 重要 */
                  key: 1, /* 重要 */
                  dragging: false,
                  showPop: false,
                  children: []
                })
              )
              // 初始化
              this.$nextTick(() => {
                const el = document.querySelectorAll('.inside-box')[this.rules.length - 1]
                this.renderInSideSortable(el)
              })
            } else {
              // outside edit
              // console.log(this.outsideIndex)
              // this.rules[this.outsideIndex].name = this.dialogForm.name
              // this.rules[this.outsideIndex].forceMatch = this.dialogForm.forceMatch
              // this.rules[this.outsideIndex].forceClose = this.dialogForm.forceClose
              // this.rules[this.outsideIndex].clazz = this.dialogForm.clazz
              this.rules[this.outsideIndex] = Object.assign(
                {},
                this.rules[this.outsideIndex],
                this.dictionary(this.dialogForm)
              )
            }
          } else if (this.dialogStatus.position === 'inside') {
            if (this.dialogStatus.status === 'new') {
              // inside new
              this.rules[this.outsideIndex].children.push(
                Object.assign(
                  {},
                  this.dictionary(this.dialogForm),
                  {
                    id: new Date().getTime(),
                    showPop: false,
                    hover: false
                  }
                )
              )
            } else {
              // inside edit
              let child = this.rules[this.outsideIndex].children[this.insideIndex]
              child = Object.assign(child, this.dictionary(this.dialogForm))
              // child.name = this.dialogForm.name
              // child.forceMatch = this.dialogForm.forceMatch
              // child.forceClose = this.dialogForm.forceClose
              // child.clazz = this.dialogForm.clazz
              // child.desc = this.dialogForm.desc
            }
          }
          this.showDialog = false
        }
      })
    },

    resetDialog() {
      this.$refs['dialogFormRef'].resetFields()
    },
    handleAddList() {
      this.showTableDialog = true
    },
    cancelAdd() {
      // this.$refs['regFormRef'].resetFields()
      this.showDrawer = false
    },
    ensureAdd() {
      this.showDrawer = false
      this.getList()
    },
    // 分配规则
    handleEditRule(row) {
      this.showDrawer = true
      this.rowStatus = row.status.value
      this.ruleId = row.id
      getRuleDetail({ id: row.id }).then(res => {
        this.rules = res.data.details.map(n => {
          return Object.assign({}, this.dictionary(n), {
            id: n.id, /* 重要 */
            key: 1, /* 重要 */
            dragging: false,
            showPop: false,
            children: n.subDetails.map(m => {
              return Object.assign({}, this.dictionary(m), {
                id: m.id,
                showPop: false,
                hover: false
              })
            })
          })
        })
        this.$nextTick(() => {
          this.renderOutSideSortable()
          const el = document.querySelectorAll('.inside-box')
          el.forEach(n => {
            this.renderInSideSortable(n)
          })
        })
      })
    },
    // 运行
    handleRunButton(row) {
      // runRule()
      this.$confirm(`运行后将不可还原，是否确认运行规则（${row.name || ''}）？`)
        .then(() => {
          this.loading = true
          runRule({ id: row.id })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: '3000'
                })
                this.getList()
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
    },
    // 编辑
    handleEditButton(row) {
      this.dialogTableForm.id = row.id
      this.dialogTableForm.name = row.name
      this.dialogTableForm.desc = row.detail
      // this
      this.showTableDialog = true
    },
    // 删除
    handleDeleteButton(row) {
      this.$confirm(`是否确认删除规则（${row.name || ''}）？`)
        .then(() => {
          this.loading = true
          delRule({ id: row.id })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: '3000'
                })
                this.getList(1)
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
    },
    // 确认分配规则
    handleSureDrawer() {
      // console.log(this.rules)
      if (this.rules.length) {
        const details = this.rules.map(n => {
          return Object.assign({}, this.dictionary(n), {
            detail: n.children.map(m => {
              return this.dictionary(m)
            })
          })
        })
        console.log(JSON.stringify(details))
        const data = {
          id: this.ruleId,
          details
        }
        this.drawerButtonLoading = true
        updateRule(data).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: '3000'
            })
            this.showDrawer = false
            // this.getList(1)
          }
        }).finally(() => {
          this.drawerButtonLoading = false
        })
        //
      } else {
        this.$message({
          message: '请选择规则',
          type: 'error',
          duration: '3000'
        })
      }
    },
    getRuleClassOpt() {
      ruleClassList({ type: 1 }).then(res => {
        this.parentOptions = res.data
      })
      ruleClassList({ type: 0 }).then(res => {
        this.childOptions = res.data
      })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getRuleList(data)
        .then(res => {
          this.tableData = res.data.resultList
          this.total = res.pagination.totalItemCount
        })
        .finally(() => {
          this.loading = false
        })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  // .btn {
  //   cursor: pointer;
  // }
  .el-drawer-customer {
    ::v-deep .el-drawer {
      background: #f8f8fa;
      .el-drawer__body {
        display: flex;
        flex-direction: column;
      }
    }
    .drawer-container {
      padding: 0 20px;
      flex: 1;
      min-height: 0;
      overflow: auto;
      .rule-container {
        // display: flex;
        .el-form-item__label {
          font-weight: bold;
          line-height: 32px;
          float: none;
          display: flex;
        }
        .rule-list {
          margin-top: 20px;
          .p-item {
            width: 100%;
            // background: #fff;
            &:last-of-type {
              .item-bottom {
                display: none;
              }
            }
            &.sortable-ghost {
              .item-header,
              .item-header .num,
              .item-content {
                background: #ccffff;
              }
            }

            &.sortable-drag {
              .item-bottom {
                display: none;
              }
            }
            .item-header {
              // background: #fff;
              background: #fefdfc;
              // border: 1px solid;
              height: 38px;
              border: 1px solid #ebeef5;
              // border-bottom: 1px solid #ebeef5;
              display: flex;
              align-items: center;
              padding-right: 10px;
              border-radius: 4px 4px 0 0;
              .drag-handle {
                height: 100%;
                // background: #aaa;
                color: $blue;
                width: 38px;
                cursor: grab;
                font-size: 16px;
                border-right: 1px solid #ebeef5;
                // background: $blue;
                &:hover {
                  font-weight: bold;
                }
              }
              .num {
                height: 100%;
                width: 38px;
                // color: #888;
                font-weight: lighter;
                // background: #fff;
                // border-right: 1px solid #ebeef5;
              }
              .name {
                font-weight: bold;
                height: 100%;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .el-icon-lock {
                  color: $blue;
                  font-size: 16px;
                  margin-right: 6px;
                }
                .remove {
                  color: $red;
                  font-size: 16px;
                  margin-right: 6px;
                }
              }
              .right {
                margin-left: auto;
                .btn {
                  cursor: pointer;
                  margin-left: 15px;
                  font-size: 16px;
                  height: 100%;
                  &:hover {
                    opacity: 0.6;
                  }
                }
                .el-icon-edit {
                  color: $blue;
                }
                .el-icon-delete {
                  color: $red;
                }
              }
            }
            .item-content {
              display: flex;
              flex-wrap: wrap;
              border: 1px solid #ebeef5;
              border-top: none;
              border-radius: 0 0 4px 4px;
              background: #fff;
              padding: 10px;
              .inside-box {
                display: inline-flex;
                flex-wrap: wrap;
                position: relative;
                margin-bottom: -10px;
                // padding: 10px;
                .c-item-box {
                  box-sizing: border-box;
                  display: inline-flex;
                  height: 40px;
                  align-items: center;
                  margin-bottom: 10px;
                  &:last-of-type {
                    margin-right: 10px;
                    .arrow {
                      display: none;
                    }
                  }
                  &.sortable-ghost {
                    .bg {
                      background: #ccffff;
                    }
                  }

                  &.sortable-drag {
                    .arrow {
                      display: none;
                    }
                  }
                  .c-item {
                    background: #fefdfc;
                    // padding-right: 10px;
                    height: 100%;
                    border-radius: 4px;
                    border: 1px solid #ebeef5;
                    display: flex;
                    align-items: center;
                    .item-handle {
                      cursor: grab;
                      color: $blue;
                      height: 100%;
                      width: 40px;
                      border-right: 1px solid #ebeef5;
                      &:hover {
                        font-weight: bold;
                      }
                    }
                    .c-item-content {
                      height: 100%;
                      flex: 1;
                      display: flex;
                      align-items: center;
                      position: relative;
                      min-width: 70px;
                      .num {
                        font-weight: lighter;
                        margin: 0 10px;
                      }
                      .name {
                        margin-right: 12px;
                        .icon {
                          margin-right: 4px;
                        }
                        .el-icon-lock {
                          color: $blue;
                        }
                        .remove {
                          color: $red;
                        }
                      }

                      .right {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fefdfc;
                        .btn {
                          text-align: center;
                          width: 30px;
                          height: 30px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          border-radius: 4px;
                          background: #f4f4f4;
                          cursor: pointer;
                          // margin-left: 10px;
                          font-size: 14px;
                          color: #fff;
                          transition: all 0.3s;
                          // height: 100%;
                          &:hover {
                            opacity: 0.6;
                          }
                        }
                        .el-icon-view {
                          background: $blue;
                          margin-right: 10px;
                        }
                        .el-icon-delete {
                          background: $red;
                        }
                      }
                    }
                  }
                  .arrow {
                    margin: 0 4px;
                    font-size: 18px;
                    color: #ccc;
                  }
                }
              }
              .add-inside {
                border-style: dashed;
                height: 40px;
                margin-bottom: 10px;
                // margin-left: 12px;
              }
            }
            .item-bottom {
              text-align: center;
              .arrow {
                font-size: 20px;
                color: #bbb;
                margin: 5px 0;
                transform: scaleX(1.5);
              }
            }
            // &:hover {
            //   box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            // }
          }
          .add-outside {
            margin-top: 20px;
          }
        }
      }
    }
    .drawer-bottom {
      margin-top: auto;
      padding: 20px;
      text-align: center;
    }
  }
}
</style>
