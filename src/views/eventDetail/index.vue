<template>
  <div class="container">
    <div class="main-container shun-card">
      <div class="header">
        <el-page-header content="事件详情"
                        @back="goBack" />
        <el-divider class="header-divider" />
        <div class="button-group">
          <el-button v-if="roleJudge.canApprove"
                     type="success">审批通过</el-button>
          <el-popover v-if="roleJudge.canApprove"
                      v-model="popoverEdit"
                      placement="top"
                      width="300">
            <el-input v-model.trim="rejectText"
                      type="textarea"
                      :rows="5"
                      style="margin-bottom:10px;"
                      placeholder="请输入内容" />
            <div style="text-align: right; margin: 0">
              <el-button size="mini"
                         type="text"
                         @click="popoverEdit = false">取消</el-button>
              <el-button type="primary"
                         size="mini"
                         @click="popoverEdit = false">确定</el-button>
            </div>
            <el-button slot="reference"
                       type="danger"
                       style="margin-left:20px;">审批驳回</el-button>

          </el-popover>
        </div>
      </div>
      <Preview />
    </div>
  </div>

</template>

<script>
import Preview from '@/views/createEvent/components/Preview'
import { mapGetters } from 'vuex'

export default {
  components: {
    Preview
  },
  data() {
    return {
      roleJudge: {},
      popoverEdit: false,
      rejectText: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  watch: {},
  created() {
    this.roleJudge.canApprove = this.roles === '领导审批' || this.roles === 'admin'
  },
  methods: {
    goBack() {
      this.$router.push('/eventBoard')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  .main-container {
    min-height: 100%;
  }
  .header {
    padding: 16px;
    .header-divider {
      margin: 15px 0;
    }
    .button-group {
      margin-top: 16px;
    }
  }
  .preview-container {
    padding: 0;
  }
}
</style>
