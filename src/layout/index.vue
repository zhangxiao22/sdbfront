<template>
  <div class="app-wrapper">
    <navbar/>
    <div class="main-container">
      <shun-sidebar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
  import {Navbar, ShunSidebar, AppMain} from './components'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
    name: 'Layout',
    components: {
      Navbar,
      ShunSidebar,
      AppMain
    },
    mixins: [ResizeMixin],
    computed: {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    .main-container {
      height: calc(100% - 60px);
      display: flex;
    }
  }
</style>
