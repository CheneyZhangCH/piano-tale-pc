import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

import { get } from './http'

/** ------------------------ 七牛上传接口 -------------------------**/
export const QiniuModel = {
  // 获取七牛上传token
  getToken(data) {
    return get(`/qiniu/getToken`, data)
  }
}

