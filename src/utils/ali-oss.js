import Vue from 'vue'
// const AliOss = require('ali-oss')
import AliOss from 'ali-oss'
import { ossUploadModel } from '@/api/common'
import { UploadVodModel } from '@/api/fangyuan'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import AliyunUpload from 'aliyun-upload-vod'
/**
 *
 * @param type
 * @param fileLastName
 * @returns {string} // 'image',  'video', 'audio', 'others'
 */
export const getFileType = (type, fileLastName) => {
    if (/\.heic$/ig.test(fileLastName)) return 'image'
    if (/image/ig.test(type)) return 'image'
    if (/audio/ig.test(type)) return 'audio'
    if (/video/ig.test(type)) return 'video'
    return 'others'
}

// module 上传阿里云的各产品线对应的文件夹路径
//  WAIWANG("waiwang", "外网"),
//   LOUPAN("loupan", "楼盘"),
//   FANGYUAN("fangyuan", "房源"),
//   XINFANG("xinfang", "新房"),
//   KEHU("kehu", "客户"),
//   JIAOYI("jiaoyi", "交易"),
//   HR("hr", "人事"),
//   MENDIAN("mendian","门店"),
//   DUANKOU("duankou","端口");
//   GONGGAO("gonggao","公告");

/**
 *
 * @param options
 * @param module 上传阿里云的各产品线对应的文件夹路径
 * @param subModule 增加子模块路径
 * @returns {Promise<void>}
 */
export const uploadOSS = async(options, module = 'default', subModule = 'default') => {
    if (!options || !options.file) return
    const { file } = options
    const { type, name, size } = file
    const nameArr = name.split('.')
    const fileLastName = nameArr[nameArr.length - 1]
    const fileType = getFileType(type, fileLastName)
    console.log('file', file)
    const getOssToken = await ossUploadModel.getOssToken({ fileType })

    const { region, accessKeyId, accessKeySecret, bucketName, endpoint, fileUrl } = getOssToken.data
    const client = new AliOss({
        region,
        accessKeyId,
        accessKeySecret,
        bucket: bucketName,
    })
    const date = moment().format('YYYY-MM-DD')
    const fileUuid = module + '/' + subModule + '/' + date + '/' + uuid() + '.' + fileLastName
    const loadingInstance = Vue.prototype.$aikaLoading()

    // heic格式的图片在windows上file.type 为空，此处给出默认值
    const contentType = type || (/\.heic$/ig.test(fileLastName) ? 'image/heic' : 'other')
    try {
        const result = await client.put(fileUuid, options.file)
        loadingInstance && loadingInstance.close()
        if (result.res.status === 200) {
            return new Promise((resolve) => {
                resolve({
                    ok: true,
                    data: {
                        contentType,
                        fileName: name,
                        fileUrl: [fileUrl, result.name].join('/'),
                        size,
                    },
                })
            })
        }
    } catch (e) {
        loadingInstance && loadingInstance.close()
    }
}

/**
 * @des 分段上传 + 进度条
 * @param options
 * @param module 上传阿里云的各产品线对应的文件夹路径
 * @param subModule 增加子模块路径
 * @returns {Promise<void>}
 */
