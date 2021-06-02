<template>
  <div class="container">
    <el-tabs tab-position="left"
             :value="tabIndex"
             type="border-card"
             style="height: 100%;"
             @tab-click="handleTabClick">
      <template v-for="(item,i) of realTabList">
        <el-tab-pane v-if="!item.hide"
                     :key="i"
                     v-loading="item.loading"
                     :label="item.label">
          <component :is="item.component"
                     ref="component"
                     :loading.sync="item.loading" />
        </el-tab-pane>
      </template>

    </el-tabs>
  </div>
</template>

<script>
import Employees from './employees'
import Agent from './agent'
import Appoint from './appoint'
import Assign from './assign'
import NotDisturb from './notDisturb'
import AssignRule from './assignRule'
import GlobalOutletDistribute from './globalOutletDistribute'
import UseCaseOutletDistribute from './usecaseOutletDistribute'
import JobOccupy from './jobOccupy'
import UseCasePriority from './useCasePriority'
import CluePriority from './cluePriority'
import HateMarketingCRM from './hateMarketingCRM'
import NeverMarketingCRM from './neverMarketingCRM'
import BlackListSMS from './blackListSMS'
import EventPriority from './eventPriority'
import { mapGetters } from 'vuex'

export default {
  components: {
    Employees,
    Agent,
    Appoint,
    Assign,
    NotDisturb,
    AssignRule,
    GlobalOutletDistribute,
    UseCaseOutletDistribute,
    JobOccupy,
    UseCasePriority,
    CluePriority,
    HateMarketingCRM,
    NeverMarketingCRM,
    BlackListSMS,
    EventPriority
  },
  data() {
    return {
      tabIndex: '0',
      tabList: [{
        label: '理财顾问指派',
        component: 'Appoint',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '分发规则参数',
        component: 'NotDisturb',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '全局网点分配比例',
        component: 'GlobalOutletDistribute',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '用例网点分配比例',
        component: 'UseCaseOutletDistribute',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '用例管理',
        component: 'UseCasePriority',
        loading: false,
        roles: ['线索统筹']
      },
      // {
      //   label: '线索优先级',
      //   component: 'CluePriority',
      //   loading: false,
      //   roles: ['用例管理']
      // },
      {
        label: '事件管理',
        component: 'EventPriority',
        loading: false,
        roles: ['用例管理']
      },
      {
        label: '岗位管理',
        component: 'Assign',
        loading: false,
        roles: ['业务管理']

      },
      {
        label: '岗位分配',
        component: 'JobOccupy',
        loading: false,
        roles: ['业务管理']
      },
      {
        label: '岗位员工',
        component: 'Employees',
        loading: false,
        roles: ['业务管理']
      },
      {
        label: '请假代办',
        component: 'Agent',
        loading: false,
        roles: ['线索统筹']
      },
      // {
      //   label: '分配规则',
      //   component: 'Rule',
      //   loading: false,
      //   roles: ['线索统筹']
      // },
      {
        label: '防打扰名单（CRM）',
        component: 'HateMarketingCRM',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '黑名单（短信）',
        component: 'BlackListSMS',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '不营销客户名单（CRM）',
        component: 'NeverMarketingCRM',
        loading: false,
        roles: ['线索统筹']
      }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    realTabList() {
      return this.tabList.filter(n => {
        if (this.roles === 'admin') {
          return true
        } else {
          return n.roles.includes(this.roles)
        }
      })
    }
  },
  watch: {},
  created() {
    // console.log('this.roles', this.roles)
  },
  mounted() {
    this.$refs.component[+this.tabIndex]?.init()
  },
  methods: {
    handleTabClick(val) {
      this.$refs.component[val.index].init()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  ::v-deep .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
