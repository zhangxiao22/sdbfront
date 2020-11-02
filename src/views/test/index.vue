<template>
  <div class="container">
    <shun-table ref="table"
                :loading="loading"
                :show-selection="showSelection"
                :show-pagination="false"
                :multiple="multiple"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList" />
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getProductList, getProductCategoryList } from '@/api/api'

export default {
  name: 'Product',
  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 表格已选中项
    selectedItems: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,

      tableColumnList: [
        {
          prop: 'post',
          label: '岗位'
        },
        {
          prop: 'role',
          label: '角色'
        }
      ],
      tableData: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },

  watch: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData = [{
        post: '岗位1',
        role: '一般员工'
      }, {
        post: '岗位2',
        role: '管理员'
      }, {
        post: '业务主管',
        role: '审批员'
      }, {
        post: '行长',
        role: '超级管理员'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
