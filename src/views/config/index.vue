<template>
  <div class="container">
    <el-tabs tab-position="left"
             value="0"
             type="border-card"
             style="height: 100%;">
      <el-tab-pane v-for="(item,i) of tabList"
                   :key="i"
                   v-loading="item.loading"
                   :label="item.label">
        <component :is="item.component"
                   :loading.sync="item.loading" />
      </el-tab-pane>
      <!-- <el-tab-pane v-loading="true"
                   label="防打扰">
        <NotDisturb />
      </el-tab-pane>
      <el-tab-pane label="全局网点分配比例">
        <GlobalOutletDistribute />
      </el-tab-pane>
      <el-tab-pane label="用例网点分配比例">
        <UseCaseOutletDistribute />
      </el-tab-pane>
      <el-tab-pane label="用例优先级">
        <UseCasePriority />
      </el-tab-pane>
      <el-tab-pane label="线索优先级">
        <CluePriority />
      </el-tab-pane>
      <el-tab-pane label="分配角色">
        <Assign />
      </el-tab-pane>
      <el-tab-pane label="厌恶营销名单（CRM）">
        <HateMarketingCRM />
      </el-tab-pane>
      <el-tab-pane label="不营销人员名单（CRM）">
        <NeverMarketingCRM />
      </el-tab-pane>
      <el-tab-pane label="黑名单（短信）">
        <BlackListSMS />
      </el-tab-pane> -->
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
        loading: false
      }]
    }
  },
  watch: {},
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
