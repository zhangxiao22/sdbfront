<template>
  <div class="container">
    <!-- ******************************************************************************** 顶栏 ******************************************************************************** -->
    <!-- // this.baseInfo[0].value = data.count // 线索数量
        // this.baseInfo[1].value = data.purchasedNum // 销售成功数量
        // this.baseInfo[2].value = data.purchaseRate // 成功购买率
        // this.baseInfo[3].value = data.aumUp // 全体客户aum增量
        // this.baseInfo[4].value = data.aumAverage // 全体客户户均aum增量
        // this.baseInfo[5].value = data.purchaseAumUp // 成功客户aum增量
        // this.baseInfo[6].value = data.purchaseAumAverage // 成功客户户均aum增量 -->
    <div class="base-info">
      <div class="item-box">
        <div class="item-inner shun-card">
          <div class="label">
            <i class="el-icon-s-data main-icon" />客户AUM增量
            <div class="right">(全体/成功/失败)</div>
          </div>
          <div class="value">
            <div class="blue">{{ tenThousandWholeNumberFormatter(null, null, baseInfo.aumUp) }}</div>
            <div class="separator">/</div>
            <div class="green">{{ tenThousandWholeNumberFormatter(null, null, baseInfo.purchaseAumUp) }}</div>
            <div class="separator">/</div>
            <div class="red">{{ tenThousandWholeNumberFormatter(null, null, baseInfo.losingAumUp) }}</div>
            <div class="unit">万元</div>
          </div>
        </div>
      </div>
      <div class="item-box">
        <div class="item-inner shun-card">
          <div class="label">
            <i class="el-icon-s-data main-icon" />客户户均AUM增量
            <div class="right">(全体/成功/失败)</div>
          </div>
          <div class="value">
            <div class="blue">{{ tenThousandFormatter(null, null, baseInfo.aumAverage) }}</div>
            <div class="separator">/</div>
            <div class="green">{{ tenThousandFormatter(null, null, baseInfo.purchaseAumAverage) }}</div>
            <div class="separator">/</div>
            <div class="red">{{ tenThousandFormatter(null, null, baseInfo.losingAumAverage) }}</div>
            <div class="unit">万元</div>
          </div>
        </div>
      </div>
      <div class="item-box">
        <div class="item-inner shun-card">
          <div class="label">
            <i class="el-icon-s-data main-icon" />线索数量 / 销售成功数量
          </div>
          <div class="value">
            {{ wholeNumberFormatter(null, null, baseInfo.count) }}
            <div class="unit">条</div>
            <div class="separator">/</div>
            {{ wholeNumberFormatter(null, null, baseInfo.purchasedNum) }}
            <div class="unit">个</div>
          </div>
        </div>
      </div>
      <div class="item-box">
        <div class="item-inner shun-card">
          <div class="label">
            <i class="el-icon-s-data main-icon" />成功购买率
          </div>
          <div class="value">
            {{ percentFormatter(null, null, baseInfo.purchaseRate).slice(0, -1) }}
            <div class="unit">%</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-loading="baseInfoLoading"
         class="base-info">
      <template v-for="(item,i) of baseInfo">
        <div v-if="item.name !== '全体客户户均AUM增量' && item.name !== '成功客户户均AUM增量'"
             :key="i"
             class="item-box">
          <div class="item-inner shun-card">
            <div class="label">
              <svg-icon class="main-icon"
                        :icon-class="item.icon" />
              <i class="el-icon-s-data main-icon" />{{ item.name }}
              <template v-if="item.name === '全体客户AUM增量' || item.name === '成功客户AUM增量'">
                <pre> / </pre><i class="el-icon-s-data main-icon" />{{ baseInfo[i+1].name }}
              </template>
            </div>
            <div class="value">
              <template v-if="item.unit === '%'">
                {{ percentFormatter(null, null, item.value).slice(0, -1) }}
              </template>
              <template v-else-if="item.unit === '万元'">
                {{ formatTenThousand(item.value) }}
              </template>
              <template v-else>
                {{ item.value | formatMoney }}
              </template>
              <template v-if="item.name === '全体客户AUM增量' || item.name === '成功客户AUM增量'">
                / {{ formatTenThousand(baseInfo[i+1].value) }}
              </template>
              <div class="unit">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </template>
    </div> -->

    <!-- ******************************************************************************** 督导总览 ******************************************************************************** -->
    <ShunTable ref="overviewRef"
               title="督导总览"
               :loading="overview.loading"
               :current-page.sync="overview.currentPage"
               :page-size.sync="overview.pageSize"
               :total="overview.total"
               :table-data="overview.tableData"
               stripe
               :table-column-list="overview.tableColumnList"
               class="block"
               @render="overviewGetList"
               @sort-change="handleOverviewSortChange">
      <template v-slot:filter>
        <el-form ref="overviewFilterRef"
                 :inline="true"
                 :model="overview.filterForm"
                 class="filter-container">
          <el-form-item label="渠道："
                        prop="channel">
            <el-select v-model="overview.filterForm.channel"
                       placeholder="请选择渠道"
                       clearable
                       style="width: 200px">
              <el-option v-for="item of channelOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="营销用例："
                        prop="useCase">
            <el-cascader ref="overviewUseCaseRef"
                         v-model="overview.filterForm.useCase"
                         placeholder="请选择用例"
                         :show-all-levels="false"
                         :options="useCaseOpt"
                         clearable
                         collapse-tags
                         :props="{multiple: true}"
                         style="width: 250px;" />
          </el-form-item>
          <el-form-item label="批次："
                        prop="batch">
            <el-cascader ref="overviewBatchRef"
                         v-model="overview.filterForm.batch"
                         placeholder="请选择批次"
                         :options="batchOpt"
                         clearable
                         collapse-tags
                         :props="{multiple: true}"
                         :show-all-levels="false"
                         style="width: 280px" />
          </el-form-item>
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="overviewSearch">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="overviewReset">
              重置
            </el-button>
            <el-tooltip content="下载为Excel"
                        placement="top">
              <el-button type="primary"
                         icon="el-icon-download"
                         plain
                         :loading="overview.downloadLoading"
                         @click="handleOverviewDownload">
                导出
              </el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:purchaseAumUpSlot="{row}">
        <span style="color: blue;">{{ tenThousandFormatter(null, null, row.aumUp) }}</span>
        /
        <span style="color: green;">{{ tenThousandFormatter(null, null, row.purchaseAumUp) }}</span>
        /
        <span style="color: red;">{{ tenThousandFormatter(null, null, row.losingAumUp) }}</span>
      </template>
      <template v-slot:purchaseAumAverageSlot="{row}">
        <span style="color: blue;">{{ tenThousandFormatter(null, null, row.aumAverage) }}</span>
        /
        <span style="color: green;">{{ tenThousandFormatter(null, null, row.purchaseAumAverage) }}</span>
        /
        <span style="color: red;">{{ tenThousandFormatter(null, null, row.losingAumAverage) }}</span>
      </template>
      <template #purchaseAumUpHeaderSlot>
        <div>客户AUM增量(万元)</div>
        <span>(全体/成功/失败)</span>
      </template>
      <template #purchaseAumAverageHeaderSlot>
        <div>客户户均AUM增量(万元)</div>
        <span>(全体/成功/失败)</span>
      </template>
    </ShunTable>

    <!-- ******************************************************************************** 生成按钮 ******************************************************************************** -->
    <div class="block"
         style="display:flex; justify-content: center;">
      <el-button type="primary"
                 icon="el-icon-document-checked"
                 style="width: 400px;"
                 @click="generate">
        生成详细督导数据
      </el-button>
    </div>

    <!-- ******************************************************************************** 生成后的内容 ******************************************************************************** -->
    <div v-if="showExtra"
         id="scroll-content">
      <!-- ********************************************************************** 执行情况 ********************************************************************** -->
      <div class="block shun-card">
        <div class="top">
          <div class="head">
            <div class="title-box">
              <div class="title">各支行的执行情况</div>
              <div class="filter-box">
                <el-select v-model="executeStatus.batch"
                           placeholder="请选择批次"
                           clearable
                           class="filter-item"
                           @change="handleExecuteStatusBatchChange">
                  <el-option v-for="item of executeStatus.batchOpt"
                             :key="item"
                             :label="item"
                             :value="item" />
                </el-select>
              </div>
            </div>
            <el-tooltip content="下载为Excel"
                        placement="top">
              <el-button type="primary"
                         plain
                         icon="el-icon-download"
                         class="download"
                         :loading="executeStatus.downloadLoading"
                         @click="handleExecuteStatusDownload">
                导出
              </el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="bottom">
          <div class="item">
            <div class="content">
              <el-table ref="executeStatusRef"
                        v-loading="executeStatus.loading"
                        stripe
                        :cell-style="executeStatusCellStyle"
                        :data="executeStatus.tableData">
                <el-table-column prop="purchasedRateRanking"
                                 label="实际购买率排名"
                                 align="right"
                                 sortable
                                 :formatter="wholeNumberFormatter" />
                <el-table-column prop="subBranchName"
                                 label="支行"
                                 align="right"
                                 show-overflow-tooltip />
                <el-table-column prop="count"
                                 label="线索数量(条)"
                                 align="right"
                                 sortable
                                 :formatter="wholeNumberFormatter" />
                <el-table-column prop="executeRate"
                                 label="执行率(%)"
                                 align="right"
                                 sortable
                                 :formatter="percentFormatter" />
                <el-table-column prop="contactedRate"
                                 label="联络成功率(%)"
                                 align="right"
                                 sortable
                                 :formatter="percentFormatter" />
                <el-table-column label="实际购买率(%)"
                                 align="center">
                  <el-table-column prop="purchaseRate"
                                   label="本批"
                                   align="right"
                                   sortable
                                   :formatter="percentFormatter" />
                  <el-table-column prop="comparison"
                                   label="比上批"
                                   align="right"
                                   sortable>
                    <template slot-scope="scope">
                      <div v-if="scope.row.comparison < 0"
                           class="red">
                        {{ percentFormatter(scope.row, null, scope.row.comparison) }}
                        <i class="el-icon-bottom" />
                      </div>
                      <div v-else-if="scope.row.comparison > 0"
                           class="green">
                        {{ percentFormatter(scope.row, null, scope.row.comparison) }}
                        <i class="el-icon-top" />
                      </div>
                      <div v-else
                           class="grey">
                        {{ percentFormatter(scope.row, null, scope.row.comparison) }}
                        <i class="el-icon-minus" />
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="客户AUM增量(万元)"
                                 align="center">
                  <el-table-column prop="aumUp"
                                   label="全体"
                                   align="right"
                                   sortable
                                   :formatter="tenThousandFormatter" />
                  <el-table-column prop="purchaseAumUp"
                                   label="成功"
                                   align="right"
                                   sortable
                                   :formatter="tenThousandFormatter" />
                  <el-table-column prop="losingAumUp"
                                   label="失败"
                                   align="right"
                                   sortable
                                   :formatter="tenThousandFormatter" />
                </el-table-column>
                <el-table-column label="客户户均AUM增量(万元)"
                                 align="center">
                  <el-table-column prop="aumAverage"
                                   label="全体"
                                   align="right"
                                   sortable
                                   :formatter="tenThousandFormatter" />
                  <el-table-column prop="purchaseAumAverage"
                                   label="成功"
                                   align="right"
                                   sortable
                                   :formatter="tenThousandFormatter" />
                  <el-table-column prop="losingAumAverage"
                                   label="失败"
                                   align="right"
                                   sortable
                                   :formatter="tenThousandFormatter" />
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!-- ********************************************************************** 综合排名 ********************************************************************** -->
      <div class="block half-block">
        <!-- 营销人员综合排名 -->
        <div class="left shun-card">
          <div class="top">
            <div class="head">
              <div class="title-box">
                <div class="title">网点综合排名</div>
                <div class="filter-box">
                  <el-radio-group v-model="ranking.org.scope"
                                  class="filter-item"
                                  @change="handleOutletRankingChange">
                    <el-radio-button label="前20名" />
                    <el-radio-button label="查看全部" />
                    <el-radio-button label="后20名" />
                  </el-radio-group>
                </div>
              </div>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button type="primary"
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="ranking.org.downloadLoading"
                           @click="handleOutletRankingDownload">
                  导出
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="bottom">
            <div class="item note">
              <div v-for="({label, value}, i) of ranking.org.calculatedValue"
                   :key="i">
                {{ label }}: {{ i === 0 ? percentFormatter(null, null, value) : wholeNumberFormatter(null, null, value) }}
              </div>
            </div>
            <div class="item"
                 style="flex: 1;">
              <el-table ref="orgRankingRef"
                        v-loading="ranking.org.loading"
                        stripe
                        border
                        :header-cell-style="{background: '#F5F7FA'}"
                        :data="ranking.org.tableData"
                        @sort-change="handleOutletRankingSortChange">
                <template v-for="(item, i) of ranking.org.tableColumnList">
                  <el-table-column v-if="item.prop==='comparison'"
                                   :key="i"
                                   :prop="item.prop"
                                   :label="item.label"
                                   :sortable="item.sortable"
                                   :align="item.align"
                                   :formatter="item.formatter"
                                   :width="item.width"
                                   :show-overflow-tooltip="item.showOverflowTooltip">
                    <template slot-scope="scope">
                      <div v-if="scope.row.comparison < 0"
                           class="red">
                        {{ scope.row.comparison }}
                        <i class="el-icon-bottom" />
                      </div>
                      <div v-else-if="scope.row.comparison > 0"
                           class="green">
                        {{ scope.row.comparison }}
                        <i class="el-icon-top" />
                      </div>
                      <div v-else
                           class="grey">
                        {{ scope.row.comparison }}
                        <i class="el-icon-minus" />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-else
                                   :key="i"
                                   :prop="item.prop"
                                   :label="item.label"
                                   :sortable="item.sortable"
                                   :align="item.align"
                                   :formatter="item.formatter"
                                   :width="item.width"
                                   :show-overflow-tooltip="item.showOverflowTooltip" />
                </template>
              </el-table>
              <el-pagination v-if="ranking.org.showPagination"
                             :current-page="ranking.org.currentPage"
                             :page-size="ranking.org.pageSize"
                             :total="ranking.org.total"
                             :pager-count="5"
                             small
                             hide-on-single-page
                             background
                             style="padding:15px 15px 0;text-align:right;"
                             layout="total, prev, pager, next"
                             @current-change="handleOutletRankingCurrentChange" />
            </div>
            <div class="item note foot-note">
              <div>综合得分 = 实际购买率贡献度 * 65% + 销售成功数量的贡献度 * 35%</div>
              <div>实际购买率贡献度 = (网点或个人的实际购买率) 除以 (全行的平均实际购买率)</div>
              <div>成功购买人数的贡献度 = (网点或个人销售成功数量) 除以 (全行执行网点或个人平均销售成功数量)</div>
            </div>
          </div>
        </div>
        <!-- 营销人员综合排名 -->
        <div class="right shun-card">
          <div class="top">
            <div class="head">
              <div class="title-box">
                <div class="title">营销人员综合排名</div>
                <div class="filter-box">
                  <el-radio-group v-model="ranking.people.scope"
                                  class="filter-item"
                                  @change="handlePeopleRankingChange">
                    <el-radio-button label="前20名" />
                    <el-radio-button label="查看全部" />
                    <el-radio-button label="后20名" />
                  </el-radio-group>
                </div>
              </div>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button type="primary"
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="ranking.people.downloadLoading"
                           @click="handlePeopleRankingDownload">
                  导出
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="bottom">
            <div class="item note">
              <div v-for="({label, value}, i) of ranking.people.calculatedValue"
                   :key="i">
                {{ label }}: {{ i === 0 ? percentFormatter(null, null, value) : wholeNumberFormatter(null, null, value) }}
              </div>
            </div>
            <div class="item"
                 style="flex: 1;">
              <el-table ref="peopleRankingRef"
                        v-loading="ranking.people.loading"
                        stripe
                        border
                        :header-cell-style="{background: '#F5F7FA'}"
                        :data="ranking.people.tableData"
                        @sort-change="handlePeopleRankingSortChange">
                <template v-for="({prop, label, sortable, formatter, align}, i) of ranking.people.tableColumnList">
                  <el-table-column v-if="prop==='comparison'"
                                   :key="i"
                                   :prop="prop"
                                   :label="label"
                                   :sortable="sortable"
                                   :align="align"
                                   :formatter="formatter">
                    <template slot-scope="scope">
                      <div v-if="scope.row.comparison < 0"
                           class="red">
                        {{ scope.row.comparison }}
                        <i class="el-icon-bottom" />
                      </div>
                      <div v-else-if="scope.row.comparison > 0"
                           class="green">
                        {{ scope.row.comparison }}
                        <i class="el-icon-top" />
                      </div>
                      <div v-else
                           class="grey">
                        {{ scope.row.comparison }}
                        <i class="el-icon-minus" />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-else
                                   :key="i"
                                   :prop="prop"
                                   :label="label"
                                   :sortable="sortable"
                                   :align="align"
                                   :formatter="formatter" />
                </template>
              </el-table>
              <el-pagination v-if="ranking.people.showPagination"
                             :current-page="ranking.people.currentPage"
                             :page-size="ranking.people.pageSize"
                             :total="ranking.people.total"
                             :pager-count="5"
                             small
                             hide-on-single-page
                             background
                             style="padding:15px 15px 0;text-align:right;"
                             layout="total, prev, pager, next"
                             @current-change="handlePeopleRankingCurrentChange" />
            </div>
            <div class="item note foot-note">
              <div>综合得分 = 实际购买率贡献度 * 65% + 销售成功数量的贡献度 * 35%</div>
              <div>实际购买率贡献度 = (网点或个人的实际购买率) 除以 (全行的平均实际购买率)</div>
              <div>成功购买人数的贡献度 = (网点或个人销售成功数量) 除以 (全行执行网点或个人平均销售成功数量)</div>
            </div>
          </div>
        </div>
      </div>
      <!-- ********************************************************************** 督导数据趋势对比 ********************************************************************** -->
      <div class="block block-title">督导数据趋势对比</div>
      <div class="block shun-card">
        <div class="top">
          <el-form ref="keyIndicatorFilterRef"
                   :inline="true"
                   :model="keyIndicator.filterForm"
                   class="top-filter-box">
            <el-form-item label="渠道："
                          prop="channel">
              <el-select v-model="keyIndicator.filterForm.channel"
                         placeholder="请选择渠道"
                         clearable
                         style="width: 200px">
                <el-option v-for="item of childChannelOpt"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="营销用例："
                          prop="useCase">
              <el-cascader v-model="keyIndicator.filterForm.useCase"
                           placeholder="请选择用例"
                           :show-all-levels="false"
                           :options="childUseCaseOpt"
                           clearable
                           collapse-tags
                           :props="{multiple: true}"
                           style="width: 250px;" />
            </el-form-item>
            <el-form-item label="批次："
                          prop="batch">
              <el-cascader ref="keyIndicatorBatchRef"
                           v-model="keyIndicator.filterForm.batch"
                           placeholder="请选择批次"
                           :options="childBatchOpt"
                           clearable
                           collapse-tags
                           :show-all-levels="false"
                           :props="{multiple: true}"
                           style="width: 280px;" />
            </el-form-item>
            <el-form-item class="top-filter-end">
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="keyIndicatorSearch">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh"
                         @click="keyIndicatorReset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom">
          <div class="item">
            <div class="head">
              <div class="title-box">
                <div class="title">各支行用例关键指标趋势表现</div>
                <div class="filter-box">
                  <el-radio-group v-model="keyIndicator.chart1Rate"
                                  class="filter-item">
                    <el-radio-button label="实际购买率" />
                    <el-radio-button label="执行率" />
                    <el-radio-button label="联络成功率" />
                  </el-radio-group>
                </div>
              </div>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button type="primary"
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="keyIndicator.chart1DownloadLoading"
                           @click="handleChart1Download">
                  导出
                </el-button>
              </el-tooltip>
            </div>
            <LineChart id="chart-1"
                       ref="chart1Ref"
                       v-loading="keyIndicator.chart1Loading"
                       class="content chart"
                       :data="realChart1Data"
                       :filter="keyIndicator.chart1Rate" />
          </div>
          <div class="item">
            <div class="head">
              <div class="title-box">
                <div class="title">各支行成功执行率</div>
                <div class="filter-box">
                  <el-radio-group v-model="keyIndicator.chart2Rate"
                                  class="filter-item">
                    <el-radio-button label="实际购买率" />
                    <el-radio-button label="执行率" />
                    <el-radio-button label="联络成功率" />
                  </el-radio-group>
                  <el-select v-model="keyIndicator.chart2Batch"
                             placeholder="请选择批次"
                             class="filter-item"
                             multiple
                             clearable
                             collapse-tags
                             @change="handleChart2BatchChange">
                    <el-option v-for="item of keyIndicator.batchOpt"
                               :key="item"
                               :label="item"
                               :value="item" />
                  </el-select>
                </div>
              </div>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button type="primary"
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="keyIndicator.chart2DownloadLoading"
                           @click="handleChart2Download">
                  导出
                </el-button>
              </el-tooltip>
            </div>
            <BarChart id="chart-2"
                      ref="chart2Ref"
                      v-loading="keyIndicator.chart2Loading"
                      class="content chart"
                      :data="realChart2Data"
                      :filter="keyIndicator.chart2Rate" />
          </div>
          <div class="item">
            <div class="head">
              <div class="title-box">
                <div class="title">意向购买产品/预约网点见面 - 成功占比与比上批情况</div>
                <div class="filter-box">
                  <el-radio-group v-model="keyIndicator.compareToLastBatchType"
                                  class="filter-item">
                    <el-radio-button label="意向购买产品" />
                    <el-radio-button label="预约网点见面" />
                  </el-radio-group>
                  <el-select v-model="keyIndicator.chart3Batch"
                             placeholder="请选择批次"
                             class="filter-item"
                             @change="handleChart3BatchChange">
                    <el-option v-for="item of keyIndicator.batchOpt"
                               :key="item"
                               :label="item"
                               :value="item" />
                  </el-select>
                </div>
              </div>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button type="primary"
                           plain
                           icon="el-icon-download"
                           class="download"
                           :loading="keyIndicator.chart3DownloadLoading"
                           @click="handleChart3Download">
                  导出
                </el-button>
              </el-tooltip>
            </div>
            <StackDodgeBarChart id="chart-3"
                                ref="chart3Ref"
                                v-loading="keyIndicator.chart3Loading"
                                class="content chart"
                                :data="realChart3Data"
                                :filter="keyIndicator.compareToLastBatchType" />
          </div>
        </div>
      </div>
      <!-- ********************************************************************** 用例各支行督导看板 ********************************************************************** -->
      <div class="block block-title">用例各支行督导看板</div>
      <div class="block shun-card">
        <div class="top">
          <el-form ref="orgFilterRef"
                   :inline="true"
                   :model="org.filterForm"
                   class="top-filter-box">
            <el-form-item label="营销用例："
                          prop="useCase">
              <el-cascader v-model="org.filterForm.useCase"
                           placeholder="请选择用例"
                           :show-all-levels="false"
                           :options="childUseCaseOpt"
                           clearable
                           collapse-tags
                           :props="{multiple: true}"
                           style="width: 250px;" />
            </el-form-item>
            <el-form-item label="批次："
                          prop="batch">
              <el-cascader v-model="org.filterForm.batch"
                           placeholder="请选择批次"
                           :show-all-levels="false"
                           :options="childBatchOpt"
                           clearable
                           style="width: 280px;" />
            </el-form-item>
            <el-form-item label="客群类型："
                          prop="customerGroup">
              <el-select v-model="org.filterForm.customerGroup"
                         clearable>
                <el-option v-for="(item, i) of customerGroupOpt"
                           :key="i"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item class="top-filter-end">
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="orgSearch">
                搜索
              </el-button>
              <el-button icon="el-icon-refresh"
                         @click="orgReset">
                重置
              </el-button>
              <el-tooltip content="下载为Excel"
                          placement="top">
                <el-button type="primary"
                           icon="el-icon-download"
                           plain
                           :loading="org.downloadLoading"
                           @click="handleOrgDownload">
                  导出
                </el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom">
          <el-table ref="orgTableRef1"
                    v-loading="org.table1Loading"
                    :data="org.table1Data"
                    :cell-style="orgTable1CellStyle"
                    stripe
                    class="item">
            <el-table-column prop="useCaseName"
                             label="用例名称"
                             align="right"
                             show-overflow-tooltip />
            <el-table-column label="销售金额(万元)"
                             align="center">
              <el-table-column label="总销售金额(比上批)"
                               prop="purchasedAmount"
                               sortable
                               align="right">
                <template slot-scope="scope">
                  {{ tenThousandFormatter(scope.row, null, scope.row.purchasedAmount) }}
                  (
                  <span v-if="scope.row.purchasedAmountPC < 0"
                        class="red">
                    {{ tenThousandFormatter(scope.row, null, scope.row.purchasedAmountPC) }}
                    <i class="el-icon-bottom" />
                  </span>
                  <span v-else-if="scope.row.purchasedAmountPC > 0"
                        class="green">
                    {{ tenThousandFormatter(scope.row, null, scope.row.purchasedAmountPC) }}
                    <i class="el-icon-top" />
                  </span>
                  <span v-else
                        class="grey">
                    {{ tenThousandFormatter(scope.row, null, scope.row.purchasedAmountPC) }}
                    <i class="el-icon-minus" />
                  </span>
                  )
                </template>
              </el-table-column>
              <el-table-column label="定期(比上批)"
                               prop="fixedTimeDeposit"
                               sortable
                               align="right">
                <template slot-scope="scope">
                  {{ tenThousandFormatter(scope.row, null, scope.row.fixedTimeDeposit) }}
                  (
                  <span v-if="scope.row.fixedTimeDepositPC < 0"
                        class="red">
                    {{ tenThousandFormatter(scope.row, null, scope.row.fixedTimeDepositPC) }}
                    <i class="el-icon-bottom" />
                  </span>
                  <span v-else-if="scope.row.fixedTimeDepositPC > 0"
                        class="green">
                    {{ tenThousandFormatter(scope.row, null, scope.row.fixedTimeDepositPC) }}
                    <i class="el-icon-top" />
                  </span>
                  <span v-else
                        class="grey">
                    {{ tenThousandFormatter(scope.row, null, scope.row.fixedTimeDepositPC) }}
                    <i class="el-icon-minus" />
                  </span>
                  )
                </template>
              </el-table-column>
              <el-table-column label="自营理财(比上批)"
                               prop="selfSupportManagement"
                               sortable
                               align="right">
                <template slot-scope="scope">
                  {{ tenThousandFormatter(scope.row, null, scope.row.selfSupportManagement) }}
                  (
                  <span v-if="scope.row.selfSupportManagementPC < 0"
                        class="red">
                    {{ tenThousandFormatter(scope.row, null, scope.row.selfSupportManagementPC) }}
                    <i class="el-icon-bottom" />
                  </span>
                  <span v-else-if="scope.row.selfSupportManagementPC > 0"
                        class="green">
                    {{ tenThousandFormatter(scope.row, null, scope.row.selfSupportManagementPC) }}
                    <i class="el-icon-top" />
                  </span>
                  <span v-else
                        class="grey">
                    {{ tenThousandFormatter(scope.row, null, scope.row.selfSupportManagementPC) }}
                    <i class="el-icon-minus" />
                  </span>
                  )
                </template>
              </el-table-column>
              <el-table-column label="代理理财(基金+保险)(比上批)"
                               prop="agencyManagement"
                               sortable
                               align="right">
                <template slot-scope="scope">
                  {{ tenThousandFormatter(scope.row, null, scope.row.agencyManagement) }}
                  (
                  <span v-if="scope.row.agencyManagementPC < 0"
                        class="red">
                    {{ tenThousandFormatter(scope.row, null, scope.row.agencyManagementPC) }}
                    <i class="el-icon-bottom" />
                  </span>
                  <span v-else-if="scope.row.agencyManagementPC > 0"
                        class="green">
                    {{ tenThousandFormatter(scope.row, null, scope.row.agencyManagementPC) }}
                    <i class="el-icon-top" />
                  </span>
                  <span v-else
                        class="grey">
                    {{ tenThousandFormatter(scope.row, null, scope.row.agencyManagementPC) }}
                    <i class="el-icon-minus" />
                  </span>
                  )
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="客户AUM增量(万元)"
                             align="center">
              <el-table-column prop="aumUp"
                               label="全体"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="purchaseAumUp"
                               label="成功"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="losingAumUp"
                               label="失败"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
            </el-table-column>
            <el-table-column label="客户户均AUM增量(万元)"
                             align="center">
              <el-table-column prop="aumAverage"
                               label="全体"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="purchaseAumAverage"
                               label="成功"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="losingAumAverage"
                               label="失败"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
            </el-table-column>
          </el-table>
          <el-table ref="orgTableRef2"
                    v-loading="org.table2Loading"
                    :data="org.table2Data"
                    stripe
                    class="item">
            <el-table-column prop="useCaseName"
                             label="用例名称"
                             align="right" />
            <el-table-column prop="type"
                             label="类别"
                             align="right" />
            <el-table-column label="资金流向(万元)"
                             align="center">
              <el-table-column prop="netInflow"
                               label="净流入"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="totalInflow"
                               label="总流入"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="totalOutflow"
                               label="总流出"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column label="互联网理财"
                               align="center">
                <el-table-column prop="internetFmInflow"
                                 label="流入"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
                <el-table-column prop="internetFmOutflow"
                                 label="流出"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
              </el-table-column>
              <el-table-column label="同业同名"
                               align="center">
                <el-table-column prop="sameTradeSameNameInflow"
                                 label="流入"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
                <el-table-column prop="sameTradeSameNameOutflow"
                                 label="流出"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
              </el-table-column>
              <el-table-column label="同业异名"
                               align="center">
                <el-table-column prop="sameTradeDifferentNameInflow"
                                 label="流入"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
                <el-table-column prop="sameTradeDifferentNameOutflow"
                                 label="流出"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
              </el-table-column>
              <el-table-column label="行内转账"
                               align="center">
                <el-table-column prop="intraBankTransferIn"
                                 label="流入"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
                <el-table-column prop="intraBankTransferOut"
                                 label="流出"
                                 align="right"
                                 sortable
                                 :formatter="tenThousandFormatter" />
              </el-table-column>
              <el-table-column prop="isSavingsUp"
                               label="是否储蓄溢价"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="creditCardRepayment"
                               label="本月信用卡还款金额"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="thirdPartyConsumption"
                               label="第三方消费"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="POSConsumption"
                               label="POS消费"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="bankToBank"
                               label="银银"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="mobileBankPurchase"
                               label="手银购买"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="repayment"
                               label="还款"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="cash"
                               label="现金"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
              <el-table-column prop="payroll"
                               label="受薪金额"
                               align="right"
                               sortable
                               :formatter="tenThousandFormatter" />
            </el-table-column>
          </el-table>
          <el-table ref="orgTableRef3"
                    v-loading="org.table3Loading"
                    :data="org.table3Data"
                    class="item"
                    stripe>
            <el-table-column prop="subBranchName"
                             label="支行"
                             align="right" />
            <el-table-column prop="count"
                             label="线索数量(条)"
                             align="right"
                             sortable
                             :formatter="wholeNumberFormatter" />
            <el-table-column label="实际购买率与比上批(%)"
                             align="center">
              <el-table-column prop="purchaseRate"
                               label="实际购买率"
                               align="right"
                               sortable
                               :formatter="percentFormatter" />
              <el-table-column prop="purchaseRateCompareUp"
                               label="比上批"
                               sortable
                               align="right">
                <template slot-scope="scope">
                  <div v-if="scope.row.purchaseRateCompareUp < 0"
                       class="red">
                    {{ percentFormatter(scope.row, null, scope.row.purchaseRateCompareUp) }}
                    <i class="el-icon-bottom" />
                  </div>
                  <div v-else-if="scope.row.purchaseRateCompareUp > 0"
                       class="green">
                    {{ percentFormatter(scope.row, null, scope.row.purchaseRateCompareUp) }}
                    <i class="el-icon-top" />
                  </div>
                  <div v-else
                       class="grey">
                    {{ percentFormatter(scope.row, null, scope.row.purchaseRateCompareUp) }}
                    <i class="el-icon-minus" />
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="purchaseRateCompareContrast"
                             label="比对照组(%)"
                             align="right"
                             sortable
                             :formatter="percentFormatter" />
            <el-table-column prop=""
                             label="执行前"
                             align="right"
                             sortable
                             :formatter="percentFormatter" />
            <el-table-column prop=""
                             label="执行后"
                             align="right"
                             sortable
                             :formatter="percentFormatter" />
            <el-table-column prop="retentionRate"
                             label="留存率(%)"
                             align="right"
                             sortable
                             :formatter="percentFormatter" />
            <el-table-column prop="totalOutflowAmount"
                             label="总流出金额(万元)"
                             align="right"
                             sortable
                             :formatter="tenThousandFormatter" />
            <el-table-column prop="totalNetInflowAmount"
                             label="总净流入金额(万元)"
                             align="right"
                             sortable
                             :formatter="tenThousandFormatter" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { mapGetters } from 'vuex'
