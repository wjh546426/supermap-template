let viewer;
/**
 * supermap初始化
 * @param {Element | String} id 指定容纳viewer部件的HTML元素的文档对象模型（DOM）或ID
 */
export const initSuperMap = (container) => {
    window.viewer = viewer = new Cesium.Viewer(container, {
        selectionIndicator: true, //选中元素显示,默认true 
        infoBox: true, //点击要素之后显示的信息,默认true 
        navigation: true, //导航罗盘控件,默认true 
        shadows: false, //确定阴影是否由太阳投射形成,默认false
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源

        // geocoder: false, //地名查找,默认true
        // homeButton: false, //主页按钮,默认true
        // fullscreenButton: true, //全屏按钮,默认显示true

        // baseLayerPicker: 图层选择器,默认为false
        // imageryProvider\terrainProvider: 底图\地形，baseLayerPicker为false时有效
        // imageryProviderViewModels\terrainProviderViewModels: 可选底图组\可选地形组，baseLayerPicker为true时有效	
    })

    /* 覆盖复位按钮的行为 */
    // viewer.homeButton.viewModel.command.beforeExecute.addEventListener((commandInfo) => {
    //     // 飞行到自定义位置
    //     viewer.camera.flyToBoundingSphere(boundingSphere);
    //     // 取消复位按钮执行
    //     commandInfo.cancel = true;
    // });


    /* ------------------------------ 添加图层 ------------------------------ */

    // 使用本地图片初始化地球
    viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
        url: require('@/assets/img/earth.jpg')
    }))
    // 添加天地图作为底图
    viewer.imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
        mapStyle: Cesium.TiandituMapsStyle.CIA_W, //天地图全球中文注记服务
        token: "ff56f3b418cf32aa3c1a8e5261ba3346" //由天地图官网申请的密钥
    }))
    // 添加超图影像图层
    // viewer.imageryLayers.addImageryProvider( new Cesium.SuperMapImageryProvider({
    //     url : TEST_IMG  //影像服务的地址
    // }))

    // 添加地形，使用terrainProvider
    // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    //     url: 'path/to/terrain/data', // 地形数据的路径或URL
    // });

    // 添加S3M图层：对于在SuperMap iServer上发布的S3M服务，可以通过以下两种方式打开。
    // (1).通过open接口将整个场景打开，这种方法简单易操作且不易出现遗漏图层的情况
    const promise = viewer.scene.open("https://maps.zwhldk.com/iserver/services/3D-MangAiHuaTuGou_GW/rest/realspace", "huatuogouyejing");  //url为在SuperMap iServer上发布的服务地址
    Cesium.when(promise, (layers) => {
        console.log(layers);

        const layer = viewer.scene.layers.find('Building@CBD');
        console.log(layer);

        /* --------- 通过设置图层的style3D属性，可以调整图层的位置 --------- */
        // const style = new Cesium.Style3D();
        // style.bottomAltitude = 5;
        // layer.style3D = style;
        // layer.refresh();  //设置后需刷新

        /* -------------------- 设置摄像机目标，角度 -------------------- */
        // viewer.camera.setView({
        //     destination: Cesium.Cartesian3.fromDegrees(106.184356, 37.880, 10000),
        //     orientation: {
        //         heading: Cesium.Math.toRadians(0),
        //         pitch: Cesium.Math.toRadians(-90.0),
        //         roll: Cesium.Math.toRadians(0),
        //     }
        // })

        // 可以使用flyTo作为开场动画
        viewer.camera.flyTo({
            destination: Cartesian3,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: Cesium.Math.toRadians(0),
            },
            duration: 2,  //飞往目的地时间
            maximumHeight: 2000  // 飞行途中的最大高度
        })
    })
    // (2).通过addS3MTilesLayerByScp接口进行添加，该方式的优势是，可以根据自己的需要选择部分图层添加到场景中，提高加载性能，但需要加载多图层的整个场景时，不如scene.open方便。
    // const promise = viewer.scene.addS3MTilesLayerByScp('http://localhost:8090/iserver/services/3D-test/rest/realspace/datas/zj/config',
    //     {
    //         name: "base",
    //         cacheKey: "123456"  //三维缓存密钥，由SuperMap iServer设置和获取
    //     });
    // promise.then(function (layer) {
    //     layer.visible = true;
    // });

    // 添加MVT图层：在SuperMap桌面产品中将地图生成好的矢量瓦片地图通过SuperMap iServer发布成矢量瓦片或三维服务
    // const mvtMap = viewer.scene.addVectorTilesMap({
    //     url: url,  //MVT的服务地址
    //     canvasWidth: 512,
    //     name: 'testMVT',
    //     viewer: viewer
    // });


    /* ------------------------------ 配置项 ------------------------------ */

    // 环境光
    viewer.scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);

    // 显示帧数
    viewer.scene.debugShowFramesPerSecond = true;

    // 去除 Cesium 版权图标
    viewer._cesiumWidget._creditContainer.style.display = "none";

    // 开启地形深度检测
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 禁止相机进入地下
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 是否应预加载渲染图块的祖先。将此设置为 true 可优化缩小体验，并在平移时在新曝光的区域提供更多细节。缺点是需要加载更多的图块。
    // viewer.scene.globe.preloadAncestors = false

    // 泛光效果开关
    // viewer.scene.bloomEffect.show = true

    /* 关闭鼠标操作惯性 */
    /*  let CesiumViewerSceneController = viewer.scene.screenSpaceCameraController;
     // `[0，1)`范围内的参数，用于确定多长时间由于惯性，相机将继续旋转。值为零时，相机将没有惯性.
     CesiumViewerSceneController.inertiaSpin = 0;
     // `[0，1)`范围内的参数，用于确定多长时间由于惯性，相机将继续平移。值为零时，相机将没有惯性。
     CesiumViewerSceneController.inertiaTranslate = 0;
     // `[0，1)`范围内的参数，用于确定多长时间由于惯性，相机将继续变焦。值为零时，相机将没有惯性。
     CesiumViewerSceneController.inertiaZoom = 0; */


}


/**
 * supermap销毁
 */
export const destroySuperMap = () => {
    viewer.destroy();
    viewer = null;
}


/**
 * 移除实体
 * 从场景中移除实体对象或实体列表
 * @param {Entity,EntityList} entities 实体对象或实体列表
 */
export const removeEntity = (entities) => {
    if (entities === undefined || entities === null) return
    if (Array.isArray(entities)) {
        entities.forEach((entity) => {
            viewer.entities.remove(entity);
        });
    } else {
        viewer.entities.remove(entities);
    }
}
