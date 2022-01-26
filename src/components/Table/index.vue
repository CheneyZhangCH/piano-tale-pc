<template>
  <el-row class="aika-table">
    <p v-if="tabType === 'selection' && !hideHeaderSummary" class="select-len">已选{{ selectLen }}条</p>
    <el-table
      ref="table"
      v-loading="listLoading"
      :cell-class-name="getCellClassName"
      :header-cell-class-name="headerCellClassName"
      :row-key="rowKey"
      :size="tabSize"
      :summary-method="getSummaries"
      :show-summary="showSummary"
      :span-method="arraySpanMethod"
      :data="tableData"
      :border="border"
      :show-overflow-tooltip="true"
      :highlight-current-row="highLight"
      :height="tableHeight"
      :max-height="maxHeight"
      :header-row-class-name="headerClass"
      lazy
      :load="load"
      :empty-text="emptyText"
      :tree-props="treeProps"
      :default-sort="defaultSort"
      style="width: 100%;"
      @cell-click="cellClick"
      @row-click="rowClick"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <el-table-column v-if="tabType" :type="tabType" width="55" align="left" fixed="left" :label="tabLabel" :selectable="selectable" />
      <template v-for="(column, index) in columns">
        <template v-if="!column.hidden">
          <template v-if="!column.type">
            <el-table-column
              :key="column.label + index"
              :show-overflow-tooltip="column.showOverflowTooltip !== undefined ? column.showOverflowTooltip : true"
              :fixed="column.fixed"
              :prop="column.value"
              :label="column.label"
              :width="column.width"
              :min-width="column.minWidth"
              :align="column.align || 'left'"
              :sortable="column.sortable"
              :sort-orders="column.sortOrders"
              :formatter="column.formatter"
              :class-name="column.className"
            />
          </template>
          <template v-else>
            <!--用于不同条件下，td显示不同style-->
            <template v-if="column.type === 'colorText'">
              <el-table-column :key="column.label + index" :prop="column.prop || column.value" :label="column.label" :class-name="column.className" :width="column.width" :min-width="column.minWidth" :align="column.align || 'left'">
                <template slot="header">
                  <span v-if="column.labelType === 'html'" v-html="column.label" />
                  <span v-else>{{ column.label }}</span>
                </template>
                <template #default="scope">
                  <span :class="column.classFn(scope.row)" @click="column.func ? column.func(scope.row, scope.$index) : {}">{{ column.formatter ? column.formatter(scope.row) : scope.row[column.value] }}</span>
                  <template v-for="(tag,tagIndex) in column.tags">
                    <el-tag v-if="tag.formatter ? !tag.formatter(scope.row).hidden : true" :key="tagIndex" :size="tag.size" :type="tag.type" :color="tag.color" :effect="tag.effect || 'light'">{{ tag.label }}</el-tag>
                  </template>
                </template>
              </el-table-column>
            </template>
            <template v-if="column.type === 'index'">
              <el-table-column :key="column.label + index" :align="column.align || 'left'" :width="column.width" :min-width="column.minWidth" type="index" :label="column.label" :index="column.func" />
            </template>

            <template v-if="column.type === 'link'">
              <el-table-column v-slot="scope" :key="column.label + index" :label="column.label" :class-name="column.className" :width="column.width" :min-width="column.minWidth" :align="column.align || 'left'" :prop="column.prop || column.value" :sortable="column.sortable" :sort-orders="column.sortOrders">
                <div class="aika-table-column-inner">
                  <!-- 前置图标展示 -->
                  <template v-if="column.formatter">
                    <i v-for="(prependIcon,prependIconIndex) in column.formatter(scope.row).prependIconClassName" :key="prependIconIndex" :class="prependIcon" class="aika-table-column-prepend-icon iconfont" />
                  </template>
                  <span class="aika-table-column-link" :class="column.disabled ? (column.disabled(scope.row) ? 'aika-table-column-link-disabled' : '') : ''" @click="column.func(scope.row, scope.$index)">{{ column.formatter ? column.formatter(scope.row).label : scope.row[column.value] }}</span>
                  <span v-if="column.slot" :class="['aika-table-column-append',column.slot.className]">{{ column.slot.formatter ? column.slot.formatter(scope.row).label : column.slot.label }}</span>

                  <template v-for="(tag,tagIndex) in column.tags">
                    <el-tag v-if="tag.formatter ? !tag.formatter(scope.row).hidden : true" :key="tagIndex" :type="tag.type" :size="tag.size" :color="tag.color" :effect="tag.effect || 'light'">{{ tag.label }}</el-tag>
                  </template>

                  <!-- 附加图标内容展示 -->
                  <template v-if="column.formatter">
                    <i v-for="(icon,iconIndex) in column.formatter(scope.row).iconClassName" :key="iconIndex" :class="icon" class="aika-table-column-append-icon iconfont" />
                  </template>

                  <template v-if="column.formatter">
                    <el-tag v-for="(tag,tagIndex) in column.formatter(scope.row).tags" :key="tagIndex" :type="tag.type" :size="tag.size" :color="tag.color" :effect="tag.effect || 'light'" class="aika-table-column-link-tags" :class="tag.class">{{ tag.text }}</el-tag>
                  </template>
                </div>
              </el-table-column>
            </template>
            <template v-if="column.type === 'html'">
              <el-table-column v-slot="scope" :key="column.label + index" :show-overflow-tooltip="true" :label="column.label" :class-name="column.className" :width="column.width" :min-width="column.minWidth" :align="column.align || 'left'">
                <template>
                  <div class="table-column-html" v-html="scope.row[column.value]" />
                </template>
              </el-table-column>
            </template>
            <!-- 操作 -->
            <template v-if="column.type === 'operation'">
              <el-table-column v-slot="scope" :key="column.label + index" :fixed="column.fixed" :show-overflow-tooltip="true" :label="column.label" :class-name="column.className ? column.className + ' operation' : ' operation' " :width="column.width" :min-width="column.minWidth" :align="column.align || 'right'">
                <template>
                  <template v-for="(item, i) in column.list">
                    <template v-if="!item.hidden || !item.hidden(scope.row)">
                      <el-button :key="i" :disabled="item.formatter ? item.formatter(scope.row).disabled : false" :type="item.formatter ? item.formatter(scope.row).type : item.type || ''" :icon="item.icon" @click="item.func(scope.row, scope.$index)">
                        {{ item.formatter ? item.formatter(scope.row).label : item.label ? item.label : scope.row[column.value] }}
                      </el-button>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </template>

          </template>
        </template>
      </template>
      <template #empty>
        <slot name="empty" />
      </template>
    </el-table>
    <div v-if="pageSize" class="pagination-footer">
      <span class="description">{{ description }}</span>
      <!--            <el-pagination :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :layout="pageLayout || 'total, sizes, prev, pager, next, jumper'" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />-->
      <aika-pagination background :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :layout="pageLayout || 'total, sizes, prev, pager, next, jumper'" :total="totalCount" :popper-class="popperClass" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { Local } from '@/utils/storage'
