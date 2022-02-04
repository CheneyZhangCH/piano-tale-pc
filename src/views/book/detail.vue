<template>
  <div class="page">
    <el-row class="page-form">
      <template v-for="item in pageContent">
        <el-row v-if="!item.hidden" :key="item.name" class="block">
          <div class="section-title">
            <h2 v-if="item.title" class="title">{{ item.title }}</h2>
            <el-button size="mini" type="primary" @click="handleEditBook">修改教材信息</el-button>
          </div>
          <aika-form :ref="item.name" :span-count="12" :forms="item.forms" />
        </el-row>
      </template>
    </el-row>

    <div class="section-title">
      <h2 class="title">单元列表</h2>
      <el-button size="mini" type="primary" @click="handleAddUnit">新增单元</el-button>
    </div>
    <template v-if="Array.isArray(units) && units.length > 0">
      <el-row v-for="unit in units" :key="unit.id" class="block">
        <div class="section-title">
          <div class="unit-title">
            <h4 class="title">{{ unit.unit.unitName }}</h4>
            <span class="sort">{{ '排序:' + unit.unit.sortNo }}</span>
          </div>
          <div>
            <el-button size="mini" type="text" @click="() => handleDeleteUnit(unit)">删除单元</el-button>
            <el-button size="mini" type="text" @click="() => handleEditUnit(unit)">修改单元</el-button>
            <el-button size="mini" type="text" @click="() => handleAddChapter(unit)">新增曲目</el-button>
          </div>
        </div>
        <aika-table
          :table-data="unit.chapters"
          :row-key="'id'"
          :columns="columns"
          :hide-header-summary="true"
        />
      </el-row>
    </template>

    <aika-dialogForm
      ref="bookDialogForm"
      width="600px"
      :title="bookDialogFormTitle"
      :forms="bookDialogForms"
      confirm-button-text="保存"
      @handleConfirm="handleBookDialogFormConfirm"
    />

    <aika-dialogForm
      ref="unitDialogForm"
      width="600px"
      title="修改单元"
      :forms="unitDialogForms"
      confirm-button-text="保存"
      @handleConfirm="handleUnitDialogFormConfirm"
    />

    <aika-dialogForm
      ref="chapterDialogForm"
      width="720px"
      :title="chapterDialogFormTitle"
      :forms="chapterDialogForm"
      @handleConfirm="handleChapterDialogFormConfirm"
    />
  </div>
</template>
<script>
import paginationMixin from '@/components/Table/mixin'
import uploadMixin from '@/mixins/upload'
import { BookModel, CourseModel } from '@/api/piano'
import { deepClone } from '@/utils'

