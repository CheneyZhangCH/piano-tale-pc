<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 14:11:04
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 16:17:37
 * @FilePath: \src\components\Form\customComp\import.vue
 * @Description: 文件导入
-->
<template>
    <div class="import-container" @click="handleImport">
        <span :class="{ wait: !form[item.prop] }">{{ form[item.prop] || item.placeholder }}</span>

        <i class="el-icon-upload" />
        <input :ref="`${item.prop}_file`" type="file" class="hidden" :accept="item.accept" @change="fileChange($event)" />
    </div>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomImport',
    mixins: [compProps],
    computed: {
        fileRef() {
            return this.item.prop + '_file'
        }
    },
    methods: {
        // 清空input file内容
        resetFile() {
            this.$nextTick(() => {
                const fileInput = this.$refs[this.fileRef]
                fileInput.value = ''
            })
        },

        // 导入
        handleImport() {
            this.$refs[this.fileRef].click()
        },

        // 选择文件
        fileChange(e) {
            const item = this.item

            var temp = e.target.files
            const file = temp[0]
            if (!file) return
            if (item.limitSize && file.size > item.limitSize) {
                this.form.file = null
                this.form[item.prop] = ''
                this.$message.error(item.limitText || '文件太大！')
                return false
            }
            if (!item.accept || item.accept.includes(file.type)) {
                if (item.importType && item.importType === 1) {
                    this.$emit('file', file)
                    return false
                }
                var formData = new FormData()
                formData.append('file', file)
                this.form.file = formData
                this.form[item.prop] = file.name
            } else {
                this.form.file = null
                this.form[item.prop] = ''
                this.$message.error('请上传指定格式文件！')
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    @import "@/styles/vars";
    .import-container{
        display: inline-block;
        position: relative;
        width: $ui-width--small;
        height: 33px;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;

        span{
            display: inline-block;
            width: calc( 100% - 25px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:$theme-font-grey;
            padding-left: 15px;
            height: 32px;
            line-height: 32px;
            font-size: 13px;
            &.wait {
                color:$theme-font-grey-4;
            }
        }
        i {
            float: right;
            margin-top: 9px;
            margin-right: 11px;
        }
    }
</style>
