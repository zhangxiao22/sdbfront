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
import Assign from './assign'
import NotDisturb from './notDisturb'
import GlobalOutletDistribute from './globalOutletDistribute'
import UseCaseOutletDistribute from './usecaseOutletDistribute'
import JobOccupy from './jobOccupy'
import UseCasePriority from './useCasePriority'
import CluePriority from './cluePriority'
import HateMarketingCRM from './hateMarketingCRM'
import NeverMarketingCRM from './neverMarketingCRM'
import BlackListSMS from './blackListSMS'
import { mapGetters } from 'vuex'

export default {
  components: {
    Assign,
    NotDisturb,
    GlobalOutletDistribute,
    UseCaseOutletDistribute,
    JobOccupy,
    UseCasePriority,
    CluePriority,
    HateMarketingCRM,
    NeverMarketingCRM,
    BlackListSMS
  },
  data() {
    return {
      tabIndex: '5',
      tabList: [{
        label: '防打扰',
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
        label: '用例优先级',
        component: 'UseCasePriority',
        loading: false,
        roles: ['线索统筹']
      },
      {
        label: '线索优先级',
        component: 'CluePriority',
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
        label: '厌恶营销名单（CRM）',
        component: 'HateMarketingCRM',
        loading: false,
        roles: ['事件注册', '用例管理']
      },
      {
        label: '不营销人员名单（CRM）',
        component: 'NeverMarketingCRM',
        loading: false,
        roles: ['事件注册', '用例管理']
      },
      {
        label: '黑名单（短信）',
        component: 'BlackListSMS',
        loading: false,
        roles: ['事件注册', '用例管理']
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
    this.$refs.component[+this.tabIndex].init()
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
