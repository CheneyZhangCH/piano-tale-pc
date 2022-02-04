<template>
  <div class="page">
    <div class="page-header">
      <h3>投诉原因</h3>
      <el-button size="mini" type="primary" @click="handleAdd">新建</el-button>
    </div>
    <aika-table
      :table-data="tableData"
      :row-key="'id'"
      :columns="columns"
      :list-loading="listLoading"
      :hide-header-summary="true"
    />

    <aika-dialogForm
      ref="dialogForm"
      :hide-required-asterisk="true"
      :title="dialogFormTitle"
      :forms="dialogForms"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import { DictModel } from '@/api/piano'

export default {
  name: 'TeacherGroup',
  data() {
    const vm = this

    return {
      columns: [
        { label: '名称', value: 'dictName', width: '160px' },
        {
          type: 'operation',
          label: '操作',
          width: '200px',
          list: [
            {
              func: vm.handleDelete,
              formatter(row) { return { type: 'text', label: '删除' } }
            }
          ]
        }
      ],
      tableData: [],
      listLoading: false,

      dialogFormTitle: '新建参数',
      dialogForms: [
        {
          type: 'input',
          placeholder: '请输入投诉原因,最多输入20个字',
          prop: 'dictName',
          label: '',
          maxlength: 20,
          labelWidth: '0px',
          className: 'widthSecondary',
          rules: [{ required: true, message: '请输入投诉原因' }]
        }
      ]

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
        const res = await DictModel.getList()
        this.tableData = res.data || []
      } finally {
        this.listLoading = false
      }
    },
    handleAdd() {
      if (this.tableData.length >= 20) return this.$message.warning('投诉原因最多20条')
      this.$refs.dialogForm.open({ })
    },

    async handleDelete(item) {
      if (this.tableData.length <= 1) return this.$message.warning('投诉原因最少1条')
      console.log(item)
      if (this.loading) return
      try {
        this.loading = true
        await DictModel.delete({ data: item.id })
        this.$message.success(`删除成功`)
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
        await DictModel.add({ data: form })
        this.$message.success(`新增成功`)
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
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
