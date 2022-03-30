<template>
  <div class="page">
    <div class="page-header">
      <el-button size="mini" type="primary" @click="handleAdd">新建分组</el-button>
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
      width="960px"
      :hide-required-asterisk="true"
      :title="dialogFormTitle"
      :forms="dialogForms"
      @handleConfirm="handleDialogFormConfirm"
    />

  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { AccountModel, PackageModel, TeacherGroupModel } from '@/api/piano'
import { deepClone } from '@/utils'
import uploadMixin from '@/mixins/upload'

export default {
  name: 'TeacherGroup',
  mixins: [paginationMixin, uploadMixin],
  data() {
    const vm = this
    const validatePercent = (rule, value, callback) => {
      if (!/(^100$)|(^100\.0$)|(^100\.00$)|(^\d{1,2}(\.\d{1,2})?$)/.test(value)) {
        callback(new Error('请输入最大100，最多2位小数'))
      } else {
        callback()
      }
    }
    return {
      columns: [
        { label: '分组名称', value: 'groupName', width: '160px' },
        { label: '组长', value: 'leaderName', width: '160px' },
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
          placeholder: '最多输入20个字',
          prop: 'groupName',
          label: '分组名称',
          maxlength: 20,
          labelWidth: '120px',
          rules: [{ required: true, message: '请输入分组名称' }]
        }
        // { type: 'subTitle', prop: 'subTitle1', label: '考核课程包（最多4个）', labelWidth: '100%', className: 'mb-0', span: 24 },
        // { type: 'subTitle', prop: 'subTitle2', label: '组内老师', labelWidth: '100%', className: 'mb-0', span: 24 }
      ],
      subTitle1: { type: 'subTitle', prop: 'subTitle1', label: '考核课程包（最多4个）', labelWidth: '100%', className: 'mb-0', span: 24 },
      subTitle2: { type: 'subTitle', prop: 'subTitle2', label: '组内老师', labelWidth: '100%', className: 'mb-0', span: 24 },

      latestPackage: 1,
      packageForm: [
        {
          type: 'select',
          prop: 'packageId',
          label: '',
          labelWidth: '0px',
          opts: [],
          span: 5,
          disabled: false,
          rules: [{ required: true, message: '请选择考核课程包' }]
        },
        {
          type: 'input',
          placeholder: '输入额度续课率，最大100，最多2位小数',
          prop: 'packageRatio',
          rules: [{ validator: validatePercent }],
          label: '',
          labelWidth: '0px',
          span: 15,
          hidden: false,
          className: 'widthSecondary',
          appendDom: [
            { type: 'text', text: '%' },
            { type: 'button', color: 'text', text: '添加', func: this.handleAddPackage },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemovePackage }
          ]
        }
      ],
      latestTeacher: 1,
      teacherForm: [
        {
          type: 'select',
          prop: 'groupTeacherType',
          label: '',
          labelWidth: '0px',
          opts: [{ label: '组长', value: 'leader' }, { label: '组员', value: 'member' }],
          span: 3,
          disabled: false,
          className: 'widthMini',
          rules: [{ required: true, message: '请选择类型' }]
        },
        {
          type: 'select',
          prop: 'teacherId',
          label: '',
          labelWidth: '0px',
          opts: [],
          span: 4,
          disabled: false,
          className: 'widthMinor',
          rules: [{ required: true, message: '请选择老师' }]
        },
        {
          type: 'input',
          placeholder: '输入分红占比，最大100，最多2位小数',
          prop: 'ratio',
          rules: [{ validator: validatePercent }],
          label: '续课分成占比',
          labelWidth: '96px',
          span: 7,
          hidden: false,
          className: 'widthMinor',
          appendDom: [
            { type: 'text', text: '%' }
          ]
        },
        {
          type: 'input',
          placeholder: '输入退费承担占比',
          prop: 'refundRatio',
          rules: [{ validator: validatePercent }],
          label: '退费承担占比',
          labelWidth: '96px',
          span: 9,
          hidden: false,
          className: 'widthMinor',
          appendDom: [
            { type: 'text', text: '%' },
            { type: 'button', color: 'text', text: '添加', func: this.handleAddTeacher },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveTeacher }
          ]
        }
      ],
      loading: false,

      packageList: [],
      packageListObj: {},
      teacherList: [],
      teacherListObj: {}
    }
  },
  mounted() {
    this.initOptions()
    this.handleSearch()
  },
  methods: {
    async initOptions() {
      const packageRes = await PackageModel.getListActive()
      this.packageList = (packageRes.data || []).map(d => ({ label: d.packageName, value: d.id, ...d })) || []
      this.packageList.forEach(d => { this.packageListObj[d.id] = d.packageName })

      const teacherRes = await AccountModel.getActiveTeacherList()
      this.teacherList = (teacherRes.data || []).map(d => ({ label: d.teacherName, value: d.accountId, ...d })) || []
      this.teacherList.forEach(d => { this.teacherListObj[d.accountId] = d.teacherName })
      console.log('this.packageList', this.packageList)
      console.log('this.timetableList', this.teacherList)

      this.packageForm[this.$findObj(this.packageForm, 'packageId')].opts = this.packageList
      this.teacherForm[this.$findObj(this.teacherForm, 'teacherId')].opts = this.teacherList
    },
    // 查询 获取列表
    async handleSearch() {
      this.listLoading = true
      const params = { page: { pageNum: this.pageIndex, pageSize: this.pageSize }}
      try {
        const res = await TeacherGroupModel.getList(params)
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
      this.latestPackage = 1
      this.latestTeacher = 1
      this.dialogForms = deepClone(this.dialogFormsTemplate)
      const packageForm = deepClone(this.packageForm)
      packageForm.forEach(item => { item.prop = item.prop + this.latestPackage })
      this.dialogForms.push(deepClone(this.subTitle1), ...packageForm)
      const teacherForm = deepClone(this.teacherForm)
      teacherForm.forEach(item => { item.prop = item.prop + this.latestTeacher })
      this.dialogForms.push(deepClone(this.subTitle2), ...teacherForm)
      console.log('this.dialogForms', this.dialogForms)
      this.$refs.dialogForm.open({ })
    },
    async handleEdit(item) {
      this.latestPackage = 1
      this.latestTeacher = 1
      // const { courseType } = item
      this.dialogForms = deepClone(this.dialogFormsTemplate)

      const detailRes = await TeacherGroupModel.getTeacherGroup({ data: item.id })

      console.log(detailRes)
      const { groupName, id, teachers, coursePackages } = detailRes.data
      this.dialogForms.push(deepClone(this.subTitle1))
      const packageForms = {}
      coursePackages.forEach((cp, index) => {
        const packageForm = deepClone(this.packageForm)
        packageForm.forEach(formItem => {
          if (formItem.prop === 'packageRatio') {
            packageForms[formItem.prop + (index + 1)] = cp.ratio
          } else {
            packageForms[formItem.prop + (index + 1)] = cp[formItem.prop]
          }
          formItem.prop = formItem.prop + (index + 1)
        })
        this.dialogForms.push(...packageForm)
      })
      this.latestPackage += coursePackages.length

      this.dialogForms.push(deepClone(this.subTitle2))
      const teacherForms = {}
      teachers.forEach((teacher, index) => {
        const teacherForm = deepClone(this.teacherForm)
        teacherForm.forEach(formItem => {
          if (formItem.prop === 'ratio') {
            teacherForms[formItem.prop + (index + 1)] = teacher.ratio
          } else if (formItem.prop === 'refundRatio') {
            teacherForms[formItem.prop + (index + 1)] = teacher.refundRatio
          } else if (formItem.prop === 'teacherId') {
            if (this.teacherList.find(t => t.value === teacher.teacherId)) {
              teacherForms[formItem.prop + (index + 1)] = teacher[formItem.prop]
            }
          } else {
            teacherForms[formItem.prop + (index + 1)] = teacher[formItem.prop]
          }
          formItem.prop = formItem.prop + (index + 1)
        })
        this.dialogForms.push(...teacherForm)
      })
      this.latestTeacher += teachers.length
      console.log('this.dialogForms', this.dialogForms)
      console.log({ id, groupName, ...packageForms, ...teacherForms })

      this.$refs.dialogForm.open({ id, groupName, ...packageForms, ...teacherForms })
    },

    async handleToggleActive(item) {
      console.log(item)
      if (this.loading) return
      const { active } = item
      try {
        this.loading = true
        await TeacherGroupModel.updateActive({ data: item.id })
        this.$message.success(`${active ? '删除' : '恢复'}成功`)
        await this.handleSearch()
      } finally {
        this.loading = false
      }
    },
    handleAddPackage(index, origin) {
      const items = this.dialogForms.filter(item => item.prop.startsWith('packageId'))
      if (items.length >= 4) {
        return this.$message.warning('课程包最多10条')
      }
      const forms = deepClone(this.packageForm)
      this.latestPackage += 1
      forms[0].prop = forms[0].prop + this.latestPackage
      forms[1].prop = forms[1].prop + this.latestPackage
      this.dialogForms.splice(index + 1, 0, ...forms)
      console.log('this.dialogForm', this.dialogForms)
    },
    handleRemovePackage(index) {
      console.log('index', index)
      const items = this.dialogForms.filter(item => item.prop.startsWith('packageId'))
      if (items.length <= 1) {
        return this.$message.warning('课程包不能少于1条')
      }
      this.dialogForms.splice(index - 1, 2)
      console.log('this.dialogForm', this.dialogForms)
    },
    handleAddTeacher(index, origin) {
      const items = this.dialogForms.filter(item => item.prop.startsWith('teacherId'))
      if (items.length >= 30) {
        return this.$message.warning('老师最多30条')
      }
      const forms = deepClone(this.teacherForm)
      this.latestTeacher += 1
      forms[0].prop = forms[0].prop + this.latestTeacher
      forms[1].prop = forms[1].prop + this.latestTeacher
      forms[2].prop = forms[2].prop + this.latestTeacher
      forms[3].prop = forms[3].prop + this.latestTeacher
      this.dialogForms.splice(index + 1, 0, ...forms)
      console.log('this.dialogForm', this.dialogForms)
    },
    handleRemoveTeacher(index) {
      console.log('index', index)
      const items = this.dialogForms.filter(item => item.prop.startsWith('teacherId'))
      if (items.length <= 1) {
        return this.$message.warning('老师不能少于1条')
      }
      this.dialogForms.splice(index - 3, 4)
      console.log('this.dialogForm', this.dialogForms)
    },
    async handleDialogFormConfirm(form) {
      console.log(form)
      if (this.loading) return
      try {
        this.loading = true
        const { id, groupName } = form

        const coursePackages = []
        const packageKeys = Object.keys(form).filter(item => item.startsWith('packageId'))
        packageKeys.forEach(key => {
          const _index = key.replace('packageId', '')
          coursePackages.push({
            groupId: id,
            packageId: form[key],
            // id: 0,
            // packageName: '',
            ratio: +form[`packageRatio${_index}`]
          })
        })
        const teachers = []
        const teacherKeys = Object.keys(form).filter(item => item.startsWith('teacherId'))
        teacherKeys.forEach(key => {
          const _index = key.replace('teacherId', '')
          teachers.push({
            groupId: id,
            teacherId: form[key],
            // id: 0,
            // teacherName: '',
            ratio: +form[`ratio${_index}`],
            refundRatio: +form[`refundRatio${_index}`],
            groupTeacherType: form[`groupTeacherType${_index}`]
          })
        })
        const params = { data: { groupName, id, coursePackages, teachers }}
        console.log('params', params)
        // debugger
        if (form.id) {
          await TeacherGroupModel.update(params)
        } else {
          await TeacherGroupModel.add(params)
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
