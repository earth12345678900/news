<template>
  <div class="manage">
    <hm-header>栏目管理</hm-header>
    <div class="content">
      <div class="active">
        <h3>点击删除以下频道(保留四项以上)</h3>
        <div class="list">
          <div class="item" v-for="item in activeList" :key="item.id" @click="delTab(item.id)">{{item.name}}</div>
        </div>
      </div>
      <div class="deactive">
        <h3>点击添加以下频道</h3>
        <div class="list">
          <div class="item" v-for="item in deactiveList" :key="item.id" @click="addTab(item.id)">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 存放激活的栏目
      activeList: [],
      // 存放未激活的栏目
      deactiveList: []
    }
  },
  methods: {
    delTab (id) {
      if (this.activeList.length <= 4) return
      const index = this.activeList.findIndex((item) => item.id === id)
      // 添加到另一个栏目
      this.deactiveList.push(this.activeList[index])
      // 本栏目删除该项
      this.activeList.splice(index, 1)
    },
    addTab (id) {
      const index = this.deactiveList.findIndex((item) => item.id === id)
      // 添加到另一个栏目
      this.activeList.push(this.deactiveList[index])
      // 本栏目删除该项
      this.deactiveList.splice(index, 1)
    }
  },
  async created () {
    // 如果缓存里有值不需要发请求
    // 字符串转为对象
    const activeList = JSON.parse(localStorage.getItem('activeList'))
    const deactiveList = JSON.parse(localStorage.getItem('deactiveList'))
    if (activeList) {
      this.activeList = activeList
      this.deactiveList = deactiveList
      return
    }
    const res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeList = data
      console.log(this.activeList)
    }
  },
  // 监听 activeList
  watch: {
    activeList: {
      // 复杂数据类型 深度监听
      deep: true,
      handler (value) {
        // 转为字符串类型
        // localStorage/sessionStorage默认只能存储字符串
        localStorage.setItem('activeList', JSON.stringify(value))
        localStorage.setItem('deactiveList', JSON.stringify(this.deactiveList))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 10px;
  .active,
  .deactive {
    h3 {
      font-size: 14px;
      font-weight: 400;
      margin: 10px 0;
    }
    .list {
      overflow: hidden;
      .item {
        width: 60px;
        height: 30px;
        border: 1px solid #ccc;
        background-color: #eee;
        text-align: center;
        line-height: 30px;
        font-size: 16px;
        float: left;
        margin: 5px;
      }
    }
  }
}
</style>
