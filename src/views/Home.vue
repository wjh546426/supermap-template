<template>
  <div class="container">
    <div id="cesium"></div>

    <div style="position: absolute;bottom: 40px;z-index: 10;">
      <button @click="drawLabel">标签</button>
      <button @click="drawBillboard">广告牌</button>
      <button @click="drawPolygon">多边形</button>
      <button @click="viewRotation">绕点旋转</button>
      <button @click="trackPlayback">轨迹回放</button>
      <button @click="exportSceneImage">场景出图</button>
      <button @click="initHeatMap">热力图</button>
      <button @click="polymerization">聚合</button>
      <button @click="measureDistance">量算</button>
      <button @click="draw">绘制</button>
    </div>

    <CameraParams></CameraParams>
    <!-- <Dialog ref="dialog"></Dialog> -->
  </div>
</template>

<script>
// @ is an alias to /src

import Vue from 'vue'
import { initSuperMap, destroySuperMap, removeEntity } from "@/utils/supermap.js";
import AlarmPoput from "@/components/AlarmPopup.vue";
import { revolveAround, replayTrace, sceneImage, polymerization } from "../utils/tools"

import CameraParams from "../components/CameraParams.vue";
import { addLabel, addBillboard, addPolygon } from "../utils/entity"
import Heatmap from "../utils/heatmap.js";
// import Dialog from "../components/Dialog";
// import {creatHtmlElement, removeHtmlElement} from "../utils/popup";


