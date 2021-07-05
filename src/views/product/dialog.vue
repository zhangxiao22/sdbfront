<template>
  <div class="dialog-container">
    <el-dialog :title="isEdit?'编辑产品':'新增产品'"
               :visible="visible"
               @close="handleClose">
      <el-form ref="formRef"
               label-width="170px"
               :model="addInfo">
        <!-- 基本信息 -->
        <el-form-item label="产品名称："
                      :rules="[{
                        required: true, message: '请输入产品名称', trigger: 'blur'
                      }]"
                      prop="name">
          <el-input v-model.trim="addInfo.name"
                    show-word-limit
                    class="form-item"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="产品类型："
                      :rules="[{
                        required: true, message: '请输入产品类型', trigger: 'change'
                      }]"
                      prop="category">
          <el-cascader v-model="addInfo.category"
                       class="form-item"
                       :options="categoryOpt"
                       :props="{ expandTrigger: 'hover' }"
                       clearable
                       @change="changeCategory" />
        </el-form-item>
        <el-form-item label="产品用例："
                      prop="attributionUseCaseList">
          <el-select v-model="addInfo.attributionUseCaseList"
                     multiple
                     class="form-item"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in useCaseListOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述："
                      prop="description">
          <el-input v-model.trim="addInfo.description"
                    class="form-item"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入产品说明" />
        </el-form-item>
        <!-- 额外信息 -->
        <div class="extra-items">
          <!-------------------------- input -------------------------->
          <el-form-item v-for="(pItem,pi) of productParams"
                        :key="pi"
                        :prop="`${pItem.fieldName}`"
                        :label="`${pItem.desc}：`">
            <template v-if="pItem.formatType==='input'">
              <el-input v-model="addInfo[pItem.fieldName]"
                        class="form-item" />
            </template>
            <!-------------------------- rate -------------------------->
            <template v-if="pItem.formatType==='rate'">
              <el-input-number v-model="addInfo[pItem.fieldName]"
                               :precision="2"
                               :step="0.1"
                               controls-position="right" />
            </template>
            <!-------------------------- date -------------------------->
            <template v-if="pItem.formatType==='date'">
              <el-date-picker v-model="addInfo[pItem.fieldName]"
                              value-format="yyyy-MM-dd"
                              type="date"
                              class="form-item"
                              placeholder="选择日期" />
            </template>
            <!-------------------------- select -------------------------->
            <template v-if="pItem.formatType==='select'">
              <el-select v-model="addInfo[pItem.fieldName]"
                         class="form-item"
                         placeholder="请选择">
                <el-option v-for="(item,i) of pItem.formatContent"
                           :key="i"
                           :label="item"
                           :value="item" />
              </el-select>
            </template>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { updateProduct, getProductExtraParams } from '@/api/api'

export default {
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 产品分类Opt
    categoryOpt: {
      type: Array,
      default() {
        return []
      }
    },
    // 产品用例Opt
    useCaseListOpt: {
      type: Array,
      default() {
        return []
      }
    },
    // 弹窗数据
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 是否编辑
      isEdit: false,
      showDialog: false,
      buttonLoading: false,
      // allParams: [],
      productParams: [],
      addInfo: {
        id: '',
        name: '',
        category: [],
        attributionUseCaseList: [],
        description: ''
      }
    }
  },
  watch: {
  },
  created() {
    this.getExtraParams()
  },
  methods: {
    getExtraParams() {
      getProductExtraParams().then(res => {
        this.allParams = res.data
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$refs['formRef'].resetFields()
      this.addInfo.id = ''
    },
    edit(row) {
      this.isEdit = true
      this.addInfo.id = row.id
      setTimeout(() => {
        // 基础字段
        this.addInfo.name = row.name
        this.addInfo.category = [row.firstCategory.value, row.secondCategory.value].filter(n => n)
        this.addInfo.attributionUseCaseList = row.attributionUseCaseList?.map(n => n.value)
        this.addInfo.description = row.description
        this.changeCategory([row.firstCategory.value])
        this.productParams.forEach(n => {
          this.addInfo = Object.assign({}, this.addInfo, {
            [n.fieldName]: row[n.fieldName]
          })
        })
      })
    },
    changeCategory(val) {
      this.productParams = this.allParams.find(n => n.type === val?.[0])?.array || []
    },
    ensureEdit() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          const data = {
            id: this.addInfo.id,
            name: this.addInfo.name,
            category: this.addInfo.category,
            attributionUseCaseList: this.addInfo.attributionUseCaseList,
            description: this.addInfo.description
          }
          this.productParams.forEach(n => {
            data[n.fieldName] = this.addInfo[n.fieldName]
          })
          this.buttonLoading = true
          updateProduct(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.$emit('update:visible', false)
              this.$emit('afterEnsure')
            }
          }).finally(() => {
            this.buttonLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.dialog-container {
  .form-item {
    width: 90%;
  }
}
</style>
