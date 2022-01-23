import axios from 'axios'
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import { Message, MessageBox, Loading } from 'element-ui'

const options = {
  lock: true,
  text: '请稍后...',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.6)'
}
function errMsg(message) {
  Message({ message, type: 'error' })
}
let isTokenErr = false
function errMsgBox(reason) {
  const store = Vue.prototype.$mainStore
  if (isTokenErr) return // 如果已经有登录超时弹窗，就不再展示
  isTokenErr = true
  MessageBox.alert(`${reason}，请重新登录`, '系统提示', {
    confirmButtonText: '确定',
    type: 'warning',
    callback: () => {
      isTokenErr = false
      store.dispatch('Layout').then(() => {
        // 跳转login页面，进入到router白名单内
        const source = [location.pathname, location.search].filter(Boolean).join('') // 记录当前页面的路径
        if (source && source !== '/' && source !== encodeURIComponent('/') && source.indexOf('login') < 0 && source.indexOf('ding-callback') < 0) {
          window.history.pushState(null, '', `/login?source=${encodeURIComponent(source)}`)
        } else {
          window.history.pushState(null, '', '/login')
        }
      })
    }
  })
}

export const instance = axios.create({
  baseURL: process.env.VUE_APP_CURRENT_MODE === 'local' ? '/api' : process.env.VUE_APP_API_ROOT,
  timeout: 120000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

// http request 拦截器
instance.interceptors.request.use(
  config => {
    if (config.url.indexOf('/loginByEmpNoOrPwd') > -1) {
      config.headers['Authorization'] = ''
    } else {
      config.headers['Authorization'] = `${getToken()}`
    }
    // 上传
    if (
      config.url.indexOf('/import/empCheck') > -1 ||
			config.url.indexOf('/import/empCheckAsync') > -1 ||
			config.url.indexOf('/import/empTraining') > -1 ||
			config.url.indexOf('/oldHouse/import') > -1 ||
			config.url.indexOf('/loupan/file/commonUploadPicture') > -1 ||
			config.url.indexOf('/file/uploadFile') > -1 ||
			config.url.indexOf('/qiaofangCommon/uploadSingleFile') > -1 ||
			config.url.indexOf('/file/uploadDimissionFile') > -1 ||
            config.url.indexOf('/api-channel/distributionInHappiness/import') > -1 ||
            config.url.indexOf('ziliaofang/fangziliaotask/startTask') > -1
    ) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      config.headers['Content-Type'] = 'application/json'
      // 序列化传入参数，上传时参数不可序列化
      config.data = JSON.stringify(config.data)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
instance.interceptors.response.use(
  async(response) => {
    if (response.config.customErr) {
      return response.data
    }

    if (/x-oss-process=image\/info/.test(response.config.url) || /video/.test(response.headers['content-type'])) {
      return response.data
    }

    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
      const data = response.data
      if (
        response.headers['content-type'].indexOf('octet-stream') > -1 ||
                response.headers['content-type'].indexOf('msexcel') > -1 ||
                response.headers['content-type'].indexOf('ms-excel') > -1 ||
                response.headers['content-type'].indexOf('x-zip-compressed') > -1 ||
                response.headers['content-type'].indexOf('image/') > -1
      ) {
        return {
          fileName: response.headers['content-disposition']?.split('filename=')[1],
          content: data
        }
      } else {
        if (data && data.code === 401) {
          errMsgBox('登录超时')
          return
        }
        // 房源核验失败 => then
        if (data && data.code === 400001 && response.config.url.includes('/fangyuan/heyan/isAccrossHeYan?propertyNo=')) {
          return data || 'error'
        }
        // 房源核验已有记录失败 => then
        if (data && data.code === 400001 && response.config.url.includes('/fangyuan/heyan/addPropertyHeYanInfo')) {
          return data || 'error'
        }
        // 租赁核验失败 => then
        if (data.code === 400001 && response.config.url.includes('/heyanRent/addPropertyHeYanRentInfo')) {
          return data || 'error'
        }
        // 转接号报错拦截 => then
        if (data && data.code === 400001 && response.config.url.includes('/fangyuan/propertyPhoneCall/callUp')) {
          return data || 'error'
        }
        // 收藏房源超出拦截 => then
        if (data.code === 400001 && response.config.url.includes('/fangyuan/propertyCollection/updateCollectionStatus')) {
          return data || 'error'
        }
        // 检查房源保护期
        if (data.code === 400001 && response.config.url.includes('/fangyuan/property/propertyInProtectTime')) {
          return data || 'error'
        }

        if (data.ok) {
          return data
        }
        errMsg(data.message)
        const error = new Error(data.message)
        error.data = data
        error.response = response

        return Promise.reject(data || 'error')
      }
    }
  },
  error => {
    let errorUrl = ''
    if (error.request && error.request.responseURL) {
      const errorUrlArr = error.request.responseURL.split(location.host)
      if (errorUrlArr.length > 0) {
        errorUrl = errorUrlArr[errorUrlArr.length - 1]
      }
    }
    if (error && error.response) {
      if (isTokenErr) {
        return
      }
      if (error.response.status === 401) {
        errMsgBox('登录超时')
        return
      }
      let errs = ''
      switch (error.response.status) {
        case 400:
          errs = '错误请求'
          break
          // case 401:
          //     errs = '未授权，请重新登录'
          //     break
        case 403:
          errs = '拒绝访问'
          break
        case 404:
          errs = '请求错误,未找到该资源'
          break
        case 405:
          errs = '请求方法未允许'
          break
        case 408:
          errs = '请求超时'
          break
        case 409:
          errs = '服务器在完成请求时发生冲突'
          break
        case 410:
          errs = '请求的资源已被永久删除'
          break
        case 411:
          errs = '需要有效长度'
          break
        case 413:
          errs = '请求实体过大'
          break
        case 414:
          errs = '请求的 URI 过长'
          break
        case 415:
          errs = '不支持的媒体类型'
          break
        case 500:
          errs = error.response.data && error.response.data.message ? error.response.data.message : '服务器端出错'
          break
        case 501:
          errs = '网络未实现'
          break
        case 502:
          errs = '网络错误'
          break
        case 503:
          errs = '服务不可用'
          break
        case 504:
          errs = '网络超时'
          break
        case 505:
          errs = 'http版本不支持该请求'
          break
        default:
          errs = `连接错误${error.response.status}`
      }
      errMsg(errorUrl + '：' + errs)
      error.message = errorUrl + '：' + errs
    } else {
      errMsg('连接到服务器失败')
      error.message = '连接到服务器失败'
    }
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url, params = {}, loading = false, responseType) {
  return new Promise((resolve, reject) => {
    let loadingInstance
    if (loading) {
      loadingInstance = Vue.prototype.$aikaLoading()
    }
    instance({
      url,
      params,
      responseType
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loadingInstance && loadingInstance.close()
      })
  })
}

// 后续get请求尽量使用这个方法
export function get(url, params = {}, loading = false, responseType) {
  return new Promise((resolve, reject) => {
    let loadingInstance
    if (loading) {
      loadingInstance = Loading.service(options)
    }
    let urlParams = []
    Object.keys(params).forEach(key => {
      urlParams.push(`${key}=${encodeURIComponent(params[key])}`)
    })
    if (urlParams.length) {
      urlParams = `${url}?${urlParams.join('&')}`
    } else {
      urlParams = url
    }
    instance({
      url: urlParams,
      params: {
        randomTime: new Date().getTime() // 防止缓存
      },
      headers: {
        'Request-Client-From': 'pc'
      },
      responseType
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loadingInstance && loadingInstance.close()
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}, loading = false, responseType, props) {
  return new Promise((resolve, reject) => {
    let loadingInstance
    if (loading) {
      loadingInstance = Loading.service(options)
    }
    instance({
      method: 'post',
      url,
      data,
      responseType,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...props
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loadingInstance && loadingInstance.close()
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deleteHttp(url, data = {}, loading = false) {
  return new Promise((resolve, reject) => {
    let loadingInstance
    if (loading) {
      loadingInstance = Loading.service(options)
    }
    instance({
      method: 'delete',
      url,
      data
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loadingInstance && loadingInstance.close()
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}, loading = false) {
  return new Promise((resolve, reject) => {
    let loadingInstance
    if (loading) {
      loadingInstance = Loading.service(options)
    }
    instance({
      method: 'patch',
      url,
      data
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loadingInstance && loadingInstance.close()
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}, loading = false) {
  return new Promise((resolve, reject) => {
    let loadingInstance
    if (loading) {
      loadingInstance = Loading.service(options)
    }
    instance({
      method: 'put',
      url,
      data
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
      .finally(() => {
        loadingInstance && loadingInstance.close()
      })
  })
}
