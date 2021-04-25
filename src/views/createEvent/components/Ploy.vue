<template>
  <div ref="ployRef"
       class="ploy-container">
    <el-form ref="refCustomerForm"
             :model="{group}"
             label-width="120px"
             @validate="validateForm">
      <el-tabs v-model="groupName"
               :before-leave="beforeHandleGroupTabClick">
        <!-- {{ groupIndex }}{{ ployIndex }} -->
        <el-tab-pane v-for="(groupItem,gi) of group"
                     :key="gi"
                     :name="gi+''">
          <div slot="label"
               class="tab-label">
            {{ groupItem.name }}
            <el-tag size="mini"
                    style="margin-left:5px;">
              {{ groupItem.people }}
            </el-tag>
          </div>
          <div class="top">
            <div class="left">当前客群人数：<b>{{ animatedNumber }}</b></div>
            <div>
              <el-form-item style="margin-bottom:0;"
                            :prop="'group.' + gi + '.ployTabs'"
                            :rules="[{
                              required: true, message: '请添加策略', type: 'array'
                            }]">
                <el-button icon="el-icon-plus"
                           type="primary"
                           @click="addStrategy">
                  选择历史策略
                </el-button>
                <el-button icon="el-icon-plus"
                           type="primary"
                           @click="addTab">
                  添加空白策略
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div v-show="groupItem.desc"
               class="desc">{{ groupItem.desc }}</div>
          <!-- 策略 -->
          <div v-show="groupItem.ployTabs.length">
            <el-tabs v-model="groupItem.ployTabsValue"
                     type="card"
                     closable
                     @tab-click="handleChangeTab"
                     @tab-remove="handleRemoveTab">
              <!-- {{ groupItem.ployTabs.map(n => n.name) }} -->
              <el-tab-pane v-for="(ployItem,pi) of groupItem.ployTabs"
                           :key="ployItem.name"
                           :label="ployItem.title"
                           :name="ployItem.name">
                <span slot="label"
                      class="ploy-title-tab">

                  <el-tooltip content="复制"
                              placement="top">
                    <el-button v-show="pi === ployIndex"
                               size="mini"
                               class="copy"
                               circle
                               icon="el-icon-document-copy"
                               type="primary"
                               @click="copyTab(ployItem)" />
                  </el-tooltip>

                  {{ ployItem.title }}
                </span>
                <!-- {{ pi }} -->
                <el-form-item label="策略名称："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.title'"
                              :rules="[{
                                required: true, message: '请输入策略名称', trigger: 'blur'
                              },{
                                validator: validatePloyName, trigger: 'blur'
                              }]">
                  <el-input v-model.trim="ployItem.title"
                            style="width:300px"
                            placeholder="请输入策略名称" />
                </el-form-item>
                <el-form-item :prop="'group.' + gi + '.ployTabs.' + pi + '.percent'"
                              :rules="[{
                                validator: validatePercent
                              }]"
                              class="shun-label">
                  <div slot="label">
                    <Info content="同一客群下所有策略分发范围总和需为100%" />
                    分发范围：
                  </div>
                  <div style="display:flex;">
                    <el-input-number v-model="ployItem.percent"
                                     controls-position="right"
                                     style="margin-right:10px;"
                                     :precision="2"
                                     :min="0"
                                     :max="100"
                                     :step="10"
                                     @blur="handlePercentBlur(ployItem)"
                                     @change="handlePercentChange" />%
                    <el-form-item style="margin-left:10px;margin-bottom:0;"
                                  :prop="'group.' + gi + '.totalPercent'"
                                  :rules="[{
                                    validator: validateTotalPercent
                                  }]">
                      <el-alert :title="'当前客群总和'+groupItem.totalPercent+'%'"
                                style="display:inline"
                                :closable="false"
                                :type="groupItem.totalPercent===100?'success':'error'" />
                    </el-form-item>
                  </div>
                  <!-- {{ groupItem.totalPercen }} -->
                </el-form-item>
                <el-form-item label="推荐产品："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.product'"
                              :rules="[{
                                required: true, message: '请选择产品', type: 'array'
                              }]">
                  <el-button icon="el-icon-plus"
                             type="primary"
                             plain
                             @click="addProduct(ployItem)">
                    添加产品
                  </el-button>
                </el-form-item>
                <el-table v-show="ployItem.product.length"
                          :data="ployItem.product"
                          border
                          style="width: 100%;margin-bottom:18px;">
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-form label-position="left"
                               inline
                               class="demo-table-expand">
                        <div v-for="(item,i) in getTableColumnListByType(scope.row.firstCategory.value)"
                             :key="i">
                          <el-form-item :label="item.label+'：'">
                            <span>{{ scope.row[item.prop] }}</span>
                          </el-form-item>
                        </div>
                      </el-form>
                    </template>
                  </el-table-column>
                  <template v-for="(item,i) of COMMON_COLUMN_LIST">
                    <el-table-column v-if="item.prop === 'attributionUseCaseList'"
                                     :key="i"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :min-width="item.minWidth">
                      <template slot-scope="scope">
                        <template>
                          <template v-if="scope.row.attributionUseCaseList && scope.row.attributionUseCaseList.length">
                            <el-tooltip placement="top-start"
                                        class="hover-text">
                              <div slot="content">
                                <div v-for="(useItem,useItemIndex) of scope.row.attributionUseCaseList"
                                     :key="useItemIndex"
                                     style="margin:5px 0;">
                                  {{ useItem.label }}
                                </div>
                              </div>
                              <span>
                                {{ scope.row.attributionUseCaseList.length }}个用例
                              </span>
                            </el-tooltip>
                          </template>
                          <div v-else>
                            无
                          </div>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column v-else
                                     :key="i"
                                     :prop="item.prop"
                                     :label="item.label"
                                     :width="item.width"
                                     :min-width="item.minWidth" />
                  </template>
                  <el-table-column fixed="right"
                                   label="操作"
                                   width="100">
                    <template slot-scope="scope">
                      <el-popconfirm title="确定删除吗？"
                                     @onConfirm="deleteProduct(ployItem,scope.$index)">
                        <el-button slot="reference"
                                   type="text"
                                   style="color:#f56c6c;"
                                   size="small">删除</el-button>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- :rules="[{
                                required: true, message: '请选择权益', type: 'array'
                              }]" -->
                <el-form-item label="推荐权益："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.interest'">
                  <el-button icon="el-icon-plus"
                             type="primary"
                             plain
                             @click="addInterest(ployItem)">
                    添加权益
                  </el-button>
                </el-form-item>
                <div v-show="ployItem.interest.length"
                     class="ploy-card">
                  <el-table :data="ployItem.interest"
                            border
                            style="width: 100%;margin-bottom:18px;">
                    <el-table-column prop="name"
                                     width="200"
                                     show-overflow-tooltip
                                     label="名称" />
                    <el-table-column prop="content"
                                     :min-width="300"
                                     label="内容" />
                    <el-table-column fixed="right"
                                     label="操作"
                                     width="100">
                      <template slot-scope="scope">
                        <el-popconfirm title="确定删除吗？"
                                       @onConfirm="deleteInterest(ployItem,scope.$index)">
                          <el-button slot="reference"
                                     type="text"
                                     style="color:#f56c6c;"
                                     size="small">删除</el-button>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <!-- <el-divider /> -->
                <el-form-item label="下发渠道："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.channel'"
                              :rules="[{
                                required: true, message: '请选择下发渠道', type: 'array'
                              }]">
                  <el-dropdown trigger="click"
                               size="medium"
                               @command="handleCommandChannel($event,ployItem)">
                    <el-button type="primary"
                               plain>
                      选择添加
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(channelItem,i) of ployItem.channelOpt"
                                        :key="i"
                                        :disabled="channelItem.disabled"
                                        :command="channelItem.value">
                        <svg-icon style="margin-right:10px;"
                                  :icon-class="channelItem.icon" />
                        {{ channelItem.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <!-- {{ ployItem.channel }} -->
                <el-card v-for="(channelCardItem,ci) of ployItem.channel"
                         :id="`channelRef-${gi}-${pi}-${ci}`"
                         :key="`${gi}-${pi}-${ci}`"
                         shadow="hover"
                         class="channel-card">
                  <div slot="header"
                       class="clearfix">
                    <span class="channel-card-title">
                      <!-- {{ `channelRef-${groupIndex}-${ployIndex}-${ci}` }} -->
                      <svg-icon class="name-icon"
                                :style="{color:channelCardItem.iconColor}"
                                :icon-class="channelCardItem.icon" />
                      <span>{{ channelCardItem.label }}</span>
                    </span>

                    <el-popconfirm title="确定删除该渠道吗？"
                                   @onConfirm="deleteChannel(ployItem,ci)">
                      <el-button slot="reference"
                                 class="channel-card-delete"
                                 type="text">
                        删除
                      </el-button>
                    </el-popconfirm>
                  </div>
                  <el-form-item label="下发类型："
                                :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.chooseType'"
                                :rules="[{
                                  required: true, message: '请选择下发类型', trigger: 'change'
                                }]">
                    <el-radio-group v-model="channelCardItem.chooseType">
                      <el-radio v-for="item of channelCardItem.type"
                                :key="item.id"
                                style="margin-right:0;"
                                :label="item.id"
                                border
                                @change="handleChannelTypeChange($event,ci)">
                        {{ item.name }}
                        <i :class="item.icon" />
                      </el-radio>
                    </el-radio-group>

                  </el-form-item>
                  <div class="card-body">
                    <!-- 定时型 -->
                    <template v-if="channelCardItem.chooseType===1">
                      <el-form-item label="起止日期："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.dateRange'"
                                    :rules="[{
                                      required: true, message: '请选择起止日期', trigger: 'change'
                                    }]">
                        <el-date-picker v-model="channelCardItem.dateRange"
                                        type="daterange"
                                        range-separator="至"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" />
                      </el-form-item>
                      <el-form-item label="推送时间："
                                    required>
                        <div style="display:flex">
                          <el-form-item style="margin-bottom:0;margin-right:10px;">
                            <el-select v-model="channelCardItem.timingDateType"
                                       style="width:80px;"
                                       @change="channelCardItem.timingDateValue = []">
                              <el-option v-for="item of timingOpt"
                                         :key="item.value"
                                         :label="item.label"
                                         :value="item.value" />
                            </el-select>
                          </el-form-item>
                          <el-form-item :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.timingDateValue'"
                                        :rules="[{
                                          required: true, message: '请选择推送时间', trigger: 'change'
                                        }]"
                                        style="margin-bottom:0;margin-right:10px;">
                            <el-select v-model="channelCardItem.timingDateValue"
                                       multiple
                                       collapse-tags>
                              <el-option v-for="item of timingOpt.find(n => channelCardItem.timingDateType === n.value).children"
                                         :key="item.value"
                                         :label="item.label"
                                         :value="item.value" />
                            </el-select>
                          </el-form-item>
                          <el-form-item style="margin-bottom:0;">
                            <el-time-select v-model="channelCardItem.timingTimeValue"
                                            style="width:150px;"
                                            :picker-options="{
                                              start: '07:00',
                                              end: '20:00',
                                              step: '00:30',
                                            }"
                                            :clearable="false"
                                            :editable="false"
                                            format="HH:mm"
                                            value-format="HH:mm" />
                          </el-form-item>
                        </div>
                      </el-form-item>

                    </template>
                    <!-- 规则型 -->
                    <template v-if="channelCardItem.chooseType===2">
                      <el-form-item class="rule-form"
                                    label="推送时间："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.ruleValue'"
                                    :rules="[{
                                      validator: validateRule
                                    }]">
                        <div v-for="(item,rule_i) of channelCardItem.ruleValue"
                             :key="rule_i"
                             class="rule-item">
                          <Info content="名单生效日" />
                          <span class="text-text">T</span>
                          <span class="plus-text">+</span>
                          <el-input-number v-model="item.date"
                                           style="margin-right:10px;"
                                           controls-position="right"
                                           :min="0"
                                           @blur="item.date=item.date||0" />天
                          <el-time-picker v-model="item.time"
                                          style="width:150px;margin-left:10px;"
                                          :clearable="false"
                                          format="HH:mm"
                                          value-format="HH:mm"
                                          @blur="handleTimeBlur($event,item)" />
                          <i v-if="channelCardItem.ruleValue.length > 1"
                             class="el-icon-delete delete"
                             @click="delRuleItem(channelCardItem,rule_i)" />
                        </div>
                        <el-button class="add"
                                   icon="el-icon-plus"
                                   @click="addRuleItem(channelCardItem)" />
                      </el-form-item>
                    </template>
                    <!-- crm -->
                    <template v-if="channelCardItem.value===1">
                      <!-- <el-form-item required
                                    class="rule-form"
                                    label="线索有效期："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.validPeriod'">
                        <el-input-number v-model="channelCardItem.validPeriod"
                                         style="margin-right:10px;"
                                         controls-position="right"
                                         :min="0"
                                         :max="10000"
                                         @blur="channelCardItem.validPeriod=channelCardItem.validPeriod||0" />天
                      </el-form-item> -->
                      <el-form-item label="推荐话术："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                    :rules="[{
                                      required: true, message: '请选择话术', type: 'array'
                                    }]">
                        <el-button icon="el-icon-plus"
                                   @click="addCRMWords(channelCardItem,ci)">
                          添加话术
                        </el-button>
                      </el-form-item>
                      <!-- {{ channelCardItem.model }} -->
                      <el-table v-show="channelCardItem.model.length"
                                :data="channelCardItem.model"
                                border
                                style="width: 100%;margin-bottom:18px;"
                                @cell-mouse-enter="handleMouseEnter"
                                @cell-mouse-leave="handleMouseLeave">
                        <el-table-column label="话术内容"
                                         :min-width="400">
                          <div slot-scope="scope"
                               class="table-desc">
                            <span>{{ scope.row.content }}</span>
                            <el-popover v-model="scope.row.isEdit"
                                        placement="top"
                                        width="300">
                              <el-input v-model.trim="scope.row._content"
                                        type="textarea"
                                        :rows="5"
                                        style="margin-bottom:10px;"
                                        placeholder="请输入内容" />
                              <div style="text-align: right; margin: 0">
                                <el-button size="mini"
                                           type="text"
                                           @click="scope.row.isEdit = false">取消</el-button>
                                <el-button type="primary"
                                           size="mini"
                                           @click="scope.row.content = scope.row._content;scope.row.isEdit = false">确定</el-button>
                              </div>
                              <div v-show="scope.row.isHover"
                                   slot="reference"
                                   class="table-edit touch-tap"
                                   @click="scope.row._content = scope.row.content">
                                <i class="el-icon-edit" />
                              </div>
                            </el-popover>
                          </div>
                        </el-table-column>
                        <el-table-column prop="category.label"
                                         show-overflow-tooltip
                                         label="话术分类" />
                        <el-table-column label="操作"
                                         width="100">
                          <template slot-scope="scope">
                            <el-popconfirm title="确定删除吗？"
                                           @onConfirm="deleteWord(channelCardItem,ci,scope.$index)">
                              <el-button slot="reference"
                                         type="text"
                                         style="color:#f56c6c;"
                                         size="small">删除</el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- 预热短信 -->
                      <el-form-item label="预热短信：">
                        <el-button icon="el-icon-plus"
                                   @click="addBeforeSmsWords(channelCardItem,ci)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.beforeSms.length"
                                :data="channelCardItem.beforeSms"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column prop="content"
                                         :min-width="300"
                                         label="预热短信内容" />
                        <el-table-column prop="description"
                                         show-overflow-tooltip
                                         :min-width="300"
                                         label="预热短信描述" />
                        <el-table-column fixed="right"
                                         label="操作"
                                         width="100">
                          <template slot-scope="scope">
                            <el-popconfirm title="确定删除吗？"
                                           @onConfirm="deleteBeforeSms(channelCardItem,scope.$index)">
                              <el-button slot="reference"
                                         type="text"
                                         style="color:#f56c6c;"
                                         size="small">删除</el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- 预热短信end -->
                      <!-- 跟尾短信 -->
                      <el-form-item label="跟尾短信：">
                        <el-button icon="el-icon-plus"
                                   @click="addAfterSmsWords(channelCardItem,ci)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.afterSms.length"
                                :data="channelCardItem.afterSms"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column prop="content"
                                         :min-width="300"
                                         label="跟尾短信内容" />
                        <el-table-column prop="description"
                                         show-overflow-tooltip
                                         :min-width="300"
                                         label="跟尾短信描述" />
                        <el-table-column fixed="right"
                                         label="操作"
                                         width="100">
                          <template slot-scope="scope">
                            <el-popconfirm title="确定删除吗？"
                                           @onConfirm="deleteAfterSms(channelCardItem,scope.$index)">
                              <el-button slot="reference"
                                         type="text"
                                         style="color:#f56c6c;"
                                         size="small">删除</el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- {{ channelCardItem.afterSms.map(n=>n.id) }} -->
                      <!-- 跟尾短信end -->
                    </template>
                    <!-- 短信 -->
                    <template v-if="channelCardItem.value===2">
                      <el-form-item label="发送模式："
                                    required
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.smsSendMode'">
                        <el-radio-group v-model="channelCardItem.smsSendMode">
                          <el-radio v-for="(item,i) of smsSendModeOpt"
                                    :key="i"
                                    :label="item.value"
                                    @blur="channelCardItem.smsSendMode=channelCardItem.smsSendMode||1">{{ item.label }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="短信模版："
                                    required
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                    :rules="[{
                                      validator: ValidatorModel
                                    }]">
                        <el-button icon="el-icon-plus"
                                   @click="addSmsWords(channelCardItem,ci)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.model.length"
                                :data="channelCardItem.model"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column label="短信内容"
                                         width="650">
                          <template slot-scope="scope">
                            <!-- <span style="color:red;">{{ scope.row.smsAttr }}</span> -->
                            <TextToHtml :ref="'testSmsRef-'+gi+'-'+pi"
                                        :params.sync="scope.row.smsAttr"
                                        :text="scope.row.content" />
                          </template>
                        </el-table-column>
                        <el-table-column label="参数描述"
                                         show-overflow-tooltip>
                          <template slot-scope="scope">
                            <pre>{{ scope.row.parameterDescription }}</pre>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-form-item :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.test'"
                                    :rules="[{
                                      validator: ValidatorTestSelect
                                    }]">
                        <div slot="label">
                          <Info content="对当前策略进行测试" />
                          精准内测：
                        </div>
                        <el-select v-model="channelCardItem.test"
                                   style="width:500px;margin-right:10px;float:left;"
                                   filterable
                                   allow-create
                                   default-first-option
                                   placeholder="请选择电话号码/输入电话号码并选择或按回车键创建" />
                        <el-button icon="el-icon-thumb"
                                   style="float:left;"
                                   @click="handleTestSms(ci)">
                          测试一下
                        </el-button>
                      </el-form-item>
                    </template>
                    <!-- 微信 -->
                    <template v-if="channelCardItem.value===3">
                      <el-form-item label="微信模版："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                    :rules="[{
                                      required: true, message: '请选择模版', type: 'array'
                                    }]">
                        <el-button icon="el-icon-plus"
                                   @click="addWeChatWords(channelCardItem,ci)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.model.length"
                                :data="channelCardItem.model"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column prop="content"
                                         :min-width="400"
                                         label="短信内容" />
                        <el-table-column prop="category.label"
                                         show-overflow-tooltip
                                         label="短信分类" />
                      </el-table>
                    </template>
                    <!-- 渠道：{{ channelCardItem.value }}
                    类型：{{ channelCardItem.chooseType }}
                    定时型的值1（规则）：{{ channelCardItem.timingDateValue }}
                    定时型的值2（时间）：{{ channelCardItem.timingTimeValue }}
                    规则型的值：{{ channelCardItem.ruleValue }} -->
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 策略end -->
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 策略 -->
    <ShunDrawer title="选择策略"
                :show.sync="showStrategy"
                @submit="submitStrategy()">
      <template v-slot:container>
        <strategy ref="strategyRef"
                  :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 产品 -->
    <ShunDrawer title="选择产品"
                :show.sync="showProduct"
                @submit="submitProduct()">
      <template v-slot:container>
        <product ref="productRef"
                 :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 权益 -->
    <ShunDrawer title="选择权益"
                :show.sync="showInterest"
                @submit="submitInterest()">
      <template v-slot:container>
        <interest ref="interestRef"
                  :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 话术 -->
    <ShunDrawer title="选择话术"
                :show.sync="showCRMWord"
                @submit="submitWord()">
      <template v-slot:container>
        <word ref="wordRef"
              :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 短信 -->
    <ShunDrawer title="选择短信"
                :show.sync="showSms"
                @submit="submitSms()">
      <template v-slot:container>
        <sms ref="smsRef"
             :multiple="false"
             :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 预热短信 -->
    <ShunDrawer title="选择短信"
                :show.sync="showBeforeSms"
                @submit="submitBeforeSms()">
      <template v-slot:container>
        <sms ref="beforeSmsRef"
             :multiple="false"
             :common-template="true"
             :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 跟尾短信 -->
    <ShunDrawer title="选择短信"
                :show.sync="showAfterSms"
                @submit="submitAfterSms()">
      <template v-slot:container>
        <sms ref="afterSmsRef"
             multiple
             :common-template="true"
             :show-selection="true" />
      </template>
    </ShunDrawer>
  </div>
