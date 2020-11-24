<template>
  <div class="container shun-card">
    <el-page-header :content="id?'编辑用例':'新建用例'"
                    @back="goBack" />
    {{ baseInfo }}
    <el-form ref="regFormRef"
             :model="baseInfo"
             label-width="220px"
             class="reg-form">
      <el-form-item label="用例名称："
                    :rules="[{
                      required: true, message: '请输入用例名称', trigger: 'blur'
                    }]"
                    prop="name">
        <el-input v-model.trim="baseInfo.name"
                  show-word-limit
                  :disabled="!!id"
                  maxlength="50" />
      </el-form-item>
      <el-form-item label="用例分类："
                    :rules="[{
                      required: true, message: '请选择用例分类', trigger: 'change'
                    }]"
                    prop="type">
        <el-radio v-for="item of types"
                  :key="item.label"
                  v-model="baseInfo.type"
                  :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item label="事件注册参与人："
                    :rules="[{
                      required: true, message: '请选择事件注册参与人', trigger: 'change'
                    }]"
                    prop="type">
        <el-radio v-for="item of types"
                  :key="item.label"
                  v-model="baseInfo.type"
                  :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item class="target-form-item"
                    required
                    label="目标设置：">
        <div v-for="(targetItem,i) of baseInfo.target"
             :key="i"
             class="target-item">
          <el-form-item :prop="'target.'+i+'.targetSelect'"
                        :rules="{
                          required: true, message: '请选择目标名称', trigger: 'change'
                        }">
            <el-tooltip :content="targetItem.label||'请选择目标名称'"
                        placement="left">
              <el-select v-model="targetItem.targetSelect"
                         placeholder="请选择目标名称"
                         class="target-item-input"
                         @change="selectTarget($event,targetItem)">
                <el-option v-for="optItem of targetOpt"
                           :key="optItem.value"
                           :disabled="optItem.disabled"
                           :label="optItem.label"
                           :value="optItem.value" />
              </el-select>
            </el-tooltip>
          </el-form-item>
          <span class="compare">{{ targetItem.compare || ':' }}</span>
          <el-form-item :prop="'target.'+i+'.targetValue'"
                        :rules="{
                          required: true, message: '请输入目标值', trigger: 'change'
                        }">
            <el-input-number v-model="targetItem.targetValue"
                             :disabled="!targetItem.targetSelect"
                             :min="targetItem.min"
                             :max="targetItem.max"
                             :precision="targetItem.precision"
                             controls-position="right"
                             placeholder="请输入目标值"
                             class="target-item-input number-input" />
            <div class="target-unit">{{ targetItem.unit }}</div>
          </el-form-item>
          <i v-if="baseInfo.target.length > 1"
             class="el-icon-delete delete"
             @click="delTargetItem(i)" />
        </div>
        <el-button v-if="baseInfo.target.length < targetOpt.length"
                   class="add"
                   icon="el-icon-plus"
                   @click="addTarget" />
      </el-form-item>
      <el-form-item label="用例描述："
                    prop="desc">
        <el-input v-model.trim="baseInfo.desc"
                  :autosize="{ minRows: 8, maxRows: 16}"
                  placeholder="请输入内容"
                  maxlength="500"
                  show-word-limit
                  type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-document"
                   type="primary"
                   style="width:100px;"
                   @click="save">保存</el-button>
        <el-button icon="el-icon-refresh"
                   style="width:100px;"
                   @click="reset">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { MAX_NUMBER } from '@/utils'
import { getTargetList, saveUseCase, getUseCaseDetailById, editUseCase } from '@/api/api'

