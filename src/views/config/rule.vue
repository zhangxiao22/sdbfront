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
               @click="handleEditButton(scope.row)">修改</div>
          <div class="btn"
               style="color:#f56c6c;"
               @click="handleDeleteButton(scope.row)">删除</div>
        </div>
      </template>
    </shun-table>
    <!-- 右侧边 -->
    <el-drawer title="我是标题"
               size="80%"
               class="el-drawer-customer"
               :visible.sync="showDrawer">
      <div class="drawer-container">
        <el-form :inline="true"
                 :model="drawerForm">
          <el-form-item label="名称：">
            <el-input v-model="drawerForm.name"
                      placeholder="请填写名称" />
          </el-form-item>

          <el-form-item label="描述：">
            <el-input v-model="drawerForm.desc"
                      type="textarea"
                      style="width:500px;"
                      :rows="2"
                      placeholder="请输入描述" />
          </el-form-item>
        </el-form>
        {{ drawerForm.rule }}
        <div class="rule-container">
          <div class="el-form-item__label">
            规则：
            <el-button type="primary"
                       class="add-outside"
                       icon="el-icon-plus"
                       @click="handleAddOutside">添加</el-button>
          </div>
          <div class="rule-list">
            <div v-for="(item,pi) of drawerForm.rule"
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
                    <i v-show="item.stop"
                       class="el-icon-remove" />
                  </el-tooltip>
                  <el-tooltip class="item"
                              effect="dark"
                              :content="item.desc||'无描述'"
                              placement="top">
                    <div>{{ item.name }}</div>
                  </el-tooltip>
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
                     class="inside-box">
                  <div v-for="(child,i) of item.children"
                       :key="child.name"
                       class="c-item-box">
                    <div class="c-item">
                      <div class="el-icon-rank item-handle center-center bg" />
                      <div class="c-item-content bg">
                        <div class="num">{{ String(i + 1).padStart(2,'0') }}</div>
                        <div class="name">{{ child.name }}</div>
                      </div>
                      <div class="right bg">
                        <div class="btn touch-tap el-icon-edit" />
                        <div class="btn touch-tap el-icon-delete" />
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
                   style="max-width:400px;width:100%;">
          确 认
        </el-button>
      </div>
    </el-drawer>
    <!-- dialog -->
    <el-dialog title="规则"
               :visible.sync="showDialog"
               @close="handleCloseDialog">
      <el-form ref="drawerFormRef"
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
        <el-form-item label="强制退出："
                      prop="stop">
          <el-switch v-model="dialogForm.stop" />
        </el-form-item>
        <el-form-item label="描述："
                      prop="desc">
          <el-input v-model="dialogForm.desc"
                    type="textarea"
                    style="width:90%;"
                    :rows="2"
                    placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary"
                   :loading="dialogButtonLoading"
                   @click="ensureDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import Sortable from 'sortablejs'

