<template>
  <section class="app-main">
    <div class="main-container">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key"/>
      </transition>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      key() {
        return this.$route.path
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 60px);
    /*width: 100%;*/
    flex: 1;
    position: relative;
    overflow: auto;
    background: #f0f2f5;
    padding: 16px;

    .main-container {
      background: #fff;
      border-radius: 4px;
      min-height: 100%;
    }
  }

</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  /*.el-popup-parent--hidden {*/
  /*.fixed-header {*/
  /*padding-right: 15px;*/
  /*}*/
  /*}*/
</style>
