/**
 * 围绕点旋转
 * 停止：viewer.scene.camera.stopFlyCircle()
 * @param {Cartesian3} center 中心点
 * @param {Number} speed 旋转速度
 */
export const revolveAround = (center, speed = 0.1) => {
    const camera = viewer.scene.camera;
    camera.flyCircleLoop = true; // 相机绕点旋转开启循环模式
    camera.speedRatio = speed //旋转速度
    camera.flyCircle(center); // 相机绕中心点旋转
}

/**
 * 轨迹回放
 * 暂停和播放 entity.clock.shouldAnimate / entity.clock.clockRange来进行
 * 结束播放 viewer.entities.remove(entity);
 * @param {Array} pathData  路径数据的数组，包含位置坐标
 * @param {Image} image 图标
 * @param {number} speed  回放速度（可选，默认为100）
 * @returns entity
 */
export const replayTrace = (pathData, image = require('../assets/logo.png'), speed = 100) => {
    if (!Array.isArray(pathData) || pathData.length < 2) {
        console.error("pathData参数无效,至少需要两个点");
        return;
    }

    const startTime = new Cesium.JulianDate.fromDate(new Date());
    let timeSum = 0;
    const property = new Cesium.SampledPositionProperty();

    for (let index = 0; index < pathData.length; index++) {
        if (index !== 0) {
            const distance = Cesium.Cartesian3.distance(pathData[index - 1], pathData[index]);
            timeSum += distance / speed;
        }
        const time = Cesium.JulianDate.addSeconds(startTime, timeSum, new Cesium.JulianDate());
        const position = pathData[index];
        property.addSample(time, position);
    }

    const stopTime = Cesium.JulianDate.addSeconds(startTime, timeSum, new Cesium.JulianDate());

    viewer.clock.startTime = startTime.clone();
    viewer.clock.currentTime = startTime.clone();
    viewer.clock.stopTime = stopTime.clone();

    const entity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
                start: startTime,
                stop: stopTime
            })
        ]),
        position: property,
        orientation: new Cesium.VelocityOrientationProperty(property),
        billboard: {
            image,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        path: {
            resolution: 1,
            width: 6,
            material: Cesium.Color.RED,
        }
    });

    //设置场景中正在被跟踪的实体
    // viewer.trackedEntity = entity;

    return entity
};

/**
 * 场景出图
 * 导出当前场景图
 */
export const sceneImage = () => {
    const promise = viewer.scene.outputSceneToFile();
    Cesium.when(promise).then((base64data) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").drawImage(image, 0, 0);
            const a = document.createElement("a");
            a.download = `${Date.now()}.jpg`;
            a.href = canvas.toDataURL("image/jpeg");;
            a.dispatchEvent(new MouseEvent("click"));
        };
        image.src = base64data;
    });
};

/* 
export const heatMap = () => {
    const container = document.getElementById('container')
    let dataRaw = [
        {
            "lat": 36.94153135072425,
            "lon": 105.1866465730861,
            "value": 16
        },
        {
            "lat": 37.03112849712429,
            "lon": 104.48405151908189,
            "value": 66
        },
        {
            "lat": 37.41958643099343,
            "lon": 104.54069595137909,
            "value": 20
        },
        {
            "lat": 36.984395230899636,
            "lon": 104.91795972688607,
            "value": 79
        },
        {
            "lat": 37.5125113274837,
            "lon": 104.65736072842851,
            "value": 13
        },
        {
            "lat": 37.482561460199605,
            "lon": 104.63276552175957,
            "value": 67
        },
        {
            "lat": 37.157510688775794,
            "lon": 104.4285355648865,
            "value": 38
        },
        {
            "lat": 37.16363297139205,
            "lon": 105.3357891868508,
            "value": 82
        },
        {
            "lat": 37.16932658511309,
            "lon": 105.30449249770662,
            "value": 36
        },
        {
            "lat": 37.298628252416236,
            "lon": 104.88551111399559,
            "value": 43
        }
    ]
    const lngList = dataRaw.map(i => i.lon)
    const latList = dataRaw.map(i => i.lat)
    let points = []
    // 设置最大值
    let max = 100
    // 设置热力图宽度和高度
    let width = container.getBoundingClientRect().width - (1550 * 2)
    let height = container.getBoundingClientRect().height - 290
    console.log(width, height)
    // let width = 600
    // let height = 400
    // 设置纬度最低点和最高点
    let latMin = Math.min(...latList)
    let latMax = Math.max(...latList)
    // 设置经度最低点和最高点
    let lonMin = Math.min(...lngList)
    let lonMax = Math.max(...lngList)
    // const dataRaw = res.data.data

    // 将每个点的元素（属性？）转换为创建h337对象即热力图实例所需的数据格式
    for (let i = 0; i < dataRaw.length; i++) {
        // 传进原始数据
        let dataItem = dataRaw[i]
        let point = {
            // 将数据点经纬度等比例设置成矩形中的x y坐标 值为原始数据的值
            x: Math.floor((dataItem.lat - latMin) / (latMax - latMin) * width),
            y: Math.floor((dataItem.lon - lonMin) / (lonMax - lonMin) * height),
            value: Math.floor(dataItem.value)
        }
        // 比较设置的最大值和原始数据值大小 取两者间的最大值
        max = Math.max(max, dataItem.value)
        // 将转换好后的数据存入数组
        points.push(point)
    }
    // 创建热力图实例
    let heatMapInstance = h337.create({
        container: document.querySelector('#heatMap')
    })
    // 设置传入实例的数据
    let data = {
        max: max,
        data: points
    }
    // 新建热力图实例并传入设置好的数据
    heatMapInstance.setData(data)
    console.log(latMin, latMax, lonMin, lonMax)
    console.log(points)
    // 设置画布为生成的热力图
    let canvas = document.getElementsByClassName('heatmap-canvas')
    // 控制台输出画布数据
    console.log(canvas)
    // 添加热力图实例
    window.viewer.entities.add({
        name: 'heatmap',
        // 设置矩形
        rectangle: {
            // 指定矩形区域
            coordinates: Cesium.Rectangle.fromDegrees(lonMin, latMin, lonMax, latMax),
            // 设置矩形图片为据透明度的热力图
            material: new Cesium.ImageMaterialProperty({
                image: canvas[0],
                transparent: true
            })
        }
    })
    // 取景器镜头聚焦到热力图实例上
    window.viewer.zoomTo(window.viewer.entities)
} */


