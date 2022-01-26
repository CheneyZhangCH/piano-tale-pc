<template>
    <div class="list picture-list borderBtm">
        <ul class="el-upload-list el-upload-list--picture-card">
            <li v-if="showUploadBtn" class="upload-wrap el-upload-list__item">
                <el-upload
                    ref="upload"
                    class="el-upload-new-upload"
                    :multiple="multiple"
                    :action="action"
                    :headers="headers"
                    :data="uploadData"
                    :show-file-list="showFileList"
                    :list-type="listType"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :on-exceed="handleExceed"
                    :on-change="handleChange"
                    :on-progress="handleProgress"
                    :before-upload="beforeUpload"
                    :before-remove="beforeRemove"
                    :file-list="uploadedFileList"
                    :accept="accept"
                    :limit="limit"
                >
                    <slot />
                    <i class="el-icon-plus" />
                </el-upload>
            </li>

            <template v-if="uploadedFileList.length > 0">
                <li v-for="(item,index) in uploadedFileList" :key="index" class="el-upload-list__item">
                    <el-image v-if="getFileType(item.name) === 'doc'" :src="DocIcon" fit="contain" />
                    <el-image v-else-if="getFileType(item.name) === 'pdf'" :src="PdfIcon" fit="contain" />
                    <el-image v-else-if="getFileType(item.name) === 'xls'" :src="XlsIcon" fit="contain" />
                    <el-image v-else-if="getFileType(item.name) === 'ppt'" :src="PptIcon" fit="contain" />
                    <el-image v-else-if="getFileType(item.name) === 'image'" :src="item.url" :preview-src-list="[item.url]" fit="contain" lazy />
                    <span class="hover-actions el-upload-list__item-actions">
                        <span v-if="item.name" class="name">{{ item.name }}</span>
                        <span class="action-btns">
                            <a v-if="showUploadBtn" href="javascript:void(0);" @click="handleDelete(index)">删除</a>
                            <a target="_blank" :href="item.url">下载</a>
                        </span>
                    </span>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import DocIcon from '@/assets/images/doc@2x.png'
import XlsIcon from '@/assets/images/xls@2x.png'
import PptIcon from '@/assets/images/ppt@2x.png'
import PdfIcon from '@/assets/images/pdf@2x.png'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'
import axios from 'axios'

