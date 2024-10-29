export function creatHtmlElement(element, position) {
    const ele = document.querySelector(element);
    ele.style.display = "block"
    const scratch = new Cesium.Cartesian2(); // cesium二维笛卡尔 笛卡尔二维坐标系就是我们熟知的而二维坐标系；三维也如此
    viewer.scene.preRender.addEventListener(() => {
        const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position, scratch);
        if (Cesium.defined(canvasPosition)) {
            ele.style.left = canvasPosition.x + 'px'
            ele.style.top = canvasPosition.y + 'px'
        } else {

        }
    })
}

export function removeHtmlElement() {
    const element = document.querySelector('#dialog');
    element.style.display = "none"
}
