/** `${bucket}watermark.png?x-oss-process=image/resize,P_100` 储存在oss上。注意：生成的base64不能由'/'， oss会根据'/'截取导致解析失败 */
const WATERMARK_BASE64 = 'd2F0ZXJtYXJrLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzEwMA=='

import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { encode } from 'js-base64'
import moment from 'moment'
import { ossInfoModel } from '@/api/common'

const getWaterMarkBase64 = (width, height) => {
    let _width = +width
    let _height = +height
    if (_width > 1620 || _height > 1080) {
        const radio = Math.max(_width / 1620, _height / 1080)
        _width = Math.floor(_width / radio)
        _height = Math.floor(_height / radio)
    }
    const url = `watermarkonline.png?x-oss-process=image/crop,w_${_width},h_${_height}`
    // console.log('getWaterMarkBase64', url)
    return encode(url).replace(/\+/ig, '-').replace(/\//ig, '_')
}

/**
 * 生成oss缩略图
 * @param url:string
 * @param size:number 按照长边等比缩放
 * @returns {string}
 */
export const getOssThumb = (url, size = 160) => {
    if (!url) return ''
    if (/^data:/ig.test(url)) return url
    if (/qfstatic/ig.test(url)) return url
    if (/x-oss-process=image/.test(url)) {
        if (/\/resize.*\//ig.test(url)) {
            const _url = url.replace(/\/resize.*\//ig, `/resize,l_${size},m_fill/`)
            return _url
        }
        if (/\/resize.*/ig.test(url)) {
            const _url = url.replace(/\/resize.*/ig, `/resize,l_${size},m_fill`)
            return _url
        }

        // console.log(url + `/resize,l_${size},m_fill`)
        return url + `/resize,l_${size},m_fill`
    }
    return `${url}?x-oss-process=image/resize,l_${size},m_fill`
}

/**
 * 生成oss水印图
 * @param url:string
 * @param size:number 按照长边等比缩放
 * @returns {string}
 */
export const getWaterUrl = (url) => {
    if (/^data:/ig.test(url)) return url
    if (!url) return ''
    return /qfstatic/ig.test(url) ? url : `${url}?x-oss-process=image/resize,m_pad,w_1000,h_750,limit_0,color_2A2A2A/watermark,image_${WATERMARK_BASE64},g_center,p_100`
}
/**
 * 生成oss水印图
 * @param url:string
 * @param size:number 按照长边等比缩放
 * @returns {string}
 */
export const getWaterUrlOnLine = async(url) => {
    if (/^data:/ig.test(url)) return url
    if (!url) return ''
    if (/qfstatic/ig.test(url)) {
        return url
    }

    try {
        const imageInfo = await ossInfoModel.getOssImageInfo(url)
        // console.log(imageInfo)
        const { ImageWidth, ImageHeight } = imageInfo
        // const waterMarkBase64 = getWaterMarkBase64(ImageWidth.value, ImageHeight.value)
        let _width = +ImageWidth.value
        const _height = +ImageHeight.value
        if (_width > 1620 || _height > 1080) {
            const radio = Math.max(_width / 1620, _height / 1080)
            _width = Math.floor(_width / radio)
            // return `${url}?x-oss-process=image/resize,w_${_width},m_mfit/watermark,image_${waterMarkBase64},g_center,p_100`
            return `${url}?x-oss-process=image/resize,w_${_width},m_mfit`
        }
        return url
    } catch (e) {
        console.error('getWaterUrlOnLine error', e)
        return url
    }
}

/**
 * 生成oss水印缩略图
 * @param url:string
 * @param size:number 按照长边等比缩放
 * @returns {string}
 */
export const getOssThumbWaterUrl = (url, size = 160) => {
    if (/^data:/ig.test(url)) return url
    if (!url) return ''
    return /qfstatic/ig.test(url) ? url : `${url}?x-oss-process=image/resize,l_${size},m_fill/watermark,image_${WATERMARK_BASE64},g_center,p_100`
}

/**
 * 生成oss下载链接 （2019.9.23之后绑定cname的bucket，不再支持a链接直接下载，故下载链接需要切换回没有绑定cname的链接）
 * @param url:string
 * @returns {string}
 */
export const getOssDownloadUrl = (url) => {
    // http://aijiawang-test-image.oss-cn-shanghai.aliyuncs.com/xinfang/65eba56e-270e-45b1-a4c5-31a4db04a991.png
    // https://aijiawang-test-image.aijiawang.com/survey/fab22f02-4d51-464f-b3c5-4ea3d9620983.JPG?
    if (!url) return ''
    if (/^data:/ig.test(url)) return url
    return /qfstatic/ig.test(url) ? url : url.replace('.aijiawang.com/', '.oss-cn-shanghai.aliyuncs.com/').replace('.mklij.com/', '.oss-cn-shanghai.aliyuncs.com/')
}

/**
 *
 * @param imageList [{fileName: '', photoUrl: '' }]
 * @returns {string|*}
 */
export const downloadPhotoZip = async(imageList, zipName = '照片') => {
    if (!Array.isArray(imageList) || imageList.length === 0) return

    const zip = new JSZip()
    const promisesRes = await Promise.all(imageList.map(item => ossInfoModel.getOssImageFile(getOssDownloadUrl(item.bigImg || item.photoUrl || item.fileUrl)).catch(() => {
        console.error('下载失败 -----------', item.bigImg || item.photoUrl || item.fileUrl)
    })))
    promisesRes.forEach((file, index) => {
        const content = file.content || file
        zip.file(imageList[index].fileName, content, { binary: true })
    })

    const date = moment().format('YYYY-MM-DD')
    zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, `${zipName}_${date}.zip`)
    })
}

