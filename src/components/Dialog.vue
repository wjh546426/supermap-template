<template>
  <div id="dialog">
    <p>我是一个弹窗</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#dialog{
  width: 300px;
  height: 300px;
  background: #66ccee;
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