import { LineChart, BarChart, StackDodgeBarChart } from './components'
import {
  getUseCaseCascaderList,
  getBatchCascaderList,
  inspectorOverview,
  getInspectorOverviewList,
  getExecuteStatusList,
  getOutletRankingList,
  getPeopleRankingList,
  getCustomerGroupList,
  getUseCaseKeyIndicatorList,
  getOutletExecuteRateList,
  getIntentToBuySuccessRate,
  getUseCaseSalesAmount,
  getInspectorSummary
} from '@/api/api'
import {
  percentFormatter,
  tenThousandWholeNumberFormatter,
  tenThousandFormatter,
  wholeNumberFormatter,
  downloadFilePost
} from '@/utils'

export default {
  name: 'InspectorBoard',
  components: {
    ShunTable,
    LineChart,
    BarChart,
    StackDodgeBarChart
  },
  data() {
    return {
      percentFormatter,
      tenThousandWholeNumberFormatter,
      tenThousandFormatter,
      wholeNumberFormatter,
      // 更多图表显示
      showExtra: false,
      // 顶栏
      baseInfoLoading: false,
      baseInfo: {},
      // baseInfo: [{
      //   name: '线索数量',
      //   icon: '',
      //   value: 0,
      //   unit: '个',
      //   color: '#F56C6C'
      // }, {
      //   name: '销售成功数量',
      //   icon: '',
      //   value: 0,
      //   unit: '个',
      //   color: '#F56C6C'
      // }, {
      //   name: '成功购买率',
      //   icon: '',
      //   value: 0,
      //   unit: '%',
      //   color: '#F56C6C'
      // }, {
      //   name: '全体客户AUM增量',
      //   icon: '',
      //   value: 0,
      //   unit: '万元',
      //   color: '#F56C6C'
      // }, {
      //   name: '全体客户户均AUM增量',
      //   icon: '',
      //   value: 0,
      //   unit: '万元',
      //   color: '#F56C6C'
      // }, {
      //   name: '成功客户AUM增量',
      //   icon: '',
      //   value: 0,
      //   unit: '万元',
      //   color: '#F56C6C'
      // }, {
      //   name: '成功客户户均AUM增量',
      //   icon: '',
      //   value: 0,
      //   unit: '万元',
      //   color: '#F56C6C'
      // }],
      // 总览
      overview: {
        loading: false,
        useCaseLoading: false,
        batchLoading: false,
        downloadLoading: false,
        filterForm: {
          channel: '',
          useCase: [],
          batch: []
        },
        searchForm: {},
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableSort: {},
        tableData: [],
        tableColumnList: [{
          prop: 'useCaseName',
          label: '用例名称',
          notShowOverflowTooltip: false,
          align: 'right',
          minWidth: '180'
        }, {
          prop: 'channelName',
          label: '渠道',
          align: 'right',
          width: '80'
        }, {
          prop: 'type',
          label: '用例类型',
          align: 'right',
          width: '80'
        }, {
          prop: 'count',
          label: '线索数量(条)',
          sortable: 'custom',
          formatter: wholeNumberFormatter,
          align: 'right',
          minWidth: '120'
        }, {
          prop: 'purchasedNum',
          label: '销售成功数量(个)',
          sortable: 'custom',
          formatter: wholeNumberFormatter,
          align: 'right',
          minWidth: '120'
        }, {
          prop: 'purchaseRate',
          label: '购买成功率(%)',
          formatter: percentFormatter,
          sortable: 'custom',
          align: 'right',
          minWidth: '120'
        }, {
          prop: 'purchasedAmount',
          label: '销售金额(万元)',
          sortable: 'custom',
          formatter: tenThousandFormatter,
          align: 'right',
          minWidth: '120'
        }, {
          prop: 'purchaseAumUp',
          // label: '客户AUM增量(万元)(成功/全体/失败)',
          slot: true,
          sortable: 'custom',
          align: 'right',
          minWidth: '280',
          headerSlot: true
        }, {
          prop: 'purchaseAumAverage',
          // label: '客户户均AUM增量(万元)(成功/全体/失败)',
          slot: true,
          sortable: 'custom',
          align: 'right',
          headerSlot: true,
          minWidth: '280'
        }]
      },
      // 执行情况
      executeStatus: {
        loading: false,
        downloadLoading: false,
        batch: '',
        batchOpt: [],
        tableData: []
      },
      // 综合排名
      ranking: {
        // 网点
        org: {
          loading: false,
          downloadLoading: false,
          showPagination: false,
          scope: '前20名',
          total: 0,
          currentPage: 1,
          pageSize: 20,
          calculatedValue: [],
          tableData: [],
          tableSort: {},
          tableColumnList: [{
            prop: 'ranking',
            label: '综合得分排名',
            align: 'right',
            sortable: 'custom'
          }, {
            prop: 'subBranchName',
            label: '支行',
            align: 'right'
          }, {
            prop: 'networkName',
            label: '执行网点',
            align: 'right'
          }, {
            prop: 'purchaseRate',
            label: '实际购买率(%)',
            align: 'right',
            sortable: 'custom',
            formatter: percentFormatter
          }, {
            prop: 'purchasedNum',
            align: 'right',
            sortable: 'custom',
            label: '销售成功数量(个)',
            formatter: wholeNumberFormatter
          }, {
            prop: 'purchaseNumContribution',
            align: 'right',
            label: '销售成功数量贡献度',
            sortable: 'custom'
          }, {
            prop: 'purchaseRateContribution',
            align: 'right',
            label: '实际购买率贡献度',
            sortable: 'custom'
          }, {
            prop: 'comparison',
            align: 'right',
            label: '比上批',
            formatter: wholeNumberFormatter,
            sortable: 'custom'
          }, {
            prop: 'synthesisScore',
            label: '综合得分',
            align: 'right',
            sortable: 'custom'
          }]
        },
        // 人员
        people: {
          loading: false,
          downloadLoading: false,
          showPagination: false,
          scope: '前20名',
          total: 0,
          currentPage: 1,
          pageSize: 20,
          calculatedValue: [],
          tableData: [],
          tableSort: {},
          tableColumnList: [{
            prop: 'ranking',
            label: '综合得分排名',
            align: 'right',
            sortable: 'custom'
          }, {
            prop: 'subBranchName',
            label: '支行',
            align: 'right'
          }, {
            prop: 'executor',
            label: '执行人',
            align: 'right'
          }, {
            prop: 'executorJob',
            label: '执行人岗位',
            align: 'right'
          }, {
            prop: 'purchaseRate',
            label: '实际购买率(%)',
            align: 'right',
            sortable: 'custom',
            formatter: percentFormatter
          }, {
            prop: 'purchasedNum',
            label: '销售成功数量(个)',
            align: 'right',
            sortable: 'custom',
            formatter: wholeNumberFormatter
          }, {
            prop: 'purchaseNumContribution',
            align: 'right',
            label: '销售成功数量贡献度',
            sortable: 'custom'
          }, {
            prop: 'purchaseRateContribution',
            align: 'right',
            label: '实际购买率贡献度',
            sortable: 'custom'
          }, {
            prop: 'comparison',
            label: '比上批',
            align: 'right',
            sortable: 'custom',
            formatter: wholeNumberFormatter
          }, {
            prop: 'synthesisScore',
            label: '综合得分',
            align: 'right',
            sortable: 'custom'
          }]
        }
      },
      // 用例关键指标趋势表现
      keyIndicator: {
        filterForm: {
          channel: '',
          useCase: [],
          batch: []
        },
        chart1Rate: '实际购买率',
        chart2Rate: '实际购买率',
        compareToLastBatchType: '意向购买产品',
        chart2Batch: [],
        chart3Batch: '',
        // 批次选项
        batchOpt: [],
        chart1DownloadLoading: false,
        chart2DownloadLoading: false,
        chart3DownloadLoading: false,
        chart1Loading: false,
        chart2Loading: false,
        chart3Loading: false,
        chart1Data: [],
        chart2Data: [],
        chart3Data: []
      },
      // 用例各支行
      org: {
        loading: false,
        downloadLoading: false,
        filterForm: {
          useCase: [],
          batch: [],
          customerGroup: ''
        },
        table1Loading: false,
        table2Loading: false,
        table3Loading: false,
        table1Data: [],
        table2Data: [],
        table3Data: []
      },
      // 渠道选项
      channelOpt: [{
        label: 'CRM',
        value: 1
      }, {
        label: '短信',
        value: 2
      }],
      childChannelOpt: [],
      // 用例选项
      useCaseOpt: [],
      childUseCaseOpt: [],
      // 批次选项
      batchOpt: [],
      childBatchOpt: [],
      // 客群选项
      customerGroupOpt: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    // 图1数据key
    chart1DataKey() {
      const mappings = {
        实际购买率: 'purchaseRate',
        执行率: 'executeRate',
        联络成功率: 'contactedRate'
      }
      return mappings[this.keyIndicator.chart1Rate]
    },
    // 图2数据key
    chart2DataKey() {
      const mappings = {
        实际购买率: 'purchaseRate',
        执行率: 'executeRate',
        联络成功率: 'contactedRate'
      }
      return mappings[this.keyIndicator.chart2Rate]
    },
    // 图3数据key
    chart3DataKey() {
      const mappings = {
        意向购买产品: 'purchaseIntention',
        预约网点见面: 'networkToMeet'
      }
      return mappings[this.keyIndicator.compareToLastBatchType]
    },
    // 图1数据
    realChart1Data() {
      return this.keyIndicator.chart1Data[this.chart1DataKey]
    },
    // 图2数据
    realChart2Data() {
      return this.keyIndicator.chart2Data[this.chart2DataKey]
    },
    // 图3数据
    realChart3Data() {
      return this.keyIndicator.chart3Data[this.chart3DataKey]
    },
    // 执行情况、综合排名 公共请求字段
    executeStatusRankingGetData() {
      return {
        channel: this.overview.searchForm.channel,
        useCaseIds: this.overview.searchForm.useCase,
        PC: this.executeStatus.batch
      }
    },
    // 督导数据趋势对比 公共请求字段
    keyIndicatorGetData() {
      return {
        channel: this.keyIndicator.filterForm.channel,
        useCaseIds: this.keyIndicator.filterForm.useCase,
        pcList: this.keyIndicator.filterForm.batch.map(m => m[1])
      }
    }
  },
  created() {
    this.overviewSearch() // 总览搜索
    this.getBaseInfoData() // 获取顶栏数据
    this.getUseCaseOpt() // 获取营销用例选项
    this.getBatchOpt() // 获取批次选项
    this.getCustomerGroupOpt() // 获取客群选项
    // this.generate()
  },
  mounted() {
  },
  methods: {
    // 总览列表 重置
    overviewReset() {
      this.$refs.overviewFilterRef.resetFields()
      this.ranking.org.scope = '前20名'
      this.ranking.people.scope = '前20名'
      this.executeStatus.batch = ''
      this.overviewSearch()
      this.showExtra = false
    },
    // 总览列表 搜索
    overviewSearch() {
      this.overview.searchForm = JSON.parse(JSON.stringify(this.overview.filterForm))
      this.overviewClearSort()
      this.overviewGetList(1)
    },
    // 总览列表 获取数据
    overviewGetList(pageNo) {
      this.overview.currentPage = pageNo || this.overview.currentPage
      const data = {
        pageNo: this.overview.currentPage,
        pageSize: this.overview.pageSize,
        channel: this.overview.searchForm.channel,
        useCaseIds: this.overview.searchForm.useCase,
        pcList: this.overview.searchForm.batch.length > 0 && this.overview.searchForm.batch.map(n => n[1]) || [],
        sort: this.overview.tableSort
      }
      this.overview.filterForm = JSON.parse(JSON.stringify(this.overview.searchForm))
      // 督导总览列表数据
      this.overview.loading = true
      getInspectorOverviewList(data).then(res => {
        this.overview.tableData = res.data.resultList
        this.overview.total = res.pagination.totalItemCount
      }).finally(() => {
        this.overview.loading = false
      })
    },
    // 总览列表 清除排序
    overviewClearSort() {
      this.$refs.overviewRef && this.$refs.overviewRef.clearSort()
      this.overview.tableSort = {}
    },
    // 总览列表 表头 列排序
    handleOverviewSortChange({ column, prop, order }) {
      this.overview.tableSort = order ? { [prop]: order } : {}
      this.overviewGetList()
    },
    // 生成详细督导数据
    generate() {
      this.showExtra = true
      // child cascader options
      this.setChildChannelOpt()
      this.setChildUseCaseOpt()
      this.setChildBatchOpt()
      // executeStatus
      this.setExecuteStatusBatchOpt()
      this.setExecuteStatusRankingFilters()
      this.executeStatusRankingGetList()
      // keyIndicator
      this.setKeyIndicatorFilter()
      this.keyIndicatorSearch()
      // org
      this.setOrgFilter()
      this.orgSearch()
      // 滚动
      this.$nextTick(() => {
        const top = document.querySelector('#scroll-content').offsetTop - 16
        document.querySelector('.app-main').scroll({
          top,
          behavior: 'smooth'
        })
      })
    },
    // 生成内容的渠道选项
    setChildChannelOpt() {
      this.childChannelOpt = this.overview.searchForm.channel && this.channelOpt.filter(m => m.value === this.overview.searchForm.channel) || this.channelOpt
    },
    // 生成内容的用例选项(级联)
    setChildUseCaseOpt() {
      const nodes = this.$refs.overviewUseCaseRef?.getCheckedNodes(true)
      if (nodes?.length > 0) {
        const optionsSet = new Set(nodes.map(m => m.parent))
        this.childUseCaseOpt = [...optionsSet].map(m => ({
          ...m,
          children: m.children.filter(n => nodes.includes(n))
        })).map(m => ({
          ...m.data,
          children: m.children.map(n => n.data)
        }))
      } else {
        this.childUseCaseOpt = this.useCaseOpt
      }
    },
    // 生成内容的批次选项(级联)
    setChildBatchOpt() {
      const nodes = this.$refs.overviewBatchRef?.getCheckedNodes(true)
      if (nodes?.length > 0) {
        const optionsSet = new Set(nodes.map(m => m.parent))
        this.childBatchOpt = [...optionsSet].map(m => ({
          ...m,
          children: m.children.filter(n => nodes.includes(n))
        })).map(m => ({
          ...m.data,
          children: m.children.map(n => n.data)
        }))
      } else {
        this.childBatchOpt = this.batchOpt
      }
    },
    // 执行情况的下拉批次选项(单选)
    setExecuteStatusBatchOpt() {
      const nodes = this.$refs.overviewBatchRef?.getCheckedNodes(true)
      if (nodes?.length > 0) {
        this.executeStatus.batchOpt = nodes.map(m => m.value)
      } else {
        const options = []
        this.batchOpt.forEach(m => {
          m.children.forEach(n => options.push(n.value))
        })
        this.executeStatus.batchOpt = options
      }
    },
    // 设置执行情况和综合排行筛选条件
    setExecuteStatusRankingFilters() {
      this.executeStatus.batch = ''
      this.ranking.org.scope = '前20名'
      this.ranking.people.scope = '前20名'
    },
    // 执行情况、2个排名获取数据
    executeStatusRankingGetList() {
      this.executeStatusGetList()
      this.outletRankingGetList()
      this.peopleRankingGetList()
    },
    // 执行情况获取数据
    executeStatusGetList() {
      this.executeStatus.loading = true
      getExecuteStatusList(this.executeStatusRankingGetData).then(res => {
        this.executeStatus.tableData = res.data
      }).finally(() => {
        this.executeStatus.loading = false
      })
    },
    // 网点综合排名搜索
    outletRankingGetList() {
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.org.scope === '前20名'
          ? 'front'
          : this.ranking.org.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.org.currentPage,
        pageSize: this.ranking.org.pageSize,
        sort: this.ranking.org.tableSort
      }
      this.ranking.org.loading = true
      getOutletRankingList(data).then(res => {
        this.ranking.org.calculatedValue = res.data.calculatedValue
        this.ranking.org.tableData = res.data.resultList
        if (this.ranking.org.scope === '查看全部') {
          this.ranking.org.total = res.pagination.totalItemCount
        }
      }).finally(() => {
        this.ranking.org.loading = false
      })
    },
    // 人员综合排名搜索
    peopleRankingGetList() {
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.people.scope === '前20名'
          ? 'front'
          : this.ranking.people.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.people.currentPage,
        pageSize: this.ranking.people.pageSize,
        sort: this.ranking.people.tableSort
      }
      this.ranking.people.loading = true
      getPeopleRankingList(data).then(res => {
        this.ranking.people.calculatedValue = res.data.calculatedValue
        this.ranking.people.tableData = res.data.resultList
        if (this.ranking.people.scope === '查看全部') {
          this.ranking.people.total = res.pagination.totalItemCount
        }
      }).finally(() => {
        this.ranking.people.loading = false
      })
    },
    // 执行情况批次更改
    handleExecuteStatusBatchChange() {
      this.executeStatusRankingGetList()
    },
    // 网点综合排名筛选
    handleOutletRankingChange() {
      this.ranking.org.showPagination = this.ranking.org.scope === '查看全部'
      this.outletRankingClearSort()
      this.outletRankingGetList()
    },
    // 网点综合排名排序
    handleOutletRankingSortChange({ column, prop, order }) {
      this.ranking.org.tableSort = order ? { [prop]: order } : {}
      this.outletRankingGetList()
    },
    // 网点综合排名 清除排序
    outletRankingClearSort() {
      this.$refs.orgRankingRef && this.$refs.orgRankingRef.clearSort()
      this.ranking.org.tableSort = {}
    },
    // 网点综合排名翻页换页
    handleOutletRankingCurrentChange(val) {
      this.ranking.org.currentPage = val
      this.outletRankingGetList()
    },
    // 人员综合排名筛选
    handlePeopleRankingChange() {
      this.ranking.people.showPagination = this.ranking.people.scope === '查看全部'
      this.peopleRankingClearSort()
      this.peopleRankingGetList()
    },
    // 人员综合排名排序
    handlePeopleRankingSortChange({ column, prop, order }) {
      this.ranking.people.tableSort = order ? { [prop]: order } : {}
      this.peopleRankingGetList()
    },
    // 人员综合排名 清除排序
    peopleRankingClearSort() {
      this.$refs.peopleRankingRef && this.$refs.peopleRankingRef.clearSort()
      this.ranking.people.tableSort = {}
    },
    // 人员综合排名翻页换页
    handlePeopleRankingCurrentChange(val) {
      this.ranking.people.currentPage = val
      this.peopleRankingGetList()
    },
    // 执行情况列表Cell样式
    executeStatusCellStyle({ row, column, rowIndex, columnIndex }) {
      if (/^purchaseAum+/.test(column.property)) {
        return {
          // backgroundColor: 'rgba(0, 255, 0, 0.03)'
          color: 'green'
        }
      }
      if (/^losingAum+/.test(column.property)) {
        return {
          // backgroundColor: 'rgba(255, 0, 0, 0.03)'
          color: 'red'
        }
      }
      if (/^aumUp$/.test(column.property) || /^aumAverage$/.test(column.property)) {
        return {
          // backgroundColor: 'rgba(0, 0, 255, 0.03)'
          color: 'blue'
        }
      }
    },
    // 设置关键指标趋势筛选条件
    setKeyIndicatorFilter() {
      this.keyIndicator.filterForm = {
        channel: this.overview.searchForm.channel,
        useCase: this.overview.searchForm.useCase,
        batch: this.overview.searchForm.batch
      }
      this.keyIndicator.chart1Rate = '实际购买率'
      this.keyIndicator.chart2Rate = '实际购买率'
      this.keyIndicator.compareToLastBatchType = '意向购买产品'
      this.keyIndicator.chart2Batch = []
      this.keyIndicator.chart3Batch = ''
    },
    // 关键指标趋势重置
    keyIndicatorReset() {
      this.setKeyIndicatorFilter()
      this.keyIndicatorSearch()
    },
    // 关键指标趋势搜索
    keyIndicatorSearch() {
      this.setKeyIndicatorBatchOpt()
      this.$refs.chart1Ref && this.$refs.chart1Ref.reset()
      this.$refs.chart2Ref && this.$refs.chart2Ref.reset()
      this.$refs.chart3Ref && this.$refs.chart3Ref.reset()
      this.getChart1Data()
      this.getChart2Data()
      this.getChart3Data()
    },
    // 关键指标趋势的批次选项(非级联)
    setKeyIndicatorBatchOpt() {
      const nodes = this.$refs.keyIndicatorBatchRef?.getCheckedNodes(true)
      if (nodes?.length > 0) {
        this.keyIndicator.batchOpt = nodes.map(m => m.value)
      } else {
        const options = []
        this.childBatchOpt.forEach(m => {
          m.children.forEach(n => options.push(n.value))
        })
        this.keyIndicator.batchOpt = options
      }
    },
    // 图1数据 各支行用例关键指标趋势表现
    getChart1Data() {
      this.keyIndicator.chart1Loading = true
      getUseCaseKeyIndicatorList(this.keyIndicatorGetData).then(res => {
        this.keyIndicator.chart1Data = res.data
      }).finally(() => {
        this.keyIndicator.chart1Loading = false
      })
    },
    // 图2数据 各支行3个率(实际购买率 执行率 联络成功率)
    getChart2Data() {
      this.keyIndicator.chart2Loading = true
      const data = {
        ...this.keyIndicatorGetData,
        pcList: this.keyIndicator.chart2Batch
      }
      getOutletExecuteRateList(data).then(res => {
        this.keyIndicator.chart2Data = res.data
      }).finally(() => {
        this.keyIndicator.chart2Loading = false
      })
    },
    // 图3数据 意向购买产品成功占比与比上批情况
    getChart3Data() {
      this.keyIndicator.chart3Loading = true
      const data = {
        ...this.keyIndicatorGetData,
        PC: this.keyIndicator.chart3Batch
      }
      getIntentToBuySuccessRate(data).then(res => {
        this.keyIndicator.chart3Data = res.data
      }).finally(() => {
        this.keyIndicator.chart3Loading = false
      })
    },
    // 图2 批次更改
    handleChart2BatchChange() {
      this.getChart2Data()
    },
    // 图3 批次更改
    handleChart3BatchChange() {
      this.getChart3Data()
    },
    // 设置用例各支行督导看板筛选条件
    setOrgFilter() {
      this.org.filterForm = {
        useCase: this.overview.searchForm.useCase,
        batch: this.overview.searchForm.batch,
        customerGroup: ''
      }
    },
    // 用例各支行督导看板重置
    orgReset() {
      this.setOrgFilter()
      this.orgSearch()
    },
    // 用例各支行督导看板搜索
    orgSearch() {
      const data = {
        useCaseIds: this.org.filterForm.useCase,
        PC: this.org.filterForm.batch.length > 0 ? this.org.filterForm.batch[1] : '',
        customerGroup: this.org.filterForm.customerGroup
      }
      // 表1
      this.org.table1Loading = true
      getUseCaseSalesAmount(data).then(res => {
        this.org.table1Data = res.data
      }).finally(() => {
        this.org.table1Loading = false
      })
      // 表2
      // this.org.table2Loading = true
      // (data).then(res => {
      //   this.org.table2Data = res.data
      // }).finally(() => {
      //   this.org.table2Loading = false
      // })
      // 表3
      this.org.table3Loading = true
      getInspectorSummary(data).then(res => {
        this.org.table3Data = res.data
      }).finally(() => {
        this.org.table3Loading = false
      })
    },
    // 机构第一张表Cell样式
    orgTable1CellStyle({ row, column, rowIndex, columnIndex }) {
      return this.executeStatusCellStyle({ row, column, rowIndex, columnIndex })
    },
    // 顶栏数据
    getBaseInfoData() {
      this.baseInfoLoading = true
      const data = {
        channel: '',
        useCaseIds: [],
        pcList: []
      }
      inspectorOverview(data).then(res => {
        this.baseInfo = res.data
        // this.baseInfo[0].value = data.count // 线索数量
        // this.baseInfo[1].value = data.purchasedNum // 销售成功数量
        // this.baseInfo[2].value = data.purchaseRate // 成功购买率
        // this.baseInfo[3].value = data.aumUp // 全体客户aum增量
        // this.baseInfo[4].value = data.aumAverage // 全体客户户均aum增量
        // this.baseInfo[5].value = data.purchaseAumUp // 成功客户aum增量
        // this.baseInfo[6].value = data.purchaseAumAverage // 成功客户户均aum增量
      }).finally(() => {
        this.baseInfoLoading = false
      })
    },
    // 获取 用例类型-用例 级联选项
    getUseCaseOpt() {
      getUseCaseCascaderList().then(res => {
        this.useCaseOpt = res.data.map(n => ({
          label: n.label,
          value: '' + n.value,
          children: n.useCaseList
        }))
      })
    },
    // 获取 批次-日期 级联选项
    getBatchOpt() {
      getBatchCascaderList().then(res => {
        this.batchOpt = res.data.map(n => ({
          label: n.value,
          value: n.value,
          children: n.childList
        }))
      })
    },
    // 获取客群类型下拉选项
    getCustomerGroupOpt() {
      getCustomerGroupList().then(res => {
        this.customerGroupOpt = res.data
      })
    },
    // 总览列表 下载excel
    handleOverviewDownload() {
      const data = {
        pageNo: this.overview.currentPage,
        pageSize: this.overview.pageSize,
        channel: this.overview.searchForm.channel,
        useCaseIds: this.overview.searchForm.useCase,
        pcList: this.overview.searchForm.batch,
        sort: this.overview.tableSort
      }
      this.overview.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadChannelAndUseCasePage', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '督导总览.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.overview.downloadLoading = false
      })
    },
    // 执行情况 - 下载为excel
    handleExecuteStatusDownload() {
      this.executeStatus.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadSubBranchExecutiveCondition', this.executeStatusRankingGetData, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '各支行执行情况.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.executeStatus.downloadLoading = false
      })
    },
    // 网点综合排名 - 下载为excel
    handleOutletRankingDownload() {
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.org.scope === '前20名'
          ? 'front'
          : this.ranking.org.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.org.currentPage,
        pageSize: this.ranking.org.pageSize
      }
      this.ranking.org.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadNetworkRanking', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '网点综合排名.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.ranking.org.downloadLoading = false
      })
    },
    // 人员综合排名 - 下载为excel
    handlePeopleRankingDownload() {
      const data = {
        ...this.executeStatusRankingGetData,
        scope: this.ranking.people.scope === '前20名'
          ? 'front'
          : this.ranking.people.scope === '后20名'
            ? 'rear'
            : 'all',
        pageNo: this.ranking.people.currentPage,
        pageSize: this.ranking.people.pageSize
      }
      this.ranking.people.downloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadMarketingPersonnelRanking', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '人员综合排名.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.ranking.people.downloadLoading = false
      })
    },
    // 关键指标趋势表现(图1) - 下载为excel
    handleChart1Download() {
      this.keyIndicator.chart1DownloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadDebtsTendency', this.keyIndicatorGetData, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '各支行用例关键指标趋势表现.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.keyIndicator.chart1DownloadLoading = false
      })
    },
    // 各支行成功执行率(图2) - 下载为excel
    handleChart2Download() {
      this.keyIndicator.chart2DownloadLoading = true
      const data = {
        ...this.keyIndicatorGetData,
        pcList: this.keyIndicator.chart2Batch
      }
      downloadFilePost('/supervisorSpectaculars/downloadBranchExecuteRate', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '各支行成功执行率.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.keyIndicator.chart2DownloadLoading = false
      })
    },
    // 意向购买产品/预约网点见面 - 成功占比与比上批情况(图3) - 下载为excel
    handleChart3Download() {
      const data = {
        ...this.keyIndicatorGetData,
        PC: this.keyIndicator.chart3Batch
      }
      this.keyIndicator.chart3DownloadLoading = true
      downloadFilePost('/supervisorSpectaculars/downloadBranchPurchaseIntention', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '意向购买产品/预约网点见面-成功占比与比上批情况.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.keyIndicator.chart3DownloadLoading = false
      })
    },
    // 用例各支行督导看板 - 下载为excel
    handleOrgDownload() {
      console.log(this.org.filterForm)
      const data = {
        useCaseIds: this.org.filterForm.useCase,
        PC: this.org.filterForm.batch.length > 0 ? this.org.filterForm.batch[1] : '',
        customerGroup: this.org.filterForm.customerGroup
      }
      this.org.downloadLoading = true
      console.log(data)
      downloadFilePost('/supervisorSpectaculars/downloadUseCaseSituation', data, {
        headers: {
          userNo: this.user.userId
        }
      }).then(res => {
        this.downloadHandler(res.data, '用例各支行督导看板.xlsx')
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.org.downloadLoading = false
      })
    },
    // post请求下载文件 打开下载弹框
    downloadHandler(blob, filename) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = e => {
        const a = document.createElement('a')
        a.download = filename
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .base-info {
    display: flex;
    flex-wrap: wrap;
    font-size: 20px;
    margin: -8px;
    margin-bottom: 8px;

    .item-box {
      min-width: 25%;
      display: flex;
      padding: 8px;

      .item-inner {
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        padding: 20px;

        .label {
          font-size: 16px;
          font-weight: 300;
          display: flex;
          align-items: center;

          .main-icon {
            margin-right: 5px;
            font-size: 18px;
            color: "#aaa";
          }

          .right {
            margin-left: 5px;
            // font-size: 16px;
          }
        }
        .value {
          display: flex;
          align-items: center;
          font-size: 30px;
          margin-top: 15px;

          .separator {
            padding: 0 10px;
          }

          .unit {
            font-size: 16px;
            margin-left: 15px;
          }
        }
      }
    }
  }
  // .base-info {
  //   display: flex;
  //   flex-wrap: wrap;
  //   font-size: 20px;
  //   margin: -8px;
  //   margin-bottom: 8px;

  //   .item-box {
  //     display: flex;
  //     width: 33.3333%;
  //     // height: 120px;
  //     padding: 8px;

  //     .item-inner {
  //       flex: 1;
  //       overflow: hidden;
  //       display: flex;
  //       flex-direction: column;
  //       padding: 20px;
  //       .label {
  //         font-size: 16px;
  //         font-weight: 300;
  //         display: flex;
  //         align-items: center;
  //         .main-icon {
  //           margin-right: 5px;
  //           font-size: 18px;
  //           color: #aaa;
  //           // left: -10px;
  //         }
  //       }
  //       .value {
  //         margin-top: 15px;
  //         display: flex;
  //         align-items: center;
  //         font-size: 30px;
  //         .unit {
  //           font-size: 16px;
  //           margin-left: 15px;
  //         }
  //       }
  //     }
  //   }
  // }
  .block {
    margin-bottom: 16px;

    .top {
      min-height: 60px;
      display: flex;
      border-bottom: 1px solid #f4f4f4;
      padding: 0 20px;

      .top-filter-box {
        padding-top: 18px;
        overflow: hidden;
        flex: 1;

        .top-filter-end {
          float: right;
          margin-right: 0;
        }
      }

      .head {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title-box {
          display: flex;
          align-items: center;

          .title {
            color: #303133;
            font-weight: bold;
          }

          .filter-box {
            display: flex;
            align-items: center;

            .filter-item {
              margin-left: 20px;
            }
          }
        }
        .download {
        }
      }
    }
    .bottom {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;

      .item {
        margin-bottom: 20px;

        .head {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .title-box {
            display: flex;
            align-items: center;

            .title {
              color: #303133;
              font-weight: bold;
            }

            .filter-box {
              display: flex;
              align-items: center;

              .filter-item {
                margin-left: 20px;
              }
            }
          }
          .download {
          }
        }

        .content {
        }

        .chart {
          padding-top: 20px;
        }
      }

      .note {
        display: flex;
        flex-direction: column;
        font-size: 10px;
        line-height: normal;
      }

      .foot-note {
        margin-bottom: 0;
        color: grey;
      }
    }
  }

  .half-block {
    display: flex;

    .left {
      width: 50%;
      margin-right: 10px;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .right {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
  }

  .block-title {
    font-size: 18px;
    color: #303133;
    font-weight: bold;
  }
}

.green {
  color: green;
}

.red {
  color: red;
}

.blue {
  color: blue;
}

.grey {
  color: grey;
}
</style>
