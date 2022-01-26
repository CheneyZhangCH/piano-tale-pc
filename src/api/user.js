import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

import { post } from './http'

/** ------------------------ 登录服务接口 -------------------------**/
export const LoginModel = {
  // 获取短信验证码
  sendVerifySmsMsg(data) {
    return post(`login/sendVerifySmsMsg`, data)
  },
  // 登录
  managerLogin(data) {
    return post(`login/managerLogin`, data)
  }
}