export default {
  name: 'Table',
  components: { },
  props: {
    listLoading: Boolean, // tab 加载层
    rowKey: { type: String },
    highLight: { type: Boolean, default: false },
    headerClass: { type: String, default: 'default' }, // 头部背景色Class名称，默认default
    emptyText: { type: String, default: '暂无数据' },
    tabType: String, // 对应列的类型，selection/index/expand
    tabLabel: String, // 列标题
    tableHeight: Number, // 表格的高度
    maxHeight: Number, // 表格的最大高度
    tabSize: { type: String, default: 'medium' },
    tableData: Array, // 表格数据
    columns: Array, // 表格列配置数据,{value:对应数据对象中的属性，label：对应的是标题文字，fixed:列是否固定，width:列宽， sortable：是否可排序，formatter:列格式化， className：对应的是列的样式类名}
    defaultSort: { type: Object }, //  默认的排序列的 prop 和顺序
    sortChange: { type: Function, default: () => {} }, // 点击列表头进行排序 { column, prop, order }
    treeProps: { type: Object }, // 渲染嵌套数据的配置选项
    load: { type: Function, default: () => {} }, // 加载子节点数据的函数
    description: String, // 分页脚底左侧的数据说明
    totalCount: Number, // 表格数据总数
    pageSizes: Array, // 决定每页显示的条数[10,15,20,25]
    pageSize: Number,
    // hideTotal: Boolean,
    pageLayout: String,
    arraySpanMethod: Function,
    getSummaries: Function,
    showSummary: { type: Boolean, default: false },
    hideHeaderSummary: { type: Boolean, default: false },
    selectMode: { type: String, default: 'multi' },
    currentPage: { type: Number, default: 1 },
    selectable: Function, // type:selection 当前行可否选 {row, index}
    border: Boolean,
    headerCellClassName: {
      type: String,
      default: 'mklij-table-header'
    },
    cellClassName: {
      type: String,
      default: 'mklij-table-cell'
    },
    clickableColumnProps: { type: Array, default: () => [] },
    popperClass: String,
    // 列表点击变灰，存储在local的key值
    localCellClickRecord: { type: String, default: '' }
  },
  data() {
    return {
      selectLen: 0,
      selectedRows: [],
      transformedTableData: []
    }
  },
  computed: {
    // ...mapGetters(['btnList', 'btnAccess'])
  },
  methods: {
    // 切换页面显示条数
    handleSizeChange(val) {
      this.$emit('pageSizeChange', val)
    },

    // 跳转页码
    handleCurrentChange(val) {
      this.$emit('currentPageChange', val)
    },

    // 复选框事件
    selectionChange(selections) {
      // console.log('selections', selections)
      if (selections.length === 0) {
        this.selectLen = selections.length
        this.selectedRows = selections
        this.$emit('selectionChange', selections)
        return
      }
      if (this.selectMode === 'single') {
        if (selections.length === this.pageSize || selections.length > 2) {
          this.selectedRows = []
          this.$refs.table.clearSelection()
        } else {
          const selectedIds = this.selectedRows.map(row => row.id)
          const newSelection = []
          const _this = this
          selections.map(selection => {
            if (selectedIds.includes(selection.id)) {
              _this.$refs.table.toggleRowSelection(selection, false)
            } else {
              newSelection.push(selection)
            }
          })
          this.selectLen = selections.length

          this.selectedRows = newSelection
          this.$emit('selectionChange', newSelection)
        }
      } else {
        this.selectedRows = selections
        this.selectLen = selections.length
        this.$emit('selectionChange', selections)
      }
    },

    // 行点击
    rowClick(row, event) {
      this.$emit('rowClick', {
        row,
        event
      })
    },

    // 单元格点击
    cellClick(row, column, cell, event) {
      if (this.clickableColumnProps.includes(column.property)) {
        if (Array.isArray(row.clickedProps)) {
          if (!row.clickedProps.includes(column.property)) {
            row.clickedProps.push(column.property)
          }
        } else {
          this.$set(row, 'clickedProps', [column.property])
        }
      }
      const propertyId = row.id || row.propertyId
      const listCellClickRecord = Local.get(this.localCellClickRecord) || {}
      listCellClickRecord[propertyId] = row.clickedProps
      Local.set(this.localCellClickRecord, listCellClickRecord)
      this.$emit('cellClick', {
        row,
        column,
        cell,
        event
      })
    },

    getCellClassName({ row, column, rowIndex, columnIndex }) {
      const { clickedProps = [] } = row
      const { property } = column
      return [this.cellClassName, clickedProps.includes(property) ? 'mklij-table-cell-clicked' : ''].filter(Boolean).join(' ')
    },

    // 计算操作列显示隐藏
    // calcColumnVisible(col) {
    //   let isVisible = false
    //   const list = col.list
    //   const btnList = this.btnList
    //   if (btnList.length === 0) {
    //     return true
    //   }
    //   if (list.length > 0) {
    //     const curList = []
    //     for (let i = 0; i < list.length; i++) {
    //       const item = list[i]
    //       if (item.type === 'more') {
    //         curList.push(...item.list)
    //       } else {
    //         curList.push(item)
    //       }
    //     }
    //     for (let i = 0; i < curList.length; i++) {
    //       const code = curList[i].code
    //       // 更多里如果有无需权限判断的按钮-直接显示
    //       if (!code) {
    //         isVisible = true
    //         break
    //       }
    //       const isExist = btnList.some(btn => btn.code === code)
    //       if (isExist) {
    //         isVisible = true
    //         break
    //       }
    //     }
    //   }
    //   return isVisible
    // },

    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },

    clearSort() {
      this.$refs.table.clearSort()
    }
  }
}
</script>

