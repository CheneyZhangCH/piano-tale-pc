import md5 from 'md5'

export const setNextRequestParams = (config, client = 'pc') => {
    const arr = 'lkjhgfdsamnbvcxz'
    const timeStr = String(new Date().getTime())
    let _timeStr = ''
    for (let i = 0; i < timeStr.length; i++) { _timeStr += arr[+timeStr[i]] }
    const path = config.url.split('/').filter(Boolean).join('-')
    const nextRequestId = localStorage.getItem(`${path}-n`) ? JSON.parse(localStorage.getItem(`${path}-n`)) : ''
    // console.log('path', path)
    // console.log('timeStr', timeStr)
    // console.log('_timeStr', _timeStr)
    // console.log('nextRequestId', nextRequestId)
    // console.log('nextRequestId.slice(4, 15)', nextRequestId ? nextRequestId.slice(4, 15) : '')
    // console.log('final md5', md5(_timeStr + '_' + (nextRequestId ? nextRequestId.slice(4, 15) : '')))
    config.headers['Query_Type'] = md5('now_the_game_start').slice(7, 23)
    config.headers['Connection-Type'] = _timeStr
    config.headers['Content-Type-R'] = md5(_timeStr + '_' + (nextRequestId ? nextRequestId.slice(4, 15) : ''))
    config.headers['Request-Client-From'] = client
}

export const cacheNextRequestParams = (response) => {
    const contentDecoding = response.headers['content-decoding'] || ''
    const transferDecoding = response.headers['transfer-decoding'] || ''
    const xBackendDev = response.headers['x-backend-dev'] || ''
    if (contentDecoding || transferDecoding || xBackendDev) {
        const _contentDecoding = contentDecoding.split('').reverse()
        const _xBackendDev = xBackendDev.split('')
        let nextRequestId = ''
        _contentDecoding.forEach((item, index) => {
            nextRequestId += item
            nextRequestId += _xBackendDev[index]
        })
        // console.log('nextRequestId', nextRequestId)
        const path = response.config.url.split('/').filter(Boolean).join('-')
        localStorage.setItem(`${path}-n`, JSON.stringify(nextRequestId))
    }
}
