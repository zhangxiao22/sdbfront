<template>
  <div class="text-to-html-container">
    <template v-for="(item,i) of html">
      <template v-if="item.type==='text'">
        <span :key="i">{{ item.content }}</span>
      </template>
      <template v-if="item.type==='input'">
        <el-tooltip :key="i"
                    :content="item.content+'：'+(item.val||'')">
          <el-input v-model="item.val"
                    :placeholder="item.content"
                    style="width:150px;margin:5px;"
                    size="mini"
                    @input="handleInput" />
        </el-tooltip>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      html: []
    }
  },
  computed: {

  },
  watch: {
    text() {
      // text转换成html
      this.transform()
    },
    params: {
      handler(newName, oldName) {
        // console.log(JSON.stringify(this.params), 'params???')
        if (JSON.stringify(this.params) === '{}') {
          this.$emit('update:params', this.getParams(true))
        } else {
          this.html.forEach(n => {
            if (n.type === 'input') {
              n.val = this.params?.[n.content]
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.transform()
  },
  mounted() {
  },
  methods: {
    transform() {
      this.html = []
      const a = this.text.split('${')
      a.forEach((n, i) => {
        const b = n.split('}')
        if (i === 0) {
          this.html.push({
            type: 'text',
            content: b[0]
          })
        } else {
          this.html.push({
            type: 'input',
            content: b[0],
            val: this.params[b[0]]
          }, {
            type: 'text',
            content: b[1]
          })
        }
      })
    },
    handleInput(val) {
      // console.log(this.getParams())
      this.$emit('update:params', this.getParams())
    },
    getParams(reset) {
      const params = {}
      // console.log('html????', this.html)
      this.html.forEach(n => {
        if (n.type === 'input') {
          params[n.content] = reset ? '' : (n.val || '')
        }
      })
      return JSON.stringify(params) === '{}' ? undefined : params
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.text-to-html-container {
}
</style>
