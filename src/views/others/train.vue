<template>
  <div class="page">
    <div class="page-header">
      <el-button size="mini" type="primary" @click="handleAdd">新建陪练券</el-button>
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

    <aika-dialogForm
      ref="dialogForm"
      width="600px"
      :hide-required-asterisk="true"
      :title="dialogFormTitle"
      :forms="dialogForms"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { TrainModel } from '@/api/piano'
import uploadMixin from '@/mixins/upload'

export default {
  name: 'TeacherGroup',
  mixins: [paginationMixin, uploadMixin],
  data() {
    const vm = this

    const validatePrice = (rule, value, callback) => {
      if (!/(^10000$)|(^10000\.0$)|(^10000\.00$)|(^\d{1,4}(\.\d{1,2})?$)/.test(value)) {
        callback(new Error('请输入单价，最大10000，最多2位小数'))
      } else {
        callback()
      }
    }
    const validateDays = (rule, value, callback) => {
      if (!/(^10000$)|(^\d{1,4}$)/.test(value)) {
        callback(new Error('请输入有效期，最大10000'))
      } else {
        callback()
      }
    }

    return {
      columns: [
        { label: '陪练券名称', value: 'ticketName', width: '160px' },
        { label: '单价(元)', value: 'price', width: '160px' },
        { label: '有效期(天)', value: 'expiryDays', width: '160px' },
        { label: '状态', value: 'active', formatter(row) { return row.active ? '启用' : '禁用' } },
        {
          type: 'operation',
          label: '操作',
          fixed: 'right',
          width: '200px',
          list: [
            {
              func: vm.handleEdit,
              formatter(row) { return { type: 'text', label: '修改', disabled: !row.active } }
            },
            {
              func: vm.handleToggleActive,
              formatter(row) { return { type: 'text', label: row.active ? '删除' : '恢复', disabled: !row.active } }
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
          placeholder: '最多输入20个字',
          prop: 'ticketName',
          label: '陪练券名称',
          maxlength: 20,
          labelWidth: '120px',
          rules: [{ required: true, message: '请输入陪练券名称' }]
        },
        {
          type: 'input',
          placeholder: '最大输入10000，最多2位小数',
          prop: 'price',
          label: '单价(元)',
          maxlength: 20,
          labelWidth: '120px',
          className: 'widthSecondary',
          rules: [{ validator: validatePrice }]
        },
        {
          type: 'input',
          placeholder: '最大输入10000',
          prop: 'expiryDays',
          label: '有效期(天)',
          maxlength: 20,
          labelWidth: '120px',
          className: 'widthSecondary',
          rules: [{ validator: validateDays }]
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
      try {
        const res = await TrainModel.getList()
        this.tableData = res.data || []
      } finally {
        this.listLoading = false
      }
    },
    handleAdd() {
      this.dialogFormTitle = '新增陪练券'
      this.$refs.dialogForm.open({ })
    },
    async handleEdit(item) {
      this.dialogFormTitle = '修改陪练券'
      this.$refs.dialogForm.open(item)
    },

    async handleToggleActive(item) {
      console.log(item)
      if (this.loading) return
      const { active } = item
      try {
        this.loading = true
        await TrainModel.updateActive({ data: item.id })
        this.$message.success(`${active ? '删除' : '恢复'}成功`)
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
        if (form.id) {
          await TrainModel.update({ data: form })
        } else {
          await TrainModel.add({ data: form })
        }
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
