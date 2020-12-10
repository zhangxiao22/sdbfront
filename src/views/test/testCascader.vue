<template>
  <div class="container">

    <el-cascader v-model="value"
                 placeholder="试试搜索：指南"
                 :options="options"
                 filterable />
  </div>
</template>

<script>
const _ = require('lodash')
var ARRAY = [
  {
    first: 'aaa',
    second: 'aa',
    three: 'a',
    id: '1'
  }, {
    first: 'bbb',
    second: 'bb',
    three: 'b',
    id: '2'
  }, {
    first: 'ccc',
    second: 'cc',
    three: 'c',
    id: '3'
  }, {
    first: 'ddd',
    second: 'dd',
    three: 'd',
    id: '4'
  }, {
    first: 'eee',
    second: 'ee',
    id: '5',
    three: 'e'
  }, {
    first: 'fff',
    second: 'ff',
    id: '6',
    three: 'f'
  }, {
    first: 'ggg',
    second: 'gg',
    three: 'g',
    id: '7'
  },
  // /////////////////
  {
    first: 'aaa',
    second: 'hh',
    three: 'h',
    id: '8'
  }, {
    first: 'aaa',
    second: 'aa',
    three: 'i',
    id: '9'
  }, {
    first: 'aaa',
    second: 'aa',
    three: 'a',
    id: '10'
  },
  // {
  //   first: 'bbb',
  //   second: 'aa',
  //   three: 'a',
  //   id: '11'

  // },
  {
    first: 'bbb',
    second: 'aa',
    three: 'l',
    id: '12'
  },
  {
    first: 'bbb',
    second: 'aa',
    three: 'l',
    id: '12'
  }
]
export default {
  components: {
  },

  data() {
    return {
      options: [],
      value: ['aaa', 'aa', '1']
    }
  },
  computed: {

  },

  watch: {

  },
  created() {
    setTimeout(() => {
      this.options = this.listToTree(
        _.uniqBy(
          this.getList(),
          'value', 'pid', 'label'
        )
      )
    }, 3000)
    // console.log(this.options)
  },
  mounted() {

  },
  methods: {
    listToTree(oldArr) {
      oldArr.forEach(element => {
        console.log(element)
        const pid = element.pid
        if (pid !== 0) {
          oldArr.forEach(ele => {
            if (ele.value === pid) { // 当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
              if (!ele.children) {
                ele.children = []
              }
              ele.children.push(element)
            }
          })
        }
      })
      //   console.log(oldArr) //此时的数组是在原基础上补充了children;
      oldArr = oldArr.filter(ele => ele.pid === 0) // 这一步是过滤，按树展开，将多余的数组剔除；
      return oldArr
    },
    getList() {
      var tempList = []
      ARRAY.forEach((n, i) => {
        tempList.push({
          value: n.first,
          pid: 0,
          label: n.first
        }, {
          value: n.second,
          pid: n.first,
          label: n.second
        }, {
          value: n.id,
          pid: n.second,
          label: n.three
        })
      })
      return tempList
      // console.log(tempList)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .timeline-container {
    position: relative;
    padding-left: 20px;
    .item {
      width: 500px;
      margin-bottom: 15px;
      // border: 1px solid;
      position: relative;
      &::after {
        position: absolute;
        content: "";
        left: -20px;
        width: 1px;
        top: 10px;
        bottom: -25px;
        background: $blue;
        transform: translateX(4px);
      }
      &.last {
        margin-bottom: 0;
        &::after {
          content: none;
        }
      }
      .content-box {
        display: flex;
        height: 16px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          left: -20px;
          width: 10px;
          height: 10px;
          top: 50%;
          background: $blue;
          border-radius: 50%;
          transform: translateY(-50%);
        }
        .title {
          font-size: 14px;
        }
        .user {
        }
        .time {
          margin-left: auto;
        }
      }
      .desc {
        font-size: 11px;
        margin-top: 5px;
        color: #888;
      }
    }
    .more {
      // position: absolute;
    }
  }
}
</style>
