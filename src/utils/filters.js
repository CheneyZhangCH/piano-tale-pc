/**
 * @file Vue 全局过滤器
 *
 * 将过滤器定义在独立的模块中以便在 Vue 之外使用
 */

import Decimal from 'decimal.js'
import moment from 'moment'

export const caclHgl = function(value) {
    if (value === 0) { return 0 }
    if (!value) { return '' }
    return Decimal.mul(value, 100)
}

export const formatPhone = function(value) {
    if (!value) { return '' }
    return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}

export const formaAddress = ({ buildingNo, unitName, roomNo }) => {
    const result = []

    if (buildingNo) {
        result.push(`${buildingNo}栋`)
    }

    if (unitName) {
        result.push(`${unitName}单元`)
    }

    if (roomNo) {
        result.push(`${roomNo}室`)
    }

    return result.length > 0 ? result.join('-') : undefined
}

/**
 * 格式化楼盘名称
 */
export const formatEstateName = data => {
    const result = [data.estateName]

    const address = formaAddress(data)

    if (address) {
        result.push(address)
    }

    return result.join('-')
}

/**
 * 格式化员工
 */
export const formatEmp = (data, ...args) => {
    const [empName, empCode] = args.length === 1 ? [`${args[0]}Name`, `${args[0]}Code`] :
        args.length >= 2 ? args :
        (() => { throw new RangeError() })()

    return [
            data[empName],
            data[empCode],
        ]
        .filter(Boolean)
        .join('') || undefined
}

/**
 * 格式化交易归属
 */
export const formatEmpWithDept = (data, ...args) => {
    const [deptName, empArgs] = args.length === 1 ? [`${args[0]}DeptName`, [`${args[0]}Emp`]] :
        args.length === 2 ? [`${args[0]}Name`, [args[1]]] :
        args.length >= 3 ? [args[0],
            [args[1], args[2]]
        ] :
        (() => { throw new RangeError() })()

    return [
            data[deptName],
            formatEmp(data, ...empArgs),
        ]
        .filter(Boolean)
        .join('-') || undefined
}

/**
 * 格式化身份证
 */
export const formatCertificate = (data, prefix, certificateTypeDict = {}) => {
    const certificateTypeLabel = certificateTypeDict[data[`${prefix}CertificateType`]]
    const certificateNo = data[`${prefix}CertificateNo`]

    if (certificateTypeLabel && certificateNo) {
        return `${certificateTypeLabel}-${certificateNo}`
    }
}

/**
 * 金额千位分隔
 * @param {any} value 金额
 * @param {number} precision 精度
 * @returns {string | undefined} 数值
 */
export const formatThousandsNum = (value, precision = 2) => {
    const num = Number(value)

    return isNaN(num) || num === 0 ? undefined : `${num.toFixed(precision).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}元`
}

/**
 * 格式化时间
 *
 * @param {number} timestamp
 * @param {string} format
 * @returns {string | undefined}
 */
export const formatDateTime = function(timestamp, format = 'YYYY-MM-DD') {
    return !Number.isFinite(timestamp) ? undefined : moment(timestamp).format(format)
}

/**
 * 格式化百分比
 *
 * @param {number} percentage
 * @returns {string | undefined}
 */
export const formatPercentage = function(percentage) {
    return !Number.isFinite(percentage) ? undefined : `${percentage}%`
}


export const wrapFilter = fn => (...args) => function(value) {
    // return fn.call(this, value, ...args) ? ? '-'
    return fn.call(this, value, ...args)
}