export default {
  name: 'Book',
  components: { },
  mixins: [paginationMixin, uploadMixin],
  data() {
    const vm = this
    return {
      pageContent: [
        {
          name: 'basic', title: '教材信息',
          forms: [
            { type: 'text', label: '教材名称', prop: 'bookName', span: 12 },
            { type: 'attachmentTooltipOss', label: '教材封面', prop: 'coverUrl', span: 12 }
          ]
        }
      ],
      columns: [
        { label: '曲目名称', value: 'chapterName', formatter(row) { return row.chapter.chapterName } },
        { label: '曲目课程种类', value: 'courseId', formatter(row) { return vm.courseListObj[row.chapter.courseId] } },
        { label: '排序', value: 'sortNo', formatter(row) { return row.chapter.chapterName } },
        // { label: '状态', value: 'active', formatter(row) { return row.active ? '启用' : '禁用' } },
        {
          type: 'operation', label: '操作', fixed: 'right', list: [
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

      bookDialogFormTitle: '修改教材',
      bookDialogForms: [
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
          folder: 'img',
          accept: 'image/jpeg, image/jpg, image/png, image/HEIC',
          exceedTips: '附件最多可上传1张！',
          limit: 1,
          success: (file) => vm.handleAddUploadFile(file, 'bookDialogForm', 'coverUrl', true),
          del: (file, index) => vm.handleDeleteUploadedFile(file, index, 'bookDialogForm', 'coverUrl', true)
        }
      ],
      loading: false,

      unitDialogForms: [
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

      editingChapterIndex: undefined,
      chapterDialogFormTitle: '新增曲目',
      chapterDialogForm: [],
      chapterDialogFormTemplate: [
        {
          type: 'input',
          placeholder: '最多输入10个字',
          prop: 'chapterName',
          label: '曲目名称',
          labelWidth: '120px',
          maxlength: 10,
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
          requiredSign: true,
          add: true,
          multiple: true,
          folder: 'video',
          accept: 'video/mp4,video/mpeg,video/3gpp,video/avi,video/quicktime,video/x-matroska,video/x-ms-wmv',
          acceptTip: '请上传 mp4、wmv、avi、mkv、mov 格式的视频',
          exceedTips: '附件最多可上传1张！',
          disabled: false,
          success: (file) => vm.handleAddUploadFile(file, 'chapterDialogForm', 'videos', true),
          del: (file, index) => vm.handleDeleteUploadedFile(file, index, 'chapterDialogForm', 'videos', true)
        },
        {
          type: 'table',
          prop: 'videoList',
          dataKey: 'videos',
          label: '',
          labelWidth: '120px',
          columns: [
            { label: '排序', value: 'sort', formatter(row, column, cellValue, index) { return index + 1 } },
            { label: '视频名称', value: 'fileName' },
            {
              type: 'operation', label: '操作', fixed: 'right',
              list: [
                {
                  func: (row, index) => vm.handleDeleteUploadedFile(row, index, 'chapterDialogForm', 'videos', true),
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
      }
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    async initPage() {
      const courseRes = await CourseModel.getList({ page: { pageNum: 1, pageSize: 999 }})
      console.log(res)
      const { data } = courseRes.data
      this.courseList = (data || []).map(d => ({ label: d.courseName, value: d.id, ...d }))
      data.forEach(d => {
        this.courseListObj[d.id] = d.courseName
      })
      this.chapterDialogFormTemplate[this.$findObj(this.chapterDialogFormTemplate, 'courseId')].opts = this.courseList

      const { id } = this.$route.params
      const res = await BookModel.getBookDetail(id)
      console.log(res)
      const { book = {}, units = [] } = res.data
      this.units = units
      this.book = book
      const { bookName, coverUrl } = book
      this.$refs.basic[0].initFieldsObj({ bookName, coverUrl: this._convertUrl2Files(coverUrl) })
    },
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
    handleAddUnit() {
      const { id } = this.$route.params
      this.$router.push({ name: 'unitAdd', query: { bookId: id }})
    },
    async handleDeleteUnit(unit) {
      console.log(unit)
      await BookModel.deleteUnit({ data: unit.unit.id })
      this.$message.success('删除成功')
      await this.initPage()
    },
    handleEditUnit(unit) {
      console.log(unit)
      this.$refs.unitDialogForm.open({
        id: unit.unit.id,
        sortNo: unit.unit.sortNo,
        unitName: unit.unit.unitName
      })
    },
    async handleUnitDialogFormConfirm(form) {
      console.log(form)
      if (this.loading) return
      try {
        this.loading = true
        const { id } = this.$route.params
        await BookModel.updateUnit({ data: { bookId: id, ...form }})
        this.$message.success(`修改成功`)
        this.$refs.unitDialogForm.close()
        await this.initPage()
      } finally {
        this.$refs.unitDialogForm.stopLoading()
        this.loading = false
      }
    },
    handleEditBook() {
      this.$refs.bookDialogForm.open({ bookName: this.book.bookName, coverUrl: this._convertUrl2Files(this.book.coverUrl) })
    },
    // handleToggleCourseType(val) {
    //   console.log(val)
    //   this.dialogForms.find(item => item.prop === 'num').hidden = val === 'one'
    // },
    // async handleToggleActive(item) {
    //   console.log(item)
    //   if (this.loading) return
    //   const { active, ...rest } = item
    //   try {
    //     this.loading = true
    //     await BookModel.updateBookActive({ data: { active: !active, ...rest }})
    //     this.$message.success(`${active ? '关闭' : '开启'}成功`)
    //     await this.handleSearch()
    //   } finally {
    //     this.loading = false
    //   }
    // },
    // handleDetail(item) {
    //   this.$router.push({ name: 'bookDetail', params: { id: item.id }})
    // },
    async handleBookDialogFormConfirm(form) {
      console.log(form)
      const { bookName, coverUrl } = form
      if (this.loading) return
      try {
        this.loading = true
        await BookModel.updateBook({ data: { bookName, coverUrl: coverUrl[0].url, active: true }})
        this.$message.success(`修改成功`)
        this.$refs.dialogForm.close()
        await this.initPage()
      } finally {
        this.$refs.dialogForm.stopLoading()
        this.loading = false
      }
    },

    async handleDeleteChapter(chapter) {
      console.log(chapter)
      await BookModel.deleteChapter({ data: chapter.chapter.id })
      this.$message.success('删除成功')
      await this.initPage()
    },
    handleAddChapter(unit) {
      this.latestWorkStep = 1
      this.chapterDialogFormTitle = '新增曲目'
      this.chapterDialogForm = deepClone(this.chapterDialogFormTemplate)
      this.$refs.chapterDialogForm.open({ unitId: unit.unit.id })
    },
    handleEditChapter(item, index) {
      console.log(item)
      this.latestWorkStep = 1
      this.editingChapterIndex = index
      this.chapterDialogFormTitle = '编辑曲目'
      this.chapterDialogForm = deepClone(this.chapterDialogFormTemplate)
      const { chapter, videos } = item
      const { workStep } = chapter
      const workStepData = {}
      const steps = workStep.map(step => {
        const workStep = deepClone(this.workStep)
        workStep.prop = workStep.prop + step.sortNo
        workStep.label = workStep.label + step.sortNo
        workStepData[workStep.prop] = step.content
        return workStep
      })
      this.latestWorkStep += Math.max(...workStep.map(s => +s.sortNo))

      console.log(workStepData)
      console.log('steps', steps)
      this.chapterDialogForm.splice(5, 1, ...steps)

      const course = this.courseList.find(c => c.value === chapter.courseId)
      this.chapterDialogForm[this.$findObj(this.chapterDialogForm, 'knowledge')].hidden = course.courseType === 'one'

      this.$refs.chapterDialogForm.open({
        bookId: chapter.bookId,
        chapterName: chapter.chapterName,
        chapterId: chapter.id,
        knowledge: chapter.knowledge,
        sortNo: chapter.sortNo,
        unitId: chapter.unitId,
        courseId: chapter.courseId,
        ...workStepData,
        videos: videos.map(video => ({
          id: video.id,
          fileName: video.videoName,
          fileUrl: video.videoUrl,
          meta: video.videoUrl.split('.').reverse()[0]
        }))
      })
    },
    handleViewChapter() {
    },
    async handleChapterDialogFormConfirm(form) {
      console.log(form)
      const { id } = this.$route.params
      const { chapterName, chapterId, courseId, knowledge, sortNo, videos, unitId } = form
      const keys = Object.keys(form).filter(key => /workStep/.test(key))
      const workStep = keys.map(key => {
        const _index = key.replace('workStep', '')
        return { content: form[key], sortNo: +_index }
      })
      const params = {
        chapter: { bookId: +id, chapterName, id: chapterId, courseId, knowledge, sortNo, unitId, workStep },
        videos: videos.map(item => ({ videoName: item.fileName, videoUrl: item.fileUrl, chapterId, id: item.id }))
      }
      try {
        if (chapterId) {
          await BookModel.updateChapter({ data: params })
        } else {
          await BookModel.addChapter({ data: params })
        }
        this.$message.success(`${chapterId ? '修改' : '新增'}成功`)
        this.$refs.chapterDialogForm.stopLoading()
        this.$refs.chapterDialogForm.close()
        this.initPage()
      } catch (e) {
        this.$refs.chapterDialogForm.stopLoading()
      }
    },
    handleCourseChange(val) {
      const course = this.courseList.find(course => course.value === val)
      this.chapterDialogForm[this.$findObj(this.chapterDialogForm, 'knowledge')].hidden = course.courseType === 'one'
    },

    handleAddStep() {
      this.editingChapterIndex = undefined
      const steps = this.chapterDialogForm.filter(item => item.prop.startsWith('workStep'))
      if (steps.length >= 8) {
        return this.$message.warning('作业步骤最多8条')
      }
      const step = deepClone(this.workStep)
      this.latestWorkStep += 1
      step.prop = step.prop + this.latestWorkStep
      step.label = step.label + this.latestWorkStep
      this.chapterDialogForm.splice(this.chapterDialogForm.length - 1, 0, step)
    },
    handleRemoveStep(index) {
      const steps = this.chapterDialogForm.filter(item => item.prop.startsWith('workStep'))
      if (steps.length <= 1) {
        return this.$message.warning('作业步骤不能少于1条')
      }
      this.chapterDialogForm.splice(index, 1)
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
.unit-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .sort {
    margin-left: 16px;
  }
}
.card-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
