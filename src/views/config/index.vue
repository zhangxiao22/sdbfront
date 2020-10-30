<template>
  <div class="container">
    <el-tabs tab-position="left"
             value="3"
             type="border-card"
             style="height: 100%;">
      <el-tab-pane label="防打扰">防打扰</el-tab-pane>
      <el-tab-pane label="分配比例">分配比例</el-tab-pane>
      <el-tab-pane label="优先级">优先级</el-tab-pane>
      <el-tab-pane label="分配角色">
        <el-table :data="tableData"
                  size="medium"
                  stripe
                  style="width: 100%">
          <el-table-column prop="date"
                           label="xxx"
                           width="180" />
          <el-table-column prop="address"
                           label="角色" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  components: {

  },

  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  watch: {},
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
}
</style>
