<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-11 11:27:16
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-10-09 17:32:34
 * @FilePath: /src/components/Dialog/Table.vue
 * @Description:
 -->
<template>
    <el-dialog :title="title" :visible.sync="visible" :width="width">
        <aika-directSubmitForm v-if="searchList && searchList.length > 0" ref="form" :forms="searchList" @handleSearch="handleSearch" />

        <el-row v-if="pageDesc" class="desc">
            <p>{{ pageDesc }}</p>
        </el-row>

        <template v-if="showPage">
            <aika-table :table-data="tableData" :row-key="'id'" :columns="columns" :list-loading="listLoading" :max-height="maxHeight" :current-page="pageIndex" :total-count="total" :page-sizes="pageSizes" :page-size="pageSize" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange" />
        </template>
        <template v-else>
            <aika-table :tab-type="tabType" :table-data="tableData" :row-key="'id'" :columns="columns" :list-loading="listLoading" :max-height="maxHeight" />
        </template>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button v-if="showConfirm" type="primary" @click="confirm">{{ confirmText }}</el-button>
            </div>
        </template>

    </el-dialog>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
export default {
    mixins: [paginationMixin],
    props: {
        title: String,
        width: {
            type: String,
            default: '520px'
        },
        confirmText: {
            type: String,
            default: '确定'
        },
        columns: Array,
        requestUrl: Function,
        showConfirm: Boolean,
        showPage: {
            type: Boolean,
            default: true
        },
        tabType: String,
        maxHeight: Number,
        searchList: Array
    },
    data() {
        return {
            visible: false,
            // 列表数据
            tableData: [],
            listLoading: false,
            cacheForm: {},
            pageDesc: '',
        }
    },
    methods: {
        open(obj) {
            this.pageIndex = 1
            this.tableData = []
            this.pageSize = this.defaultPageSize
            this.visible = true
            if (obj.noSearchFlag) {
                this.tableData = obj.data
                this.pageDesc = obj.message
            } else {
                this.handleSearch(obj)
            }
        },

        // 查询
        handleSearch(form) {
            this.listLoading = true

            this.cacheForm = this.cacheForm || form
            const params = Object.assign(this.cacheForm, form)

            if (this.showPage) {
                params.pageNo = this.pageIndex
                params.pageSize = this.pageSize
            }

            this.requestUrl(params).then(res => {
                if (res.ok) {
                    if (this.transformer) {
                        this.transformer(res)
                    } else {
                        const d = res.data
                        if (this.showPage) {
                            let total = 0
                            let result = []
                            if (d && d.data && d.data.count > 0) {
                                result = d.data.newHouseList
                                total = d.data.count
                            } else {
                                if (d && d.totalSize > 0) {
                                    result = d.data
                                    total = d.totalSize
                                }
                            }
                            this.tableData = result
                            this.total = total
                        } else {
                            this.tableData = d
                        }
                        this.listLoading = false
                    }
                }
            })
        },

        // 确定
        confirm() {
            this.$emit('confirm')
        },
        // 关闭
        close() {
            this.visible = false
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.desc {
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 10px;
}

</style>
