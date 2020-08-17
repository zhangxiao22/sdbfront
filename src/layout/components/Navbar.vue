<template>
  <div class="navbar">
    <div class="left-menu">
      <img class="logo" src="@/assets/logo.png"/>
      <div class="text">顺德农商银行大数据营销平台</div>
    </div>
    <div class="right-menu">
      <div class="message-container">
        <el-badge :value="12" class="icon">
          <span class="svg-container message">
            <svg-icon icon-class="message"/>
          </span>
        </el-badge>
        <span class="message-text">未读信息</span>
      </div>

      <img class="profile" src="@/assets/profile.png"/>
      <div class="user-name">张三</div>
      <div class="user-authority">营销规划岗</div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'

  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .05);
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
</style>