export const multipartUploadOSS = async(options, module = 'default', subModule = 'default') => {
    if (!options || !options.file) return

    let loadingInstance
    if (options.showLoading) {
        // loadingInstance = Vue.prototype.$aikaLoading()
        loadingInstance = Vue.prototype.$aikaLoading({
            text: '文件上传中',
            customClass: 'anki-loading anki-loading--info'
        })
    }

    const { file } = options
    const { type, name, size, uid } = file
    try {
        const nameArr = name.split('.')
        const fileLastName = nameArr[nameArr.length - 1]
        const fileType = getFileType(type, fileLastName)
        console.log('file', file)

        const getOssToken = await ossUploadModel.getOssToken({ fileType })

        const { region, accessKeyId, accessKeySecret, bucketName, fileUrl } = getOssToken.data
        const client = new AliOss({
            region,
            accessKeyId,
            accessKeySecret,
            bucket: bucketName,
        })
        const date = moment().format('YYYY-MM-DD')
        const fileUuid = module + '/' + subModule + '/' + date + '/' + uuid() + '.' + fileLastName
        // const loadingInstance = Vue.prototype.$aikaLoading()

        // heic格式的图片在windows上file.type 为空，此处给出默认值
        const contentType = type || (/\.heic$/ig.test(fileLastName) ? 'image/heic' : 'other')

        let abortCheckpoint
        const abort = function() {
            client.abortMultipartUpload(abortCheckpoint.name, abortCheckpoint.uploadId)
        }
        const progress = (p, cpt, res) => {
            abortCheckpoint = cpt
            options.progress(p, cpt, res, abort)
        }

        const result = await client.multipartUpload(fileUuid, options.file, {
            // partSize: options.partSize || 1024 * 1024,
            progress: progress,
            timeout: 30 * 60 * 1000
        })

        // loadingInstance && loadingInstance.close()
        if (options.showLoading) {
            loadingInstance && loadingInstance.close()
        }
        if (result.res.status === 200) {
            return new Promise((resolve) => {
                resolve({
                    ok: true,
                    data: {
                        contentType,
                        fileName: name,
                        fileUrl: [fileUrl, result.name].join('/'),
                        size,
                        uid
                    },
                })
            })
        }
    } catch (e) {
        console.log(e)
        // loadingInstance && loadingInstance.close()
        if (options.showLoading) {
            loadingInstance && loadingInstance.close()
        }
        return new Promise((resolve) => {
            resolve({
                ok: false,
                data: {
                    fileName: name,
                    uid
                },
            })
        })
    }
}
/**
 * @des 视频点播 上传阿里云 https://help.aliyun.com/document_detail/52204.html
 * @param options
 * @returns {Promise<void>}
 */
export const UploadVod = async(options) => {
    if (!options || !options.file) return

    let loadingInstance
    if (options.showLoading) {
        loadingInstance = Vue.prototype.$aikaLoading({
            text: '文件上传中',
            customClass: 'anki-loading anki-loading--info'
        })
    }

    const { file } = options
    const { type, name, size, uid } = file
    const sts = await UploadVodModel.getSts()
    console.log(sts)
    if (!sts.ok) return
    const paramData = await UploadVodModel.getParamData({
        fileName: name
    })
    console.log('paramData', paramData)
    if (!paramData.ok) return

    // return
    const credentials = sts?.data?.credentials
    const { accessKeyId, accessKeySecret, securityToken: secretToken } = credentials

    return new Promise((resolve, reject) => {
        const uploader = new AliyunUpload.Vod({
            timeout: options.timeout || 60000,
            partSize: options.partSize || 1048576, // 分片大小默认1 MB，不能小于100 KB
            parallel: options.parallel || 5, // 并行上传分片个数，默认5
            retryCount: options.retryCount || 3, // 网络原因失败时，重新上传次数，默认为3
            retryDuration: options.retryDuration || 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
            userId: options.userId || '123', // userID，必填，只需有值即可。
            // 开始上传
            onUploadstarted: function(uploadInfo) {
                uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret, secretToken)
                console.log('onUploadStarted:' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
            },
            // 文件上传成功
            onUploadSucceed: function(uploadInfo) {
                console.log(uploadInfo)
                console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
                if (options.showLoading) {
                    loadingInstance && loadingInstance.close()
                }
                resolve(uploadInfo)
            },
            // 文件上传失败
            onUploadFailed: function(uploadInfo, code, message) {
                console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
                if (options.showLoading) {
                    loadingInstance && loadingInstance.close()
                }
                reject({ uploadInfo, code, message })
            },
            // 文件上传进度，单位：字节
            onUploadProgress: function(uploadInfo, totalSize, loadedPercent) {
                console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(loadedPercent * 100) + '%')
                options.progress(loadedPercent, uploadInfo, null, () => uploader.cancelFile(0))
            },

            // 上传凭证或STS token超时
            onUploadTokenExpired: function(uploadInfo) {
                console.log('onUploadTokenExpired')
                // 重新获取STS token，恢复上传
            },
            // 全部文件上传结束
            onUploadEnd: function(uploadInfo) {
                console.log('onUploadEnd: uploaded all the files')
                uploader.cleanList()
            }
        })

        // var paramData = '{"Vod":{"Title":"925954-80322FCB01DC4海上新村14-301.mp4","UserData":{"Extend":{"type":"dev","surveyVideoFileId":"925954"}}}}'
        const { type, surveyVideoId } = paramData.data || {}
        const param = {
            Vod: {
                Title: surveyVideoId + '-' + name,
                UserData: {
                    Extend: {
                        type: type,
                        surveyVideoFileId: surveyVideoId
                    }
                }
            }
        }

        uploader.addFile(file, null, null, null, JSON.stringify(param))
        uploader.startUpload()
        return uploader
    })
}
