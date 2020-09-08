<template>
  <div class="container">
    <el-tabs id="shun-list"
             v-model="activeName">
      <el-tab-pane v-for="(item,i) of tableData"
                   :key="i"
                   :label="item.name"
                   :name="item.id">
        {{ i }}{{ item.name }}
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      tableData: [
        {
          name: '用户管理',
          id: '1'
        }, {
          name: '配置管理',
          id: '2'
        }, {
          name: '角色管理',
          id: '3'
        }, {
          name: '定时任务补偿',
          id: '4'
        }
      ],
      activeName: '1'
    }
  },
  watch: {},
  mounted() {
    // this.$nextTick(() => {
    const el = document.querySelector('#shun-list .el-tabs__nav')
    console.log(el)
    const _this = this
    var sortable = Sortable.create(el, {
      onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
        console.log(newIndex, oldIndex)
        // const currRow = _this.tableData.splice(oldIndex - 1, 1)[0] // 鼠标拖拽当前的el-tabs-pane
        // _this.tableData.splice(newIndex - 1, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
      }
    })
    // })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
#shun-list .el-tabs__nav {
  border: 1px solid red;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
