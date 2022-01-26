/*
 * @Author: sun.shengjie
 * @Date: 2020-02-04 18:57:31
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-08 15:16:20
 * @FilePath: \src\components\Table\mixin.js
 * @Description:
 */
const mixin = {
    data() {
        return {
            defaultPageSize: 10,
            total: 0,
            pageIndex: 1,
            pageNo: 1,
            pageSize: 10,
            pageSizes: [5, 10, 20, 50, 100]
        }
    },
    methods: {
        // 跳转页码
        handleCurrentChange(val) {
            this.pageIndex = val
            this.handleSearch()
        },

        // 切换页面显示条数
        handleSizeChange(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.handleSearch()
        },

        // 跳转页码
        handlePageNoChange(val) {
            this.pageNo = val
            this.updateQuery({ pageNo: val, pageSize: this.pageSize })
        },

        // 切换页面显示条数
        handlePageSizeChange(val) {
            this.pageSize = val
            this.pageNo = 1
            this.updateQuery({ pageNo: 1, pageSize: val })
        },
    }
}
export default mixin
