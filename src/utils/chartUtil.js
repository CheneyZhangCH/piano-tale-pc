/*
 * @Author: ge.rongyin
 * @Date: 2020-07-08 10:38:53
 * @LastEditors: ge.rongyin
 * @LastEditTime: 2020-07-10 09:57:56
 * @FilePath: \src\utils\chartUtil.js
 * @Description: 图表方法
 */
import { merge } from 'lodash'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// 默认配置
const defaultOpts = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'none'
        },
        backgroundColor: '#fff',
        borderColor: '#E7EBEE',
        borderWidth: 1,
        textStyle: {
            color: '$theme-font-dark-1'
        }
    },
    grid: {
        top: '10px',
        right: '10px',
        bottom: '30px',
        left: '50px'
    },
    axisPointer: {
        snap: false,
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            color: '$theme-font-dark-1',
            fontSize: 14
        },
        axisLine: {
            lineStyle: {
                color: '#DCDFE6'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: '$theme-font-dark-1',
            fontSize: 14
        },
        axisLine: {
            lineStyle: {
                color: '#DCDFE6'
            }
        },
        splitLine: {
            lineStyle: {
                color: '#F6F6F6'
            }
        }
    },
    series: []
}

const build = (dom, opts = {}, type) => {
    const chart = echarts.init(dom)
    const newOpts = merge({}, defaultOpts, opts)
    chart.setOption(newOpts)
}

export default {
    build
}
