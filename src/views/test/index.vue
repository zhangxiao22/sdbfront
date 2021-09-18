<template>
  <div class="container">
    <el-table :data="parseTable(product)"
              :span-method="objectSpanMethod"
              border
              style="width: 100%;margin-bottom:18px;">
      <el-table-column prop="groupName"
                       label="组合" />
      <el-table-column prop="amount1"
                       min-width="100"
                       label="综合收益" />
      <el-table-column prop="productName"
                       min-width="120"
                       label="产品名称" />
      <el-table-column prop="productType"
                       label="产品类型" />
      <el-table-column prop="risklLevel"
                       label="风险等级" />
      <el-table-column prop="rateOfReturn"
                       min-width="150"
                       label="收益率/行业比较基准" />
      <el-table-column prop="minimumPurchaseAmount"
                       label="起购金额" />
      <el-table-column prop="begin_time"
                       label="起息日" />
      <el-table-column prop="end_time"
                       label="到期日" />
      <el-table-column prop="proportion"
                       label="比例" />
    </el-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList, getStragetyList, fuzzySearch } from '@/api/api'

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      product: {
        groupName: '组合A',
        amount1: '3.065-3.385%',
        list: [
          {
            productName: '顺盈2号',
            productType: '开放式理财',
            risklLevel: 'R2',
            rateOfReturn: '2.8-3.2%',
            minimumPurchaseAmount: '10000',
            begin_time: 'XXXX',
            end_time: 'XXXX',
            proportion: '50%'
          },
          {
            productName: '顺盈3号',
            productType: '开放式理财',
            risklLevel: 'R2',
            rateOfReturn: '2.8-3.2%',
            minimumPurchaseAmount: '10000',
            begin_time: 'XXXX',
            end_time: 'XXXX',
            proportion: '30%'
          },
          {
            productName: '三年期定期',
            productType: '存款',
            risklLevel: '',
            rateOfReturn: '4.13%',
            minimumPurchaseAmount: '50',
            begin_time: 'T',
            end_time: 'T+3年',
            proportion: '20%'
          }
        ]
      }
    }
  },
  computed: {
  },
  watch: {},
  created() {
    console.log(this.parseTable(this.product))
  },
  mounted() {
  },
  methods: {
    parseTable(data) {
      return data.list.map((n, i) => {
        return Object.assign({
          groupName: data.groupName,
          amount1: data.amount1,
          total: data.list.length
        }, n)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'groupName' || column.property === 'amount1') {
        if (rowIndex === 0) {
          return {
            rowspan: row.total,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .box {
    width: 400px;
    display: inline-flex;
    flex-wrap: wrap;
    span {
      height: 30px;
      border: 1px solid;
      margin: 0 20px;
    }
  }
}
</style>