export default {
  name: 'CreateUseCase',
  components: {
  },
  data() {
    return {
      MAX_NUMBER,
      types: [
        {
          value: '1',
          label: '选项一'
        },
        {
          value: '2',
          label: '选项二'
        }
      ],
      baseInfo: {
        name: '',
        type: '',
        target: [
          {
            targetSelect: '',
            targetValue: ''
          }
        ],
        desc: ''
      },
      targetOpt: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    // 获取数据
    getData() {
      const data = {}
      data.id = this.id
      data.name = this.baseInfo.name
      // 目标
      data.useCaseAchieveList = this.baseInfo.target.map(n => {
        return {
          tagId: n.targetSelect,
          value: n.targetValue
        }
      })
      data.description = this.baseInfo.desc
      return data
    }
  },
  watch: {

  },
  created() {
    this.targetList().then(() => {
      if (this.id) {
        this.getUseCaseById()
      }
    })
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.$router.push('/useCase')
    },
    reset() {
      this.baseInfo.target = [{
        targetSelect: '',
        targetValue: ''
      }]
      this.$nextTick(() => {
        this.$refs['regFormRef'].resetFields()
        this.resetTargetOpt()
      })
    },
    getUseCaseById() {
      getUseCaseDetailById({ id: this.id }).then(res => {
        this.baseInfo.name = res.data.name
        // 目标
        this.baseInfo.target = res.data.achieveList.map(item => {
          let obj = this.targetOpt.find(n => {
            if (n.value === item.tagId) {
              obj = n
              return true
            }
          })
          return Object.assign({}, obj, {
            targetSelect: item.tagId,
            targetValue: item.value
          })
        })
        this.resetTargetOpt()
        this.baseInfo.desc = res.data.description
      })
    },
    save() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          let ajax
          if (this.id) {
            ajax = editUseCase
          } else {
            ajax = saveUseCase
          }
          ajax(this.getData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.goBack()
            }
          })
        }
      })
    },

    // 获取目标
    targetList() {
      return new Promise(resolve => {
        getTargetList().then(res => {
          this.targetOpt = res.data.achieveTagBOList.map(n => {
            return {
              // 目标名称
              label: n.name,
              // 单位
              unit: n.unit.label,
              // 单位id
              unitId: n.unit.value,
              // 目标值
              value: n.id,
              // 是否可选
              disabled: false,
              // 目标值-小数点精度
              precision: n.unit.value === 4 ? 2 : 0,
              // 目标值-最小值
              min: n.unit.value === 4 ? 0.01 : 1,
              // 目标值-最大值
              max: n.unit.value === 4 ? 100 : MAX_NUMBER,
              // 比较符号
              compare: n.relation.label
            }
          })
          resolve()
        })
      })
    },

    addTarget() {
      this.baseInfo.target.push({
        targetSelect: '',
        targetValue: ''
      })
    },
    delTargetItem(i) {
      this.baseInfo.target.splice(i, 1)
      this.resetTargetOpt()
    },
    resetTargetOpt() {
      const temp = []
      this.baseInfo.target.forEach((n, i) => {
        n.targetSelect && temp.push(n.targetSelect)
      })
      this.targetOpt.forEach((n, i) => {
        n.disabled = temp.includes(n.value)
      })
    },

    selectTarget(val, item) {
      this.targetOpt.find((n, i) => {
        if (n.value === val) {
          Object.assign(item, n, {
            // 清空输入
            targetValue: ''
          })
          return true
        }
      })
      // 设置不可选项
      this.resetTargetOpt()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 16px;

  .reg-form {
    width: 700px;
    margin: 20px auto;

    .target-form-item {
      width: 700px;
      .target-item {
        display: flex;
        position: relative;
        .compare {
          width: 10px;
          margin: 0 10px;
          color: #888;
          text-align: center;
        }
        .el-form-item {
          flex: 1;
          position: relative;
          .target-item-input {
            width: 100%;
            position: relative;

            &.number-input {
              ::v-deep .el-input__inner {
                padding-right: 80px;
                text-align: left;
              }
            }
          }
          .target-unit {
            position: absolute;
            top: 0;
            right: 42px;
          }
        }

        .delete {
          color: $red;
          display: inline-block;
          width: 20px;
          cursor: pointer;
          height: 32px;
          margin-left: 10px;
          font-size: 18px;
          line-height: 32px;
          position: absolute;
          right: -30px;
          top: 0;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .add {
        width: 100%;
        border-style: dashed;
      }
    }
  }
}
</style>
