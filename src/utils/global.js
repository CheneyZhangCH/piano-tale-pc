/** *---------------vue全局实例方法-------------***/
import { Message } from 'element-ui'

export default {
  install(Vue) {
    // 成功提示后回调
    Vue.prototype.$success = function(msg, fn, time = 1000) {
      Message({
        message: msg,
        type: 'success',
        duration: time,
        onClose() {
          fn && fn()
        }
      })
    }
    // 数组中匹配特定对象，返回其index
    Vue.prototype.$findObj = function(arr, val, key = 'prop') {
      let index
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
          index = i
          break
        }
      }
      return index
    }

    Vue.prototype.$getDictObj = function(arr, value = 'value', label = 'label') {
      const obj = {}
      Array.isArray(arr) && arr.forEach(item => {
        obj[item[value]] = item[label]
      })
      return obj
    }

    // 判空（0返回true）
    Vue.prototype.$isNullOrEmpty = function(val) {
      return val === null || val === undefined || val === ''
    }

    // 加载中
    Vue.prototype.$aikaLoading = function(opts = {}) {
      const newOpts = Object.assign({
        customClass: 'anki-loading',
        lock: true
      }, opts)
      return this.$loading(newOpts)
    }

    // 设置表单的选项
    Vue.prototype.$setFormDict = function(form, prop, dict) {
      form.find(item => item.prop === prop).opts = dict
    }

    // 打开新页面
    Vue.prototype.$goToNewBlank = function(vm, routeParams) {
      const routeUrl = vm.$router.resolve(routeParams)
      window.open(routeUrl.href, '_blank')
    }
  }
}
