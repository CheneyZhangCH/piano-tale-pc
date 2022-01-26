import { MessageBox } from 'element-ui'

export const captchaVerify = async(func = () => {}) => {
    return new Promise(async(resolve) => {
        MessageBox.confirm(`<div id="__nc" style="margin-left:auto;margin-right:auto;width:100%;"><div id="nc"></div></div>`, '', {
            showCancelButton: false,
            showConfirmButton: false,
            showClose: false,
            closeOnPressEscape: false,
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true,
        })

        await new Promise((resolve, reject) => {
            setTimeout(resolve, 1 * 1000)
        })
        // __nc挂载之后再初始化验证码逻辑
        setTimeout(() => {
            var nc_token = ['FFFF0N00000000009FA6', (new Date()).getTime(), Math.random()].join(':')
            var nc = NoCaptcha.init({
                renderTo: '#nc',
                appkey: 'FFFF0N00000000009FA6',
                scene: 'nc_login_h5',
                token: nc_token,
                trans: { 'key1': 'code200' },
                elementID: ['usernameID'],
                is_Opt: 0,
                language: 'cn',
                timeout: 10000,
                retryTimes: 5,
                errorTimes: 5,
                inline: false,
                apimap: {
                    // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
                    // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
                },
                bannerHidden: false,
                initHidden: false,
                callback: function(data) {
                    // window.console && console.log(nc_token)
                    // window.console && console.log(data)
                    // window.console && console.log(data.csessionid)
                    // window.console && console.log(data.sig)
                    resolve({ nc_token, data })
                    MessageBox.close()
                },
                error: function(s) {
                }
            })
            NoCaptcha.setEnabled(true)
            nc.reset()// 请务必确保这里调用一次reset()方法

            NoCaptcha.upLang('cn', {
                'LOADING': '加载中...', // 加载
                'SLIDER_LABEL': '请向右滑动验证', // 等待滑动
                'CHECK_Y': '验证通过', // 通过
                'ERROR_TITLE': '非常抱歉，这出错了...', // 拦截
                'CHECK_N': '验证未通过', // 准备唤醒二次验证
                'OVERLAY_INFORM': '经检测你当前操作环境存在风险，请输入验证码', // 二次验证
                'TIPS_TITLE': '验证码错误，请重新输入'// 验证码输错时的提示
            })
        })
    })
}
