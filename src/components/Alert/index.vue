<template>
  <transition name="el-alert-fade">
    <div v-show="visible"
         class="el-alert"
         :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
         role="alert">
      <i v-if="showIcon"
         class="el-alert__icon"
         :class="[ iconClass, isBigIcon ]" />
      <div class="el-alert__content">
        <span v-if="title || $slots.title"
              class="el-alert__title"
              :class="[ isBoldTitle ]">
          <slot name="title">{{ title }}</slot>
        </span>
        <p v-if="$slots.default && !description"
           class="el-alert__description">
          <slot />
        </p>
        <p v-if="description && !$slots.default"
           class="el-alert__description">{{ description }}</p>
        <i v-show="closable"
           class="el-alert__closebtn"
           :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }"
           @click="close()">{{ closeText }}</i>
      </div>
    </div>
  </transition>
</template>

<script>
const TYPE_CLASSES_MAP = {
  'success': 'el-icon-success',
  'warning': 'el-icon-warning',
  'error': 'el-icon-error'
}

export default {
  props: {
    // 接收标题
    title: {
      type: String,
      default: '',
      required: true
    },
    // 辅助性文字
    description: {
      type: String,
      default: ''
    },
    // 接收主题 computed里会根据不同type返回对应的样式
    type: {
      type: String,
      default: 'info'
    },
    // 关闭按钮显示
    closable: {
      type: Boolean,
      default: true
    },
    // 关闭按钮自定义文字
    closeText: {
      type: String,
      default: ''
    },
    // 是否显示icom
    showIcon: Boolean,
    // 内容是否居中
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].indexOf(value) !== -1
      }
    }

  },

  data() {
    return {
      // 组件显示隐藏
      visible: true
    }
  },
  computed: {
    // alert的样式
    typeClass() {
      return `el-alert--${this.type}`
    },
    // alert里icon的样式
    iconClass() {
      return TYPE_CLASSES_MAP[this.type] || 'el-icon-info'
    },
    // 如果传入了description（辅助性文字）或者 传入了匿名插槽 则显示大icon
    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : ''
    },
    // 如果传入了description（辅助性文字）或者 传入了匿名插槽 则显示加粗title
    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : ''
    }
  },
  watch: {

  },

  methods: {
    // 关闭alert方法
    close() {
      // v-show隐藏alert
      // this.visible = false
      // 向父组件暴露close方法
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
