<template>
  <div class="attachment-tooltip">
    <el-upload
      v-if="item && item.add"
      ref="upload"
      class="upload-container"
      :multiple="item.multiple"
      :action="item.action || ''"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :accept="item.accept"
      :limit="item.limit"
      :file-list="attachmentList"
      :http-request="handleUpload"
    >
      <el-button :ref="'uploadBtn' + (item.prop || '')" type="new" size="mini">上传</el-button>
    </el-upload>
    <template v-if="item && item.appendContent && !item.appendContent.hidden">
      <div class="appendContent-container">
        <span v-if="item.appendContent.text" :style="item.appendContent.textStyle">{{ item.appendContent.text }}</span>
        <el-button
          v-if="item.appendContent.type === 'button'"
          :type="item.appendContent.buttonType || 'text'"
          @click="item.appendContent.func ? item.appendContent.func() : {}"
        >
          {{ item.appendContent.buttonText }}
        </el-button>
      </div>
    </template>
    <template v-if="attachmentList && attachmentList.length > 0">
      <el-tooltip v-if="attachmentList.length > 1" placement="top-start" effect="light">
        <template #content>
          <div class="file-container my-tooltip-content">
            <ul class="file-wrap">
              <el-tooltip v-for="(file,index) in attachmentList" :key="index" placement="top-start">
                <template #content>
                  <div>{{ file.meta.indexOf('image') > -1 || /\.HEIC$/ig.test(file.fileUrl) ? '预览' : '下载' }}</div>
                </template>
                <li class="file-item" @click="previewOrDownload(file, index)">
                  <div class="content">
                    <span class="item-type">
                      <el-image v-if="file.meta.indexOf('image') > -1 || /\.HEIC$/ig.test(file.fileUrl)" :src="file.fileUrl" />
                      <el-image v-else :src="require('@/assets/images/unknow.png')" />
                    </span>
                    <span class="file-name">{{ file.fileName }}</span>
                  </div>
                  <div v-if="item && item.add" class="del" @click.stop="item.del(file,index)">
                    <i class="el-icon-close" />
                  </div>
                </li>
              </el-tooltip>
            </ul>
          </div>
        </template>
        <span>
          <i class="el-icon-link" />{{ attachmentList.length }}个附件
        </span>
      </el-tooltip>
      <div v-else class="file-container single-file">
        <ul class="file-wrap">
          <el-tooltip v-for="(file,index) in attachmentList" :key="file.affixUuid" placement="top-start">
            <template #content>
              <div>{{ file.meta.indexOf('image') > -1 || /\.HEIC$/ig.test(file.fileUrl) ? '预览' : '下载' }}</div>
            </template>
            <li class="file-item" :class="{ 'shikan-upload': file.approveDesc }" :style="[{ height: file.approveDesc ? '80px' : '32px' }]" @click="previewOrDownload(file, index)">
              <div class="file">
                <div class="content" :class="{ 'border': file.approveDesc }">
                  <span class="item-type">
                    <el-image v-if="file.meta.indexOf('image') > -1 || /\.HEIC$/ig.test(file.fileUrl)" :src="file.fileUrl" />
                    <el-image v-else :src="require('@/assets/images/unknow.png')" />
                  </span>
                  <span v-if="singleFileName" class="file-name">{{ file.fileName }}</span>
                </div>
                <div v-if="item && item.add" class="del" @click.stop="item.del(file,index)">
                  <i class="el-icon-close" />
                </div>
              </div>
              <div v-if="file.approveDesc" class="approve-desc">{{ file.approveDesc }}</div>
            </li>
          </el-tooltip>
        </ul>
      </div>
    </template>

    <span v-else>
      <template v-if="!item || !item.add">{{ emptyText }}</template>
    </span>

    <el-image-viewer v-if="showViewer" :initial-index="previewInitialIndex" :z-index="9999" :on-close="closeViewer" :url-list="previewUrlList" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
