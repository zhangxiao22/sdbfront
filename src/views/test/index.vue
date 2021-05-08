<template>
  <div class="container">
    <el-autocomplete v-model="state1"
                     class="inline-input"
                     :fetch-suggestions="querySearch"
                     placeholder="请输入内容"
                     @select="handleSelect">
      <template slot-scope="{ item }">
        <div class="opt-item"
             :class="{disabled:item.disabled}"
             @click="handleTestClick($event,item)">{{ item.value }}{{ item.disabled }}</div>
      </template>
    </el-autocomplete>
    <el-autocomplete v-model="state2"
                     class="inline-input"
                     :fetch-suggestions="querySearch"
                     placeholder="请输入内容"
                     @select="handleSelect">
      <template slot-scope="{ item }">
        <div class="opt-item"
             :class="{disabled:item.disabled}"
             @click="handleTestClick($event,item)">{{ item.value }}{{ item.disabled }}</div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList, getStragetyList, fuzzySearch } from '@/api/api'

export default {
  components: {
  },
  directives: {
    hello: {
      bind: function (el, bingind, vnode) {
        console.log('1-bind')
        // console.log('el:', el)
        // const $input = el.getElementsByTagName('input')[0]
        // console.log('$input:', $input)
        // console.log('bingind:', bingind)
        // console.log('vnode:', vnode)
        // const min = vnode.componentOptions.propsData.min
        // // vnode.componentOptions.propsData.value = 666
        // // el.style['color'] = bingind.value
        // console.log(min)
        // setTimeout(() => {
        //   $input.value = '666'
        // }, 300)
        // console.log(el.parentNode)
        // const $input = el.querySel
        // $input.addEventListener('blur', function () {
        //   console.log(123)
        //   // console.log(el, binding.value)
        // })
      },
      inserted: function (el, bingind, vnode) {
        console.log('2-insert')
        // console.log(el.parentNode)
      },
      update: function (el, bingind, vnode) {
        console.log('3-update')
      },
      componentUpdated: function (el, bingind, vnode) {
        console.log('4 - componentUpdated')
        // console.log(el, bingind, vnode)
        const { min, value } = vnode.componentOptions.propsData
        const $input = el.getElementsByTagName('input')[0]
        console.log(min, value)
        if (value === undefined) {
          $input.value = min
        }
      },
      unbind: function (el, bingind, vnode) {
        console.log('5 - unbind')
      }
    }
  },
  props: {
  },
  data() {
    return {
      restaurants: [],
      state1: '',
      state2: ''
    }
  },
  computed: {
  },
  watch: {},
  created() {

  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': '11', disabled: false },
        { 'value': '22', disabled: false },
        { 'value': '33', disabled: false },
        { 'value': '44', disabled: false }]
    },
    handleSelect(item) {
      console.log(item)
      this.restaurants.some(n => {
        if (n.value === item.value) {
          n.disabled = true
          return true
        }
      })
    },
    handleTestClick(event, item) {
      if (item.disabled) {
        event.stopPropagation()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
.opt-item {
  &.disabled {
    color: #ccc;
    cursor: not-allowed;
  }
}
</style>
