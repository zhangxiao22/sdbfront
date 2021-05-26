<template>
  <div class="dialog-container">
    <el-dialog :title="isEdit?'修改产品':'新增产品'"
               :visible.sync="showDialog"
               @close="showDialog=false"
               @open="dialogOpen">
      <el-form ref="regFormRef"
               label-width="170px"
               :model="addInfo">
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
        <el-form-item label="产品说明："
                      prop="description">
          <el-input v-model.trim="addInfo.description"
                    class="form-item"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入产品说明" />
        </el-form-item>
        <div v-for="(pItem,pi) of productParams"
             :key="pi">
          <!-------------------------- input -------------------------->
          <template v-if="pItem.formatType==='input'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}：`">
              <el-input v-model="addInfo[pItem.fieldName]"
                        class="form-item"
                        controls-position="right" />
            </el-form-item>
          </template>
          <!-------------------------- rate -------------------------->
          <template v-if="pItem.formatType==='rate'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}：`">
              <el-input-number v-model="addInfo[pItem.fieldName]"
                               :precision="2"
                               :step="0.1"
                               controls-position="right" />
            </el-form-item>
          </template>
          <!-------------------------- date -------------------------->
          <template v-if="pItem.formatType==='date'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}：`">
              <el-date-picker v-model="addInfo[pItem.fieldName]"
                              value-format="yyyy-MM-dd"
                              type="date"
                              class="form-item"
                              placeholder="选择日期" />
            </el-form-item>
          </template>
          <!-------------------------- select -------------------------->
          <template v-if="pItem.formatType==='select'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}：`">
              <el-select v-model="addInfo[pItem.fieldName]"
                         class="form-item"
                         placeholder="请选择">
                <el-option v-for="(item,i) of pItem.formatContent"
                           :key="i"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
          </template>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateProduct } from '@/api/api'

export default {
  props: {
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
    }
  },
  data() {
    return {
      // 是否编辑
      isEdit: false,
      showDialog: false,
      buttonLoading: false,
      allParams: [],
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
  methods: {
    init(data) {
      this.allParams = data
    },
    edit(row) {
      this.showDialog = true
      this.isEdit = true
      this.$nextTick(() => {
        this.addInfo.id = row.id
        // 基础字段
        this.addInfo.name = row.name
        this.addInfo.category = row.secondCategory.value ? [row.firstCategory.value, row.secondCategory.value] : [row.firstCategory.value]
        this.addInfo.attributionUseCaseList = row.attributionUseCaseList?.map(n => n.value)
        this.addInfo.description = row.description
        this.productParams = this.allParams.find(n => n.type === row.firstCategory.value).array
        this.productParams.forEach(n => {
          this.addInfo = Object.assign({}, this.addInfo, {
            [n.fieldName]: row[n.fieldName]
          })
        })
      })
    },
    dialogOpen() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
    },
    changeCategory(val) {
      this.productParams = this.allParams.find(n => n.type === val[0]).array
    },
    cancelEdit() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureEdit() {
      console.log(this.addInfo)
      this.buttonLoading = true
      updateProduct(this.addInfo).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: '3000'
          })
          this.$emit('getList')
        }
      }).finally(() => {
        this.buttonLoading = false
        this.showDialog = false
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
