<template>
    <div>
      <div class="palceholder"></div>
      <div class="hm-header">
        <div class="back" @click='back'>
            <span class="iconfont iconjiantou2"></span>
        </div>
        <div class="title"><slot></slot></div>
        <div class="extra"></div>
      </div>
    </div>
</template>

<script>
export default {
  methods: {
    back () {
      //  console.log(this);
      //  console.log(this.$router);
      this.$router.go(-1)
    }
  }
}

</script>

<style lang="less">
    .palceholder {
        width: 100%;
        height: 50px;
    }
    .hm-header {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 99;
        background-color: #fff;
        height: 50px;
        border-bottom: 1px solid #ccc;
        display: flex;
        line-height: 50px;
        text-align: center;
        .back,
        .extra {
            width: 50px;
        }
        .title {
            flex: 1;
            font-size: 18px;
            font-weight: 700;
        }
    }
</style>
