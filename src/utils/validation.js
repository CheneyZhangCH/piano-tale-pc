/*
 * @Author: sun.shengjie
 * @Date: 2020-02-04 18:57:31
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-11-13 11:12:11
 * @FilePath: /src/utils/validation.js
 * @Description:
 */
/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,\!?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * validate phone by juejin
 * @param phone
 * @returns {boolean}
 * 时间截止 2020年1月
 * 电信号段：133 149 153 173 174 177 180 181 189 191 193 199
 * 联通号段：130 131 132 145 146 155 156 166 171 175 176 185 186
 * 移动号段：134 135 136 137 138 139 147 148 150 151 152 157 158 159 172 178 182 183 184 187 188 198
 * 虚拟运营商：170
 */
// export function validatePhone(phone) {
//   const reg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[1389])[0-9]{8}$/
//   return reg.test(phone)
// }

export const validatePhone = (rule, value, callback) => {
  if (value === undefined || value === null || value === '') {
    callback(new Error('手机号码必填'))
    return
  }
  const formatValue = value.replace(/\s/g, '')
  if (!formatValue) {
    callback(new Error('手机号码必填'))
    return
  }
  const reg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[1389])[0-9]{8}$/

  if (reg.test(formatValue)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}

/**
 * 身份证号 最小出生日期 19000101 校验闰年
 * @param no
 * @returns {boolean}
 */
export const validateIdCardNo = (no) => {
  if (!/^\d{17}([0-9]|x|X)$/.test(no)) {
    return false
  }

  const ymd = no.substring(6, 14)
  const year = ymd.substring(0, 4)
  const month = ymd.substring(4, 6)
  const day = ymd.substring(6, 8)

  if (+year < 1900) {
    return false
  }
  if (+month > 12 || +month < 1) {
    return false
  }
  if (+day > 31 || +day < 1) {
    return false
  }

  switch (+month) {
    case 2:
      if (+day > 29) {
        return false
      } else if (+year % 4 !== 0 && +day > 28) {
        return false
      }
      break
    case 4:
    case 6:
    case 9:
    case 11:
      if (+day > 30) {
        return false
      }
      break
    default:
  }

  return true
}

/**
 * validate password
 * 密码正则，以字母开头，长度在6~18之间，只能包含字母、数字和下划线
 * @param password
 * @returns {boolean}
 */
export function validatePasswordEasy(password) {
  const reg = /^[a-zA-Z]\w{5,17}$/
  return reg.test(password)
}

/**
 * validate password
 * 强密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
 * @param password
 * @returns {boolean}
 */
export function validatePasswordHard(password) {
  const reg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
  return reg.test(password)
}

const phoneReg = /(((^0\d{2,5})|(^8\d{2}))(\-)?\d{7,10}$)|(^(1[3-9])[0-9]{9}$)/

export const validatePhone1 = (rule, value, callback) => {
  if (value === undefined || value === null || value === '') {
    callback(new Error('电话必填'))
    return
  }
  const formatValue = value.replace(/\s/g, '')
  if (!formatValue) {
    callback(new Error('电话必填'))
    return
  }
  if (!phoneReg.test(formatValue)) {
    return callback(new Error('请核对输入的手机号是否正确，座机号要加区号。'))
  }
  if (formatValue.replace(/-/g, '').length < 11) {
    return callback(new Error('请核对输入的手机号是否正确，座机号要加区号。'))
  }
  callback()
}

export const validatePhone2 = (rule, value, callback) => {
  if (value === undefined || value === null || value === '') {
    callback()
    return
  }
  const formatValue = value.replace(/\s/g, '')
  if (formatValue === '' || formatValue === undefined || formatValue === null) {
    callback()
    return
  }
  if (!phoneReg.test(formatValue)) {
    return callback(new Error('请核对输入的手机号是否正确，座机号要加区号。'))
  }
  if (formatValue.replace(/-/g, '').length < 11) {
    return callback(new Error('请核对输入的手机号是否正确，座机号要加区号。'))
  }
  callback()
}

export const validateContactName = (rule, value, callback) => {
  if (value === undefined || value === null || value === '') { return callback(new Error('姓名必填')) }
  const formatValue = value.replace(/\s/g, '')
  if (!formatValue) { return callback(new Error('姓名必填')) }
  if (/\d/ig.test(formatValue)) { return callback(new Error('姓名中不能包含数字哦！')) }
  callback()
}

export const validateOwnerMentality = (rule, value, callback) => {
  const phoneReg = /\d{11,}/g
  if (phoneReg.test(value)) {
    callback(new Error('你填写的内容疑似包含手机号码，请删掉不合规信息后再重新提交！'))
  }
  if (value?.includes('学区') || value?.includes('学位')) {
    callback(new Error('你填写的内容疑似包含“学区”或“学位”，请删掉不合规信息后再重新提交！'))
  }
  callback()
}

const valids = {
  userAccount: /^[0-9a-zA-Z_]{2,18}$/,
  userPassword: /^[0-9a-zA-Z_]{6,18}$/,
  Number: /\d+/,
  Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  ComplexPhone: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[1389])[0-9]{8}$/,
  Phone: /^(1[3-9])[0-9]{9}$/,
  SimplePhone: /^[0-9]{11}$/,
  IDCardOld: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 大陆身份证
  IDCard: /^(([1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]))$|^(\d{8})$|^([HhMm](\d{8}|\d{10}))$/, // 大陆身份证、台湾居民来往大陆通行证、港澳来往大陆通行证
  Telephone: /(^(0\d{2,3}-)?\d{7,8}$)|(^(1[3-9])[0-9]{9}$)/,
  // 行业龄
  businessAge: /^(([1-9]{1}|[1-3]{1}\d{1}|40)年|([1-9]{1}|1[0-2]{1})月|0)$/,
  // 最多保留2位小数的数字
  twoDecimalNum: /^[0-9]+(.[0-9]{1,2})?$/,
  // 百分比校验，最多两位小数， 包含100.0、100.00、等
  percentRate: /(^100$)|(^100\.0$)|(^100\.00$)|(^\d{1,2}(\.\d{1,2})?$)/,
  // 金额：大于等于0，保留2位小数
  moneyNumber: /^([1-9]\d{0,}(\.\d{1,2})?)$|^(0(\.\d{1,2})?)$/,
  // 统一信用代码
  CreditCode: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10})$|^([1-9]\d{14})$/,
  // qq号 首位不能是0、必须是 [5, 11] 位的数字
  QQ: /^[1-9][0-9]{4,9}$/,
  required(message, trigger = 'blur') {
    return {
      required: true,
      message,
      trigger
    }
  },
  pattern(pattern, message, trigger = 'blur') {
    return {
      pattern,
      message,
      trigger
    }
  }
}

export default valids