export default {
  name: 'Home',
  components: {
    CameraParams
    //   Dialog

  },
  data() {
    return {
      entityList: {},
      position: { x: -2179822.885628574, y: 4379937.498906027, z: 4092122.3540202696 },
      polygonList: [
        [{ "x": -2180120.0068056346, "y": 4379602.885589556, "z": 4092283.8258315776 }, { "x": -2180273.645873152, "y": 4379913.587749449, "z": 4091869.4240597426 }, { "x": -2180880.9160003294, "y": 4379611.322822511, "z": 4091869.3383153696 }, { "x": -2180733.090844394, "y": 4379292.750951053, "z": 4092289.0634193816 }, { "x": -2180120.2878429666, "y": 4379601.50070105, "z": 4092285.158230404 }],
        [{ "x": -2179352.543276668, "y": 4379552.20927324, "z": 4092746.819557798 }, { "x": -2179536.3485262166, "y": 4379878.673929331, "z": 4092299.561101154 }, { "x": -2180725.579455013, "y": 4379275.190917504, "z": 4092311.857617289 }, { "x": -2180671.650699099, "y": 4379171.343545397, "z": 4092451.720711239 }, { "x": -2180391.218414373, "y": 4379293.726878704, "z": 4092470.180603024 }, { "x": -2180313.300171773, "y": 4379326.054626642, "z": 4092477.099628826 }, { "x": -2180219.3872964378, "y": 4379357.726480757, "z": 4092493.239747826 }, { "x": -2180033.1041877368, "y": 4379417.425625418, "z": 4092528.5909139677 }, { "x": -2179839.977689291, "y": 4379461.1358892685, "z": 4092584.6871537077 }, { "x": -2179354.050821916, "y": 4379550.74084117, "z": 4092747.5881365063 }],
        [{ "x": -2180101.57374521, "y": 4380036.257253721, "z": 4091829.799001567 }, { "x": -2180482.903136233, "y": 4379849.349114089, "z": 4091826.6799638434 }, { "x": -2180573.3723985204, "y": 4380031.0912841065, "z": 4091583.9228322026 }, { "x": -2180201.3854716853, "y": 4380234.919627265, "z": 4091563.950172778 }, { "x": -2180102.96939113, "y": 4380039.060564615, "z": 4091826.054640426 }],
        [{ "x": -2179547.0598235624, "y": 4379891.371281318, "z": 4092280.2666070303 }, { "x": -2179629.853623616, "y": 4380070.442055262, "z": 4092044.5029922486 }, { "x": -2179694.1585598425, "y": 4380108.7912197765, "z": 4091969.201119911 }, { "x": -2179727.5413844725, "y": 4380174.500720183, "z": 4091881.0807771715 }, { "x": -2179966.5628885385, "y": 4380057.351576138, "z": 4091879.1492759115 }, { "x": -2180020.6988639925, "y": 4380042.209529218, "z": 4091866.516134473 }, { "x": -2180249.5038759015, "y": 4379924.256600998, "z": 4091870.867700847 }, { "x": -2180095.2679471215, "y": 4379614.497186057, "z": 4092284.5782578806 }, { "x": -2179545.298239481, "y": 4379894.776338541, "z": 4092277.5604481352 }]
      ],
    }
  },
  mounted() {
    initSuperMap('cesium')

    // 创建 AlarmPoput 的构造函数
    const PopupConstructor = Vue.extend(AlarmPoput);

    // 使用构造函数创建实例
    this.alarmPopupInstance = new PopupConstructor();

    // 挂载实例但不添加到 DOM 中
    this.alarmPopupInstance.$mount();

    const popup1 = new Popup({
      viewer: viewer,
      element: this.alarmPopupInstance.$el,
      show: false,
      position: null,
      hideOnBehindGlobe: true,
      pixelOffset: new Cesium.Cartesian2(0, 0),
      scaleByDistance: new Cesium.NearFarScalar(1000, 1, 10000, 0.2),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 11000),
    });

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(event => {

      /* ------- 获取实体/实体列表 ------- */
      const picked = viewer.scene.pick(event.position); //返回所提供窗口坐标处的 最顶层 实体
      // const pickList = viewer.scene.drillPick(event.position); //返回所提供的窗口坐标处的实体列表

      /* ------- 获取坐标 ------- */
      const position = viewer.scene.pickPosition(event.position)
      // const ray = viewer.camera.getPickRay(event.position)
      // const position = viewer.scene.globe.pick(ray, viewer.scene)

      /* ------- 气泡窗 ------- */
      if (Cesium.defined(picked) && picked.id.name === 'billboard') {

        const attach = picked.id.attach;

        this.$nextTick(() => { // 确保更新 DOM 后再执行

          this.alarmPopupInstance.setData(attach);

          popup1.setPosition(position)

          // 添加自定义事件close,用于关闭弹窗
          this.alarmPopupInstance.$on('close', () => {
            popup1.close();
          });

        });

      }


      //将笛卡尔坐标转化为经纬度坐标
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      console.log(longitude, latitude, height);

      //创建弹出框信息
      const entity = new Cesium.Entity({
        name: "位置信息",
        description: createDescription(Cesium, [longitude, latitude, height.toFixed(4)])
      });
      viewer.selectedEntity = entity;

      function createDescription(Cesium, properties) {
        var simpleStyleIdentifiers = ['经度', '纬度', '高度'];
        var html = '';
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            if (simpleStyleIdentifiers.indexOf(key) !== -1) {
              continue;
            }
            var value = properties[key];
            if (Cesium.defined(value) && value !== '') {
              html += '<tr><td>' + simpleStyleIdentifiers[key] + '</td><td>' + value + '</td></tr>';
            }
          }
        }
        if (html.length > 0) {
          html = '<table class="zebra"><tbody>' + html + '</tbody></table>';
        }
        return html;
      }





    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


  },

  beforeDestroy() {
    destroySuperMap()
  },

  methods: {
    drawLabel() {
      if (this.entityList.label) {
        removeEntity(this.entityList.label)
        this.entityList.label = null
        viewer.camera.flyHome()
      } else {
        // const entity = addLabel(this.position, '摄像头', new Cesium.Cartesian2(0, 30), 0.7, null)
        const entity = viewer.entities.add({
          name: '摄像头',
          position: this.position,
          label: {
            text: '摄像头',
            font: "14px Microsoft YaHei, Arial, Helvetica, sans-serif, 宋体",
            fillColor: Cesium.Color.WHITE,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString("rgba(217,153,43,.6)"),
            backgroundPadding: new Cesium.Cartesian2(4, 4),
            pixelOffset: new Cesium.Cartesian2(0, 30),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY

          },
        })

        viewer.flyTo(entity)
        this.entityList.label = entity
      }
    },

    drawBillboard() {
      if (this.entityList.billboard) {
        removeEntity(this.entityList.billboard)
        this.entityList.billboard = null
        viewer.camera.flyHome()
      } else {
        const image = require('../assets/icon/video.png')
        const entity = viewer.entities.add({
          name: 'billboard',
          attach: '',
          position: this.position,
          description: null,
          billboard: {
            image: image,
            scale: 0.5,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
        viewer.flyTo(entity)
        this.entityList.billboard = entity
      }
    },

    drawPolygon() {
      if (this.entityList.polygon?.length) {
        removeEntity(this.entityList.polygon)
        this.entityList.polygon.length = 0
        viewer.camera.flyHome()
      } else {
        let entityList = []
        const colors = ['#fa6400', '#2265ff', '#8361ff', '#62be00']
        this.polygonList.forEach((item, index) => {
          const entity = addPolygon(item, colors[index], 3)
          entityList.push(entity)
        })
        viewer.flyTo(entityList)
        this.entityList.polygon = entityList
      }
    },

    viewRotation() {
      if (!this.entityList.around) {
        revolveAround(this.position, 0.3)
        this.entityList.around = true
      } else {
        viewer.scene.camera.stopFlyCircle()
        this.entityList.around = false
      }
    },

    trackPlayback() {
      if (this.entityList.track) {
        removeEntity(this.entityList.track)
        this.entityList.track = null
      } else {
        const entity = replayTrace(this.polygonList[1], require('@/assets/icon/point.png'))
        this.entityList.track = entity
      }
    },

    exportSceneImage() {
      sceneImage();
    },

    initHeatMap() {
      const heatmapData = [{
        "lng": 116.191031,
        "lat": 39.988585,
        "value": 10
      }, {
        "lng": 116.389275,
        "lat": 39.925818,
        "value": 11
      }, {
        "lng": 116.287444,
        "lat": 39.810742,
        "value": 12
      }, {
        "lng": 116.481707,
        "lat": 39.940089,
        "value": 13
      }, {
        "lng": 116.410588,
        "lat": 39.880172,
        "value": 14
      }, {
        "lng": 116.394816,
        "lat": 39.91181,
        "value": 15
      }, {
        "lng": 116.416002,
        "lat": 39.952917,
        "value": 16
      }, {
        "lng": 116.39671,
        "lat": 39.924903,
        "value": 17
      }, {
        "lng": 116.180816,
        "lat": 39.957553,
        "value": 18
      }, {
        "lng": 116.382035,
        "lat": 39.874114,
        "value": 19
      }, {
        "lng": 116.316648,
        "lat": 39.914529,
        "value": 20
      }, {
        "lng": 116.395803,
        "lat": 39.908556,
        "value": 21
      }, {
        "lng": 116.74553,
        "lat": 39.875916,
        "value": 22
      }, {
        "lng": 116.352289,
        "lat": 39.916475,
        "value": 23
      }, {
        "lng": 116.441548,
        "lat": 39.878262,
        "value": 24
      }, {
        "lng": 116.318947,
        "lat": 39.942735,
        "value": 25
      }, {
        "lng": 116.382585,
        "lat": 39.941949,
        "value": 26
      }, {
        "lng": 116.42042,
        "lat": 39.884017,
        "value": 27
      }, {
        "lng": 116.31744,
        "lat": 39.892561,
        "value": 28
      }, {
        "lng": 116.407059,
        "lat": 39.912438,
        "value": 29
      }, {
        "lng": 116.412351,
        "lat": 39.888082,
        "value": 30
      }, {
        "lng": 116.444341,
        "lat": 39.915891,
        "value": 31
      }, {
        "lng": 116.335385,
        "lat": 39.741756,
        "value": 32
      }, {
        "lng": 116.3926,
        "lat": 40.008733,
        "value": 33
      }, {
        "lng": 116.389731,
        "lat": 39.92292,
        "value": 34
      }, {
        "lng": 116.413371,
        "lat": 39.874483,
        "value": 35
      }, {
        "lng": 116.199752,
        "lat": 39.911717,
        "value": 36
      }, {
        "lng": 116.278472,
        "lat": 40.254994,
        "value": 37
      }, {
        "lng": 116.464252,
        "lat": 39.925828,
        "value": 38
      }, {
        "lng": 116.479475,
        "lat": 39.937945,
        "value": 39
      }, {
        "lng": 116.415599,
        "lat": 39.956902,
        "value": 40
      }, {
        "lng": 116.355675,
        "lat": 39.870089,
        "value": 41
      }, {
        "lng": 116.295267,
        "lat": 39.987171,
        "value": 42
      }, {
        "lng": 116.323634,
        "lat": 39.911692,
        "value": 43
      }, {
        "lng": 116.692769,
        "lat": 40.173307,
        "value": 44
      }, {
        "lng": 116.287888,
        "lat": 39.928531,
        "value": 45
      }, {
        "lng": 116.386502,
        "lat": 39.922747,
        "value": 46
      }, {
        "lng": 116.236773,
        "lat": 40.218341,
        "value": 47
      }, {
        "lng": 116.490636,
        "lat": 39.804253,
        "value": 48
      }, {
        "lng": 116.391095,
        "lat": 39.925791,
        "value": 49
      }, {
        "lng": 116.472402,
        "lat": 39.769178,
        "value": 50
      }, {
        "lng": 116.38657,
        "lat": 39.956731,
        "value": 51
      }, {
        "lng": 116.427536,
        "lat": 39.943671,
        "value": 52
      }, {
        "lng": 116.374547,
        "lat": 39.967588,
        "value": 53
      }, {
        "lng": 116.380383,
        "lat": 39.871634,
        "value": 54
      }, {
        "lng": 116.376092,
        "lat": 39.965485,
        "value": 55
      }, {
        "lng": 116.352424,
        "lat": 39.91811,
        "value": 56
      }, {
        "lng": 116.020157,
        "lat": 40.348526,
        "value": 57
      }, {
        "lng": 116.416201,
        "lat": 39.951736,
        "value": 58
      }, {
        "lng": 116.405392,
        "lat": 39.908738,
        "value": 59
      }, {
        "lng": 116.49238,
        "lat": 39.926248,
        "value": 60
      }, {
        "lng": 116.389282,
        "lat": 39.988391,
        "value": 61
      }, {
        "lng": 116.396683,
        "lat": 39.923487,
        "value": 62
      }, {
        "lng": 116.41718,
        "lat": 39.905213,
        "value": 63
      }, {
        "lng": 116.321512,
        "lat": 39.913192,
        "value": 64
      }, {
        "lng": 116.260028,
        "lat": 40.03353,
        "value": 65
      }, {
        "lng": 116.394846,
        "lat": 39.911168,
        "value": 66
      }, {
        "lng": 116.374767,
        "lat": 39.96608,
        "value": 67
      }, {
        "lng": 116.6841,
        "lat": 39.909762,
        "value": 68
      }, {
        "lng": 116.3838,
        "lat": 39.95811,
        "value": 69
      }, {
        "lng": 116.39243,
        "lat": 40.01143,
        "value": 70
      }, {
        "lng": 116.661912,
        "lat": 40.121137,
        "value": 71
      }, {
        "lng": 116.333056,
        "lat": 39.90123,
        "value": 72
      }, {
        "lng": 116.484839,
        "lat": 39.881729,
        "value": 73
      }, {
        "lng": 116.360923,
        "lat": 39.935745,
        "value": 74
      }, {
        "lng": 116.408531,
        "lat": 39.953194,
        "value": 75
      }, {
        "lng": 116.417916,
        "lat": 39.954029,
        "value": 76
      }, {
        "lng": 116.412215,
        "lat": 39.992282,
        "value": 77
      }, {
        "lng": 116.181532,
        "lat": 40.048762,
        "value": 78
      }, {
        "lng": 116.434848,
        "lat": 40.070463,
        "value": 79
      }, {
        "lng": 116.385039,
        "lat": 39.956937,
        "value": 80
      }, {
        "lng": 116.755067,
        "lat": 39.854499,
        "value": 81
      }, {
        "lng": 116.396061,
        "lat": 39.912841,
        "value": 82
      }, {
        "lng": 116.474303,
        "lat": 39.971398,
        "value": 83
      }, {
        "lng": 116.376262,
        "lat": 39.85811,
        "value": 84
      }, {
        "lng": 116.403783,
        "lat": 39.954469,
        "value": 85
      }, {
        "lng": 116.339136,
        "lat": 39.729159,
        "value": 86
      }, {
        "lng": 116.240159,
        "lat": 39.947003,
        "value": 87
      }, {
        "lng": 117.107541,
        "lat": 40.141457,
        "value": 88
      }, {
        "lng": 116.341813,
        "lat": 40.078786,
        "value": 89
      }, {
        "lng": 116.320648,
        "lat": 39.706455,
        "value": 90
      }, {
        "lng": 116.402566,
        "lat": 39.960873,
        "value": 91
      }, {
        "lng": 116.849261,
        "lat": 40.402999,
        "value": 92
      }, {
        "lng": 116.521064,
        "lat": 39.834187,
        "value": 93
      }, {
        "lng": 116.329942,
        "lat": 39.925327,
        "value": 94
      }, {
        "lng": 116.479852,
        "lat": 39.974856,
        "value": 95
      }, {
        "lng": 116.399185,
        "lat": 39.925736,
        "value": 96
      }, {
        "lng": 116.193166,
        "lat": 39.911953,
        "value": 1
      }, {
        "lng": 116.400916,
        "lat": 39.870614,
        "value": 2
      }, {
        "lng": 116.518041,
        "lat": 39.956615,
        "value": 3
      }, {
        "lng": 116.388981,
        "lat": 39.997716,
        "value": 4
      }, {
        "lng": 116.285852,
        "lat": 39.863497,
        "value": 5
      }, {
        "lng": 116.294167,
        "lat": 39.884599,
        "value": 6
      }, {
        "lng": 116.394235,
        "lat": 39.996845,
        "value": 7
      }, {
        "lng": 116.32471,
        "lat": 39.970486,
        "value": 8
      }, {
        "lng": 116.496828,
        "lat": 39.99335,
        "value": 9
      }, {
        "lng": 116.482534,
        "lat": 39.934086,
        "value": 10
      }, {
        "lng": 116.454662,
        "lat": 39.974981,
        "value": 11
      }, {
        "lng": 116.387076,
        "lat": 39.87631,
        "value": 12
      }, {
        "lng": 116.433341,
        "lat": 39.92803,
        "value": 13
      }, {
        "lng": 116.382196,
        "lat": 39.941606,
        "value": 14
      }, {
        "lng": 116.244286,
        "lat": 39.82905,
        "value": 15
      }, {
        "lng": 116.566672,
        "lat": 40.176097,
        "value": 16
      }, {
        "lng": 116.686862,
        "lat": 39.908507,
        "value": 17
      }, {
        "lng": 117.240166,
        "lat": 40.175796,
        "value": 18
      }, {
        "lng": 116.428661,
        "lat": 39.866958,
        "value": 19
      }, {
        "lng": 116.443292,
        "lat": 39.917447,
        "value": 20
      }, {
        "lng": 116.356538,
        "lat": 39.926711,
        "value": 21
      }, {
        "lng": 116.194086,
        "lat": 39.912242,
        "value": 22
      }, {
        "lng": 116.379861,
        "lat": 39.971831,
        "value": 23
      }, {
        "lng": 116.377966,
        "lat": 39.874647,
        "value": 24
      }, {
        "lng": 116.466778,
        "lat": 39.926304,
        "value": 25
      }, {
        "lng": 116.692078,
        "lat": 40.170197,
        "value": 26
      }, {
        "lng": 116.428651,
        "lat": 39.94275,
        "value": 27
      }, {
        "lng": 116.322655,
        "lat": 39.939517,
        "value": 28
      }, {
        "lng": 116.445601,
        "lat": 39.98439,
        "value": 29
      }, {
        "lng": 116.662833,
        "lat": 39.912238,
        "value": 30
      }, {
        "lng": 116.394183,
        "lat": 39.925557,
        "value": 31
      }, {
        "lng": 116.312788,
        "lat": 39.860017,
        "value": 32
      }, {
        "lng": 116.104708,
        "lat": 40.065563,
        "value": 33
      }, {
        "lng": 116.204443,
        "lat": 39.938295,
        "value": 34
      }, {
        "lng": 116.310917,
        "lat": 39.89381,
        "value": 35
      }, {
        "lng": 116.265851,
        "lat": 39.834247,
        "value": 36
      }, {
        "lng": 116.33501,
        "lat": 39.742507,
        "value": 37
      }, {
        "lng": 116.397519,
        "lat": 39.99794,
        "value": 38
      }, {
        "lng": 116.441252,
        "lat": 39.915566,
        "value": 39
      }, {
        "lng": 116.441898,
        "lat": 39.856454,
        "value": 40
      }, {
        "lng": 116.446552,
        "lat": 39.946418,
        "value": 41
      }, {
        "lng": 116.359761,
        "lat": 39.895327,
        "value": 42
      }, {
        "lng": 116.349168,
        "lat": 39.893551,
        "value": 43
      }, {
        "lng": 116.476819,
        "lat": 39.94388,
        "value": 44
      }, {
        "lng": 116.29912,
        "lat": 39.988433,
        "value": 45
      }, {
        "lng": 116.467912,
        "lat": 39.770524,
        "value": 46
      }, {
        "lng": 116.382134,
        "lat": 39.862204,
        "value": 47
      }, {
        "lng": 116.483378,
        "lat": 39.93431,
        "value": 48
      }, {
        "lng": 116.35395,
        "lat": 39.910738,
        "value": 49
      }, {
        "lng": 116.398771,
        "lat": 39.976433,
        "value": 50
      }, {
        "lng": 116.462189,
        "lat": 39.925864,
        "value": 51
      }, {
        "lng": 116.378957,
        "lat": 39.806676,
        "value": 52
      }, {
        "lng": 116.334199,
        "lat": 39.900985,
        "value": 53
      }, {
        "lng": 116.443961,
        "lat": 39.913511,
        "value": 54
      }, {
        "lng": 116.388829,
        "lat": 39.95053,
        "value": 55
      }, {
        "lng": 116.319655,
        "lat": 39.892339,
        "value": 56
      }, {
        "lng": 117.431959,
        "lat": 40.630521,
        "value": 57
      }, {
        "lng": 117.108914,
        "lat": 40.140406,
        "value": 58
      }, {
        "lng": 116.43019,
        "lat": 39.880486,
        "value": 59
      }, {
        "lng": 116.250698,
        "lat": 39.907186,
        "value": 60
      }, {
        "lng": 116.341065,
        "lat": 39.766082,
        "value": 61
      }, {
        "lng": 116.290335,
        "lat": 39.812431,
        "value": 62
      }, {
        "lng": 116.360813,
        "lat": 39.936362,
        "value": 63
      }, {
        "lng": 116.400282,
        "lat": 39.995027,
        "value": 64
      }, {
        "lng": 116.317257,
        "lat": 39.889092,
        "value": 65
      }, {
        "lng": 116.482537,
        "lat": 39.954978,
        "value": 66
      }, {
        "lng": 116.38496,
        "lat": 39.954428,
        "value": 67
      }, {
        "lng": 116.391803,
        "lat": 39.911587,
        "value": 68
      }, {
        "lng": 116.4266,
        "lat": 39.867228,
        "value": 69
      }, {
        "lng": 116.145997,
        "lat": 39.790856,
        "value": 70
      }, {
        "lng": 116.430265,
        "lat": 39.867451,
        "value": 71
      }, {
        "lng": 116.315479,
        "lat": 39.940668,
        "value": 72
      }, {
        "lng": 116.359393,
        "lat": 39.975431,
        "value": 73
      }, {
        "lng": 116.382347,
        "lat": 39.968935,
        "value": 74
      }, {
        "lng": 115.987169,
        "lat": 40.454625,
        "value": 75
      }, {
        "lng": 116.489292,
        "lat": 39.931242,
        "value": 76
      }, {
        "lng": 116.368238,
        "lat": 39.879807,
        "value": 77
      }, {
        "lng": 116.493761,
        "lat": 39.923885,
        "value": 78
      }, {
        "lng": 116.53666,
        "lat": 39.8778,
        "value": 79
      }, {
        "lng": 116.501743,
        "lat": 39.79602,
        "value": 80
      }, {
        "lng": 116.582818,
        "lat": 39.932646,
        "value": 81
      }, {
        "lng": 116.417364,
        "lat": 39.869292,
        "value": 82
      }, {
        "lng": 116.354305,
        "lat": 39.872022,
        "value": 83
      }, {
        "lng": 116.375162,
        "lat": 40.01344,
        "value": 84
      }, {
        "lng": 116.400523,
        "lat": 39.881031,
        "value": 85
      }, {
        "lng": 116.315365,
        "lat": 39.945005,
        "value": 86
      }, {
        "lng": 116.44088,
        "lat": 39.810753,
        "value": 87
      }, {
        "lng": 116.679285,
        "lat": 39.916527,
        "value": 88
      }, {
        "lng": 116.483694,
        "lat": 39.946929,
        "value": 89
      }, {
        "lng": 116.341678,
        "lat": 40.080021,
        "value": 90
      }, {
        "lng": 116.017167,
        "lat": 39.889175,
        "value": 91
      }, {
        "lng": 116.454692,
        "lat": 39.954167,
        "value": 92
      }, {
        "lng": 116.410129,
        "lat": 40.050952,
        "value": 93
      }, {
        "lng": 116.418556,
        "lat": 39.872365,
        "value": 94
      }, {
        "lng": 116.25432,
        "lat": 40.142367,
        "value": 95
      }, {
        "lng": 116.658763,
        "lat": 39.891072,
        "value": 96
      }, {
        "lng": 116.305312,
        "lat": 39.9953,
        "value": 97
      }, {
        "lng": 116.388761,
        "lat": 39.951259,
        "value": 98
      }, {
        "lng": 116.68017,
        "lat": 39.873413,
        "value": 99
      }, {
        "lng": 116.090539,
        "lat": 39.796301,
        "value": 1
      }, {
        "lng": 116.380305,
        "lat": 39.78354,
        "value": 2
      }, {
        "lng": 116.348831,
        "lat": 40.022543,
        "value": 3
      }, {
        "lng": 116.438133,
        "lat": 39.960988,
        "value": 4
      }, {
        "lng": 116.199587,
        "lat": 39.911,
        "value": 5
      }, {
        "lng": 116.081743,
        "lat": 39.788321,
        "value": 6
      }, {
        "lng": 117.24044,
        "lat": 40.1752,
        "value": 7
      }, {
        "lng": 116.636141,
        "lat": 40.327724,
        "value": 8
      }, {
        "lng": 116.453166,
        "lat": 39.973511,
        "value": 9
      }, {
        "lng": 116.583381,
        "lat": 39.953315,
        "value": 10
      }, {
        "lng": 116.236326,
        "lat": 39.90595,
        "value": 11
      }, {
        "lng": 116.328305,
        "lat": 39.781647,
        "value": 12
      }, {
        "lng": 116.260012,
        "lat": 39.984951,
        "value": 13
      }, {
        "lng": 116.254938,
        "lat": 39.916206,
        "value": 14
      }, {
        "lng": 116.85469,
        "lat": 40.474419,
        "value": 15
      }, {
        "lng": 116.309389,
        "lat": 39.971918,
        "value": 16
      }, {
        "lng": 116.310732,
        "lat": 39.971517,
        "value": 17
      }, {
        "lng": 116.401885,
        "lat": 39.847641,
        "value": 18
      }, {
        "lng": 116.427771,
        "lat": 39.880572,
        "value": 19
      }, {
        "lng": 116.430537,
        "lat": 39.880968,
        "value": 20
      }, {
        "lng": 116.550673,
        "lat": 39.895212,
        "value": 21
      }, {
        "lng": 116.345906,
        "lat": 39.815152,
        "value": 22
      }, {
        "lng": 116.512016,
        "lat": 39.868573,
        "value": 23
      }, {
        "lng": 115.894604,
        "lat": 39.803644,
        "value": 24
      }, {
        "lng": 116.32497,
        "lat": 40.083198,
        "value": 25
      }, {
        "lng": 116.315523,
        "lat": 39.858242,
        "value": 26
      }, {
        "lng": 116.465052,
        "lat": 39.903055,
        "value": 27
      }, {
        "lng": 116.464814,
        "lat": 39.924176,
        "value": 28
      }, {
        "lng": 115.959538,
        "lat": 39.727218,
        "value": 29
      }, {
        "lng": 116.478895,
        "lat": 39.954472,
        "value": 30
      }, {
        "lng": 116.337546,
        "lat": 39.741337,
        "value": 31
      }, {
        "lng": 116.504757,
        "lat": 39.83778,
        "value": 32
      }, {
        "lng": 116.393143,
        "lat": 40.02725,
        "value": 33
      }, {
        "lng": 116.23419,
        "lat": 40.217361,
        "value": 34
      }, {
        "lng": 116.368688,
        "lat": 39.829561,
        "value": 35
      }, {
        "lng": 116.460134,
        "lat": 39.983721,
        "value": 36
      }, {
        "lng": 116.381539,
        "lat": 39.746766,
        "value": 37
      }, {
        "lng": 116.291759,
        "lat": 39.983886,
        "value": 38
      }, {
        "lng": 116.377613,
        "lat": 39.817895,
        "value": 39
      }, {
        "lng": 116.306646,
        "lat": 39.956296,
        "value": 40
      }, {
        "lng": 116.160747,
        "lat": 39.818863,
        "value": 41
      }, {
        "lng": 116.392912,
        "lat": 40.001989,
        "value": 42
      }, {
        "lng": 116.199115,
        "lat": 39.91276,
        "value": 43
      }, {
        "lng": 116.434577,
        "lat": 39.812232,
        "value": 44
      }, {
        "lng": 116.495843,
        "lat": 39.925538,
        "value": 45
      }, {
        "lng": 116.333803,
        "lat": 39.913224,
        "value": 46
      }, {
        "lng": 116.489277,
        "lat": 39.941842,
        "value": 47
      }, {
        "lng": 116.510514,
        "lat": 39.973547,
        "value": 48
      }, {
        "lng": 116.474685,
        "lat": 39.936648,
        "value": 49
      }, {
        "lng": 116.418054,
        "lat": 39.905091,
        "value": 50
      }, {
        "lng": 116.285529,
        "lat": 39.926274,
        "value": 51
      }, {
        "lng": 116.289399,
        "lat": 39.948054,
        "value": 52
      }, {
        "lng": 116.508241,
        "lat": 39.920234,
        "value": 53
      }, {
        "lng": 116.317979,
        "lat": 40.000721,
        "value": 54
      }, {
        "lng": 116.428324,
        "lat": 39.868263,
        "value": 55
      }, {
        "lng": 116.407517,
        "lat": 40.016715,
        "value": 56
      }, {
        "lng": 116.338841,
        "lat": 39.969646,
        "value": 57
      }, {
        "lng": 116.495703,
        "lat": 39.992607,
        "value": 58
      }, {
        "lng": 116.369659,
        "lat": 39.97595,
        "value": 59
      }, {
        "lng": 116.291709,
        "lat": 39.96228,
        "value": 60
      }, {
        "lng": 116.311003,
        "lat": 39.998264,
        "value": 61
      }, {
        "lng": 116.391429,
        "lat": 39.93324,
        "value": 62
      }, {
        "lng": 116.406033,
        "lat": 39.95407,
        "value": 63
      }, {
        "lng": 116.391856,
        "lat": 39.912004,
        "value": 64
      }, {
        "lng": 116.356434,
        "lat": 39.871474,
        "value": 65
      }, {
        "lng": 116.477081,
        "lat": 39.970334,
        "value": 66
      }, {
        "lng": 116.475337,
        "lat": 39.939749,
        "value": 67
      }, {
        "lng": 116.752911,
        "lat": 39.916369,
        "value": 68
      }, {
        "lng": 116.470361,
        "lat": 39.874606,
        "value": 69
      }, {
        "lng": 116.489172,
        "lat": 39.949033,
        "value": 70
      }, {
        "lng": 116.502514,
        "lat": 39.973734,
        "value": 71
      }, {
        "lng": 116.186985,
        "lat": 39.920185,
        "value": 72
      }, {
        "lng": 116.583743,
        "lat": 39.95335,
        "value": 73
      }, {
        "lng": 116.119183,
        "lat": 39.732055,
        "value": 74
      }, {
        "lng": 116.391902,
        "lat": 39.93331,
        "value": 75
      }, {
        "lng": 116.488588,
        "lat": 39.953371,
        "value": 76
      }, {
        "lng": 116.381798,
        "lat": 39.975717,
        "value": 77
      }, {
        "lng": 116.384689,
        "lat": 39.827773,
        "value": 78
      }, {
        "lng": 116.445287,
        "lat": 39.894354,
        "value": 79
      }, {
        "lng": 116.24048,
        "lat": 39.947687,
        "value": 80
      }, {
        "lng": 116.413605,
        "lat": 40.04902,
        "value": 81
      }, {
        "lng": 116.239012,
        "lat": 39.904288,
        "value": 82
      }, {
        "lng": 116.408522,
        "lat": 40.016971,
        "value": 83
      }, {
        "lng": 116.475833,
        "lat": 39.947107,
        "value": 84
      }, {
        "lng": 116.43476,
        "lat": 39.901671,
        "value": 85
      }, {
        "lng": 116.40229,
        "lat": 39.869205,
        "value": 86
      }, {
        "lng": 116.226013,
        "lat": 40.213485,
        "value": 87
      }, {
        "lng": 116.689042,
        "lat": 39.889192,
        "value": 88
      }, {
        "lng": 116.377252,
        "lat": 39.873622,
        "value": 89
      }, {
        "lng": 116.53061,
        "lat": 40.103146,
        "value": 90
      }, {
        "lng": 116.416271,
        "lat": 39.905187,
        "value": 91
      }, {
        "lng": 116.531169,
        "lat": 39.91276,
        "value": 92
      }, {
        "lng": 116.17849,
        "lat": 40.075692,
        "value": 93
      }, {
        "lng": 116.188616,
        "lat": 40.102413,
        "value": 94
      }, {
        "lng": 116.531799,
        "lat": 39.84939,
        "value": 95
      }, {
        "lng": 116.443707,
        "lat": 39.87558,
        "value": 96
      }, {
        "lng": 116.814298,
        "lat": 40.53416,
        "value": 97
      }, {
        "lng": 116.428247,
        "lat": 39.873118,
        "value": 98
      }, {
        "lng": 116.290774,
        "lat": 39.963116,
        "value": 99
      }, {
        "lng": 116.299918,
        "lat": 39.936094,
        "value": 100
      }, {
        "lng": 116.489325,
        "lat": 39.944556,
        "value": 101
      }, {
        "lng": 116.339297,
        "lat": 40.038739,
        "value": 102
      }, {
        "lng": 116.485631,
        "lat": 39.804667,
        "value": 103
      }, {
        "lng": 116.480549,
        "lat": 39.955012,
        "value": 104
      }, {
        "lng": 116.381977,
        "lat": 39.878496,
        "value": 1
      }, {
        "lng": 116.259586,
        "lat": 40.043622,
        "value": 2
      }, {
        "lng": 116.587813,
        "lat": 40.015618,
        "value": 3
      }, {
        "lng": 116.35472,
        "lat": 39.975865,
        "value": 4
      }, {
        "lng": 116.644011,
        "lat": 40.299776,
        "value": 5
      }, {
        "lng": 116.299449,
        "lat": 39.95324,
        "value": 6
      }, {
        "lng": 116.332228,
        "lat": 39.900741,
        "value": 7
      }, {
        "lng": 116.377459,
        "lat": 39.80869,
        "value": 8
      }, {
        "lng": 116.657873,
        "lat": 40.120521,
        "value": 9
      }, {
        "lng": 116.154466,
        "lat": 39.731616,
        "value": 10
      }, {
        "lng": 116.845418,
        "lat": 40.375612,
        "value": 11
      }, {
        "lng": 116.466696,
        "lat": 39.766475,
        "value": 12
      }, {
        "lng": 116.45685,
        "lat": 40.011172,
        "value": 13
      }, {
        "lng": 116.406651,
        "lat": 39.970182,
        "value": 14
      }, {
        "lng": 116.428161,
        "lat": 39.866144,
        "value": 15
      }, {
        "lng": 116.504801,
        "lat": 39.836822,
        "value": 16
      }, {
        "lng": 116.439995,
        "lat": 39.81546,
        "value": 17
      }, {
        "lng": 116.559057,
        "lat": 39.936131,
        "value": 18
      }, {
        "lng": 116.225584,
        "lat": 39.842961,
        "value": 19
      }, {
        "lng": 116.64103,
        "lat": 40.141812,
        "value": 20
      }, {
        "lng": 116.306028,
        "lat": 39.860581,
        "value": 21
      }, {
        "lng": 116.403426,
        "lat": 40.066843,
        "value": 22
      }, {
        "lng": 116.399935,
        "lat": 40.009504,
        "value": 23
      }, {
        "lng": 116.309222,
        "lat": 39.913107,
        "value": 24
      }, {
        "lng": 116.295396,
        "lat": 39.784501,
        "value": 25
      }, {
        "lng": 116.289673,
        "lat": 39.963462,
        "value": 26
      }, {
        "lng": 116.445731,
        "lat": 40.051509,
        "value": 27
      }, {
        "lng": 116.395362,
        "lat": 39.975426,
        "value": 28
      }, {
        "lng": 116.605608,
        "lat": 40.0489,
        "value": 29
      }, {
        "lng": 116.421157,
        "lat": 39.975636,
        "value": 30
      }, {
        "lng": 116.452161,
        "lat": 39.977081,
        "value": 31
      }, {
        "lng": 116.242604,
        "lat": 40.22134,
        "value": 32
      }, {
        "lng": 116.32532,
        "lat": 39.970535,
        "value": 33
      }, {
        "lng": 116.685587,
        "lat": 39.926874,
        "value": 34
      }, {
        "lng": 116.39186,
        "lat": 39.912056,
        "value": 35
      }, {
        "lng": 116.326004,
        "lat": 39.974148,
        "value": 36
      }, {
        "lng": 116.677542,
        "lat": 39.892667,
        "value": 37
      }, {
        "lng": 116.835958,
        "lat": 40.375008,
        "value": 38
      }, {
        "lng": 116.484969,
        "lat": 39.956518,
        "value": 39
      }, {
        "lng": 115.95685,
        "lat": 39.732297,
        "value": 40
      }, {
        "lng": 116.380024,
        "lat": 39.872133,
        "value": 41
      }, {
        "lng": 116.396477,
        "lat": 39.928246,
        "value": 42
      }, {
        "lng": 116.390986,
        "lat": 39.92675,
        "value": 43
      }, {
        "lng": 116.346845,
        "lat": 40.018932,
        "value": 44
      }, {
        "lng": 116.381966,
        "lat": 39.970729,
        "value": 45
      }, {
        "lng": 116.337349,
        "lat": 39.752131,
        "value": 46
      }, {
        "lng": 116.494995,
        "lat": 39.99648,
        "value": 47
      }, {
        "lng": 116.314029,
        "lat": 39.516896,
        "value": 48
      }, {
        "lng": 116.662237,
        "lat": 40.122764,
        "value": 49
      }, {
        "lng": 116.841367,
        "lat": 40.379938,
        "value": 50
      }, {
        "lng": 116.365928,
        "lat": 39.975824,
        "value": 51
      }, {
        "lng": 116.489236,
        "lat": 39.939992,
        "value": 52
      }, {
        "lng": 116.363994,
        "lat": 39.852943,
        "value": 53
      }, {
        "lng": 116.34283,
        "lat": 39.754081,
        "value": 54
      }, {
        "lng": 116.361183,
        "lat": 39.894634,
        "value": 55
      }, {
        "lng": 116.412822,
        "lat": 39.9769,
        "value": 56
      }, {
        "lng": 116.40433,
        "lat": 39.97541,
        "value": 57
      }, {
        "lng": 116.413478,
        "lat": 39.948868,
        "value": 58
      }, {
        "lng": 116.406129,
        "lat": 39.932386,
        "value": 59
      }, {
        "lng": 116.451852,
        "lat": 39.995137,
        "value": 60
      }, {
        "lng": 116.349718,
        "lat": 39.870509,
        "value": 61
      }, {
        "lng": 116.568628,
        "lat": 39.926382,
        "value": 62
      }, {
        "lng": 116.643881,
        "lat": 40.300758,
        "value": 63
      }, {
        "lng": 116.440445,
        "lat": 39.881325,
        "value": 64
      }, {
        "lng": 116.48299,
        "lat": 39.869588,
        "value": 65
      }, {
        "lng": 116.323732,
        "lat": 40.082528,
        "value": 66
      }, {
        "lng": 116.257834,
        "lat": 39.876782,
        "value": 67
      }, {
        "lng": 116.3596,
        "lat": 40.034545,
        "value": 68
      }, {
        "lng": 116.349841,
        "lat": 39.875597,
        "value": 69
      }, {
        "lng": 116.403928,
        "lat": 39.879252,
        "value": 70
      }, {
        "lng": 116.42005,
        "lat": 39.833467,
        "value": 71
      }, {
        "lng": 116.663001,
        "lat": 39.91046,
        "value": 72
      }, {
        "lng": 116.406568,
        "lat": 39.908939,
        "value": 73
      }, {
        "lng": 116.405188,
        "lat": 39.909159,
        "value": 74
      }, {
        "lng": 116.415107,
        "lat": 39.872521,
        "value": 75
      }, {
        "lng": 116.321197,
        "lat": 39.767552,
        "value": 76
      }, {
        "lng": 116.211721,
        "lat": 39.688611,
        "value": 77
      }, {
        "lng": 116.451346,
        "lat": 39.882833,
        "value": 78
      }, {
        "lng": 116.557492,
        "lat": 39.875288,
        "value": 79
      }, {
        "lng": 116.420546,
        "lat": 39.899053,
        "value": 80
      }, {
        "lng": 116.440968,
        "lat": 39.898035,
        "value": 81
      }, {
        "lng": 116.096699,
        "lat": 39.94052,
        "value": 82
      }, {
        "lng": 116.410422,
        "lat": 39.996992,
        "value": 83
      }, {
        "lng": 116.376382,
        "lat": 40.040343,
        "value": 84
      }, {
        "lng": 116.664304,
        "lat": 39.912656,
        "value": 85
      }, {
        "lng": 116.477188,
        "lat": 39.972973,
        "value": 86
      }, {
        "lng": 116.400057,
        "lat": 39.883241,
        "value": 87
      }, {
        "lng": 116.287055,
        "lat": 39.865057,
        "value": 88
      }, {
        "lng": 116.47842,
        "lat": 39.975087,
        "value": 89
      }, {
        "lng": 116.481061,
        "lat": 39.973994,
        "value": 90
      }, {
        "lng": 116.428439,
        "lat": 39.943564,
        "value": 91
      }, {
        "lng": 116.507173,
        "lat": 39.815616,
        "value": 92
      }, {
        "lng": 116.405081,
        "lat": 39.959449,
        "value": 93
      }, {
        "lng": 116.40121,
        "lat": 39.869219,
        "value": 94
      }, {
        "lng": 116.437595,
        "lat": 39.878214,
        "value": 95
      }, {
        "lng": 116.448647,
        "lat": 39.981149,
        "value": 96
      }, {
        "lng": 116.239298,
        "lat": 40.218372,
        "value": 97
      }, {
        "lng": 116.402223,
        "lat": 39.960511,
        "value": 98
      }, {
        "lng": 116.664158,
        "lat": 40.120092,
        "value": 99
      }, {
        "lng": 116.119102,
        "lat": 40.233172,
        "value": 99
      }, {
        "lng": 116.666931,
        "lat": 39.917685,
        "value": 100
      }, {
        "lng": 115.977448,
        "lat": 40.456067,
        "value": 101
      }, {
        "lng": 116.355541,
        "lat": 39.911069,
        "value": 1
      }, {
        "lng": 116.474525,
        "lat": 39.944593,
        "value": 2
      }, {
        "lng": 116.35277,
        "lat": 39.910566,
        "value": 3
      }, {
        "lng": 116.310743,
        "lat": 39.915123,
        "value": 4
      }, {
        "lng": 116.384415,
        "lat": 39.948468,
        "value": 5
      }, {
        "lng": 116.470283,
        "lat": 39.92274,
        "value": 6
      }, {
        "lng": 116.545304,
        "lat": 39.632635,
        "value": 7
      }, {
        "lng": 116.358194,
        "lat": 39.898647,
        "value": 8
      }, {
        "lng": 116.311002,
        "lat": 39.917643,
        "value": 9
      }, {
        "lng": 116.387084,
        "lat": 39.959407,
        "value": 10
      }, {
        "lng": 116.399161,
        "lat": 39.972319,
        "value": 11
      }, {
        "lng": 116.41415,
        "lat": 40.048341,
        "value": 12
      }, {
        "lng": 116.283811,
        "lat": 39.862684,
        "value": 13
      }, {
        "lng": 116.154671,
        "lat": 39.793723,
        "value": 14
      }, {
        "lng": 116.338059,
        "lat": 40.034402,
        "value": 15
      }, {
        "lng": 116.564921,
        "lat": 40.336754,
        "value": 16
      }, {
        "lng": 116.396465,
        "lat": 39.928236,
        "value": 17
      }, {
        "lng": 116.345465,
        "lat": 39.815134,
        "value": 18
      }, {
        "lng": 117.105997,
        "lat": 40.140457,
        "value": 19
      }, {
        "lng": 116.458762,
        "lat": 40.011334,
        "value": 20
      }, {
        "lng": 116.330312,
        "lat": 39.892811,
        "value": 21
      }, {
        "lng": 116.246434,
        "lat": 39.981835,
        "value": 22
      }, {
        "lng": 116.482718,
        "lat": 39.967001,
        "value": 23
      }, {
        "lng": 116.531887,
        "lat": 39.91018,
        "value": 24
      }, {
        "lng": 116.303479,
        "lat": 40.030135,
        "value": 25
      }, {
        "lng": 116.567226,
        "lat": 39.897282,
        "value": 26
      }, {
        "lng": 116.443197,
        "lat": 39.810833,
        "value": 27
      }, {
        "lng": 116.271062,
        "lat": 40.205664,
        "value": 28
      }, {
        "lng": 116.430094,
        "lat": 39.975569,
        "value": 29
      }, {
        "lng": 116.320701,
        "lat": 40.030695,
        "value": 30
      }, {
        "lng": 116.318237,
        "lat": 39.945583,
        "value": 31
      }, {
        "lng": 116.384177,
        "lat": 39.976624,
        "value": 32
      }, {
        "lng": 116.609751,
        "lat": 39.67949,
        "value": 33
      }, {
        "lng": 116.470793,
        "lat": 39.976487,
        "value": 34
      }, {
        "lng": 116.451952,
        "lat": 39.994476,
        "value": 35
      }, {
        "lng": 116.898355,
        "lat": 40.465999,
        "value": 36
      }, {
        "lng": 116.324261,
        "lat": 39.97006,
        "value": 37
      }, {
        "lng": 116.345849,
        "lat": 39.902789,
        "value": 38
      }, {
        "lng": 116.392448,
        "lat": 39.949775,
        "value": 39
      }, {
        "lng": 116.404969,
        "lat": 39.869671,
        "value": 40
      }, {
        "lng": 116.391978,
        "lat": 39.951331,
        "value": 41
      }, {
        "lng": 116.293389,
        "lat": 39.963228,
        "value": 42
      }, {
        "lng": 116.354359,
        "lat": 39.871352,
        "value": 43
      }, {
        "lng": 116.250473,
        "lat": 39.905799,
        "value": 44
      }, {
        "lng": 116.529661,
        "lat": 39.912838,
        "value": 45
      }, {
        "lng": 116.400244,
        "lat": 39.953832,
        "value": 46
      }, {
        "lng": 116.33445,
        "lat": 39.790326,
        "value": 47
      }, {
        "lng": 116.327622,
        "lat": 39.795556,
        "value": 48
      }, {
        "lng": 116.394292,
        "lat": 39.948671,
        "value": 49
      }, {
        "lng": 116.841248,
        "lat": 40.382222,
        "value": 50
      }, {
        "lng": 116.39621,
        "lat": 39.912717,
        "value": 51
      }, {
        "lng": 116.29526,
        "lat": 39.839011,
        "value": 52
      }, {
        "lng": 116.390165,
        "lat": 39.949776,
        "value": 53
      }, {
        "lng": 116.521784,
        "lat": 39.83616,
        "value": 54
      }, {
        "lng": 116.393875,
        "lat": 39.996715,
        "value": 55
      }, {
        "lng": 116.724049,
        "lat": 39.951418,
        "value": 56
      }, {
        "lng": 116.434731,
        "lat": 39.90149,
        "value": 57
      }, {
        "lng": 116.356244,
        "lat": 39.910916,
        "value": 58
      }, {
        "lng": 116.457003,
        "lat": 40.008583,
        "value": 59
      }, {
        "lng": 116.4954,
        "lat": 39.922626,
        "value": 60
      }, {
        "lng": 116.451481,
        "lat": 39.81428,
        "value": 61
      }, {
        "lng": 116.33145,
        "lat": 39.891865,
        "value": 62
      }, {
        "lng": 116.2393,
        "lat": 40.236043,
        "value": 63
      }, {
        "lng": 116.424888,
        "lat": 39.976048,
        "value": 64
      }, {
        "lng": 116.336565,
        "lat": 39.751957,
        "value": 65
      }, {
        "lng": 116.225132,
        "lat": 39.872326,
        "value": 66
      }, {
        "lng": 116.564558,
        "lat": 39.886867,
        "value": 67
      }, {
        "lng": 116.12651,
        "lat": 39.735538,
        "value": 68
      }, {
        "lng": 117.008136,
        "lat": 40.376266,
        "value": 69
      }, {
        "lng": 116.420949,
        "lat": 39.87321,
        "value": 70
      }, {
        "lng": 115.994695,
        "lat": 39.701187,
        "value": 71
      }, {
        "lng": 116.400738,
        "lat": 39.908585,
        "value": 72
      }, {
        "lng": 116.424696,
        "lat": 39.962873,
        "value": 73
      }, {
        "lng": 116.3266,
        "lat": 40.08181,
        "value": 74
      }, {
        "lng": 116.331061,
        "lat": 39.892843,
        "value": 75
      }, {
        "lng": 116.29248,
        "lat": 39.988895,
        "value": 76
      }, {
        "lng": 116.466217,
        "lat": 39.92232,
        "value": 77
      }, {
        "lng": 116.324551,
        "lat": 39.940216,
        "value": 78
      }, {
        "lng": 116.289698,
        "lat": 39.815009,
        "value": 79
      }, {
        "lng": 116.366762,
        "lat": 40.240256,
        "value": 80
      }, {
        "lng": 116.331123,
        "lat": 39.890995,
        "value": 81
      }, {
        "lng": 116.416662,
        "lat": 39.869136,
        "value": 82
      }, {
        "lng": 116.417434,
        "lat": 39.833862,
        "value": 83
      }, {
        "lng": 116.489063,
        "lat": 39.950495,
        "value": 84
      }, {
        "lng": 116.425088,
        "lat": 39.834288,
        "value": 85
      }, {
        "lng": 116.288801,
        "lat": 39.965264,
        "value": 86
      }, {
        "lng": 116.29665,
        "lat": 39.805464,
        "value": 87
      }, {
        "lng": 116.154403,
        "lat": 39.792215,
        "value": 88
      }, {
        "lng": 116.320248,
        "lat": 39.945852,
        "value": 89
      }, {
        "lng": 115.957457,
        "lat": 39.599769,
        "value": 90
      }, {
        "lng": 116.353289,
        "lat": 39.915624,
        "value": 91
      }, {
        "lng": 116.438992,
        "lat": 39.876785,
        "value": 92
      }, {
        "lng": 116.10987,
        "lat": 39.93606,
        "value": 1
      }, {
        "lng": 116.42478,
        "lat": 39.9665,
        "value": 2
      }, {
        "lng": 116.295136,
        "lat": 39.927262,
        "value": 3
      }, {
        "lng": 116.579446,
        "lat": 39.846365,
        "value": 4
      }, {
        "lng": 116.507268,
        "lat": 39.859229,
        "value": 5
      }, {
        "lng": 116.246201,
        "lat": 39.943989,
        "value": 6
      }, {
        "lng": 116.321964,
        "lat": 39.767435,
        "value": 7
      }, {
        "lng": 116.543317,
        "lat": 39.877525,
        "value": 8
      }, {
        "lng": 116.402726,
        "lat": 39.962996,
        "value": 9
      }, {
        "lng": 116.533757,
        "lat": 39.916293,
        "value": 10
      }, {
        "lng": 116.297368,
        "lat": 39.936267,
        "value": 11
      }, {
        "lng": 116.281225,
        "lat": 39.947723,
        "value": 12
      }, {
        "lng": 116.651846,
        "lat": 40.119239,
        "value": 13
      }, {
        "lng": 116.399739,
        "lat": 39.960987,
        "value": 14
      }, {
        "lng": 116.316824,
        "lat": 39.862571,
        "value": 15
      }];
      new Heatmap(heatmapData)
    },


    polymerization() {
      const dataSource = new Cesium.CustomDataSource('source');

      for (let i = 0; i < 2000; ++i) {
        const longitude = 116.462253 + Math.random() * 0.1;
        const latitude = 39.896533 + Math.random() * 0.1;

        dataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 100),
          point: {
            color: Cesium.Color.RED,
            pixelSize: 20,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
          },
        });
      }

      viewer.dataSources.add(dataSource).then(function (dataSource) {
        dataSource.clustering.enabled = true; // 是否聚合
        dataSource.clustering.pixelRange = 15;
        dataSource.clustering.minimumClusterSize = 2;

        // 监听聚合事件
        dataSource.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
          cluster.label.show = false
          cluster.billboard.show = true;
          if (clusteredEntities.length >= 10) {
            cluster.billboard.image = require('@/assets/icon/level3.png');
          } else if (clusteredEntities.length >= 5) {
            cluster.billboard.image = require('@/assets/icon/level2.png');
          } else if (clusteredEntities.length >= 2) {
            cluster.billboard.image = require('@/assets/icon/level1.png');
          }
        });
      });

      viewer.flyTo(dataSource)
    },

    measureDistance() {
      // 初始化测量距离
      const handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, 0);
      // 注册测距功能事件
      handlerDis.measureEvt.addEventListener(result => {
        const dis = Number(result.distance);
        const distance = dis > 1000 ? `${(dis / 1000).toFixed(2)}km` : `${dis.toFixed(2)}m`;
        handlerDis.disLabel.text = `距离: ${distance}`;
      });
      handlerDis.activate();
    },

    draw() {
      var handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
      handlerLine.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = '';
          $('body').removeClass('drawCur').addClass('drawCur');
        }
        else {
          viewer.enableCursorStyle = true;
          $('body').removeClass('drawCur');
        }
      });
      handlerLine.movingEvt.addEventListener(function (windowPosition) {
        if (handlerLine.isDrawing) {
          tooltip.showAt(windowPosition, '<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>');
        }
        else {
          tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>');
        }
      });
      handlerLine.drawEvt.addEventListener(function (result) {
        tooltip.setVisible(false);
      });
    }


  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;

  #cesium {
    width: 100%;
    height: 100%;
  }
}
</style>
