<template>
  <div class="page">
    <div class="page-header">
      <el-button size="mini" type="primary" @click="handleAdd">新建课程包</el-button>
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
      width="630px"
      :title="dialogFormTitle"
      :forms="dialogForm"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { BookModel, CourseModel, PackageModel } from '@/api/piano'
import { deepClone } from '@/utils'

export default {
  name: 'Package',
  mixins: [paginationMixin],
  data() {
    const vm = this
    return {
      columns: [
        { label: '课程包名称', value: 'packageName', width: '160px' },
        { label: '关联课程及数量', value: 'courses', width: '320px' },
        { label: '关联教材', value: 'books', width: '300px' },
        { label: '课程包有效期', value: 'expiryMonths', width: '120px', formatter(row) { return row.expiryMonths ? row.expiryMonths + '月' : '-' } },
        { label: '状态', value: 'active', formatter(row) { return row.active ? '启用' : '禁用' } },
        { label: '排序', value: 'sortNo' },
        {
          type: 'operation',
          label: '操作',
          fixed: 'right',
          width: '100px',
          list: [
            { func: vm.handleEdit, formatter(row) { return { type: 'text', label: '修改', disabled: !row.active } } },
            { func: vm.handleToggleActive, formatter(row) { return { type: 'text', label: row.active ? '关闭' : '开启' } } }
          ]
        }
      ],
      tableData: [],
      listLoading: false,
      total: 0,

      loading: false,

      courseList: [],
      courseListObj: {},
      bookList: [],
      bookListObj: {},

      dialogFormTitle: '新增课程包',
      dialogForm: [],
      dialogFormTemplate: [
        {
          type: 'input',
          placeholder: '最多输入8个字',
          prop: 'packageName',
          label: '课程包名称',
          labelWidth: '120px',
          maxlength: 10,
          span: 24,
          disabled: false,
          rules: [{ required: true, message: '请输入课程包名称' }]
        },
        // {
        //   type: 'select',
        //   prop: 'courseId1',
        //   label: '课程分类',
        //   labelWidth: '120px',
        //   opts: [],
        //   span: 12,
        //   disabled: false,
        //   rules: [{ required: true, message: '请选择课程分类' }]
        // },
        // {
        //   type: 'inputNumber',
        //   placeholder: '最多输入999',
        //   prop: 'num1',
        //   rules: [{ required: true, message: '请输入课程节数' }],
        //   label: '',
        //   labelWidth: '0px',
        //   span: 12,
        //   min: 1,
        //   max: 999,
        //   disabled: false,
        //   precision: 0,
        //   appendDom: [
        //     { text: '节' },
        //     { type: 'button', color: 'text', text: '添加', func: this.handleAddCourse },
        //     { type: 'button', color: 'text', text: '删除', func: this.handleRemoveCourse }
        //   ]
        // },
        // {
        //   type: 'select',
        //   prop: 'book1',
        //   label: '教材教材',
        //   labelWidth: '120px',
        //   opts: [],
        //   span: 24,
        //   disabled: false,
        //   rules: [{ required: true, message: '请选择教材' }],
        //   appendDom: [
        //     { type: 'button', color: 'text', text: '添加', func: this.handleAddBook },
        //     { type: 'button', color: 'text', text: '删除', func: this.handleRemoveBook }
        //   ]
        // },
        {
          type: 'inputNumber',
          placeholder: '最多输入999',
          prop: 'expiryMonths',
          rules: [{ required: true, message: '请输入课程包有效期' }],
          label: '课程包有效期',
          labelWidth: '120px',
          span: 24,
          min: 1,
          max: 999,
          disabled: false,
          precision: 0,
          appendDom: { text: '月' }
        },
        {
          type: 'inputNumber',
          placeholder: '请输入正整数',
          prop: 'sortNo',
          rules: [{ required: true, message: '请输入正整数' }],
          label: '排序',
          labelWidth: '120px',
          span: 24,
          min: 1,
          max: 99999,
          disabled: false,
          precision: 0,
          appendDom: { text: '数字越大，排序越靠后' }
        }
      ],

      latestCourse: 1,
      course: [
        {
          type: 'select', prop: 'courseId', label: '课程分类', labelWidth: '120px', opts: [], span: 12, disabled: false,
          rules: [{ required: true, message: '请选择课程分类' }]
        },
        {
          type: 'inputNumber',
          placeholder: '最多输入999',
          prop: 'num',
          rules: [{ required: true, message: '请输入课程节数' }],
          label: '',
          labelWidth: '0px',
          span: 12,
          min: 1,
          max: 999,
          disabled: false,
          precision: 0,
          appendDom: [
            { text: '节' },
            { type: 'button', color: 'text', text: '添加', func: this.handleAddCourse },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveCourse }
          ]
        }
      ],
      latestBook: 1,
      book: {
        type: 'select',
        prop: 'bookId',
        label: '教材',
        labelWidth: '120px',
        opts: [],
        span: 24,
        disabled: false,
        // rules: [{ required: true, message: '请选择教材' }],
        appendDom: [
          { type: 'button', color: 'text', text: '添加', func: this.handleAddBook },
          { type: 'button', color: 'text', text: '删除', func: this.handleRemoveBook }
        ]
      }
    }
  },
  mounted() {
    this.initOptions()
    this.handleSearch()
  },
  methods: {
    async initOptions() {
      const courseRes = await CourseModel.getList({ page: { pageNum: 1, pageSize: 999 }})
      const bookRes = await BookModel.getList({ page: { pageNum: 1, pageSize: 999 }})
      this.courseList = (courseRes.data.data || []).map(d => ({ label: d.courseName, value: d.id, ...d })) || []
      this.courseList.forEach(d => { this.courseListObj[d.id] = d.courseName })
      this.bookList = (bookRes.data.data || []).map(d => ({ label: d.bookName, value: d.id, ...d })) || []
      this.bookList.forEach(d => { this.bookListObj[d.id] = d.bookName })
      console.log('this.courseListObj', this.courseListObj)
      console.log('this.bookListObj', this.bookListObj)
      this.course[this.$findObj(this.course, 'courseId')].opts = this.courseList
      this.book.opts = this.bookList
    },
    // 查询 获取列表
    async handleSearch() {
      this.listLoading = true
      const params = { page: { pageNum: this.pageIndex, pageSize: this.pageSize }}
      try {
        const res = await PackageModel.getList(params)
        console.log(res)
        const { totalSize, data } = res.data
        const result = totalSize > 0 ? data : []
        this.total = totalSize
        this.tableData = result
      } finally {
        this.listLoading = false
      }
    },

    async handleToggleActive(item) {
      console.log(item)
      if (this.loading) return
      const { active, ...rest } = item
      try {
        this.loading = true
        await PackageModel.updateActive({ data: { active: !active, ...rest }})
        this.$message.success(`${active ? '关闭' : '开启'}成功`)
        await this.handleSearch()
      } finally {
        this.loading = false
      }
    },

    handleAdd() {
      this.latestBook = 1
      this.latestCourse = 1
      this.dialogFormTitle = '新建课程包'
      this.dialogForm = deepClone(this.dialogFormTemplate)
      this.dialogForm.splice(1, 0, ...deepClone(this.course))
      this.dialogForm.splice(3, 0, deepClone(this.book))
      console.log('this.dialogForm', this.dialogForm)
      this.$refs.dialogForm.open({})
    },
    async handleEdit(item, index) {
      this.latestBook = 1
      this.latestCourse = 1

      console.log(item)
      const detailRes = await PackageModel.detail(item.id)
      console.log(detailRes)
      const { books, coursePackage, courses } = detailRes.data
      this.dialogFormTitle = '编辑课程包'
      this.dialogForm = deepClone(this.dialogFormTemplate)
      const courseForm = {}
      courses.forEach((c, index) => {
        const course = deepClone(this.course)
        course[0].prop = course[0].prop + (index + 1)
        course[1].prop = course[1].prop + (index + 1)
        course[0].label = course[0].label + (index + 1)
        courseForm[course[0].prop] = c.courseId
        courseForm[course[1].prop] = c.num
        this.dialogForm.splice(this.dialogForm.length - 1, 0, ...course)
      })
      this.latestCourse += courses.length
      const bookForm = {}
      const _books = !Array.isArray(books) || books.length === 0 ? [{}] : books
      _books.forEach((c, index) => {
        const book = deepClone(this.book)
        book.prop = book.prop + (index + 1)
        bookForm[book.prop] = c.bookId
        this.dialogForm.splice(this.dialogForm.length - 1, 0, book)
      })
      this.latestBook += books.length

      console.log(this.dialogForm)
      console.log(courseForm)
      // debugger
      this.$refs.dialogForm.open({ ...coursePackage, ...bookForm, ...courseForm })
    },
    async handleDialogFormConfirm(form) {
      console.log(form)
      if (this.loading) return
      try {
        this.loading = true
        const { packageName, expiryMonths, id, sortNo } = form
        const coursePackage = { active: true, expiryMonths, id, packageName, sortNo }

        const bookKeys = Object.keys(form).filter(key => /bookId/.test(key))
        const books = bookKeys.map(key => {
          return {
            bookId: form[key],
            bookName: this.bookListObj[form[key]],
            // id: 0,
            packageId: id
          }
        }).filter(book => book.bookId)

        const courseKeys = Object.keys(form).filter(key => /courseId/.test(key))
        const courses = courseKeys.map(key => {
          const course = this.courseList.find(c => c.id === form[key])
          const _index = key.replace('courseId', '')
          return {
            courseId: form[key],
            courseName: this.courseListObj[form[key]],
            // id: 0,
            packageId: id,
            courseType: course.courseType,
            num: form[`num` + _index]
          }
        })

        const one2one = courses.filter(item => item.courseType === 'one') || []
        if (one2one.length > 1) {
          return this.$message.warning('最多只能选择一个一对一课程')
        }
        const courseIds = Array.from(new Set(courses.map(c => c.courseId))) || []
        const bookIds = Array.from(new Set(books.map(c => c.bookId))) || []
        console.log('books', books)
        console.log('courses', courses)
        // debugger
        if (bookIds.length !== books.length) {
          return this.$message.warning('教材不能重复')
        }
        if (courseIds.length !== courses.length) {
          return this.$message.warning('课程不能重复')
        }

        const params = { books, coursePackage, courses }
        console.log(params)

        // const params = {
        //   books: [
        //     { bookId: 0, bookName: '', id: 0, packageId: 0 }
        //   ],
        //   coursePackage: { active: true, expiryMonths: 0, id: 0, packageName: '' },
        //   courses: [
        //     { courseId: 0, courseName: '', courseType: '', id: 0, num: 0, packageId: 0 }
        //   ]
        // }
        const res = form.id ? await PackageModel.update({ data: params }) : await PackageModel.add({ data: params })
        console.log(res)
        this.$message.success(`${form.id ? '修改' : '新增'}成功`)
        await this.handleSearch()
        this.$refs.dialogForm.close()
      } finally {
        this.$refs.dialogForm.stopLoading()
        this.loading = false
      }
    },

    handleAddCourse() {
      // this.editingChapterIndex = undefined
      const courses = this.dialogForm.filter(item => item.prop.startsWith('courseId'))
      if (courses.length >= 2) {
        return this.$message.warning('课程最多2条')
      }
      const course = deepClone(this.course)
      this.latestCourse += 1
      course[0].prop = course[0].prop + this.latestCourse
      course[1].prop = course[1].prop + this.latestCourse
      course[0].label = course[0].label + this.latestCourse
      this.dialogForm.splice(this.dialogForm.length - 2, 0, ...course)
      console.log('this.dialogForm', this.dialogForm)
    },
    handleRemoveCourse(index) {
      console.log('index', index)
      const courses = this.dialogForm.filter(item => item.prop.startsWith('courseId'))
      if (courses.length <= 1) {
        return this.$message.warning('课程分类不能少于1条')
      }
      this.dialogForm.splice(index - 1, 2)
      console.log('this.dialogForm', this.dialogForm)
    },
    handleAddBook() {
      const book = deepClone(this.book)
      this.latestBook += 1
      book.prop = book.prop + this.latestBook
      book.label = book.label + this.latestBook
      this.dialogForm.splice(this.dialogForm.length - 2, 0, book)
    },
    handleRemoveBook(index) {
      console.log('index', index)
      const books = this.dialogForm.filter(item => item.prop.startsWith('bookId'))
      if (books.length <= 1) {
        return this.$message.warning('教材不能少于1条')
      }
      this.dialogForm.splice(index, 1)
      console.log('this.dialogForm', this.dialogForm)
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
