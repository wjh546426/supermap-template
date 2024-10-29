# supermap-template

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### superMap.js
1. 覆盖复位按钮的行为后，可以直接调用`viewer.carmar.flyHome()`初始化视角位置
2. flyTo更适用于针对特定地理位置或实体的相机平滑过渡，而flyToBoundingSphere更适用于将相机平滑过渡到一个包围球范围内，以聚焦和显示一组实体或特定区域
3. `removeEntity()`可以接收一个实体对象或实体数组，快捷将实体从场景中移除

> 影像，地形都有对应的影像提供者和地形提供者，加载时需要使用对应的提供者，如TiandituImageryProvider（天地图）等
 