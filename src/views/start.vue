<template>
  <div class="wscn-http401-container center-center">
    <!-- <div>401</div> -->
    <el-button type="primary"
               @click="next('admin-token')">管理员</el-button>
    <el-button type="primary"
               @click="next('editor-token')">非管理员</el-button>
    <!-- {{ user }} -->
    <!-- {{ routes }} -->
  </div>
</template>

<script>
import { setToken, getToken, removeToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'Page401',
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