// import { uploadOSS, multipartUploadOSS } from '@/utils/ali-oss'
// import { getOssThumb } from '@/utils/ossImage'
import { QiniuModel } from '@/api/qiniu'
import * as qiniu from 'qiniu-js'
import Vue from 'vue'
export default {
  name: 'AttachmentTooltip',
  components: {
    ElImageViewer
  },
  props: {
    item: {
      type: Object
    },
    attachmentList: {
      type: Array,
      default: () => [],
      required: true
    },
    singleFileName: { type: Boolean, default: true },
    emptyText: {
      type: String,
      default: '-'
    }
  },
  data() {
    return {
      // getOssThumb,
      previewInitialIndex: 0,
      previewUrlList: [],
      showViewer: false // 显示查看器
    }
  },
  methods: {
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },

    // 预览或下载
    previewOrDownload(file) {
      if (file.meta.indexOf('image') > -1 || /\.HEIC$/ig.test(file.fileUrl)) {
        const result = this.attachmentList.filter(item => (item.meta && item.meta.indexOf('image') > -1) || /\.HEIC$/ig.test(item.fileUrl))
        let initialIndex = 0

        result.forEach((item, index) => {
          if (item.fileUrl === file.fileUrl) {
            initialIndex = index
          }
        })
        this.previewInitialIndex = initialIndex
        this.previewUrlList = result.map(item => item.fileUrl).filter(Boolean)
        this.showViewer = true
      } else if (file.meta.indexOf('videoVod') > -1) {
        // 点播视频
        if (file.vodFlag) return window.open(file.fileUrl)
        return this.$message.error('视频正在转码中……')
      } else {
        window.open(file.fileUrl)
        // const elink = document.createElement('a')
        // elink.href = file.fileUrl
        // elink.download = file.fileName
        // elink.style.display = 'none'
        // document.body.appendChild(elink)
        // elink.click()
        // URL.revokeObjectURL(elink.href) // 释放URL 对象
        // document.body.removeChild(elink)
      }
    },

    beforeUpload(file) {
      const { maxSize, accept, acceptTip } = this.item
      const _maxSize = Object.prototype.toString.call(maxSize) === '[object Number]' ? maxSize : 20
      const overSizeLimit = file.size / 1024 / 1024 > _maxSize
      if (overSizeLimit) {
        this.$message.error(`文件大小不能超过${_maxSize}M！`)
        return false
      }

      // 有些文件 type 为空 如 flv
      if (accept && accept !== '*' && (accept.indexOf(file.type) < 0 || !file.type)) {
        console.log(file.type)
        if (acceptTip) {
          this.$message.error(acceptTip)
          return false
        }
        this.$message.error(`请上传${accept}类型文件`)
        return false
      }
      return true
    },

    // 超出限制
    handleExceed() {
      const { exceedTips, limit } = this.item
      this.$message.error(exceedTips || `最多可上传${limit}个文件！`)
    },
    async handleUpload(options) {
      console.log('options', options)
      // 是否 用分片上传
      console.log(this.item.showLoading)
      const res = await QiniuModel.getToken()
      const token = res.data
      console.log('res', res)
      const { file } = options
      const { name, type } = file

      const { folder } = this.item
      const loading = this.$loading({ lock: true, text: '上传中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.5)' })
      try {
        const observable = qiniu.upload(file, (folder ? folder + '/' : '') + name, token)
        const subscription = observable.subscribe(
          (res) => {
            console.log('next', res)
          },
          (err) => {
            console.log('error', err)
            loading.close()
          },
          (res) => {
            console.log('complete', res)
            const { key, hash } = res
            const contentType = type || (/\.heic$/ig.test(fileLastName) ? 'image/heic' : 'other')
            const qiniuHost = 'http://static.gangqintonghua.com/'
            this.item.success({
              ...file,
              contentType,
              fileUrl: qiniuHost + key,
              fileName: name, // fileName 不带文件夹名称
              hash
            })
          }
        )
      } finally {
        loading.close()
      }

      if (this.item.multipart) {
        console.log(this.item.showLoading)
        // const res = await multipartUploadOSS({ ...options, progress: this.item.onProgress, showLoading: this.item.showLoading }, this.item.module, this.item.subModule)
        // if (this.item.success) {
        // this.item.success(res)
        // }
      } else {
        // const res = await uploadOSS(options, this.item.module, this.item.subModule)
        // if (this.item.success) {
        // this.item.success(res)
        // }
      }
    },
    handleClickFakeUpload() {
      this.$emit('fakeUploadClick', this.item)
    },
    uploadBtnClick() {
            this.$refs?.['upload']?.$children[0]?.$refs.input.click()
    }
  }
}
</script>

<style lang="scss" scoped>
    .attachment-tooltip {
        display: inline-block;
        .upload-container {
            float: left;
            margin-right: 10px;
        }
        .appendContent-container {
            float: left;
            margin-right: 10px;
        }
        .viewer-btn {
            position: absolute;
            z-index: 1;
            width: 56px;
            height: 33px;
            cursor: pointer;
        }
    }
    .file-container {
        display: inline-block;
        max-height: 200px;
        padding: 0;
        overflow-y: auto;
        &.my-tooltip-content {
            width: 360px;
            .file-wrap {
                .file-item {
                    width: 100%;
                }
            }
        }
        &.single-file {
            .file-wrap {
                .file-item {
                    //height: 80px;
                    padding-top: 0;
                    padding-bottom: 0;
                    .del {
                        width: 32px;
                        height: 32px;
                        line-height: 32px;
                    }
                }
            }
        }
        .file-wrap {
            display: flex;
            flex-wrap: wrap;
            .file-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 40px;
                padding-top: 8px;
                padding-bottom: 8px;
                padding-left: 10px;
                line-height: 16px;
                cursor: pointer;
                +.file-item {
                    margin-top: 2px;
                }
                &:hover {
                    background-color: $theme-bg-white-8;
                    .del {
                        display: block;
                    }
                }
                .file {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 32px;
                    &:hover {
                        background-color: $theme-bg-white-8;
                        .del {
                            display: block;
                        }
                    }
                }
                .content {
                    display: flex;
                    align-items: center;
                    .file-name {
                        display: inline-block;
                        max-width: 276px;
                        margin-right: 8px;
                        margin-left: 8px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    ::v-deep .el-image {
                        width: 24px;
                        height: 24px;
                    }
                    &.border {
                        border: 2px solid red;
                    }
                }
                .del {
                    display: none;
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    background-color: $theme-bg-white-11;
                    &:hover {
                        background-color: $theme-color-primary;
                        i {
                            color: $theme-font-white;
                        }
                    }
                }
                .approve-desc {
                    margin: 10px 0;
                    color: red;
                }
            }
            .shikan-upload {
                display: block;
            }
        }
    }
</style>
<style lang="scss">
.el-image-viewer__wrapper .el-image-viewer__close i {
    color: $theme-font-white-6;
}
</style>
