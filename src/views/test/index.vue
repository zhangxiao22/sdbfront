<template>
  <div class="container">
    {{ num }}
    <el-input-number v-model="num"
                     v-el-imput-blur
                     :min="66" />
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList, getStragetyList, fuzzySearch } from '@/api/api'

export default {
  name: 'Sms',
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
      num: undefined
    }
  },
  computed: {
  },
  watch: {},
  created() {

  },
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