import { } from '@/api/api'
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
      aaaa: 1,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showDrawer: true,
      showDialog: false,
      dialogButtonLoading: false,
      filterForm: {
      },
      form: {
      },
      searchForm: {
      },
      drawerForm: {
        rule: [
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
        ]
      },
      dialogForm: {
        name: '',
        stop: false,
        desc: ''
      },
      tableColumnList: [
        {
          prop: 'id',
          label: 'ID',
          width: 100
        },
        {
          prop: 'name',
          label: '名称',
          width: 100
        },
        {
          prop: 'status',
          label: '状态',
          width: 100
        },
        {
          prop: 'modifyTime',
          label: '更新时间',
          width: 150
        },
        {
          prop: 'description',
          label: '描述'
        },
        {
          prop: 'operate',
          label: '操作',
          width: 200,
          fixed: 'right',
          slot: true
        }
      ],
      tableData: [
        {
          id: 1,
          name: '123',
          description: '11111',
          status: '运行中',
          modifyTime: '1'
        }
      ]
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
      setTimeout(() => {
        this.renderOutSideSortable()
        // const el = document.querySelectorAll('.inside-box')[0]
        // this.renderInSideSortable(el)
      }, 1000)
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
    renderOutSideSortable() {
      const _this = this
      const el = document.querySelector('.rule-list')
      Sortable.create(el, {
        animation: 150,
        handle: '.drag-handle',
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.drawerForm.rule.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.drawerForm.rule.splice(newIndex, 0, currRow) // 添加至指定位置
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
      console.log('el>>>>???', el)
      Sortable.create(el, {
        animation: 150,
        handle: '.item-handle',
        filter: '.ignore-elements',
        draggable: '.c-item-box',
        onStart: function (evt) {
          // console.log(evt.oldIndex)
          _this.drawerForm.rule[0].dragging = true
          // evt.oldIndex // element index within parent
        },
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.drawerForm.rule[0].children.splice(oldIndex, 1)[0] // 删除拖拽项
          _this.drawerForm.rule[0].children.splice(newIndex, 0, currRow) // 添加至指定位置
          _this.drawerForm.rule[0].dragging = false
          // 重新渲染组件
          _this.drawerForm.rule[0].key += 1
          _this.$nextTick(() => {
            _this.renderInSideSortable(document.querySelectorAll('.inside-box')[0])
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
    handleAddInside(i) {
      this.dialogStatus = {
        position: 'inside',
        status: 'new'
      }
      this.insideIndex = i
      this.showDialog = true
    },
    handleOutsideEdit(pi) {
      console.log(pi)
      this.dialogStatus = {
        position: 'outside',
        status: 'edit'
      }
      this.outsideIndex = pi
      this.dialogForm = JSON.parse(JSON.stringify(this.drawerForm.rule[pi]))
      this.showDialog = true
    },
    handleOutsideDel(pi) {
      console.log(pi)
      this.drawerForm.rule.splice(pi, 1)
    },
    ensureDialog() {
      this.$refs['drawerFormRef'].validate((valid) => {
        if (valid) {
          console.log(this.dialogForm)
          if (this.dialogStatus.position === 'outside') {
            if (this.dialogStatus.status === 'new') {
              // outside new
              this.drawerForm.rule.push({
                id: new Date().getTime(),
                name: this.dialogForm.name,
                desc: this.dialogForm.desc,
                stop: this.dialogForm.stop,
                children: []
              })
              // 初始化
              this.$nextTick(() => {
                const el = document.querySelectorAll('.inside-box')[this.drawerForm.rule.length - 1]
                this.renderInSideSortable(el)
              })
            } else {
              // outside edit
              console.log(this.outsideIndex)
              this.drawerForm.rule[this.outsideIndex].name = this.dialogForm.name
              this.drawerForm.rule[this.outsideIndex].stop = this.dialogForm.stop
              this.drawerForm.rule[this.outsideIndex].desc = this.dialogForm.desc
            }
          } else if (this.dialogStatus.position === 'inside') {
            if (this.dialogStatus.status === 'new') {
              // inside new
              this.drawerForm.rule[this.insideIndex].children.push({
                id: new Date().getTime(),
                name: this.dialogForm.name,
                desc: this.dialogForm.desc,
                stop: this.dialogForm.stop
              })
            } else {
              // inside edit
            }
          }

          this.showDialog = false
        }
      })
    },

    resetDialog() {
      this.$refs['drawerFormRef'] && this.$refs['drawerFormRef'].resetFields()
    },
    handleAddList() {
      this.showDrawer = true
    },
    cancelAdd() {
      // this.$refs['regFormRef'].resetFields()
      this.showDrawer = false
    },
    ensureAdd() {
      this.showDrawer = false
      this.getList()
    },
    handleEditButton(row) {
      console.log(row)
    },

    handleDeleteButton(row) {
      this.$confirm(`是否确认删除规则（${row.name || ''}）？`)
        .then(() => {
          // this.loading = true
          // delEmpLeave({ empCode: row.id })
          //   .then(res => {
          //     if (res.code === 200) {
          //       this.$message({
          //         message: '删除成功',
          //         type: 'success',
          //         duration: '3000'
          //       })
          //       this.getList()
          //     }
          //   })
          //   .finally(() => {
          //     this.loading = false
          //   })
        })
    },
    handleEdit() { },
    handleDel() { },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      // this.loading = true
      // getEmpLeave(data)
      //   .then(res => {
      //     this.tableData = res.data.resultList
      //     this.total = res.pagination.totalItemCount
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
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
          margin-top: 10px;
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
                i {
                  color: $red;
                  font-size: 18px;
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
                    padding-right: 10px;
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
                      .num {
                        font-weight: lighter;
                        margin: 0 10px;
                      }
                      .name {
                        margin-right: 10px;
                      }
                    }

                    .right {
                      height: 100%;
                      display: flex;
                      align-items: center;
                      .btn {
                        cursor: pointer;
                        margin-left: 5px;
                        font-size: 14px;
                        // height: 100%;
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
