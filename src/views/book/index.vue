<template>
  <div class="page">
    <div class="page-header">
      <el-button size="mini" type="primary" @click="handleAdd">新建教材</el-button>
    </div>
    <div v-if="Array.isArray(tableData) && tableData.length > 0" class="card-wrap">
      <bookCard v-for="item in tableData" :key="item.id" :item="item" @toggle="handleToggleActive" @detail="handleDetail" />
    </div>
    <el-row v-else>
      <div class="empty">暂无数据</div>
    </el-row>

    <el-pagination
      v-if="Array.isArray(tableData) && tableData.length > 0"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :current-page.sync="pageIndex"
      :page-size.sync="pageSize"
      :total="total"
      :page-sizes="pageSizes"
    />

    <aika-dialogForm
      ref="dialogForm"
      width="600px"
      :title="dialogFormTitle"
      :forms="dialogForms"
      confirm-button-text="保存并创建单元"
      @handleConfirm="handleDialogFormConfirm"
    />
  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import uploadMixin from '@/mixins/upload'
import BookCard from './components/BookCard'
import { BookModel } from '@/api/piano'

export default {
  name: 'Book',
  components: { bookCard: BookCard },
  mixins: [paginationMixin, uploadMixin],
  data() {
    const vm = this
    return {
      tableData: [],
      listLoading: false,
      total: 0,

      dialogFormTitle: '',
      dialogForms: [
        {
          type: 'input',
          placeholder: '最多输入10个字',
          prop: 'bookName',
          label: '教材名称',
          maxlength: 10,
          rules: [{ required: true, message: '请输入教材名称' }]
        },
        {
          type: 'attachmentTooltipOss',
          label: '教材封面',
          prop: 'coverUrl',
          span: 24,
          requiredSign: true,
          add: true,
          multiple: false,
          folder: 'pc',
          accept: 'image/jpeg, image/jpg, image/png, image/HEIC',
          exceedTips: '附件最多可上传1张！',
          limit: 1,
          success: (file) => vm.handleAddUploadFile(file, 'dialogForm', 'coverUrl', true),
          del: (file, index) => vm.handleDeleteUploadedFile(file, index, 'dialogForm', 'coverUrl', true)
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
        const res = await BookModel.getList(params)
        console.log(res)
        const { totalSize, data } = res.data
        const result = totalSize > 0 ? data : []
        this.total = totalSize
        this.tableData = result
      } finally {
        this.listLoading = false
      }
    },
    handleAdd(form) {
      // this.dialogForms.find(item => item.prop === 'num').hidden = true
      // this.dialogForms.find(item => item.prop === 'courseType').disabled = false
      this.$refs.dialogForm.open({})
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
        await BookModel.updateBookActive({ data: { active: !active, ...rest }})
        this.$message.success(`${active ? '关闭' : '开启'}成功`)
        await this.handleSearch()
      } finally {
        this.loading = false
      }
    },
    handleDetail(item) {
      this.$router.push({ name: 'bookDetail', params: { id: item.id }})
    },
    async handleDialogFormConfirm(form) {
      const { bookName, coverUrl } = form
      if (this.loading) return
      try {
        this.loading = true
        const res = await BookModel.addBook({ data: { bookName, coverUrl: coverUrl[0].url, active: true }})
        console.log(res)
        this.$message.success(`新增成功`)
        // await this.handleSearch()
        this.$refs.dialogForm.close()
        this.$goToNewBlank(this, { name: 'bookDetail', params: { id: res.data }})
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
.card-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
