/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce(func, wait, immediate) {
    let timeout

    return function() {
        const that = this
        const args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (callNow) func.apply(that, args)
        } else {
            timeout = setTimeout(function() {
                func.apply(that, args)
            }, wait)
        }
    }
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
export function throttle(func, wait, type) {
    let previous = 0
    let timeout
    return function() {
        const that = this
        const args = arguments
        if (type === 1) {
            const now = Date.now()

            if (now - previous > wait) {
                func.apply(that, args)
                previous = now
            }
        } else if (type === 2) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null
                    func.apply(that, args)
                }, wait)
            }
        }
    }
}

/**
 * @desc 设置页面水印
 * @param str 水印文字
 */
export  function setWatermark(str,targetId){
    const can = document.createElement('canvas')
    can.width = 180
    can.height = 90
    can.back = 90
    const cans = can.getContext('2d')
    // getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性，可用于在画布上绘制文本、线条、矩形、圆形等等。
    cans.rotate(-20 * Math.PI / 180)
    // Math.PI = 3.14 = 180°  1度
    cans.font = '16px Vedana'
    // Verdana是一套无衬线字体
    // cans.fillStyle = 'rgba(242, 242, 242, 0.10)';
    cans.fillStyle = '#eee' // 方便观看的颜色，正常使用删掉
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 20, can.height)
    const div = document.getElementById(targetId)
    div.style.background = '#fff url(' + can.toDataURL('image/png') + ') left top repeat'
}