export default {
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        action: String,
        headers: {
            type: Object,
            default: () => {
                return {
                    Authorization: getToken()
                }
            }
        },
        fileList: {
            type: Array,
            default: () => {
                return []
            }
        },
        uploadData: Object,
        showFileList: {
            type: Boolean,
            default: false
        },
        showUploadBtn: {
            type: Boolean,
            default: true,
        },
        listType: {
            type: String,
            default: 'picture-card'
        },
        tip: {
            type: String,
            default: ''
        },
        accept: String,
        limit: Number,
        exceedTips: String,
        maxSize: Number,
    },
    data() {
        return {
            DocIcon,
            XlsIcon,
            PptIcon,
            PdfIcon,
            uploadedFileList: this.fileList,
            uploading: false,
            options: {
                lock: true,
                text: '正在上传，请稍后...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
            },
            loadingInstance: undefined,
        }
    },
    watch: {
        fileList(val) {
            this.uploadedFileList = this.fileList
        }
    },
    mounted() {
        // console.log('this.fileList', this.fileList)
    },
    methods: {
        beforeUpload(file) {
            if (this.uploading) {
                return false
            }
            this.loadingInstance = Loading.service(this.options)
            const overSizeLimit = this.maxSize ? file.size / 1024 / 1024 > this.maxSize : false
            if (overSizeLimit) {
                this.$message.error(`文件大小不能超过${this.maxSize}M！`)
                this.loadingInstance && this.loadingInstance.close()
            }
            return !overSizeLimit
        },

        getFileType(name) {
            if (!name) return ''
            const postName = name.split('.').reverse()[0]
            if (!postName) return ''

            if (/jpg|jpeg|png|HEIC/ig.test(postName)) {
                return 'image'
            }
            if (/pdf/ig.test(postName)) {
                return 'pdf'
            }
            if (/doc/ig.test(postName)) {
                return 'doc'
            }
            if (/ppt/ig.test(postName)) {
                return 'ppt'
            }
            if (/xls/ig.test(postName)) {
                return 'xls'
            }
        },
        // 超出限制
        handleExceed() {
            this.$message.error(this.exceedTips || `最多可上传${this.limit}个文件！`)
        },

        handleChange(event, file, fileList) {
            // console.log(event)
            // console.log(file)
            // console.log(fileList)
        },

        handleProgress(file, fileList) {
            // console.log(file)
            // console.log(fileList)
        },
        // 上传成功
        handleSuccess(res, file, fileList) {
            this.loadingInstance && this.loadingInstance.close()
            if (res.ok) {
                const result = []
                fileList.forEach(item => {
                    if (item.response) {
                        result.push({
                            name: item.name || item.fileName,
                            url: typeof item.response.data === 'string' ? item.response.data : item.response.data.fileUrl,
                            contentType: Object.prototype.toString.call(item.response.data) === '[object Object]' ? item.response.data.contentType : '',
                            size: item.size,
                            uploadTime: new Date().getTime()
                        })
                    } else {
                        result.push({
                            ...item,
                            name: item.name,
                            url: item.url,
                            contentType: item.contentType || item.meta,
                            size: item.size,
                            uploadTime: item.uploadTime || new Date().getTime(),
                        })
                    }
                })
                console.log('result', result)
                this.uploadedFileList = result
                this.$emit('newUploadSuccess', result)
            } else {
                this.$message.warning(res.message || 'error!')
            }
        },

        handleDelete(index) {
            console.log('index', index)
            console.log(this.uploadedFileList[index])
            const deletedItem = JSON.parse(JSON.stringify(this.uploadedFileList[index]))
            this.uploadedFileList.splice(index, 1)
            this.$emit('handleDeleteUploadedFile', { fileList: this.uploadedFileList, deletedItem })
        },

        handlePreview(file) {
            this.$emit('preview', file.url)
        },

        beforeRemove(file) {
            const overSizeLimit = this.maxSize ? file.size / 1024 / 1024 < this.maxSize : false
            if (overSizeLimit) {
                return this.$confirm(`确定移除 ${file.name}？`)
            }
        },

        handleRemove() {

        },
        handleReset() {
            this.$refs.upload.clearFiles()
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    .el-upload-list {
        display: flex;
        flex-wrap: wrap;
        .upload-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
        }
    }

    li {
        width: 156px;
        height: 150px;
        text-align: center;
        .checkbox {
            position: absolute;
            left: 6px;
            top: 0;
        }
        .delete-icon {
            position: absolute;
            top: 0;
            right: 6px;
            font-size: 16px;
            cursor: pointer;
        }
        .my-select {
            position: absolute;
            bottom: 0;
            left: 0;
        }
        .type {
            position: absolute;
            top: 0;
            right: 0;
            height: 24px;
            line-height: 24px;
            padding: 0 4px;
            font-size: 12px;
            font-weight: 400;
            color: $theme-font-white;
            background-color: rgba(0, 0, 0, 0.5)
        }
        ::v-deep .hover-actions {
            position: absolute;
            left: 0;
            top: 60%;
            bottom: 0;
            height: 40%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            padding: 6px 4px;
            & > span {
                width: 100%;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                font-weight: 400;
                color: $theme-font-white;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            & > span+span {
                margin-left: 0px;
            }
            .action-btns {
                display: flex;
                justify-content: space-between;
                a {
                    color: $theme-font-white;
                }
            }
            &::after {
                display: none;
            }

        }
    }
}
.el-image {
    width: 156px;
    height: 120px;
}

.actions {
    display: inline-flex;
    align-items: center;
    width: 670px;
    span {
        margin-left: 20px;
        font-size: 14px;
    }
    .btn {
        margin-left: 8px;
    }
}
.upload-file-dialog {
    .main {
        min-height: 320px;
        border-bottom: 1px solid $theme-border-white-6;
    }
}
</style>
