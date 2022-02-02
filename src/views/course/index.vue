<template>
  <div class="page">
    <div class="page-header">
      <el-button size="mini" type="primary" @click="handleAdd">新建课程分类</el-button>
    </div>
    <aika-table
      :table-data="tableData"
      :row-key="'id'"
      :columns="columns"
      :list-loading="listLoading"
      :hide-header-summary="true"
      :current-page="pageIndex"
      :total-count="total"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :page-layout="'total, sizes, prev, pager, next'"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"
    />

    <aika-dialogForm ref="dialogForm" width="600px" :title="dialogFormTitle" :forms="dialogForms" @handleConfirm="handleDialogFormConfirm" />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { CourseModel } from '@/api/piano'

export default {
  name: 'Course',
  mixins: [paginationMixin],
  data() {
    const vm = this
    return {
      columns: [
        { label: '课程分类名称', value: 'courseName', width: '160px' },
        { label: '课程类型', value: 'courseType', width: '160px', formatter(row) { return row.courseType === 'more' ? '一对多' : '一对一' } },
        { label: '人数上限', value: 'num', width: '160px' },
        { label: '状态', value: 'active', formatter(row) { return row.active ? '启用' : '禁用' } },
        {
          type: 'operation',
          label: '操作',
          fixed: 'right',
          width: '200px',
          list: [
            {
              func: vm.handleEdit,
              formatter(row) {
                return { type: 'text', label: '修改' }
              }
            },
            {
              func: vm.handleToggleActive,
              formatter(row) {
                return { type: 'text', label: row.active ? '关闭' : '开启' }
              }
            }
          ]
        }
      ],
      tableData: [],
      listLoading: false,
      total: 0,

      dialogFormTitle: '',
      dialogForms: [
        {
          type: 'input',
          placeholder: '最多输入8个字',
          prop: 'courseName',
          label: '课程分类名称',
          maxlength: 8,
          rules: [{ required: true, message: '请输入课程分类名称' }]
        },
        {
          type: 'radio',
          prop: 'courseType',
          label: '课程类型',
          disabled: false,
          opts: [{ label: '一对一', value: 'one' }, { label: '一对多', value: 'more' }],
          rules: [{ required: true, message: '课程分类名称' }],
          func: (val) => vm.handleToggleCourseType(val)
        },
        {
          type: 'inputNumber',
          hidden: true,
          placeholder: '请输入正整数，最大99',
          prop: 'num',
          rules: [{ required: true, message: '人数上限必填' }],
          label: '人数上限',
          min: 1,
          max: 99,
          precision: 0
        }
      ],
      loading: false
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    // 查询 获取列表
    async handleSearch() {
      this.listLoading = true
      const params = { page: { pageNum: this.pageIndex, pageSize: this.pageSize }}
      try {
        const res = await CourseModel.getList(params)
        console.log(res)
        const { totalSize, data } = res.data
        const result = totalSize > 0 ? data : []
        this.total = totalSize
        this.tableData = result
      } finally {
        this.listLoading = false
      }
    },
    handleAdd() {
      this.dialogForms.find(item => item.prop === 'num').hidden = true
      this.dialogForms.find(item => item.prop === 'courseType').disabled = false
      this.$refs.dialogForm.open({ courseType: 'one' })
    },
    handleEdit(item) {
      console.log(item)
      const { courseType } = item
      this.dialogForms.find(item => item.prop === 'courseType').disabled = true
      this.handleToggleCourseType(courseType)
      this.$refs.dialogForm.open(item)
    },
    handleToggleCourseType(val) {
      console.log(val)
      this.dialogForms.find(item => item.prop === 'num').hidden = val === 'one'
    },
    async handleToggleActive(item) {
      console.log(item)
      if (this.loading) return
      const { active, ...rest } = item
      try {
        this.loading = true
        await CourseModel.updateActive({ data: { active: !active, ...rest }})
        this.$message.success(`${active ? '关闭' : '开启'}成功`)
        await this.handleSearch()
      } finally {
        this.loading = false
      }
    },
    async handleDialogFormConfirm(form) {
      console.log(form)
      if (this.loading) return
      try {
        this.loading = true
        const res = form.id ? await CourseModel.updateCourse({ data: form }) : await CourseModel.addCourse({ data: form })
        console.log(res)
        this.$message.success(`${form.id ? '修改' : '新增'}成功`)
        await this.handleSearch()
        this.$refs.dialogForm.close()
      } finally {
        this.$refs.dialogForm.stopLoading()
        this.loading = false
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
