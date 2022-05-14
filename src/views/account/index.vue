<template>
  <div class="page">
    <div class="page-header">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="管理员账号" name="ADMIN" />
        <el-tab-pane label="试听账号" name="AUDITION" />
        <el-tab-pane label="老师账号" name="TEACHER" />
      </el-tabs>

      <el-button size="mini" type="primary" @click="handleAdd">{{ btnText }}</el-button>
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
      width="660px"
      :title="dialogFormTitle"
      :forms="dialogForms"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { AccountModel, CourseModel, PackageModel, TimetableModel } from '@/api/piano'
import { mapState } from 'vuex'
import { deepClone } from '@/utils'
import uploadMixin from '@/mixins/upload'

export default {
  name: 'Course',
  mixins: [paginationMixin, uploadMixin],
  data() {
    const vm = this
    const validatePhone = (rule, value, callback) => {
      if (!/^(1[3-9])[0-9]{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    const validateUnitPrice = (rule, value, callback) => {
      if (!/(^100000$)|(^100000\.0$)|(^100000\.00$)|(^\d{1,5}(\.\d{1,5})?$)/.test(value)) {
        callback(new Error('请输入最大100000, 最多2位小数'))
      } else {
        callback()
      }
    }

    return {
      activeName: 'ADMIN',
      activeMap: { ADMIN: '管理员', TEACHER: '老师', AUDITION: '试听', SUPER_ADMIN: '超级管理员', STUDENT: '学生' },

      columns: [
        { label: '老师姓名', value: 'name', width: '160px', hidden: true },
        { label: '账号', value: 'phone', width: '160px' },
        { label: '类型', value: 'accountType', width: '160px', hidden: false, formatter(row) { return row.accountType ? vm.activeMap[row.accountType] : '-' } },
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
      dialogForms: [],
      dialogFormsTemplate: [
        {
          type: 'input',
          placeholder: '最多输入6个字',
          prop: 'teacherName',
          label: '老师姓名',
          maxlength: 6,
          hidden: true,
          labelWidth: '120px',
          rules: [{ required: true, message: '请输入老师姓名' }]
        },
        {
          type: 'input',
          placeholder: '请输入11位手机号码',
          prop: 'phone',
          label: '账号',
          maxlength: 11,
          labelWidth: '120px',
          rules: [{ required: true, message: '请输入手机号码' }, { validator: validatePhone }]
        },
        {
          type: 'attachmentTooltipOss',
          label: '头像',
          prop: 'coverUrl',
          span: 24,
          requiredSign: true,
          add: true,
          multiple: false,
          folder: 'pc',
          accept: 'image/jpeg, image/jpg, image/png, image/HEIC',
          exceedTips: '附件最多可上传1张！',
          limit: 1,
          hidden: true,
          labelWidth: '120px',
          success: (file) => vm.handleAddUploadFile(file, 'dialogForm', 'coverUrl', true),
          del: (file, index) => vm.handleDeleteUploadedFile(file, index, 'dialogForm', 'coverUrl', true)
        },
        {
          type: 'select',
          prop: 'timetableId',
          label: '关联课表',
          opts: [],
          span: 12,
          labelWidth: '120px',
          hidden: true,
          rules: [{ required: true, message: '请选择关联课表' }]
        },
        {
          type: 'inputNumber',
          placeholder: '请输入最大999999，最多2位小数',
          prop: 'salary',
          rules: [{ required: true, message: '底薪必填' }],
          label: '底薪',
          min: 1,
          max: 999999,
          precision: 2,
          labelWidth: '120px',
          hidden: true
        },
        {
          type: 'select',
          prop: 'packageId',
          label: '可观看课程包',
          labelWidth: '120px',
          multiple: true,
          opts: [],
          span: 12,
          hidden: true,
          rules: [{ required: true, message: '请选择可观看课程包' }]
        },
        { type: 'subTitle', prop: 'subTitle', label: '可上的课程分类', labelWidth: '100%', className: 'mb-0', span: 24 }
      ],
      latestCourse: 1,
      course: [
        {
          type: 'select',
          prop: 'courseId',
          label: '课程分类',
          labelWidth: '120px',
          opts: [],
          span: 12,
          disabled: false,
          rules: [{ required: true, message: '请选择课程分类' }]
        },
        {
          type: 'input',
          placeholder: '输入课单价，最大100000，最多2位小数',
          prop: 'unitPrice',
          // rules: [{ required: true, message: '请输入课单价' }],
          rules: [{ validator: validateUnitPrice }],
          label: '',
          labelWidth: '0px',
          // min: 1,
          // max: 100000,
          // precision: 2,
          span: 12,
          hidden: false,
          appendDom: [
            { type: 'button', color: 'text', text: '添加', func: this.handleAddCourse },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveCourse }
          ]
        }
      ],
      loading: false,

      courseList: [],
      courseListObj: {},
      packageList: [],
      packageListObj: {},
      timetableList: [],
      timetableListObj: {}
    }
  },
  computed: {
    ...mapState({
    }),
    btnText() {
      return `新增${this.activeMap[this.activeName]}账号`
    }
  },
  mounted() {
    this.initOptions()
    this.handleSearch('ADMIN')
  },
  methods: {
    async initOptions() {
      const courseRes = await CourseModel.listActive()
      this.courseList = (courseRes.data || []).map(d => ({ label: d.courseName, value: d.id, ...d })) || []
      this.courseList.forEach(d => { this.courseListObj[d.id] = d.courseName })

      const packageRes = await PackageModel.getListActive()
      this.packageList = (packageRes.data || []).map(d => ({ label: d.packageName, value: d.id, ...d })) || []
      this.packageList.forEach(d => { this.packageListObj[d.id] = d.packageName })

      const timetableRes = await TimetableModel.getListActive()
      this.timetableList = (timetableRes.data || []).map(d => ({ label: d.timetableName, value: d.id, ...d })) || []
      this.timetableList.forEach(d => { this.timetableListObj[d.id] = d.timetableName })
      console.log('this.courseList', this.courseList)
      console.log('this.packageList', this.packageList)
      console.log('this.timetableList', this.timetableList)

      this.dialogFormsTemplate[this.$findObj(this.dialogFormsTemplate, 'timetableId')].opts = this.timetableList
      this.dialogFormsTemplate[this.$findObj(this.dialogFormsTemplate, 'packageId')].opts = this.packageList
      this.course[this.$findObj(this.course, 'courseId')].opts = this.courseList
    },
    // 查询 获取列表
    async handleSearch(type) {
      this.listLoading = true
      const params = { page: { pageNum: this.pageIndex, pageSize: this.pageSize }, param: type || this.activeName }
      try {
        const res = await AccountModel.getList(params)
        console.log(res)
        const { totalSize, data } = res.data
        const result = totalSize > 0 ? data : []
        this.total = totalSize
        this.tableData = result
      } finally {
        this.listLoading = false
      }
    },
    handleTabClick() {
      this.columns.find(item => item.value === 'name').hidden = this.activeName !== 'TEACHER'
      this.columns.find(item => item.value === 'accountType').hidden = this.activeName === 'TEACHER'
      this.handleSearch(this.activeName)
    },
    handleAdd() {
      // this.dialogForms.find(item => item.prop === 'num').hidden = true
      // this.dialogForms.find(item => item.prop === 'courseType').disabled = false
      this.latestCourse = 1
      this.dialogForms = deepClone(this.dialogFormsTemplate)
      this.dialogForms.forEach(item => { item.hidden = item.prop === 'phone' ? false : this.activeName !== 'TEACHER' })
      if (this.activeName === 'TEACHER') {
        const course = deepClone(this.course)
        course.forEach(item => { item.prop = item.prop + this.latestCourse })
        this.dialogForms.push(...course)
      }
      console.log(this.dialogForms)
      this.$refs.dialogForm.open({ })
    },
    async handleEdit(item) {
      this.latestCourse = 1
      const _accountType = this.$store.getters.accountType
      if (_accountType !== 'SUPER_ADMIN' && item.accountType === 'SUPER_ADMIN') {
        return this.$message.warning('只有超级管理员可以修改超级管理员账号')
      }

      console.log(item)
      // const { courseType } = item
      this.dialogForms = deepClone(this.dialogFormsTemplate)
      this.dialogForms.forEach(f => { f.hidden = f.prop === 'phone' ? false : item.accountType !== 'TEACHER' })
      if (item.accountType !== 'TEACHER') {
        this.$refs.dialogForm.open(item)
      } else {
        const detailRes = await AccountModel.getTeacherDetail({ data: item.id })
        console.log(detailRes)
        const { courses, teacher, watchPackages } = detailRes.data
        const { coverUrl, accountId, ...rest } = teacher
        const courseForm = {}
        courses.forEach((course, index) => {
          const _course = deepClone(this.course)
          _course.forEach(item => {
            courseForm[item.prop + (index + 1)] = course[item.prop]
            item.prop = item.prop + (index + 1)
          })
          this.dialogForms.push(..._course)
        })
        this.latestCourse += courses.length
        console.log('this.dialogForms', this.dialogForms)
        console.log('courseForm', courseForm)
        this.$refs.dialogForm.open({
          ...rest,
          id: accountId,
          coverUrl: this._convertUrl2Files(coverUrl),
          packageId: watchPackages.map(p => p.packageId),
          ...courseForm
        })
      }
    },
    _convertUrl2Files(url) {
      console.log('url', url)
      const fileName = url.split('/').reverse()[0]
      const type = url.split('.').reverse()[0]
      console.log(fileName)
      return [{
        meta: 'image',
        url: url,
        fileUrl: url,
        fileName,
        contentType: type
      }]
    },
    async handleToggleActive(item) {
      console.log(item)
      if (item.accountType === 'SUPER_ADMIN') {
        return this.$message.warning('超级管理员账号不能删除')
      }
      if (this.activeName === 'TEACHER') {
        await this.$confirm('账号被删除后将不能再登录系统，课表将被释放，并从分组内退出，是否确定？', '提示', {
          type: 'warning'
        })
      }

      if (this.loading) return
      const { active } = item
      try {
        this.loading = true
        await AccountModel.updateActive({ data: item.id })
        this.$message.success(`${active ? '删除' : '恢复'}成功`)
        await this.handleSearch()
      } finally {
        this.loading = false
      }
    },
    handleAddCourse(index, origin) {
      // this.editingChapterIndex = undefined
      const courses = this.dialogForms.filter(item => item.prop.startsWith('courseId'))
      if (courses.length >= 10) {
        return this.$message.warning('课程最多10条')
      }
      const course = deepClone(this.course)
      this.latestCourse += 1
      course[0].prop = course[0].prop + this.latestCourse
      course[1].prop = course[1].prop + this.latestCourse
      course[0].label = course[0].label + this.latestCourse
      this.dialogForms.splice(index + 1, 0, ...course)
      console.log('this.dialogForm', this.dialogForms)
    },
    async handleRemoveCourse(index) {
      console.log('index', index)
      const courses = this.dialogForms.filter(item => item.prop.startsWith('courseId'))
      if (courses.length <= 1) {
        return this.$message.warning('课程分类不能少于1条')
      }
      console.log(this.dialogForms[index])
      console.log(this.$refs.dialogForm.$refs.form.form)
      const { id } = (this.$refs.dialogForm.$refs.form.form || {})
      const courseId = this.dialogForms[index].prop.replace('unitPrice', '')
      console.log(courseId)
      if (id) {
        const params = {
          data: {
            removeCourseIds: [courseId],
            teacherId: id
          }
        }
        const res = await AccountModel.checkRemoveTeacherCourse(params)
        console.log(res)
        if (!res.ok || !res.data) {
          return this.$message.warning('存在未计算的消课，不能删除课程分类，以免无法结算')
        }
      }

      this.dialogForms.splice(index - 1, 2)
      delete this.$refs.dialogForm.$refs.form.form[`courseId${courseId}`]
      delete this.$refs.dialogForm.$refs.form.form[`unitPrice${courseId}`]
      console.log('this.dialogForm', this.dialogForms)
      console.log(this.$refs.dialogForm.$refs.form.form)
    },
    async handleDialogFormConfirm(form) {
      console.log(form)
      if (this.loading) return
      try {
        this.loading = true
        if (this.activeName !== 'TEACHER') {
          if (form.id) {
            await AccountModel.update({ data: { accountType: this.activeName, id: form.id, phone: form.phone }})
          } else {
            await AccountModel.add({ data: { accountType: this.activeName, id: form.id, phone: form.phone }})
          }
        } else {
          const { id, coverUrl, phone, salary, teacherName, timetableId, packageId } = form
          const teacher = { accountId: id, phone, salary, teacherName, timetableId, coverUrl: coverUrl[0].fileUrl }
          console.log('teacher', teacher)
          const watchPackages = packageId.map(pid => {
            const _package = this.packageList.find(p => p.id === pid)
            return { accountId: id, packageId: pid, packageName: _package.packageName }
          })
          console.log('watchPackages', watchPackages)
          const courses = []
          const keys = Object.keys(form).filter(item => item.startsWith('courseId'))
          keys.forEach(key => {
            const _index = key.replace('courseId', '')
            courses.push({
              accountId: id,
              courseId: form[key],
              // courseName: '',
              // id: 0,
              unitPrice: form[`unitPrice${_index}`]
            })
          })
          console.log('courses', courses)
          const coursesIds = Array.from(new Set(courses.map(c => c.courseId))) || []
          if (coursesIds.length !== courses.length) {
            return this.$message.warning('课程分类不能重复')
          }
          const params = { data: { courses, teacher, watchPackages }}
          console.log('params', params)
          const res = form.id
            ? await AccountModel.updateTeacher(params)
            : await AccountModel.addTeacher(params)
          console.log(res)
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
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
