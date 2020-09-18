<template>
  <div class="wscn-http401-container center-center">
    <el-button type="primary"
               @click="next('editor-token')">一般员工</el-button>
    <el-button type="primary"
               @click="next('admin-token')">审批人员</el-button>
    <el-button type="primary"
               @click="next('boss-token')">高级管理员</el-button>
    <!-- {{ user }} -->
    <!-- {{ routes }} -->
  </div>
</template>

<script>
import { setToken, getToken, removeToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'Start',
  computed: {
    ...mapGetters([
      'user',
      'routes'
    ])
  },
  created() {
    removeToken()
  },
  methods: {
    next(token) {
      // store存
      this.$store.commit('user/SET_TOKEN', token)
      // cookie存
      setToken(token)
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http401-container {
  height: 500px;
}
</style>
