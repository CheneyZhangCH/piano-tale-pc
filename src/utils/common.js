import { mapKeys, round } from 'lodash'

/**
 * 清空数组
 * @param {*} Arr
 */
export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

/**
 * 对象转换成key value 编码字符串
 * @export
 * @param {*} json 传入待转换json对象
 * @returns
 */
export function param(json) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

/**
 * 格式化参数
 * @param {String} str 待格式化的字符串
 * @param {*} type 字符串类型（type === 'url' 网址参数）
 */
export function param2Obj(str, type = 'params') {
    if (type === 'url') {
        str = str.split('?')[1]
    }
    if (!str) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(str)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

// 深复制
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = source[keys].constructor === Array ? [] : {}
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * 日期范围
 * disabledDate 不可选范围
 * shortcuts 快捷选中
 */
export const pickerOptions = {
    before: {
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
        }
    },
    after: {
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
        }
    },
    Thursday: {
        firstDayOfWeek: 4,
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
        },
    },
    // 快捷选择
    shortcuts: [
        {
            text: '最近一周',
            onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
            }
        },
        {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
            }
        },
        {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
            }
        }
    ],
    format: 'yyyy-MM-dd',
    valueFormat: 'yyyy-MM-dd 00:00:00',
    valueFormatNew: 'yyyy-MM-dd HH:mm:ss',
    defaultTime: ['00:00:00', '23:59:59']
}

// 格式化枚举
export function getDictLabelByVal(data, val, props = { value: 'value', label: 'label' }) {
    let result = ''
    if (val || val === 0 || val === false) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item[props.value] === val) {
                    result = item[props.label]
                }
            })
        }
    }
    console.log('result-----------', result)
    return result
}

// 格式化枚举
export function getDictValByLabel(data, val) {
    let result = ''
    if (val || val === 0) {
        data.forEach((item) => {
            if (item.label === val) {
                result = item.value
            }
        })
    }
    return result
}

export function createPath(url, params = {}) {
    let urlParams = []
    Object.keys(params).forEach((key) => {
        urlParams.push(`${key}=${encodeURIComponent(params[key])}`)
    })
    if (urlParams.length) {
        urlParams = `${url}?${urlParams.join('&')}`
    } else {
        urlParams = url
    }
    return urlParams
}

/** ----------------- 数字转换金额------------------ ***/
export function numberToAmount(num, n = 2) {
    if (!num && num !== 0) {
        return '-'
    }
    if (!isNaN(num)) {
        num = parseFloat(num).toFixed(n)
    }
    var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g
    return num.replace(re, '$1,')
}

/** -------------------------- 金额转换数字----------------------**/
export function amountToNumber(value) {
    let num = value
    if (!num) {
        return ''
    }
    num = num.toString()
    num = num.replace(/[ ]/g, '')
    num = num.replace(/,/gi, '')
    if (!isNaN(num)) {
        return Number(num)
    }
    return num
}

// 根据身份证号获取性别和年龄
export function getGenderAndAgeByIdCard(idCard) {
    var result = {}
    // 获取性别
    if (parseInt(idCard.substr(16, 1)) % 2 === 1) {
        result.gender = '男'
    } else {
        result.gender = '女'
    }
    // 获取出生年月日
    var year = idCard.substring(6, 10)
    var month = idCard.substring(10, 12)
    var day = idCard.substring(12, 14)
    // 获取当前年月日并计算年龄
    var myDate = new Date()
    var monthNow = myDate.getMonth() + 1
    var dayNow = myDate.getDay()
    var age = myDate.getFullYear() - year
    if (monthNow < month || (monthNow === month && dayNow < day)) {
        age--
    }
    // 得到年龄
    result.age = age
    return result
}

// 预览pdf或图片
export function perviewPdfOrPicture(url) {
    if (!url) return
    if (url.includes('.pdf')) {
        window.open(url)
    } else {
        const newWin = window.open('')
        newWin.document.write('<img src=' + url + ' />')
    }
}

import { JobModel, JobLevelModel } from '@/api/ehr'
// 根据部门id获取岗位
export function queryJobInfoByDeptId(id) {
    return new Promise((resolve, reject) => {
        JobModel.queryJobInfoByDeptId({ deptId: id }).then(res => {
            if (res.ok) {
                const d = res.data
                const jobList = []
                if (d.length > 0) {
                    d.forEach(item => {
                        jobList.push({
                            id: item.id,
                            value: item.jobCode,
                            label: item.jobName
                        })
                    })
                }
                resolve(jobList)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

// 根据岗位id获取职级
export function queryLevelInfoByJobId(id) {
    return new Promise((resolve, reject) => {
        JobLevelModel.queryLevelInfoByJobId({ jobId: id }).then(res => {
            if (res.ok) {
                const d = res.data
                const jobLevelList = []
                if (d.length > 0) {
                    d.forEach(item => {
                        jobLevelList.push({
                            id: item.id,
                            value: item.levelName,
                            label: item.levelName
                        })
                    })
                }
                resolve(jobLevelList)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export function toThousandsNum(value, precision = 2) {
    if (isNaN(value) || value === null || value === undefined) { return '-' }
    return round(Number(value), precision).toFixed(precision).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export const formatDetailAttachments = (list) => {
    if (!Array.isArray(list)) return []
    return list.map(item => ({
        ...item,
        name: item.affixName,
        url: item.affixUrl,
        contentType: item.meta,
    }))
}

export const formatConfirmAttachments = (list, options) => {
    if (!Array.isArray(list)) return []
    return list.map(item => ({
        ...item,
        affixName: item.name,
        affixUrl: item.url,
        meta: item.contentType || item.meta,
        ...options,
    }))
}

export const convertArray2Obj = (list, optLabel, optValue) => {
    if (!Array.isArray(list) || list.length === 0) return []
    const obj = {}
    list.map(item => {
        obj[`${optValue ? item[optValue] : item.value}`] = optLabel ? item[optLabel] : item.label
    })
    return obj
}

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @param {number} [n]
 * @returns {(...args: Tail<Parameters<F>>) => ReturnType<F>}
 */
export const shiftArgs = (fn, n = 1) => {
    if (typeof fn !== 'function') {
        throw new TypeError('fn must be a funtion')
    } else if (!Number.isFinite(n)) {
        throw new RangeError('n must be infinite')
    } else {
        return function(...args) { return fn.apply(this, args.slice(n)) }
    }
}

/**
 * @template T
 * @template {{ [key:string]: string }} M
 * @param {T} obj
 * @param {M} map
 * @returns {Omit<T, keyof M> & { [P in M[keyof M]]: T[P] }}
 */
export const project = (obj, map) => mapKeys(obj, shiftArgs(key => map[key] ?? key))

const regExpSyntaxCharacter = /[\^\$\\\.\*\+\?\(\)\[\]\{\}\|]/g

export const escapeRegExp = literal =>
    String(literal).replace(regExpSyntaxCharacter, $0 => `\\${$0}`)

/**
 * @template {any[]} T
 * @typedef {T extends [any, ...infer P] ? P : never} Tail
 */
