<template>
  <div class="container">
    <div class="title-container">
      <div class="title">事件看板</div>
      <el-button class="button"
                 type="primary">
        新建营销事件
      </el-button>
    </div>
    <div class="filter-container-box">
      <el-form :inline="true"
               :model="filterForm"
               class="filter-container">
        <el-form-item label="事件名称：">
          <el-input v-model="filterForm.value3"
                    style="width:300px"
                    placeholder="搜索事件名称"
                    clearable
                    prefix-icon="el-icon-search" />
        </el-form-item>
        <el-form-item label="事件类型：">
          <el-select v-model="filterForm.value1"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options1"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人：">
          <el-select v-model="filterForm.value2"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in options2"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="起止日期：">
          <el-date-picker v-model="filterForm.value4"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item class="filter-item-end">
          <el-button type="primary"
                     icon="el-icon-search">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh">
            重置
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="table-container shun-card">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item of tabList"
                     :key="item.value">
          <div slot="label"
               class="tab-label">
            {{ item.name }}
            <div class="count"
                 :style="{background:item.color}">{{ item.count }}</div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-table :data="tableData"
                class="table"
                size="medium"
                stripe
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column prop="id"
                         label="事件ID"
                         min-width="100px"
                         sortable />
        <el-table-column min-width="300px"
                         label="状态/名称/起止日期"
                         :filters="[{text: '状态1', value: '1'}, {text: '状态2', value: '2'}, {text: '状态3', value: '3'}, {text: '状态4', value: '4'}]">
          <template slot-scope="scope">
            <div class="name-group">
              <div class="top">
                <div class="status">进行中</div>
                <el-tooltip effect="light"
                            :content="scope.row.name"
                            placement="top-start">
                  <div class="name elip bold"
                       @click="eventDetail(scope.row.id)">
                    {{ scope.row.name }}
                  </div>
                </el-tooltip>
              </div>
              <div class="bottom">
                {{ scope.row.start_time }} - {{ scope.row.end_time }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推送类型"
                         min-width="150px">
          <template slot-scope="scope">
            <div class="td-group">
              <div class="top bold">
                规则型
              </div>
              <div class="bottom">
                每天09:00
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="触达渠道"
                         min-width="150px">
          <template slot-scope="scope">
            <div class="td-group">
              <div class="top bold">
                电话营销
              </div>
              <div class="bottom">
                电销
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最近一次（天）计划触达/目标完成率"
                         sortable
                         min-width="300px">
          <template slot-scope="scope">
            <div class="main-group">
              <div class="left">
                4,567<span class="unit">人次</span>
              </div>
              <div class="right">
                <el-progress type="circle"
                             style="margin-right:10px"
                             :show-text="false"
                             :stroke-width="3"
                             :width="20"
                             :percentage="33.3" />
                <b>33.3%</b>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         sortable
                         min-width="200px"
                         label="整体目标完成率">
          <template slot-scope="scope">
            <div class="td-group">
              <div class="top">策略组 7.00%</div>
              <div class="bottom">对照组 0%</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         width="280px">
          <template slot-scope="scope">
            <div class="action-group">
              <div class="btn"
                   style="color:#1890FF">复制</div>
              <div class="btn"
                   style="color:#F56C6C;">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :current-page="currentPage"
                     background
                     style="margin-top:10px;text-align:right;"
                     :page-sizes="[10, 20, 30]"
                     :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="400"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options1: [
        {
          value: '1',
          label: '事件类型1'
        },
        {
          value: '2',
          label: '事件类型2'
        },
        {
          value: '3',
          label: '事件类型3'
        },
        {
          value: '4',
          label: '事件类型4'
        },
        {
          value: '5',
          label: '事件类型5'
        }
      ],

      options2: [
        {
          value: '1',
          label: '创建人1'
        },
        {
          value: '2',
          label: '创建人2'
        },
        {
          value: '3',
          label: '创建人3'
        },
        {
          value: '4',
          label: '创建人4'
        },
        {
          value: '5',
          label: '创建人5'
        }
      ],

      options3: [
        {
          value: '1',
          label: '触达渠道1'
        },
        {
          value: '2',
          label: '触达渠道2'
        },
        {
          value: '3',
          label: '触达渠道3'
        },
        {
          value: '4',
          label: '触达渠道4'
        },
        {
          value: '5',
          label: '触达渠道5'
        }
      ],

      filterForm: {
        value1: '',
        value2: '',
        value3: '',
        value4: ''
      },
      activeName: '0',
      tabList: [
        {
          name: '全部',
          color: '#224191',
          count: 100
        },
        {
          name: '进行中',
          count: 25,
          color: '#67c23a'

        },
        {
          name: '暂停中',
          color: '#f90',
          count: 25
        }, {
          name: '待审批',
          color: '#1890FF',
          count: 25
        }, {
          name: '已结束',
          color: '#909399',
          count: 25
        }
      ],
      tableData: [
        {
          id: '2222',
          status: 1,
          name: '少儿医疗保险精准营销计划',
          start_time: '2020-03-03 00:00',
          end_time: '2020-03-03 10:00',
          push_type: '规则型',
          push_name: '每天 09:00',
          channel_type: '电话营销',
          channel_name: '电话',
          aaa: '4,768',
          aaa_unit: '人',
          percent: '0.33',
          p_1: '0.7',
          p_2: '0.66'
        }, {
          id: '3333',
          name: '少儿医疗保险精准营销计划2',
          start_time: '2020-03-03 00:00',
          end_time: '2020-03-03 10:00'
        }, {
          id: '4444',
          name: '少儿医疗保险精准营销计划3',
          start_time: '2020-03-03 00:00',
          end_time: '2020-03-03 10:00'
        }, {
          id: '5555',
          name: '少儿医疗保险精准营销计划4',
          start_time: '2020-03-03 00:00',
          end_time: '2020-03-03 10:00'
        }
      ],
      currentPage: 1
    }
  },
  watch: {},
  methods: {
    eventDetail(id) {
      this.$router.push({
        path: '/eventDetail', query: {
          id
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  flex: 1;
  display: flex;
  flex-direction: column;

  .title-container {
    display: flex;
    align-items: center;

    .title {
      font-size: 20px;
      color: #303133;
      font-weight: bold;
    }

    .button {
      margin-left: 12px;
    }
  }
  .filter-container-box {
    overflow: hidden;
    .filter-container {
      margin-top: 20px;
      margin-right: -20px;
      overflow-x: hidden;
      .filter-item-end {
        float: right;
      }
    }
  }
}
.table-container {
  flex: 1;
  margin-top: 16px;
  padding: 6px 16px 16px;

  ::v-deep .el-tabs__nav-wrap::after {
    content: none;
  }
  .tab-label {
    display: flex;
    align-items: center;

    .count {
      height: 20px;
      padding: 0 8px;
      font-size: 10px;
      color: #fff;
      display: flex;
      align-items: center;
      border-radius: 2px;
      margin-left: 5px;
    }
  }

  .table {
    .name-group {
      // padding-top: 5px;
      .top {
        display: flex;
        .status {
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          border-radius: 2px;
          border-radius: 2px;
          width: 52px;
          height: 22px;
          @include center-center;
          color: #52c41a;
          margin-right: 5px;
          font-size: 12px;
        }
        .name {
          flex: 1;
          color: $blue;
          cursor: pointer;
        }
      }
    }
    .main-group {
      display: flex;
      .left {
        font-size: 20px;
        .unit {
          font-size: 12px;
        }
      }
      .right {
        margin-left: 40px;
        font-size: 18px;
        display: flex;
        align-items: center;
      }
    }
    .action-group {
      display: flex;
      flex-wrap: wrap;
      .btn {
        width: 40px;
        height: 30px;
        cursor: pointer;
        @include center-center;
        margin-right: 10px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
