<template>
  <div class="page">
    <el-row class="page-form">
      <div class="section-title">
        <h2 class="title">基本信息</h2>
      </div>
      <aika-form ref="basicForm" :span-count="12" :forms="basicForms" />
    </el-row>

    <div class="section-title">
      <h2 class="title">曲目列表</h2>
      <el-button size="mini" type="primary" @click="handleAddChapter">新增曲目</el-button>
    </div>

    <aika-table
      :table-data="chapters"
      :row-key="'id'"
      :columns="columns"
      :hide-header-summary="true"
    />

    <el-row class="page-footer">
      <el-button :loading="loading" type="primary" @click="handleSave">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>

    <aika-dialogForm
      ref="dialogForm"
      width="720px"
      :title="dialogFormTitle"
      :forms="dialogForm"
      @handleConfirm="handleDialogFormConfirm"
    />
  </div>
</template>

<script>
import uploadMixin from '@/mixins/upload'
import { BookModel, CourseModel } from '@/api/piano'
import { deepClone } from '@/utils'

export default {
  name: 'AddUnit',
  components: { },
  mixins: [uploadMixin],
  data() {
    const vm = this
    return {
      basicForms: [
        {
          type: 'input',
          placeholder: '最多输入10个字',
          prop: 'unitName',
          label: '单元名称',
          labelWidth: '120px',
          maxlength: 10,
          span: 12,
          rules: [{ required: true, message: '请输入单元名称' }]
        },
        {
          type: 'inputNumber',
          placeholder: '请输入正整数',
          prop: 'sortNo',
          rules: [{ required: true, message: '排序必填' }],
          label: '排序',
          labelWidth: '120px',
          min: 1,
          precision: 0,
          appendDom: {
            text: '数字越大，在教材内的排序越靠后'
          }
        }
      ],
      chapters: [],

      // pageContent: [
      //   {
      //     name: 'basic', title: '教材信息',
      //     forms: [
      //       { type: 'text', label: '教材名称', prop: 'bookName', span: 12 },
      //       { type: 'attachmentTooltipOss', label: '教材封面', prop: 'coverUrl', span: 12 }
      //     ]
      //   }
      // ],

      columns: [
        { label: '曲目名称', value: 'chapterName' },
        { label: '曲目课程种类', value: 'courseId', formatter(row) { return vm.courseListObj[row.courseId] } },
        { label: '排序', value: 'sortNo' },
        {
          type: 'operation', label: '操作', fixed: 'right',
          list: [
            { func: vm.handleDeleteChapter, formatter(row) { return { type: 'text', label: '删除' } } },
            { func: vm.handleEditChapter, formatter(row) { return { type: 'text', label: '修改' } } }
            // { func: vm.handleViewChapter, formatter(row) { return { type: 'text', label: '查看' } } }
          ]
        }
      ],

      units: [],
      courseList: [],
      courseListObj: {},

      listLoading: false,
      total: 0,

      editingChapterIndex: undefined,
      dialogFormTitle: '新增曲目',
      dialogForm: [],
      dialogFormTemplate: [
        {
          type: 'input',
          placeholder: '最多输入20个字',
          prop: 'chapterName',
          label: '曲目名称',
          labelWidth: '120px',
          maxlength: 20,
          span: 12,
          disabled: false,
          rules: [{ required: true, message: '请输入曲目名称' }]
        },
        {
          type: 'select',
          prop: 'courseId',
          label: '课程分类',
          labelWidth: '120px',
          opts: [],
          span: 12,
          disabled: false,
          func: (val, index) => vm.handleCourseChange(val, index),
          rules: [{ required: true, message: '请选择课程分类' }]
        },
        {
          type: 'inputNumber',
          placeholder: '数字越大，在单元内的排序越靠后',
          prop: 'sortNo',
          rules: [{ required: true, message: '曲目排序必填' }],
          label: '曲目排序',
          labelWidth: '120px',
          span: 24,
          min: 1,
          max: 99,
          disabled: false,
          precision: 0

        },
        {
          type: 'attachmentTooltipOss',
          label: '视频',
          labelWidth: '120px',
          prop: 'videos',
          span: 24,
          // requiredSign: true,
          rules: [{ required: true, message: '请上传视频' }],
          add: true,
          multiple: true,
          folder: 'video',
          accept: 'video/mp4,video/mpeg,video/3gpp,video/avi,video/quicktime,video/x-matroska,video/x-ms-wmv',
          acceptTip: '请上传 mp4、wmv、avi、mkv、mov 格式的视频',
          exceedTips: '附件最多可上传1张！',
          disabled: false,
          success: (file) => vm.handleAddUploadFile(file, 'dialogForm', 'videos', true),
          del: (file, index) => vm.handleDeleteUploadedFile(file, index, 'dialogForm', 'videos', true)
        },
        {
          type: 'table',
          prop: 'videoList',
          dataKey: 'videos',
          label: '',
          labelWidth: '120px',
          columns: [
            { label: '排序', value: 'sort', formatter(row, column, cellValue, index) { return row.sortNo } },
            { label: '视频名称', value: 'fileName', formatter(row, column, cellValue, index) { return row.fileName.split('.')[0] } },
            {
              type: 'operation', label: '操作', fixed: 'right',
              list: [
                {
                  func: (row, index) => vm.handleOpenSortNo(index),
                  formatter(row) { return { type: 'text', label: '排序' } }
                },
                {
                  func: (row, index) => vm.handleDeleteUploadedFile(row, index, 'dialogForm', 'videos', true),
                  formatter(row) { return { type: 'text', label: '删除' } }
                }
              ]
            }
          ]
        },
        {
          type: 'input',
          inputType: 'textarea',
          rows: 2,
          placeholder: '最多输入30个字',
          prop: 'workStep1',
          label: '作业步骤1',
          labelWidth: '120px',
          maxlength: 30,
          disabled: false,
          rules: [{ required: true, message: '请输入本课作业步骤' }],
          appendDom: [
            { type: 'button', color: 'text', text: '添加', func: this.handleAddStep },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveStep }
          ]
        },
        {
          type: 'input',
          inputType: 'textarea',
          rows: 2,
          placeholder: '最多输入30个字',
          prop: 'knowledge',
          label: '本课知识点',
          labelWidth: '120px',
          maxlength: 30,
          disabled: false,
          hidden: false,
          rules: [{ required: true, message: '请输入本课知识点' }]
        }
      ],
      latestWorkStep: 1,
      workStep: {
        type: 'input',
        inputType: 'textarea',
        rows: 2,
        placeholder: '最多输入30个字',
        prop: 'workStep',
        label: '作业步骤',
        labelWidth: '120px',
        maxlength: 30,
        disabled: false,
        rules: [{ required: true, message: '请输入本课作业步骤' }],
        appendDom: [
          { type: 'button', color: 'text', text: '添加', func: this.handleAddStep },
          { type: 'button', color: 'text', text: '删除', func: this.handleRemoveStep }
        ]
      },
      loading: false
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    async initPage() {
      const courseRes = await CourseModel.getList({ page: { pageNum: 1, pageSize: 999 }})
      const { data } = courseRes.data
      this.courseList = (data || []).map(d => ({ label: d.courseName, value: d.id, ...d }))
      data.forEach(d => { this.courseListObj[d.id] = d.courseName })
      console.log('this.courseListObj', this.courseListObj)
      this.dialogFormTemplate[this.$findObj(this.dialogFormTemplate, 'courseId')].opts = this.courseList
    },
    // 查询 获取列表
    // async handleSearch() {
    //   this.listLoading = true
    //   const params = { page: { pageNum: this.pageIndex, pageSize: this.pageSize }}
    //   try {
    //     const res = await BookModel.getBookList(params)
    //     console.log(res)
    //     const { totalSize, data } = res.data
    //     const result = totalSize > 0 ? data : []
    //     this.total = totalSize
    //     this.tableData = result
    //   } finally {
    //     this.listLoading = false
    //   }
    // },
    handleAddChapter() {
      this.dialogFormTitle = '新增曲目'
      this.dialogForm = deepClone(this.dialogFormTemplate)
      this.$refs.dialogForm.open({})
    },
    handleEditChapter(item, index) {
      this.editingChapterIndex = index
      console.log(item)
      this.dialogFormTitle = '编辑曲目'
      this.dialogForm = deepClone(this.dialogFormTemplate)
      const keys = Object.keys(item).filter(key => /workStep/.test(key))
      const steps = keys.map(key => {
        const workStep = deepClone(this.workStep)
        workStep.prop = key
        workStep.label = workStep.label + key.replace('workStep', '')
        return workStep
      })
      console.log('steps', steps)
      this.dialogForm.splice(5, 1, ...steps)

      const course = this.courseList.find(c => c.value === item.courseId)
      this.dialogForm[this.$findObj(this.dialogForm, 'knowledge')].hidden = course.courseType === 'one'

      this.$refs.dialogForm.open(item)
    },
    handleDeleteChapter(item, index) {
      this.chapters.splice(index, 1)
    },
    handleViewChapter() {

    },
    async handleOpenSortNo(index) {
      const res = await this.$prompt('输入正整数，数字越大，排序越靠后', '排序', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '输入正整数，数字越大，排序越靠后',
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入正整数'
      })
      if (res.action === 'confirm') {
        this.$set(this.$refs.dialogForm.$refs.form.form.videos[index], 'sortNo', res.value)
      }
      console.log(res)
    },
    async handleDialogFormConfirm(form) {
      console.log(form)
      const _form = deepClone(form)
      for (const key in form) { if (!_form[key]) delete _form[key] }
      if (this.editingChapterIndex !== undefined) {
        this.chapters.splice(this.editingChapterIndex, 1, _form)
      } else {
        this.chapters.push(_form)
      }
      this.$refs.dialogForm.stopLoading()
      this.$refs.dialogForm.close()
    },

    handleCourseChange(val) {
      const course = this.courseList.find(course => course.value === val)
      this.dialogForm[this.$findObj(this.dialogForm, 'knowledge')].hidden = course.courseType === 'one'
    },

    handleAddStep() {
      this.editingChapterIndex = undefined
      const steps = this.dialogForm.filter(item => item.prop.startsWith('workStep'))
      if (steps.length >= 8) {
        return this.$message.warning('作业步骤最多8条')
      }
      const step = deepClone(this.workStep)
      this.latestWorkStep += 1
      step.prop = step.prop + this.latestWorkStep
      step.label = step.label + this.latestWorkStep
      this.dialogForm.splice(this.dialogForm.length - 1, 0, step)
    },
    handleRemoveStep(index) {
      const steps = this.dialogForm.filter(item => item.prop.startsWith('workStep'))
      if (steps.length <= 1) {
        return this.$message.warning('作业步骤不能少于1条')
      }
      this.dialogForm.splice(index, 1)
    },
    handleCancel() {
      this.$router.back()
    },
    async handleSave() {
      const basicForm = await this.$refs.basicForm.validate()
      console.log('basicForm', basicForm)
      const { bookId } = this.$route.query
      const unit = { bookId, sortNo: basicForm.sortNo, unitName: basicForm.unitName }
      const chapters = this.chapters.map(chapter => {
        const {
          chapterName,
          courseId,
          knowledge,
          sortNo,
          videos
        } = chapter
        const keys = Object.keys(chapter).filter(key => /workStep/.test(key))
        const workStep = keys.map(key => {
          const _index = key.replace('workStep', '')
          return { content: chapter[key], sortNo: _index }
        })
        return {
          chapter: { bookId, chapterName, courseId, knowledge, sortNo, workStep },
          videos: videos.map(item => ({ videoName: item.fileName, videoUrl: item.fileUrl, sortNo: item.sortNo }))
        }
      })
      const params = { data: { chapters, unit }}
      console.log('save unit params', params)
      await BookModel.saveUnit(params)
      this.$message.success('提交成功')
      this.$router.back()
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
    _convertFiles(files) {
      if (!files || files.length === 0) return []
      return files.map(item => ({
        ...item,
        meta: 'image',
        fileUrl: item.url,
        fileName: item.name,
        contentType: item.contentType
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.section-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