<style lang="scss" src="./index.scss"></style>

<style lang="scss" scoped>
.select-len {
    margin-bottom: 8px;
    font-size: 14px;
}
// .aika-table {
//     margin-left: 5px;
//     margin-right: 5px;
// }
.el-tag {
    border-radius: 2px;
    &--dark {
        border: none;
    }
    &--mini {
        height: 18px;
        line-height: 18px;
    }
}
::v-deep.el-table {
    .mklij-table-cell {

        // 操作列样式
        &.operation {
            .cell {
                >*:nth-of-type(n) {
                    position: relative;
                    &::before {
                        position: absolute;
                        top: 50%;
                        left: 4px;
                        display: block;
                        width: 1px;
                        height: 10px;
                        content: '';
                        background: $theme-bg-white-4;
                        transform: translateY(-50%);
                    }
                }
                button {
                    &::before {
                        left: -6px !important;
                    }
                }
                button:nth-of-type(1) {
                    &::before {
                        display: none;
                    }
                }
            }
        }
        &.is-right {
            .cell {
                justify-content: flex-end;
                text-align: right;
            }
        }
        &.is-center {
            .cell {
                justify-content: center;
                text-align: center;
            }
        }
        &.price {
            .cell {
                padding-right: 36px;
            }
        }
    }
}
.pagination-footer {
    .description {
        float: left;
        margin-top: 12px;
        margin-left: 20px;
        font-size: 14px;
    }
    .el-pagination {
        float: right;
        margin-top: 30px;
        margin-bottom: 8px;
    }
}
</style>
