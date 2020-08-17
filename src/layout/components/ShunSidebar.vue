<template>
  <div class="sidebar-container">
    <template v-for="item of menu">

      <el-tooltip v-if="item.type === 'icon'"
                  class="item"
                  effect="light"
                  :content="item.title"
                  placement="right">
        <span class="svg-container" :class="{'active':item.active}" @click="handleClick(item)">
          <svg-icon :icon-class="item.icon"/>
        </span>
      </el-tooltip>

      <div v-else class="line"></div>
    </template>

  </div>
</template>

<script>
  // import {mapGetters} from 'vuex'

  export default {
    components: {},
    computed: {
      // ...mapGetters([
      //   'name'
      // ]),

    },
    watch: {
      $route: {
        handler(val, oldval) {
          // console.log(val);//新路由信息
          // console.log(oldval);//老路由信息
          this.menu.forEach((n, i) => {
            // console.log(val, n)
            if (n.type === 'icon') {
              n.active = false;
              if (val.name === n.name) {
                n.active = true;
              }
            }
          })

        },
        deep: true
      }
    },
    data() {
      return {
        menu: [],
      }
    },
    created() {
      this.getMenu()
    },
    methods: {
      getMenu() {
        this.menu = [];
        // console.log(this.$router.options.routes)
        this.$router.options.routes.forEach((n, i) => {
          if (n.path === '/') {
            n.children.forEach((m, j) => {
              // console.log(m)
              this.menu.push({
                type: 'icon',
                path: m.path,
                title: m.meta.title,
                name: m.name,
                icon: m.meta.icon,
                active: this.$route.name === m.name,
              })
              if (m.meta.line) {
                this.menu.push({
                  type: 'line'
                })
              }
            })
          }
        })

        // console.log(this.menu)
      },
      handleClick(item) {
        this.$router.push(item.path);
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .sidebar-container {
    width: 56px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    /*padding: 8px 0;*/

    .svg-container {
      width: 56px;
      height: 56px;
      @include center-center;
      cursor: pointer;
      color: #909399;
      font-size: 24px;

      &:hover, &.active {
        color: $blue;
      }
      &:focus {
        border: none;
        outline: none;
      }
    }

    .line {
      /*margin-top: 8px;*/
      /*margin-bottom: 8px;*/
      width: 42px;
      height: 1px;
      background: #f0f2f5;
    }
  }
</style>
