<template>
  <div class="page">
    <div class="page-header">
      <el-button size="mini" type="primary" @click="handleAdd">新建课表</el-button>
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
      width="930px"
      :hide-required-asterisk="true"
      :title="dialogFormTitle"
      :forms="dialogForm"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { PackageModel, TimetableModel } from '@/api/piano'
import { deepClone } from '@/utils'

export default {
  name: 'Package',
  mixins: [paginationMixin],
  data() {
    const vm = this
    return {
      columns: [
        { label: '课表名称', value: 'timetableName', width: '160px' },
        { label: '状态', value: 'active', formatter(row) { return row.active ? '启用' : '禁用' } },
        {
          type: 'operation',
          label: '操作',
          fixed: 'right',
          width: '100px',
          list: [
            { func: vm.handleEdit, formatter(row) { return { type: 'text', label: '修改', disabled: true } } },
            { func: vm.handleToggleActive, formatter(row) { return { type: 'text', label: row.active ? '关闭' : '开启', disabled: true } } }
          ]
        }
      ],
      tableData: [],
      listLoading: false,
      total: 0,

      loading: false,

      // courseList: [],
      // courseListObj: {},
      // bookList: [],
      // bookListObj: {},

      dialogFormTitle: '新增课表',
      dialogForm: [],
      dialogFormTemplate: [
        {
          type: 'input',
          placeholder: '最多输入8个字',
          prop: 'timetableName',
          label: '课表名称',
          labelWidth: '80px',
          maxlength: 10,
          span: 24,
          className: 'widthSecondary',
          rules: [{ required: true, message: '请输入课表名称' }]
        },
        { type: 'subTitle', prop: '2', label: '周二', labelWidth: '100%', className: 'mb-0', span: 24 },
        { type: 'subTitle', prop: '3', label: '周三', labelWidth: '100%', className: 'mb-0', span: 24 },
        { type: 'subTitle', prop: '4', label: '周四', labelWidth: '100%', className: 'mb-0', span: 24 },
        { type: 'subTitle', prop: '5', label: '周五', labelWidth: '100%', className: 'mb-0', span: 24 },
        { type: 'subTitle', prop: '6', label: '周六', labelWidth: '100%', className: 'mb-0', span: 24 },
        { type: 'subTitle', prop: '7', label: '周日', labelWidth: '100%', className: 'mb-0', span: 24 }

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
        // {
        //   type: 'inputNumber',
        //   placeholder: '最多输入999',
        //   prop: 'expiryMonths',
        //   rules: [{ required: true, message: '请输入课程包有效期' }],
        //   label: '课程包有效期',
        //   labelWidth: '120px',
        //   span: 24,
        //   min: 1,
        //   max: 999,
        //   disabled: false,
        //   precision: 0,
        //   appendDom: { text: '月' }
        // }
      ],

      latestTimetable: 1,
      timetable: [
        {
          type: 'input',
          placeholder: '最多输入20个字',
          prop: 'periodName',
          label: '',
          labelWidth: '0px',
          maxlength: 20,
          span: 9,
          disabled: false,
          className: 'widthMedium',
          rules: [{ required: true, message: '请输入' }]
        },
        {
          type: 'select',
          prop: 'periodType',
          label: '',
          labelWidth: '0px',
          opts: [{ label: '上课', value: 'work' }, { label: '休息', value: 'rest' }],
          span: 7,
          rules: [{ required: true, message: '请选择' }],
          func: this.handlePeriodTypeChange,
          appendDom: [
            { type: 'button', color: 'text', text: '添加', func: this.handleAddTimetable },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveTimetable }
          ]
        },
        {
          type: 'inputNumber',
          placeholder: '人数上限, 请输入正整数,最大99',
          prop: 'studentNum',
          rules: [{ required: true, message: '请输入学生人数' }],
          label: '',
          labelWidth: '0px',
          span: 8,
          min: 1,
          max: 99,
          precision: 0,
          hidden: true,
          className: 'widthNormal',
          appendDom: [
            { type: 'button', color: 'text', text: '添加', func: this.handleAddTimetable },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveTimetable }
          ]
        }
      ],
      appendDom: [
        { type: 'button', color: 'text', text: '添加', func: this.handleAddTimetable },
        { type: 'button', color: 'text', text: '删除', func: this.handleRemoveTimetable }
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
      const params = { page: { pageNum: this.pageIndex, pageSize: this.pageSize }}
      try {
        const res = await TimetableModel.getList(params)
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
        await TimetableModel.updateActive({ data: { active: !active, ...rest }})
        this.$message.success(`${active ? '关闭' : '开启'}成功`)
        await this.handleSearch()
      } finally {
        this.loading = false
      }
    },

    handleAdd() {
      this.latestTimetable = 1
      this.dialogFormTitle = '新建课表'
      this.dialogForm = deepClone(this.dialogFormTemplate)

      for (let i = 2; i <= 7; i++) {
        const index = this.dialogForm.findIndex(item => item.prop === '' + i)
        const timetable = deepClone(this.timetable)
        timetable.forEach(item => { item.prop = item.prop + this.latestTimetable })
        this.dialogForm.splice(index + 1, 0, ...timetable)
        this.latestTimetable += 1
      }
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
      const bookForm = {}
      books.forEach((c, index) => {
        const book = deepClone(this.book)
        book.prop = book.prop + (index + 1)
        bookForm[book.prop] = c.bookId
        this.dialogForm.splice(this.dialogForm.length - 1, 0, book)
      })

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
        const { timetableName, id } = form

        const periods = []
        // const period = { dayOfWeek: 0, id: 0, periodName: '', periodType: '', studentNum: '', timetableId: 0 }
        const index2 = this.dialogForm.findIndex(item => item.prop === '2')
        const index3 = this.dialogForm.findIndex(item => item.prop === '3')
        const index4 = this.dialogForm.findIndex(item => item.prop === '4')
        const index5 = this.dialogForm.findIndex(item => item.prop === '5')
        const index6 = this.dialogForm.findIndex(item => item.prop === '6')
        const index7 = this.dialogForm.findIndex(item => item.prop === '7')
        for (let i = 0; i < this.latestTimetable; i++) {
          const period = {
            dayOfWeek: 0,
            periodName: form[`periodName${i}`],
            periodType: form[`periodType${i}`],
            studentNum: form[`studentNum${i}`],
            timetableId: id
          }
          const _index = this.dialogForm.findIndex(item => item.prop === `periodName${i}`)
          if (_index && _index > index7) {
            period.dayOfWeek = 7
            periods.push(period)
            continue
          }
          if (_index && _index > index6) {
            period.dayOfWeek = 6
            periods.push(period)
            continue
          }
          if (_index && _index > index5) {
            period.dayOfWeek = 5
            periods.push(period)
            continue
          }
          if (_index && _index > index4) {
            period.dayOfWeek = 4
            periods.push(period)
            continue
          }
          if (_index && _index > index3) {
            period.dayOfWeek = 3
            periods.push(period)
            continue
          }
          if (_index && _index > index2) {
            period.dayOfWeek = 2
            periods.push(period)
          }
        }
        // for (let i = 0; i < this.dialogForm.length; i++) {
        //   if (i > index2 && i < index3) {
        //     const appendIndex =
        //     periods.push({
        //       dayOfWeek: 2,
        //       periodName: form[this.dialogForm[i].prop],
        //       periodType: '',
        //       studentNum: '',
        //       timetableId: id
        //     })
        //   }
        // }

        const params = { active: true, timetableName, id, periods }
        console.log('params', params)

        const res = form.id ? await TimetableModel.update({ data: params }) : await TimetableModel.add({ data: params })
        console.log(res)
        this.$message.success(`${form.id ? '修改' : '新增'}成功`)
        await this.handleSearch()
        this.$refs.dialogForm.close()
      } finally {
        this.$refs.dialogForm.stopLoading()
        this.loading = false
      }
    },

    handlePeriodTypeChange(val, index) {
      console.log('handlePeriodTypeChange val', val)
      console.log('handlePeriodTypeChange index', index)
      this.dialogForm[index].appendDom = val === 'work' ? undefined : this.appendDom
      this.dialogForm[index].span = val === 'work' ? 6 : 8
      this.dialogForm[index + 1].appendDom = val === 'work' ? this.appendDom : undefined
      this.dialogForm[index + 1].hidden = val !== 'work'
    },
    handleAddTimetable(index, origin) {
      console.log('index', index)
      console.log('origin', origin)
      const items = deepClone(this.timetable)
      this.latestTimetable += 1
      items.forEach(item => { item.prop = item.prop + this.latestTimetable })
      const _index = /periodType/ig.test(origin.prop) ? index + 2 : index + 1
      this.dialogForm.splice(_index, 0, ...items)
      console.log(this.dialogForm)
    },
    handleRemoveTimetable(index, origin) {
      console.log('index', index)
      console.log('this.timetable', this.timetable)
      const _index = /periodType/ig.test(origin.prop) ? index - 1 : index - 2
      this.dialogForm.splice(_index, 3)
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
