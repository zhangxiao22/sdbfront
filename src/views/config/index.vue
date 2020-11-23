<template>
  <div class="container">
    <el-tabs tab-position="left"
             value="2"
             type="border-card"
             style="height: 100%;">
      <template v-for="(item,i) of realTabList">
        <el-tab-pane v-if="!item.hide"
                     :key="i"
                     v-loading="item.loading"
                     :label="item.label">
          <component :is="item.component"
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
    UseCasePriority,
    CluePriority,
    HateMarketingCRM,
    NeverMarketingCRM,
    BlackListSMS
  },
  data() {
    return {
      tabList: [{
        label: '防打扰',
        component: 'NotDisturb',
        loading: false,
        roles: ['aaa']
      },
      {
        label: '全局网点分配比例',
        component: 'GlobalOutletDistribute',
        loading: false,
        roles: ['']
      },
      {
        label: '用例网点分配比例',
        component: 'UseCaseOutletDistribute',
        loading: false,
        roles: ['admin']
      },
      {
        label: '用例优先级',
        component: 'UseCasePriority',
        loading: false,
        roles: ['admin']
      },
      {
        label: '线索优先级',
        component: 'CluePriority',
        loading: false,
        roles: ['admin']

      },
      {
        label: '分配角色',
        component: 'Assign',
        loading: false,
        roles: ['admin']

      },
      {
        label: '厌恶营销名单（CRM）',
        component: 'HateMarketingCRM',
        loading: false,
        roles: ['admin']
      },
      {
        label: '不营销人员名单（CRM）',
        component: 'NeverMarketingCRM',
        loading: false,
        roles: ['admin']
      },
      {
        label: '黑名单（短信）',
        component: 'BlackListSMS',
        loading: false,
        roles: ['admin']
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
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
}
</style>
