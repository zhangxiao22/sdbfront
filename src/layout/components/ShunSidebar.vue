<template>
  <div class="sidebar-container">
    <template v-for="(item,i) of menu">
      <el-tooltip :key="i"
                  class="item"
                  :content="item.title"
                  placement="right">
        <span class="svg-container"
              :class="{'active':item.active,'underline':item.underline}"
              @click="handleClick(item)">
          <svg-icon :icon-class="item.icon" />
        </span>
      </el-tooltip>

    </template>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {
      menu: []
    }
  },
  computed: {
    ...mapGetters([
      'routes'
    ])

  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.menu.forEach((n, i) => {
          // console.log(val, n)
          if (n.type === 'icon') {
            n.active = false
            if (val.name === n.name) {
              n.active = true
            }
          }
        })
      },
      deep: true
    },
    routes(val) {
      this.getMenu()
    }
  },
  created() {
    this.getMenu()
    // console.log(this.menu)
    // console.log('this.routes???', this.routes)
  },
  methods: {
    getMenu() {
      this.menu = []
      // console.log(this.routes)
      this.routes.forEach((n, i) => {
        if (n.path === '/') {
          n.children.forEach((m, j) => {
            // console.log(m)
            if (!m.meta.hide) {
              this.menu.push({
                type: 'icon',
                path: m.path,
                title: m.meta.title,
                name: m.name,
                icon: m.meta.icon,
                active: this.$route.name === m.name,
                underline: m.meta.underline
              })
            }
          })
        }
      })

      // console.log(this.menu)
    },
    handleClick(item) {
      // console.log(i)
      if (item.active) return
      this.$router.push(item.path)
    }

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
  // display: flex;
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
    position: relative;
    &.underline {
      &:after {
        content: "";
        position: absolute;
        width: 42px;
        height: 1px;
        background: #e0e2e5;
        left: 50%;
        bottom: -1px;
        transform: translateX(-50%);
      }
    }

    &:hover {
      color: $blue;
    }
    &.active {
      color: #fff;
      background: $blue;
    }
    &:focus {
      border: none;
      outline: none;
    }
  }
}
</style>
