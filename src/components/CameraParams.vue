<template>
    <div>
        <div class="params">
            <span>x: {{ position?.x }}</span>
            <span>y: {{ position?.y }}</span>
            <span>z: {{ position?.z }}</span>
            <span>heading: {{ heading }}</span>
            <span>pitch: {{ pitch }}</span>
            <span>roll: {{ roll }}</span>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'CameraParams',
    data() {
        return {
            position: null,
            heading: 0,
            pitch: 0,
            roll: 0,
        }
    },

    mounted() {
        this.$nextTick(() => {
            viewer.camera.changed.addEventListener(() => {
                const camera = viewer.camera
                this.position = camera.position
                this.heading = camera.heading;
                this.pitch = camera.pitch;
                this.roll = camera.roll;
            })
        })

    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.params {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: rgba(0, 0, 0, .5);
    color: #FFF;
    text-align: center;

    span {
        margin: 0 20px;
    }
}
</style>
  