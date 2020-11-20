<template>
  <div class="container">
    <tree-transfer :title="[' ', ' ']"
                   :button_text="['到右边','到左边']"
                   :from_data="leftData"
                   :to_data="rightData"
                   :default-props="{label:'label'}"
                   height="100%"
                   filter
                   open-all
                   @addBtn="add"
                   @removeBtn="remove">
      <div slot="title-left"
           class="top-select">
        <el-select v-model="leftPost"
                   style="width:100%;"
                   placeholder="请选择岗位">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <span class="count">884</span>
      </div>
      <div slot="title-right"
           class="top-select">
        <el-select v-model="leftPost"
                   style="width:100%;"
                   placeholder="请选择岗位">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <span class="count">666</span>
      </div>
    </tree-transfer>
  </div>
</template>

<script>
import { postList } from '@/api/api'
import treeTransfer from 'el-tree-transfer' // 引入
export default {
  components: {
    treeTransfer
  },

  data() {
    return {
      // 岗位
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      // 左边选的岗位
      leftPost: '',
      // 右边选的岗位
      rightPost: '',
      leftData: [
        {
          id: '1',
          pid: 0,
          label: '一级 1',
          children: [
            {
              id: '1-1',
              pid: '1',
              label: '二级 1-1',
              disabled: true,
              children: []
            },
            {
              id: '1-2',
              pid: '1',
              label: '二级 1-2',
              children: [
                {
                  id: '1-2-1',
                  pid: '1-2',
                  children: [],
                  label: '二级 1-2-1'
                },
                {
                  id: '1-2-2',
                  pid: '1-2',
                  children: [],
                  label: '二级 1-2-2'
                }
              ]
            }
          ]
        }
      ],
      rightData: []
    }
  },
  computed: {

  },

  watch: {},
  created() {
    // postList().then(res => {
    //   this.leftData = res.data
    // })
  },
  mounted() {

  },
  methods: {
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  background: #fff;
  padding: 40px;
  ::v-deep .wl-transfer {
    .transfer-left,
    .transfer-right {
      overflow: hidden;
    }
    .transfer-title {
      // padding-right: 5px;
      // background: #fff;
      display: flex;
      align-items: center;
      .top-select {
        flex: 1;
        display: flex;
        .count {
          font-size: 14px;
          margin-left: 10px;
          color: #888;
        }
      }
    }
  }

  .left-select {
    display: inline-block;
  }
}
</style>
