<template>
  <div class="navbar">
    <div class="left-menu">
      <img class="logo"
           src="@/assets/logo.png">
      <div class="text">顺德农商银行大数据营销平台</div>
    </div>
    <div class="right-menu">
      <div class="message-container">
        <el-badge :value="12"
                  class="icon">
          <span class="svg-container message">
            <svg-icon icon-class="message" />
          </span>
        </el-badge>
        <span class="message-text">未读信息</span>
      </div>

      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img class="profile"
               :src="user.avatar">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-authority">{{ user.suBranchName }}</div>
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown"
                          @command="handleCommand">
          <el-dropdown-item @click.native="logout">切换用户</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    // Hamburger
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    handleCommand(command) {
      this.$message('click on item ' + command)
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/start?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  color: $blue;
  z-index: 2;

  .left-menu {
    display: flex;
    align-items: center;
    padding: 0 14px;

    .logo {
      width: 36px;
      margin-right: 16px;
    }

    .text {
      font-size: 20px;
      color: $blue;
    }
  }

  .right-menu {
    padding: 0 30px;
    display: flex;
    align-items: center;
    font-size: 14px;

    .message-container {
      display: flex;
      align-items: center;
      height: 100%;
      cursor: pointer;

      .message {
        font-size: 24px;
        color: $blue;
      }

      .message-text {
        margin-left: 10px;
      }
    }

    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      .profile {
        margin-left: 28px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
      }

      .user-name {
        margin-left: 8px;
        cursor: pointer;
      }

      .user-authority {
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
}
</style>
