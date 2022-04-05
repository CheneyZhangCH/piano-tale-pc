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
      width="1200px"
      :hide-required-asterisk="true"
      :title="dialogFormTitle"
      :forms="dialogForm"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { CourseModel, TimetableModel } from '@/api/piano'
import { deepClone } from '@/utils'

export default {
  name: 'Package',
  mixins: [paginationMixin],
  data() {
    const vm = this
    const validateInteger = (rule, value, callback) => {
      if (!/\d{1,5}$/.test(value)) {
        callback(new Error('请输入正整数，最大99999'))
      } else {
        callback()
      }
    }
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
            { func: vm.handleEdit, formatter(row) { return { type: 'text', label: '修改' } } },
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
          hidden: true, // 是否已被使用, 一直隐藏
          type: 'input',
          prop: 'id'
        },
        {
          hidden: true, // 是否已被使用, 一直隐藏
          type: 'input',
          prop: 'studentUsed'
        },
        {
          type: 'input',
          placeholder: '请输入排序',
          prop: 'sortNo',
          label: '',
          labelWidth: '0px',
          span: 4,
          disabled: false,
          rules: [{ validator: validateInteger }]
        },
        {
          type: 'input',
          placeholder: '最多输入20个字',
          prop: 'periodName',
          label: '',
          labelWidth: '0px',
          maxlength: 20,
          span: 6,
          disabled: false,
          className: 'widthMedium2',
          rules: [{ required: true, message: '请输入' }]
        },
        {
          type: 'select',
          prop: 'periodType',
          label: '',
          labelWidth: '0px',
          opts: [{ label: '上课', value: 'work' }, { label: '休息', value: 'rest' }],
          span: 6,
          rules: [{ required: true, message: '请选择' }],
          func: this.handlePeriodTypeChange,
          disabled: false,
          appendDom: [
            { type: 'button', color: 'text', text: '添加', disabled: false, func: this.handleAddTimetable },
            { type: 'button', color: 'text', text: '删除', disabled: false, func: this.handleRemoveTimetable }
          ]
        },
        {
          type: 'select',
          prop: 'courseType',
          label: '',
          labelWidth: '0px',
          disabled: false,
          hidden: true,
          span: 4,
          opts: [{ label: '一对一', value: 'one' }, { label: '一对多', value: 'more' }],
          rules: [{ required: true, message: '课程分类名称' }],
          func: vm.handleToggleCourseType,
          appendDom: [
            { type: 'button', color: 'text', text: '添加', disabled: false, func: this.handleAddTimetable },
            { type: 'button', color: 'text', text: '删除', disabled: false, func: this.handleRemoveTimetable }
          ]
        },
        {
          type: 'select',
          prop: 'courseId',
          label: '',
          labelWidth: '0px',
          opts: [],
          span: 4,
          disabled: false,
          hidden: true,
          rules: [{ required: true, message: '请选择课程分类' }],
          appendDom: [
            { type: 'button', color: 'text', text: '添加', disabled: false, func: this.handleAddTimetable },
            { type: 'button', color: 'text', text: '删除', disabled: false, func: this.handleRemoveTimetable }
          ]
        },
        {
          type: 'br',
          prop: 'br',
          span: 24
        }
        // {
        //   type: 'inputNumber',
        //   placeholder: '人数上限, 请输入正整数,最大99',
        //   prop: 'studentNum',
        //   rules: [{ required: true, message: '请输入学生人数' }],
        //   label: '',
        //   labelWidth: '0px',
        //   span: 8,
        //   min: 1,
        //   max: 99,
        //   precision: 0,
        //   hidden: true,
        //   className: 'widthNormal',
        //   appendDom: [
        //     { type: 'button', color: 'text', text: '添加', func: this.handleAddTimetable },
        //     { type: 'button', color: 'text', text: '删除', func: this.handleRemoveTimetable }
        //   ]
        // }
      ],
      appendDom: [
        { type: 'button', color: 'text', text: '添加', disabled: false, func: this.handleAddTimetable },
        { type: 'button', color: 'text', text: '删除', disabled: false, func: this.handleRemoveTimetable }
      ]
    }
  },
  mounted() {
    this.initOptions()
    this.handleSearch()
  },
  methods: {
    async initOptions() {
      const courseRes = await CourseModel.listActive('more')
      this.courseList = (courseRes.data || []).map(d => ({ label: d.courseName, value: d.id, ...d })) || []
      this.courseList.forEach(d => { this.courseListObj[d.id] = d.courseName })
      this.timetable[this.$findObj(this.timetable, 'courseId')].opts = this.courseList
    },
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
      if (this.loading) return
      try {
        this.loading = true
        if (item.active) {
          const res = await TimetableModel.checkCouldUpdate('updateActive', item.id)
          if (!res.ok || res.data === false) {
            return this.$message.warning('当前存在老师或学员关联此课表，不能关闭')
          }
        }
        const detailRes = await TimetableModel.detail({ data: item.id })
        const { active, ...rest } = detailRes.data

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
        const index = this.dialogForm.findIndex(item => item.prop === ('' + i))
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
      // const res = await TimetableModel.checkCouldUpdate('update', item.id)
      // if (!res.ok || res.data === false) {
      //   return this.$message.warning('当前存在老师或学员关联此课表，不能修改')
      // }
      const detailRes = await TimetableModel.detail({ data: item.id })
      console.log(detailRes)
      const { id, active, timetableName, periods } = detailRes.data

      this.dialogFormTitle = '编辑课表'
      this.dialogForm = deepClone(this.dialogFormTemplate)

      const periodsForm = {}
      for (let i = 2; i <= 7; i++) {
        const index = this.dialogForm.findIndex(item => item.prop === '' + i)
        const subjectPeriods = periods.filter(period => period.dayOfWeek === i) || []
        subjectPeriods.sort((prev, next) => next.sortNo - prev.sortNo)
        subjectPeriods.forEach(period => {
          const timetable = deepClone(this.timetable)
          if (period.periodType === 'work') {
            timetable[4].appendDom = undefined
            timetable[4].span = 4
            timetable[5].hidden = false
            timetable[5].span = 6
          }
          if (period.courseType === 'more') {
            timetable[5].appendDom = undefined
            timetable[5].span = 4
            timetable[6].hidden = false
            timetable[6].span = 6
          }
          if (period.studentUsed) {
            timetable.forEach(item => {
              if (!item.prop.includes('periodName') && !item.prop.includes('sortNo')) item.disabled = true
            })
            if (timetable[4].appendDom) timetable[4].appendDom.forEach(btn => { if (btn.text === '删除') btn.disabled = true })
            if (timetable[5].appendDom) timetable[5].appendDom.forEach(btn => { if (btn.text === '删除') btn.disabled = true })
            if (timetable[6].appendDom) timetable[6].appendDom.forEach(btn => { if (btn.text === '删除') btn.disabled = true })
          }
          timetable.forEach(item => { item.prop = item.prop + this.latestTimetable })
          this.dialogForm.splice(index + 1, 0, ...timetable)
          periodsForm[timetable[0].prop] = period.id
          periodsForm[timetable[1].prop] = period.studentUsed
          periodsForm[timetable[2].prop] = period.sortNo
          periodsForm[timetable[3].prop] = period.periodName
          periodsForm[timetable[4].prop] = period.periodType
          periodsForm[timetable[5].prop] = period.courseType
          periodsForm[timetable[6].prop] = period.courseId
          this.latestTimetable += 1
        })
        console.log('subjectPeriods', subjectPeriods)
      }
      console.log(this.dialogForm)
      this.$refs.dialogForm.open({ id, active, timetableName, ...periodsForm })
    },
    async handleDialogFormConfirm(form) {
      console.log(form)
      console.log(this.latestTimetable)
      if (this.loading) return
      try {
        this.loading = true
        const { timetableName, id } = form

        const periods = []
        const index2 = this.dialogForm.findIndex(item => item.prop === '2')
        const index3 = this.dialogForm.findIndex(item => item.prop === '3')
        const index4 = this.dialogForm.findIndex(item => item.prop === '4')
        const index5 = this.dialogForm.findIndex(item => item.prop === '5')
        const index6 = this.dialogForm.findIndex(item => item.prop === '6')
        const index7 = this.dialogForm.findIndex(item => item.prop === '7')
        for (let i = 0; i <= this.latestTimetable; i++) {
          const period = {
            dayOfWeek: 0,
            id: +form[`id${i}`],
            studentUsed: form[`studentUsed${i}`],
            sortNo: +form[`sortNo${i}`],
            periodName: form[`periodName${i}`],
            periodType: form[`periodType${i}`],
            courseType: form[`courseType${i}`],
            courseId: form[`courseId${i}`],
            // studentNum: form[`studentNum${i}`],
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
        // debugger

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
      this.dialogForm[index].span = val === 'work' ? 4 : 6
      this.dialogForm[index + 1].appendDom = val === 'work' ? this.appendDom : undefined
      this.dialogForm[index + 1].hidden = val !== 'work'
      this.dialogForm[index + 1].span = val === 'work' ? 6 : 4
    },

    handleToggleCourseType(val, index) {
      console.log('handleToggleCourseType val', val)
      console.log('handleToggleCourseType index', index)
      this.dialogForm[index].appendDom = val === 'more' ? undefined : this.appendDom
      this.dialogForm[index].span = val === 'more' ? 4 : 6
      this.dialogForm[index + 1].appendDom = val === 'more' ? this.appendDom : undefined
      this.dialogForm[index + 1].hidden = val !== 'more'
      this.dialogForm[index + 1].span = val === 'more' ? 6 : 4
    },

    handleAddTimetable(index, origin) {
      console.log('index', index)
      console.log('origin', origin)
      const items = deepClone(this.timetable)
      this.latestTimetable += 1
      items.forEach(item => { item.prop = item.prop + this.latestTimetable })
      const _index = index + (/periodType/.test(origin.prop) ? 4 : /courseType/ig.test(origin.prop) ? 3 : 2)
      this.dialogForm.splice(_index, 0, ...items)
      console.log(this.dialogForm)
    },
    handleRemoveTimetable(index, origin) {
      console.log('index', index)
      console.log('this.timetable', this.timetable)
      // const _index = /periodType/ig.test(origin.prop) ? index - 1 : index - 2
      const _index = index - (/periodType/.test(origin.prop) ? 2 : /courseType/ig.test(origin.prop) ? 3 : 4)
      this.dialogForm.splice(_index, 8)
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
