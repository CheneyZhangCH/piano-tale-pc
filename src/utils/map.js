// const BMAP_STATUS_SUCCESS = 0

const init = (id, options = { enableMapClick: false }) => {
    const map = new BMap.Map(id, options)
    // 添加带有定位的导航控件
    const navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE
    })
    map.addControl(navigationControl)
    // map.enableScrollWheelZoom(true)// 缩放
    return map
}

// 添加标记
const addMarker = ({ map, lng, lat, icon }) => {
    // 创建图标
    const myIcon = new BMap.Icon(icon, new BMap.Size(46, 64), {
        imageSize: new BMap.Size(23, 32)
    })
    const point = new BMap.Point(lng, lat)
    const marker = new BMap.Marker(point, {
        icon: myIcon
    })
    map.addOverlay(marker)
}

const markerPop = (e) => {
    let t
    let n = ''
    n = n += "<div class='map-locate-name'>" + ((t = e.name) == null ? '' : t) + "<i class='arrow'></i></div>"
    return n
}

// 批量添加标记
const addPosLocate = ({ map, point, data }) => {
    const pop = markerPop(data)
    const markerLabel = new BMap.Label(pop, {
        position: point,
        offset: new BMap.Size(-4, -68)
    })
    markerLabel.setStyle({
        border: 0,
        backgroundColor: 'transparent'
    })
    map.addOverlay(markerLabel)
}

const getFeatureIcon = (data) => {
    let t
    let result = ''
    const { itemIcon, itemIndex, title } = data
    result = result += "<i class='map-feature-locate " + ((t = itemIcon) == null ? '' : t) + "' data-label='" + ((t = itemIndex) == null ? '' : t) + "' title='" + ((t = title) == null ? '' : t) + "'></i>"
    return result
}

const addBatchFeatureLocate = ({ map, data, icon, clickFun, mouseoverFun, mouseoutFun }) => {
    map.clearOverlays()
    map.reset()
    data.forEach((item, index) => {
        const { title, point } = item

        addFeatureLocate({
            map,
            icon,
            index,
            title,
            point,
            clickFun,
            mouseoverFun,
            mouseoutFun
        })
    })
}

const addFeatureLocate = ({ map, icon, index, title, point, clickFun, mouseoverFun, mouseoutFun }) => {
    const iconSetting = getFeatureIcon({
        itemIcon: icon,
        itemIndex: index,
        title
    })
    const markerLabel = new BMap.Label(iconSetting, {
        position: point,
        offset: new BMap.Size(-17, -40)
    })
    markerLabel.setStyle({
        border: 0,
        backgroundColor: 'transparent'
    })
    map.addOverlay(markerLabel)

    clickFun && markerLabel.addEventListener('click', function(event) {
        clickFun(event, index)
    })
    mouseoverFun && markerLabel.addEventListener('mouseover', function(event) {
        mouseoverFun(event, index)
    })
    mouseoutFun && markerLabel.addEventListener('mouseout', function(event) {
        mouseoutFun(event, index)
    })
}

const getFeaturePop = (data) => {
    let t
    const { keyword, title, distance, address } = data
    let result = ''
    // <span\n class='icon-distance'></span>
    result += `<div class='itemContent'>
                <span class='icon icon-${((t = keyword) == null ? '' : t)} '></span>
                <span class='itemText itemTitle'>${((t = title) == null ? '' : t)}</span>
                <span class='itemText itemdistance'>${((t = distance) == null ? '' : t + ' 米')}</span>
                </div>\n
                <div class='itemInfo'>${((t = address) == null ? '' : t)}
                </div>`
    return result
}

const showFeaturePop = (map, { title, distance, address, point }, id) => {
    // const bounds = map.getBounds()
    const target = document.querySelector('.feature-selected')
    const popCon = getFeaturePop({
        keyword: id,
        title,
        distance,
        address
    })
    // const aroundMap = document.querySelector('#mapFeature')
    // const mapTop = aroundMap.offsetTop
    // const targetTop = target.offsetTop
    const popWrap = '<div class="makerDetailStyle" data-detail="' + id + '">' + popCon + '<span class="detailArrow"></span></div>'
    target.innerHTML = popWrap
    const popWrapH = document.querySelector('.makerDetailStyle').clientHeight
    // const allTop = mapTop + popWrapH
    const top = -parseInt(popWrapH) - parseInt(target.clientHeight) + 24
    // allTop > targetTop && map.panBy(0, allTop - targetTop)
    document.querySelector('.makerDetailStyle').style.top = top + 'px'

    // bounds.containsPoint(point) !== 1 && map.setViewport([point])
    // map.setZoom(12)

    // map.setCenter(point)
}

// 添加poi搜索
const addSearchCtl = (mapId, searchKey, center, cb) => {
    console.log(mapId)
    const local = new BMap.LocalSearch(mapId)
    local.searchNearby(searchKey, center, 2e3)
    local.setSearchCompleteCallback(function(e) {
        let result = []
        if (local.getStatus() === BMAP_STATUS_SUCCESS) {
            for (let n = 0; n < e.getCurrentNumPois(); n++) {
                result.push(e.getPoi(n))
            }
        }
        result = result.filter(function(e) {
            return e.address !== 'null'
        })
        cb && cb(result)
    })
}

// 获取2点间距离
const getDistance = (targetPoint, currPoint) => {
    const mercatorProjection = new BMap.MercatorProjection()
    const from = mercatorProjection.lngLatToPoint(targetPoint)
    const to = mercatorProjection.lngLatToPoint(currPoint)
    const distance = Math.round(Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2))
    return distance
}

const searchSubway = (lng, lat, distance = 2e3) => {
    return new Promise((resolve) => {
        if (!lng || !lat) {
            resolve(false)
        }

        const point = new BMap.Point(lng, lat)
        const local = new BMap.LocalSearch(point)
        local.searchNearby('地铁站', point, distance)
        local.setSearchCompleteCallback(function(e) {
            let result = []
            if (local.getStatus() === BMAP_STATUS_SUCCESS) {
                for (let n = 0; n < e.getCurrentNumPois(); n++) {
                    result.push(e.getPoi(n))
                }
            }
            result = result.filter(function(e) {
                return e.address !== 'null'
            })
            resolve(result.length > 0)
        })
    })
}

export default {
    init,
    addMarker,
    addPosLocate,
    addSearchCtl,
    getDistance,
    addBatchFeatureLocate,
    addFeatureLocate,
    showFeaturePop,
    searchSubway
}
