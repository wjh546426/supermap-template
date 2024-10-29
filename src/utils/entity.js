/**
 * 添加标签
 * @param {Cartesian3} position 
 * @param {String} text 
 * @param {String} id 
 * @param {Cartesian2} pixelOffset 
 * @returns 
 */
export const addLabel = (position, text, pixelOffset, scale, id) => {
    return viewer.entities.add({
        id,
        position,
        label: {
            text,
            scale,
            font: '14pt Helvetica Neue',
            pixelOffset,
            showBackground: true,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    })
}

/**
 * 添加广告牌
 * position，image必传
 * 如果需要添加点击事件，则id必传
 * @param {Cartesian3} position 
 * @param {Image,Canvas} image 
 * @param {Number} scale 
 * @param {String} id 
 * @param {Any} attach 
 * @param {Html} description 
 * @returns 
 */
export const addBillboard = (position, image, scale, id, attach, description) => {
    return viewer.entities.add({
        id,
        attach,
        position,
        description,
        billboard: {
            image,
            scale,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    })
}

export const addPolyline = (positions, material, width, id, attach, description) => {
    return viewer.entities.add({
        id,
        attach,
        description,
        polyline: {
            width,
            positions,
            material
        }
    })
}

/**
 * 添加多边形 
 * hierarchy,color必传
 * 如果需要添加点击事件，则id必传
 * 注：轮廓线不生效，可能是没有设置对应面高度（与贴地冲突）
 * @param {PolygonHierarchy} hierarchy 
 * @param {String} color
 * @param {Number} outlineWidth
 * @param {String} id 
 * @param {Any} attach 
 * @param {Html} description 
 * @returns 
 */
export const addPolygon = (hierarchy, color, outlineWidth, id, attach, description) => {
    const colorStr = Cesium.Color.fromCssColorString(color)
    return viewer.entities.add({
        id,
        attach,
        description,
        polygon: {
            hierarchy,
            outline: true,
            outlineWidth,
            outlineColor: colorStr,
            material: colorStr.withAlpha(.2)
        },
    })
}