<template>
  <div class="navbar">
    <div class="left-menu">
      <!-- <img class="logo"
           src="@/assets/logo.png"> -->
      <svg-icon class="logo"
                icon-class="logo" />
      <div class="text">顺德农商银行大数据营销平台</div>
    </div>
    <div class="right-menu">
      <!-- <div class="message-container">
        <el-badge :value="12"
                  hidden
                  class="icon">
          <span class="svg-container message">
            <svg-icon icon-class="message" />
          </span>
        </el-badge>
        <span class="message-text">未读信息</span>
      </div> -->
      <div class="name-group">
        <el-tooltip class="item"
                    effect="dark"
                    placement="bottom">
          <div slot="content">
            <div v-for="(item,i) of user.orgInfoList"
                 :key="i"
                 style="margin:2px 0;">{{ item }}</div>
          </div>
          <div class="user-name">{{ user.userName }}</div>
        </el-tooltip>
        <!-- <div class="user-authority">{{ user.orgInfoList.join(',') }}</div> -->
        <div class="user-authority">{{ user.jobName }}</div>
      </div>
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
    padding-right: 14px;

    .logo {
      // width: 36px;
      font-size: 24px;
      width: 56px;
      // margin-right: 16px;
    }

    .text {
      font-size: 18px;
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
      padding: 0 10px;
      transition: all 0.3s;
      margin-right: 20px;
      &:hover {
        background: #f0f2f5;
      }

      .message {
        font-size: 24px;
        color: $blue;
      }

      .message-text {
        margin-left: 10px;
      }
    }

    .name-group {
      display: flex;
      height: 100%;
      align-items: center;

      .user-name {
        // margin-left: 8px;
        // cursor: pointer;
      }

      .user-authority {
        margin-left: 10px;
      }
    }
  }
}
</style>
