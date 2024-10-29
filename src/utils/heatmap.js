import h337 from 'heatmap.js'

class Heatmap {
    /**
     * @param {Array} data 热力值数组
     * @param {Object} option 基础参数
     */
    constructor(data, option) {

        this.viewer = viewer
        this.option = option || {}
        this.data = data || []
        if (!this.data || this.data.length < 2) {
            throw new Error("数据异常")
        }

        // 创建热力图图层
        const cesiumId = viewer.container.id
        const cesiumContainer = document.getElementById(cesiumId);

        const heatmapContainer = document.createElement('div');
        heatmapContainer.id = "heatmap";
        heatmapContainer.style.cssText = "width: 200px; height: 200px; position: absolute; display: none;";

        cesiumContainer.appendChild(heatmapContainer);

        // 使用heatmap.js生成热力图
        this.heatMapInstance = h337.create({
            container: document.querySelector('#heatmap'),
            radius: this.option.radius || 20,
            blur: 0.75,
            minOpacity: 0,
            maxOpacity: 0.7,
            // xField: this.option.xField || 'x',
            // yField: this.option.xField || 'y',
            // valueField: this.option.xField || 'value',
            gradient: this.option.gradient || {
                '.1': 'blue',
                '.5': 'yellow',
                '.7': 'red',
                '.99': 'white'
            }
        });



        this.hierarchy = []
        for (let index = 0; index < this.data.length; index++) {
            let position = Cesium.Cartesian3.fromDegrees(this.data[index].lng, this.data[index].lat);
            this.hierarchy.push(position);
        }

        const bound = this.getBound(this.hierarchy);
        if (!bound) return;
        let points = [];
        let x_axios = Cesium.Cartesian3.subtract(bound.rightTop, bound.leftTop, new Cesium.Cartesian3());
        x_axios = Cesium.Cartesian3.normalize(x_axios, new Cesium.Cartesian3());
        let y_axios = Cesium.Cartesian3.subtract(bound.leftBottom, bound.leftTop, new Cesium.Cartesian3());
        y_axios = Cesium.Cartesian3.normalize(y_axios, new Cesium.Cartesian3());
        const girthX = Cesium.Cartesian3.distance(bound.rightTop, bound.leftTop);
        const girthY = Cesium.Cartesian3.distance(bound.leftBottom, bound.leftTop);
        for (let i = 0; i < this.hierarchy.length; i++) {
            const p1 = this.hierarchy[i];
            const p_origin = Cesium.Cartesian3.subtract(p1, bound.leftTop, new Cesium.Cartesian3());
            const diffX = Cesium.Cartesian3.dot(p_origin, x_axios);
            const diffY = Cesium.Cartesian3.dot(p_origin, y_axios);
            points.push({
                x: Number(diffX / girthX * this.canvasw).toFixed(0),
                y: Number(diffY / girthY * this.canvasw).toFixed(0),
                value: this.data[i].value
            })
        }
        this.heatMapInstance.addData(points);
        // this.heatMapInstance.setData({ max: 100, min: 0, data: this.data })

        this.polygon = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy([
                    bound.leftTop,
                    bound.leftBottom,
                    bound.rightBottom,
                    bound.rightTop
                ]),
                material: this.heatMapInstance.getDataURL(),
                heightReference: 1
            }
        });
        this.viewer.zoomTo(this.polygon)
    }




    // 扩展边界 防止出现热力图被分割
    getBound(positions) {
        let rect = this.toRectangle(positions); // 转为正方形
        let lnglats = this.cartesiansToLnglats(rect, this.viewer);
        let minLat = Number.MAX_VALUE, maxLat = Number.MIN_VALUE, minLng = Number.MAX_VALUE, maxLng = Number.MIN_VALUE;
        const length = rect.length;
        for (let i = 0; i < length; i++) {
            const lnglat = lnglats[i];
            if (lnglat[0] < minLng) {
                minLng = lnglat[0];
            }
            if (lnglat[0] > maxLng) {
                maxLng = lnglat[0];
            }

            if (lnglat[1] < minLat) {
                minLat = lnglat[1];
            }
            if (lnglat[1] > maxLat) {
                maxLat = lnglat[1];
            }
        }

        const diff_lat = maxLat - minLat;
        const diff_lng = maxLng - minLng;

        minLat = minLat - diff_lat / length;
        maxLat = maxLat + diff_lat / length;
        minLng = minLng - diff_lng / length;
        maxLng = maxLng + diff_lng / length;

        return {
            leftTop: Cesium.Cartesian3.fromDegrees(minLng, maxLat),
            leftBottom: Cesium.Cartesian3.fromDegrees(minLng, minLat),
            rightTop: Cesium.Cartesian3.fromDegrees(maxLng, maxLat),
            rightBottom: Cesium.Cartesian3.fromDegrees(maxLng, minLat),
        }
    }

    // 任何图形均转化为正方形
    toRectangle(hierarchy) {
        if (!hierarchy) return;
        let boundingSphere = Cesium.BoundingSphere.fromPoints(hierarchy, new Cesium.BoundingSphere());
        let center = boundingSphere.center;
        const radius = boundingSphere.radius;

        let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center.clone());
        let modelMatrix_inverse = Cesium.Matrix4.inverse(modelMatrix.clone(), new Cesium.Matrix4());
        let roate_y = new Cesium.Cartesian3(0, 1, 0);

        let arr = [];
        for (let i = 45; i <= 360; i += 90) {
            let roateZ_mtx = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(i), new Cesium.Matrix3());
            let yaix_roate = Cesium.Matrix3.multiplyByVector(roateZ_mtx, roate_y, new Cesium.Cartesian3());
            yaix_roate = Cesium.Cartesian3.normalize(yaix_roate, new Cesium.Cartesian3());
            let third = Cesium.Cartesian3.multiplyByScalar(yaix_roate, radius, new Cesium.Cartesian3());
            let poi = Cesium.Matrix4.multiplyByPoint(modelMatrix, third.clone(), new Cesium.Cartesian3());


            arr.push(poi);
        }

        return arr;
    }


    cartesiansToLnglats(cartesians, viewer) {
        if (!cartesians || cartesians.length < 1) return;
        viewer = viewer || window.viewer;
        if (!viewer) {
            console.log('util.cartesiansToLnglats方法缺少viewer对象');
            return;
        }
        var arr = [];
        for (var i = 0; i < cartesians.length; i++) {
            arr.push(this.cartesianToLnglat(cartesians[i], viewer));
        }
        return arr;
    }

    cartesianToLnglat(cartesian, viewer) {
        if (!cartesian) return [];
        viewer = viewer || window.viewer;
        var lnglat = Cesium.Cartographic.fromCartesian(cartesian);
        var lat = Cesium.Math.toDegrees(lnglat.latitude);
        var lng = Cesium.Math.toDegrees(lnglat.longitude);
        var hei = lnglat.height;
        return [lng, lat, hei];
    }

}

export default Heatmap