<template>
  <div class="container">
    <el-tabs tab-position="left"
             value="5"
             type="border-card"
             style="height: 100%;">
      <el-tab-pane label="防打扰">
        <NotDisturb />
      </el-tab-pane>
      <el-tab-pane label="分配比例">
        <Distribute />
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Assign from './assign'
import NotDisturb from './notDisturb'
import Distribute from './distribute'
import UseCasePriority from './useCasePriority'
import CluePriority from './cluePriority'
import HateMarketingCRM from './hateMarketingCRM'
import NeverMarketingCRM from './neverMarketingCRM'
import BlackListSMS from './blackListSMS'
export default {
  components: {
    Assign,
    NotDisturb,
    Distribute,
    UseCasePriority,
    CluePriority,
    HateMarketingCRM,
    NeverMarketingCRM,
    BlackListSMS
  },

  data() {
    return {

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
