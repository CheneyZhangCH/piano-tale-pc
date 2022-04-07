<template>
  <div class="page">
    <h3>续课规则</h3>
    <br>
    <div class="form-wrap">
      <aika-form ref="form" :forms="forms" hide-required-asterisk />
    </div>

    <el-row class="page-footer">
      <el-button :loading="loading" type="primary" @click="handleSave">保存设置</el-button>
    </el-row>
  </div>
</template>

<script>
import paginationMixin from '@/components/Table/mixin'
import { PackageModel, RuleModel } from '@/api/piano'
import { deepClone } from '@/utils'
import uploadMixin from '@/mixins/upload'

export default {
  name: 'TeacherGroup',
  mixins: [paginationMixin, uploadMixin],
  data() {
    const validateBonus = (rule, value, callback) => {
      if (!/(^10000$)|(^10000\.0$)|(^10000\.00$)|(^\d{1,4}(\.\d{1,2})?$)/.test(value)) {
        callback(new Error('请输入奖励， 最大10000，最多2位小数'))
      } else {
        callback()
      }
    }

    return {
      forms: [],
      formsTemplate: [
        {
          type: 'select',
          prop: 'fromPackageId',
          label: '',
          labelWidth: '0px',
          opts: [],
          span: 6,
          disabled: false,
          rules: [{ required: true, message: '请选择课程包' }],
          appendDom: { type: 'text', text: '续课至' }
        },
        {
          type: 'select',
          prop: 'toPackageId',
          label: '',
          labelWidth: '0px',
          opts: [],
          span: 6,
          disabled: false,
          rules: [{ required: true, message: '请选择课程包' }],
          appendDom: { type: 'text', text: ', 奖励' }
        },
        {
          type: 'input',
          placeholder: '最大10000，最多2位小数',
          prop: 'bonus',
          rules: [{ validator: validateBonus }],
          label: '',
          labelWidth: '0px',
          span: 12,
          hidden: false,
          className: 'widthSecondary',
          appendDom: [
            { type: 'text', text: '元/个' },
            { type: 'button', color: 'text', text: '添加', func: this.handleAddRule },
            { type: 'button', color: 'text', text: '删除', func: this.handleRemoveRule }
          ]
        }
      ],

      latestForm: 1,
      loading: false,

      packageList: [],
      packageListObj: {}
    }
  },
  mounted() {
    this.initOptions()
  },
  methods: {
    async initOptions() {
      const packageRes = await PackageModel.getListActive()
      this.packageList = (packageRes.data || []).map(d => ({ label: d.packageName, value: d.id, ...d })) || []
      this.packageList.forEach(d => { this.packageListObj[d.id] = d.packageName })
      console.log('this.packageList', this.packageList)
      this.formsTemplate[this.$findObj(this.formsTemplate, 'fromPackageId')].opts = this.packageList
      this.formsTemplate[this.$findObj(this.formsTemplate, 'toPackageId')].opts = this.packageList
      this.handleSearch()
    },
    // 查询 获取列表
    async handleSearch() {
      this.listLoading = true
      try {
        this.forms = []
        const res = await RuleModel.getList()
        const data = Array.isArray(res.data) && res.data.length > 0 ? res.data : [{}]
        const form = {}
        data.forEach((item, index) => {
          const forms = deepClone(this.formsTemplate)
          forms.forEach(formItem => {
            form[formItem.prop + (index + 1)] = item[formItem.prop]
            formItem.prop = formItem.prop + (index + 1)
          })
          this.forms.push(...forms)
        })
        console.log('this.forms', this.forms)
        console.log('form', form)

        this.latestForm += data.length
        this.$refs.form.initFieldsObj(form)
      } finally {
        this.listLoading = false
      }
    },
    handleAddRule(index, origin) {
      const items = this.forms.filter(item => item.prop.startsWith('fromPackageId'))
      if (items.length >= 50) {
        return this.$message.warning('续课规则最多50条')
      }
      const forms = deepClone(this.formsTemplate)
      this.latestForm += 1
      forms[0].prop = forms[0].prop + this.latestForm
      forms[1].prop = forms[1].prop + this.latestForm
      forms[2].prop = forms[2].prop + this.latestForm
      this.forms.splice(index + 1, 0, ...forms)
      console.log('this.dialogForm', this.forms)
    },
    handleRemoveRule(index) {
      console.log('index', index)
      const items = this.forms.filter(item => item.prop.startsWith('fromPackageId'))
      if (items.length <= 1) {
        return this.$message.warning('课程规则不能少于1条')
      }
      console.log(this.forms[index])

      const courseId = this.forms[index].prop.replace('bonus', '')
      console.log(this.$refs.form.form)
      delete this.$refs.form.form[`bonus${courseId}`]
      delete this.$refs.form.form[`toPackageId${courseId}`]
      delete this.$refs.form.form[`fromPackageId${courseId}`]
      console.log(this.$refs.form.form)

      this.forms.splice(index - 2, 3)
      console.log('this.dialogForm', this.forms)
    },
    async handleSave() {
      const form = await this.$refs.form.validate()
      if (this.loading) return
      try {
        this.loading = true
        const data = []
        const packageKeys = Object.keys(form).filter(item => item.startsWith('fromPackageId'))
        packageKeys.forEach(key => {
          const _index = key.replace('fromPackageId', '')
          data.push({
            bonus: form[`bonus${_index}`],
            fromPackageActive: true,
            fromPackageId: form[`fromPackageId${_index}`],
            // fromPackageName: "",
            // id: 0,
            toPackageActive: true,
            toPackageId: form[`toPackageId${_index}`]
            // toPackageName: ""
          })
        })
        console.log('data', data)
        await RuleModel.save({ data })
        this.$message.success(`保存成功`)
        await this.handleSearch()
      } finally {
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
.form-wrap {
  width: 930px;
}
</style>