</template>

<script>
import { savePloy, getPloyDetail, testSms } from '@/api/api'
import gsap from 'gsap'
import Info from '@/components/Info'
import ShunDrawer from '@/components/ShunDrawer'
import TextToHtml from '@/components/TextToHtml'
import Strategy from '@/views/strategy/index'
import Product from '@/views/product/index'
import Interest from '@/views/interest/index'
import Word from '@/views/word/index'
import Sms from '@/views/sms/index'
import { isPhone } from '@/utils/validate'
import { MessageBox, Message } from 'element-ui'
import { parseTime, SELF_COLUMN_LIST, COMMON_COLUMN_LIST } from '@/utils'
import { CHANNEL_OPT, TIMING_OPT } from '../constant'

// import { getWordList } from '@/api/api'

export default {
  components: {
    Strategy, Product, Info, Interest, Word, ShunDrawer, Sms, TextToHtml
  },
  data() {
    const _this = this
    return {
      SELF_COLUMN_LIST,
      COMMON_COLUMN_LIST,
      // 单个校验时零时存放数组
      validateList: [],
      // 客群tab对应的值
      groupName: '0',
      // 人数初始值
      tweenedNumber: 0,
      // 策略侧边栏
      showStrategy: false,
      // 产品侧边栏
      showProduct: false,
      // 权益侧边栏
      showInterest: false,
      // crm话术侧边栏
      showCRMWord: false,
      // crm预热短信侧边栏
      showBeforeSms: false,
      // crm跟尾短信侧边栏
      showAfterSms: false,
      // 短信侧边栏
      showSms: false,
      // 短信发送模式的选项
      smsSendModeOpt: [
        { label: '重复下发', value: 0 },
        { label: '均分下发', value: 1 }
      ],
      // 定时型 下拉选项
      timingOpt: JSON.parse(JSON.stringify(TIMING_OPT)),
      group: [
        // {
        //   gid: 1,
        //   name: '群组1',
        //   people: 221324,
        //   desc: '客群描述客群描述客群描述客群描述客群描述客群描述客群描述苏打粉',
        //   // 当前分发范围设置总和
        //   totalPercent: 100,
        //   // 策略
        //   ployTabs: [{
        //     // 策略名称
        //     title: '新策略',
        //     // 策略分发范围
        //     percent: 100,
        //     // 策略tab id
        //     name: '1',
        //     // 产品
        //     product: JSON.parse(JSON.stringify(PRODUCT)),
        //     // 权益
        //     interest: {},
        //     channel: [],
        //     channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
        //   }],
        //   // v-model值
        //   ployTabsValue: '1',
        //   // 累加数量
        //   ployTabIndex: 1
        // },
      ],

      tempPloyItem: null,
      pickerOptions: {
        disabledDate(time) {
          // console.log(_this.$parent.baseInfoDetail.startDate, _this.$parent.baseInfoDetail.endDate)
          const testStartTime = _this.$parent.baseInfoDetail.startDate
          const testEndTime = _this.$parent.baseInfoDetail.endDate
          const dateTime = parseTime(time, '{y}-{m}-{d}')
          return dateTime > testEndTime || dateTime < testStartTime
        }
      },
      channelIndex: null
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    },
    animatedNumber() {
      return parseInt(this.tweenedNumber.toFixed(0)).toLocaleString()
    },
    groupIndex() {
      return +this.groupName
    },
    ployIndex() {
      return this.group[this.groupIndex].ployTabs.findIndex((n, i) => {
        return n.name === this.group[this.groupIndex].ployTabsValue
      })
    },
    ployCounts() {
      let count = 0
      this.group.forEach(n => {
        count += n.ployTabs.length
      })
      return count
    }
  },
  watch: {

  },
  created() {
    this.reset()
  },

  methods: {
    reset() {
      this.ployDetail().then(() => {
        this.$nextTick(() => {
          // 客群tab跳转到第一个
          this.beforeHandleGroupTabClick(0)
          // 清除校验
          this.$refs['refCustomerForm'].clearValidate()
        })
      })
    },
    // 从字符串中获取gi pi, 如 group.0.ployTabs.0.title => [0,0]
    getIndex(str) {
      const arr = str.split('.')
      return [+arr[1], +arr[3]]
    },
    /**
     * arr [[0,0],[0,1],[1,1]]
     */
    sortIndex(arr) {
      var newArray = arr.sort((a, b) => {
        const aHas = isNaN(a[1])
        const bHas = isNaN(b[1])
        return (aHas - bHas) || (aHas === true && a[1] - b[1]) || 0
      })
      return newArray.sort(function (a, b) {
        return a[0] - b[0]
      })
    },
    // translate(obj, paramPropStr) {
    //   let val = obj
    //   paramPropStr.split('.').forEach(n => {
    //     val = val[n]
    //   })
    //   return val
    // },
    ployTranslate(ployObj, ployName) {
      // console.log(ployObj, ployIndex)
      // ployIndex tab的index下标
      return {
        abstractId: ployObj.abstractId,
        // 策略名称
        title: ployObj.name,
        // 策略分发范围
        percent: ployObj.range,
        // 策略tab id
        name: ployName + '',
        // 产品
        product: ployObj.productInfoList.map((product) => {
          return Object.assign({}, product, product.extraField)
        }),
        // 权益
        interest: ployObj.couponInfoList,
        channel: ployObj.strategyInfoList.map(m => {
          // console.log(m)
          return Object.assign({}, CHANNEL_OPT.find(x => {
            return x.value === m.channel.value
          }), {
            // infoId: m.infoId,
            chooseType: m.pushType.value,
            // validPeriod: m.clueEffectDays,
            smsSendMode: m.sendMode?.value,
            model: m.channel.value === 1 ? m.scriptInfoList.map(n => {
              return Object.assign({}, n, {
                _content: n.content,
                isEdit: false,
                isHover: false
              })
            }) : m.meterialInfoList,
            beforeSms: m.advanceSMSInfoList || [],
            afterSms: m.followSMSInfoList || []
          }, (() => {
            const obj = {}
            if (m.pushType.value === 1) {
              // 定时型
              // obj.pushTimeId = m.pushTimeInfo.scheduelPushInfoVO.pushTimeId
              // 定时型的值-规则 (每周几或每月)
              obj.timingDateType = m.pushTimeInfo.scheduelPushInfoVO.intervalType.value
              // 定时型的值-规则 (周几或者几号) (多选)
              obj.timingDateValue = m.pushTimeInfo.scheduelPushInfoVO.interval
              // 定时型的值-时间
              obj.timingTimeValue = m.pushTimeInfo.scheduelPushInfoVO.moment
              // 定时型的值-起止时间
              obj.dateRange = [m.pushTimeInfo.scheduelPushInfoVO.startDate, m.pushTimeInfo.scheduelPushInfoVO.endDate]
            } else if (m.pushType.value === 2) {
              // 规则型
              // 规则型的值
              obj.ruleValue = m.pushTimeInfo.rulePushInfoList.map(r => {
                return {
                  // pushTimeId: r.pushTimeId,
                  date: r.delay,
                  time: r.moment
                }
              })
            }
            return obj
          })())
        }),
        channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT)).map(c => {
          return Object.assign({}, c, {
            // 已选择的渠道禁止选择
            disabled: ployObj.strategyInfoList.some(x => x.channel.value === c.value)
          })
        })
      }
    },
    ployDetail() {
      return new Promise((resolve, reject) => {
        getPloyDetail({ baseId: this.id }).then(res => {
          if (res.code === 200) {
            this.group = res.data.strategyQueryVOList.map((n, i) => {
              return {
                gid: n.customeInfoId,
                name: n.name,
                people: n.count,
                desc: n.desc,
                totalPercent: 100,
                ployTabs: n.strategyDetailVOList.map((n, i) => {
                  return this.ployTranslate(n, i + 1)
                }),
                // v-model值：控制策略tab显示
                ployTabsValue: '1',
                // 累加数量：策略数量的累加,用于显示‘新策略几’
                ployTabIndex: n.strategyDetailVOList.length
              }
            })
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    // 切换策略
    handleChangeTab() {
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
    },
    validateForm(rule, validate, message) {
      // console.log(a, b, c)
      this.validateList.push({
        rule,
        validate,
        message
      })
    },
    validatePloyName(rule, value, callback) {
      const gi = this.getIndex(rule.field)[0]
      const pi = this.getIndex(rule.field)[1]
      const isSame = this.group[gi].ployTabs.some((n, i) => {
        if (i !== pi && n.title === value) {
          return true
        }
      })
      if (isSame) {
        callback(new Error('该策略名已存在'))
      } else {
        callback()
      }
    },
    validateRule(rule, value, callback) {
      let hasSame = false

      for (let i = 0; i < value.length - 1; i++) {
        for (let j = i + 1; j < value.length; j++) {
          if (JSON.stringify(value[i]) === JSON.stringify(value[j])) {
            hasSame = true
            break
          }
        }
      }
      // console.log('hasSame', hasSame)
      if (hasSame) {
        callback(new Error('存在相同的推送时间'))
      } else {
        callback()
      }
    },
    validatePercent(rule, value, callback) {
      // console.log(rule, value, callback)
      if (value === 0) {
        callback(new Error('分发范围需大于0%'))
      } else {
        callback()
      }
    },
    validateTotalPercent(rule, value, callback) {
      // console.log(value)
      if (value !== 100) {
        callback('分发范围总和需等于100%')
      } else {
        callback()
      }
    },

    validateAndNext() {
      this.isSubmit = true
      return new Promise((resolve, reject) => {
        this.$refs.refCustomerForm.validate((valid, field) => {
          // console.log(valid, field)
          if (valid) {
            // 客群
            // console.log(this.group)
            const data = this.group.map((gn, gi) => {
              return {
                // 客群id
                customerInfoId: gn.gid,
                // 策略
                strategyDetailList: gn.ployTabs.map((pn, pi) => {
                  return {
                    // 策略id
                    abstractId: pn.abstractId,
                    // 策略名称
                    name: pn.title,
                    // 分发范围
                    range: pn.percent,
                    // 产品id
                    productIdList: pn.product.map(n => n.id),
                    // 权益id
                    couponIdList: pn.interest.map(n => n.id),
                    // 渠道
                    strategyInfoList: pn.channel.map((cn, ci) => {
                      // console.log(cn)
                      return {
                        // 渠道id
                        // infoId: cn.infoId,
                        // 渠道类型 1:crm 2:短信 3:微信
                        channel: cn.value,
                        // CRM线索有效期
                        // clueEffectDays: cn.value === 1 ? cn.validPeriod : undefined,
                        // SMS发送模式（重复均分）
                        sendMode: cn.value === 2 ? cn.smsSendMode : undefined,
                        // 话术id
                        scriptList: cn.value === 1 ? cn.model.map(n => {
                          return {
                            scriptId: n.id,
                            scriptContent: n.content,
                            scriptInstId: n.scriptInstId
                          }
                        }) : undefined,
                        // 预热短信ids
                        advanceSMSIds: cn.value === 1 ? cn.beforeSms.map(n => n.id) : undefined,
                        // 跟尾短信ids
                        followSMSIds: cn.value === 1 ? cn.afterSms.map(n => n.id) : undefined,
                        // 模版id
                        materialIdList: cn.value !== 1 ? cn.model.map(n => n.id) : undefined,
                        smsAttr: cn.model[0].smsAttr || {},
                        // 推送类型 1:定时 2:规则
                        pushType: cn.chooseType,
                        pushTimeInfo: {
                          // 定时型的值
                          schedulePushInfo: cn.chooseType === 1 ? {
                            // pushTimeId: cn.pushTimeId,
                            startDate: cn.dateRange[0],
                            endDate: cn.dateRange[1],
                            intervalType: cn.timingDateType,
                            interval: cn.timingDateValue,
                            moment: cn.timingTimeValue
                          } : undefined,
                          // 规则型的值
                          rulePushInfoList: cn.chooseType === 2 ? cn.ruleValue.map((ruleItem, rule_i) => {
                            return {
                              // pushTimeId: ruleItem.pushTimeId,
                              delay: ruleItem.date,
                              moment: ruleItem.time
                            }
                          }) : undefined
                        }
                      }
                    })
                  }
                })
              }
            })
            // console.log(data)
            // reject()
            const param = {
              baseId: this.id,
              strategySaveCriteriaList: data
            }
            savePloy(param).then(res => {
              resolve()
            }).catch(() => {
              reject()
            })
          } else {
            // console.log(field)
            let errList = Object.keys(field).map(key => this.getIndex(key))
            errList = this.sortIndex(errList)
            // console.log(errList, '???')
            const [gi, pi] = errList[0]
            // console.log(gi, pi)
            this.groupName = gi + ''
            this.$nextTick(() => {
              // console.log(this.group[gi])
              if (!isNaN(pi)) {
                // console.log(this.group[gi].ployTabs[pi].name)
                this.group[gi].ployTabsValue = this.group[gi].ployTabs[pi].name
              }
            })
            this.isSubmit = false
            reject()
          }
        })
      })
    },
    beforeHandleGroupTabClick(activeName, oldActiveName) {
      this.animateNum(+activeName)
    },

    animateNum(i) {
      this.tweenedNumber = 0
      const num = this.group[i].people.toFixed(0)
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: num })
    },

    getTotalPercent(gi) {
      let p = 0
      this.group[gi].ployTabs.forEach((n, i) => {
        p += n.percent
      })
      return p
    },
    addStrategy() {
      this.showStrategy = true
      this.$nextTick(() => {
        this.$refs.strategyRef.reset()
        this.$refs.strategyRef.parentRef.setSelection([])
      })
    },
    // 选择策略-确定
    submitStrategy() {
      const val = this.$refs.strategyRef.parentRef.getVal()
      if (val.length) {
        this.showStrategy = false
        console.log('val', val)
        const gi = this.groupIndex
        const length = this.group[gi].ployTabs.length
        // 添加策略
        val.forEach((n, i) => {
          // 累加数量
          const newTabName = ++this.group[gi].ployTabIndex
          const obj = this.ployTranslate(n, newTabName)
          obj.abstractId = undefined
          this.group[gi].ployTabs.push(obj)
        })
        // this.group[gi].ployTabs.push(...val.map((n, i) => {
        //   return this.ployTranslate(n, i + length)
        // }))
        this.group[gi].totalPercent = this.getTotalPercent(gi)
        // 修改简介
        this.$parent.ployDetail.ployCount = this.ployCounts
        // 校验
        this.$nextTick(() => {
          // 校验策略是否为空
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs`)
          // 校验策略名是否重复
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
        })
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    addTab() {
      const gi = this.groupIndex
      const newTabName = ++this.group[gi].ployTabIndex + ''
      let percent = 100
      this.group[gi].ployTabs.forEach((n, i) => {
        percent = parseFloat((percent - n.percent) < 0 ? 0 : (percent - n.percent).toFixed(2))
      })
      this.group[gi].ployTabs.push({
        title: '新策略' + newTabName,
        name: newTabName,
        percent,
        // 产品
        product: [],
        // 权益
        interest: [],
        // 渠道
        channel: [],
        channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
      })
      this.group[gi].ployTabsValue = newTabName
      this.group[gi].totalPercent = this.getTotalPercent(gi)
      // console.log(typeof this.group[gi].totalPercent, typeof percent)
      this.$nextTick(() => {
        // 校验策略是否为空
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs`)
        // 校验策略名是否重复
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
      })

      // 修改简介
      this.$parent.ployDetail.ployCount = this.ployCounts
    },
    copyTab(ployItem) {
      // console.log(ployItem)
      const gi = this.groupIndex
      const newTabName = ++this.group[gi].ployTabIndex + ''
      let percent = 100
      this.group[gi].ployTabs.forEach((n, i) => {
        percent = parseFloat((percent - n.percent) < 0 ? 0 : (percent - n.percent).toFixed(2))
      })
      const ploy = {
        title: '新策略' + newTabName,
        name: newTabName,
        percent,
        // 产品
        product: JSON.parse(JSON.stringify(ployItem.product)),
        // 权益
        interest: JSON.parse(JSON.stringify(ployItem.interest)),
        // 渠道
        channel: JSON.parse(JSON.stringify(ployItem.channel)),
        channelOpt: JSON.parse(JSON.stringify(ployItem.channelOpt))
      }
      ploy.channel.forEach(n => {
        n.infoId = undefined
        n.pushTimeId = undefined
      })
      this.group[gi].ployTabs.push(ploy)
      // this.group[gi].ployTabsValue = newTabName
      this.group[gi].totalPercent = this.getTotalPercent(gi)
      // console.log(typeof this.group[gi].totalPercent, typeof percent)
      // this.$nextTick(() => {
      //   // 校验策略是否为空
      //   this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs`)
      //   // 校验策略名是否重复
      //   this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
      // })

      // 修改简介
      this.$parent.ployDetail.ployCount = this.ployCounts
    },
    handleRemoveTab(targetName) {
      const gi = this.groupIndex
      this.$confirm('确认删除？')
        .then(() => {
          const tabs = this.group[gi].ployTabs
          let activeName = this.group[gi].ployTabsValue
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }
          this.group[gi].ployTabsValue = activeName
          this.group[gi].ployTabs = tabs.filter(tab => tab.name !== targetName)
          this.group[gi].totalPercent = this.getTotalPercent(gi)

          this.$nextTick(() => {
            // 校验策略是否为空
            this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs`)
            // 校验策略名是否重复
            this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
          })
          // 修改简介
          this.$parent.ployDetail.ployCount = this.ployCounts
        })
        .catch(() => {
        })
    },
    // 选择推送类型
    handleChannelTypeChange(val, ci) {
      this.channelIndex = ci
      // 校验
      this.$nextTick(() => {
        // 1 定时型 2 规则型
        if (val === 1) {
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.dateRange`)
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.timingDateValue`)
        } else if (val === 2) {
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.ruleValue`)
        }
      })
    },
    handlePercentChange() {
      let total = 0
      this.group[+this.groupName].ployTabs.forEach((n, i) => {
        total += n.percent || 0
      })
      // console.log(total)
      this.group[+this.groupName].totalPercent = total
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.totalPercent`)
    },
    handlePercentBlur(item) {
      if (!item.percent) {
        item.percent = 0
      }
    },
    // 选择产品
    addProduct(item) {
      // console.log(item.product)
      // this.$refs.productRef && this.$refs.productRef.resetAll()
      this.showProduct = true
      this.$nextTick(() => {
        this.$refs.productRef.reset()
        this.$refs.productRef.parentRef.setSelection(item.product)
      })
    },
    // 删除产品
    deleteProduct(item, i) {
      // console.log(item.product, row)
      item.product.splice(i, 1)
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.product`)
    },
    // 选择产品-确定
    submitProduct() {
      const val = this.$refs.productRef.parentRef.getVal()
      if (val.length) {
        this.showProduct = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].product = val
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.product`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    getTableColumnListByType(type) {
      return SELF_COLUMN_LIST.find(n => {
        return n.type === type
      }).columnList
    },

    // 选择权益
    addInterest(item) {
      this.showInterest = true
      this.$nextTick(() => {
        this.$refs.interestRef.reset()
        this.$refs.interestRef.parentRef.setSelection(item.interest)
      })
    },
    // 删除权益
    deleteInterest(item, i) {
      item.interest.splice(i, 1)
      // 校验
      // this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.interest`)
    },
    // 选择权益-确定
    submitInterest() {
      const val = this.$refs.interestRef.parentRef.getVal()
      if (val.length) {
        this.showInterest = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].interest = val
        // 校验
        // this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.interest`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    parseTable(data) {
      return data.list.map((n, i) => {
        return Object.assign({
          groupName: data.groupName,
          income: data.income,
          total: data.list.length
        }, n)
      })
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'groupName' || column.property === 'income') {
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
    },

    // 添加渠道
    handleCommandChannel(index, item) {
      CHANNEL_OPT.forEach((n, i) => {
        if (n.value === index) {
          item.channel.push(JSON.parse(JSON.stringify(n)))
        }
      })
      // 添加之后滚动到对应位置
      this.$nextTick(() => {
        const id = `#channelRef-${this.groupIndex}-${this.ployIndex}-${item.channel.length - 1}`
        const top = document.querySelector(id).getBoundingClientRect().top
        document.querySelector('.content').scrollTop = top
      })
      // 已选择的渠道禁止选择
      item.channelOpt.forEach((n, i) => {
        n.disabled = item.channel.some(m => m.value === n.value)
      })
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel`)
    },
    // 删除渠道
    deleteChannel(ployItem, ci) {
      // 删除该项
      ployItem.channel.splice(ci, 1)
      // 重新渲染下拉选项
      ployItem.channelOpt.forEach((n, i) => {
        n.disabled = ployItem.channel.some(m => m.value === n.value)
      })
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel`)
    },
    addRuleItem(item) {
      item.ruleValue.push({
        date: 0,
        time: '00:00'
      })
    },
    delRuleItem(item, i) {
      item.ruleValue.splice(i, 1)
    },

    handleMouseEnter(row, column, cell, event) {
      // console.log(row)
      row.isHover = true
    },
    handleMouseLeave(row, column, cell, event) {
      // console.log(row)
      row.isHover = false
    },
    // crm选择话术
    addCRMWords(item, ci) {
      this.showCRMWord = true
      this.$nextTick(() => {
        this.$refs.wordRef.reset()
        this.$refs.wordRef.parentRef.setSelection([])
      })
      this.channelIndex = ci
    },

    // 短信
    addSmsWords(item, ci) {
      this.showSms = true
      this.$nextTick(() => {
        this.$refs.smsRef.reset()
        this.$refs.smsRef.parentRef.setSelection(item.model)
      })
      this.channelIndex = ci
    },
    // crm-预热短信
    addBeforeSmsWords(item, ci) {
      this.showBeforeSms = true
      this.$nextTick(() => {
        this.$refs.beforeSmsRef.reset()
        this.$refs.beforeSmsRef.parentRef.setSelection(item.beforeSms)
      })
      this.channelIndex = ci
    },
    // 删除crm-预热短信
    deleteBeforeSms(item, i) {
      item.beforeSms.splice(i, 1)
    },
    // crm-跟尾短信
    addAfterSmsWords(item, ci) {
      this.showAfterSms = true
      this.$nextTick(() => {
        this.$refs.afterSmsRef.reset()
        this.$refs.afterSmsRef.parentRef.setSelection(item.afterSms)
      })
      this.channelIndex = ci
    },
    // 删除crm-跟尾短信
    deleteAfterSms(item, i) {
      item.afterSms.splice(i, 1)
    },
    // 微信
    addWeChatWords(item, ci) {
      this.showSms = true
      this.$nextTick(() => {
        this.$refs.smsRef.reset()
        this.$refs.smsRef.parentRef.setSelection(item.model)
      })
      this.channelIndex = ci
    },
    // 删除话术
    deleteWord(item, ci, i) {
      item.model.splice(i, 1)
      this.channelIndex = ci

      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
    },
    // 选择话术-确认
    submitWord() {
      const val = this.$refs.wordRef.parentRef.getVal()
      if (val.length) {
        this.showCRMWord = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].model.push(
          ...val.map(n => {
            return Object.assign({}, n, {
              _content: n.content,
              isEdit: false,
              isHover: false
            })
          })
        )
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // crm-预热短信-确认
    submitBeforeSms() {
      const val = this.$refs.beforeSmsRef.parentRef.getVal()
      if (val.length) {
        this.showBeforeSms = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].beforeSms = val.map(n => {
          return Object.assign({}, n, {
            smsAttr: {}
          })
        })
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // crm-跟尾短信-确认
    submitAfterSms() {
      const val = this.$refs.afterSmsRef.parentRef.getVal()
      if (val.length) {
        if (val.length > 15) {
          Message({
            message: '请选择少于十五项',
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          this.showAfterSms = false
          this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].afterSms = val.map(n => {
            return Object.assign({}, n, {
              smsAttr: {}
            })
          })
        }
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 短信/微信-确认
    submitSms() {
      const val = this.$refs.smsRef.parentRef.getVal()
      // console.log(val)
      if (val.length) {
        this.showSms = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].model = val.map(n => {
          return Object.assign({}, n, {
            smsAttr: {}
          })
        })
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },

    // 精准内侧
    handleTestSms(channelIndex) {
      this.validateList = []
      // 校验model
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${channelIndex}.model`)
      // 校验phone
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${channelIndex}.test`)
      const data = {}
      // console.log(this.validateList)
      const validate = this.validateList.every(n => {
        return n.validate
      })
      if (validate) {
        // console.log(this.group[this.groupIndex].ployTabs[this.ployIndex].channel[channelIndex])
        const data = {}
        data.templateId = this.group[this.groupIndex].ployTabs[this.ployIndex].channel[channelIndex].model[0].id
        data.mblpnNo = this.group[this.groupIndex].ployTabs[this.ployIndex].channel[channelIndex].test
        // const params = this.$refs['testSmsRef-' + this.groupIndex + '-' + this.ployIndex][0].getParams()
        const params = this.group[this.groupIndex].ployTabs[this.ployIndex].channel[channelIndex].model[0].smsAttr
        Object.assign(data, params)
        // console.log(data)
        testSms(data).then(res => {
          if (res.code === 200) {
            Message({
              message: '操作成功',
              type: 'success',
              duration: '3000'
            })
          }
        })
      }
    },
    handleTimeBlur(vueComponent, item) {
      if (!item.time) {
        item.time = parseTime(new Date(), '{h}:{i}')
      }
    },
    ValidatorModel(rule, value, callback) {
      // console.log('ValidatorModelValue>>>>>>>>>>>>', value)
      if (value.length) {
        value.forEach(n => {
          if (!n.smsAttr) {
            callback()
          } else if (
            Object.keys(n.smsAttr).every(m => {
              return n.smsAttr[m]
            })
          ) {
            callback()
          } else {
            callback(new Error('请填写参数'))
          }
        })
      } else {
        callback(new Error('请选择模版'))
      }
    },
    ValidatorTestSelect(rule, value, callback) {
      // console.log(value)
      if (this.isSubmit) callback()
      // if (!value) callback()
      const b = isPhone(value)
      if (!b) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.ploy-container {
  padding: 5px 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .left {
      color: #888;
      font-size: 14px;
      flex: 1;
      display: flex;
      align-items: center;
      b {
        color: #444;
        font-size: 18px;
      }
    }
  }
  .desc {
    @include shun-text;
    word-break: break-all;
  }
  ::v-deep th.is-leaf,
  ::v-deep td {
    &.el-table__expanded-cell {
      padding: 10px 50px;
      text-align: left;
      .el-form-item {
        margin: 0;
        font-weight: normal;
        .el-form-item__label {
          font-size: 12px;
          color: #909399;
        }
        .el-form-item__content {
          font-size: 12px;
        }
      }
    }
  }
  .tab-label {
    display: flex;
    align-items: center;
  }
  .ploy-title-tab {
    display: inline-flex;
    align-items: center;
    .copy {
      margin-right: 4px;
      transform: scale(0.8);
    }
  }

  .ploy-card {
    // @include shun-text;
    // border: 1px solid #ebeef5;
    // background: #fafafa;
    // color: #444;
    // margin-bottom: 0;
    // font-size: 13px;
    // display: flex;
  }
  .channel-card {
    background: #fefdfc;
    margin-bottom: 18px;
    .name-icon {
      margin-right: 10px;
      color: $blue;
      font-size: 20px;
    }
    .channel-card-title {
      font-weight: bold;
      display: flex;
      align-items: flex-start;
      float: left;
    }
    .channel-card-delete {
      float: right;
      padding: 3px 0;
      color: rgb(245, 108, 108);
      &:hover {
        opacity: 0.8;
      }
    }
    ::v-deep .el-card__body {
      padding-bottom: 2px;
    }
    .rule-form {
      width: 470px;
      .rule-item {
        display: flex;
        position: relative;
        margin-bottom: 10px;
        // height: 32px;
        .text-text {
          margin: 0 10px 0 5px;
          font-size: 16px;
        }
        .plus-text {
          font-size: 18px;
          margin-right: 10px;
        }
        // .el-form-item {
        //   flex: 1;
        // }
        // .target-item-input {
        //   width: 100%;
        // }
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
    .table-desc {
      .table-edit {
        display: inline-block;
        cursor: pointer;
        margin-left: 10px;
        i {
          color: $blue;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
