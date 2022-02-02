const uploadMixin = {
  data() {
    return { deletedAffixIdList: [] }
  },
  methods: {
    handleDeleteUploadedFile(file, index, ref, prop, dialogForm = false) {
      if (Array.isArray(this.deletedAffixIdList)) {
        this.deletedAffixIdList.push(file)
      } else {
        this.deletedAffixIdList = [file]
      }

      if (dialogForm) {
        // element upload 删除不返回index， 取file的url来对比进行删除
        if (index === undefined) {
          let _index
          this.$refs[ref].$refs.form.form[prop].forEach((item, index) => {
            if (item.url === file.url) {
              _index = index
            }
          })
          this.$refs[ref].$refs.form.form[prop].splice(_index, 1)
        } else {
          this.$refs[ref].$refs.form.form[prop].splice(index, 1)
        }
        return
      }
      if (Array.isArray(this.$refs[ref])) {
        this.$refs[ref][0].form[prop].splice(index, 1)
      } else {
        this.$refs[ref].form[prop].splice(index, 1)
      }
    },
    // 附件上传成功
    handleAddUploadFile(data, ref, prop, dialogForm = false, replace = false) {
      const item = {
        url: data.fileUrl,
        name: data.fileName,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        meta: data.contentType
      }
      if (dialogForm) {
        if (replace) { // 直接替换
          return this.$set(this.$refs[ref].$refs.form.form, prop, [item])
        }
        if (Array.isArray(this.$refs[ref].$refs.form.form[prop])) {
          this.$refs[ref].$refs.form.form[prop].push(item)
        } else {
          this.$set(this.$refs[ref].$refs.form.form, prop, [item])
        }
        console.log('this.$refs[ref].$refs.form.form', this.$refs[ref].$refs.form.form)
        return
      }
      if (Array.isArray(this.$refs[ref])) {
        if (replace) { // 直接替换
          return this.$set(this.$refs[ref][0].form, prop, [item])
        }
        if (Array.isArray(this.$refs[ref][0].form[prop])) {
          this.$refs[ref][0].form[prop].push(item)
        } else {
          this.$set(this.$refs[ref][0].form, prop, [item])
        }
      } else {
        if (replace) {
          return this.$set(this.$refs[ref].form, prop, [item])
        }
        if (Array.isArray(this.$refs[ref].form[prop])) {
          this.$refs[ref].form[prop].push(item)
        } else {
          this.$set(this.$refs[ref].form, prop, [item])
        }
      }
    }
  }
}

export default uploadMixin
