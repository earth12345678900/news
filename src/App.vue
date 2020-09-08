<template>
  <div id="app">
    <!-- keepalive包裹路由组件 用过组件的name属性缓存-->
    <keep-alive include="index">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

</script>

<style lang="less">

</style>
