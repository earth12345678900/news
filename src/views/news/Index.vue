<template>
  <div class="index">
    <div class="header">
      <div class="logo">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="search">
        <div class="search-box">
          <span class="iconfont iconsearch"></span>
          <span>搜索新闻</span>
        </div>
      </div>
      <div class="user" @click="$router.push('/user')">
        <span class="iconfont iconwode"></span>
      </div>
    </div>

    <!-- tab栏 -->
    <!-- 管理的图标 图标粘性定位-->
    <van-sticky class="more-sticky">
    <div class="more" @click="$router.push('/mange')">
      <span class="iconfont iconlianjie"></span>
    </div>
    </van-sticky>

    <van-tabs v-model="active" sticky animated swipeable>
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check='false'
            @load="onLoad"
          >
          <hm-post :post="item" v-for="item in newsList" :key="item.id"></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      tabList: [],
      newsList: [],
      pageIndex: 1,
      pageSize: 8,
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  created () {
    this.getTabList()
  },
  methods: {
    // 获取tab栏数据
    async getTabList () {
      // 判断缓存中是否存在
      const activeList = JSON.parse(localStorage.getItem('activeList'))
      if (activeList) {
        this.tabList = activeList
        // 发送请求获取第一个tab栏的数据并渲染
        this.getNewsList(this.tabList[0].id)
        return
      }
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList = data
        // console.log(this.tabList)
        // 发送请求获取第一个tab栏的数据并渲染
        this.getNewsList(this.tabList[0].id)
      }
    },
    // 获取新闻列表
    async getNewsList (id) {
      const res = await this.$axios.get('/post', {
        // 通过params传参 列表页通过params接受参数
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // this.newsList = data
        this.newsList = [...this.newsList, ...data]
        console.log(this.newsList)
        // 数据加载完成吧loading改为false
        this.loading = false
        this.refreshing = false
        // 判断是否还有更多数据
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // 加载下一页数据
        this.pageIndex++
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    },
    onRefresh () {
      this.newsList = []
      this.pageIndex = 1
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true

      setTimeout(() => {
        this.getNewsList(this.tabList[this.active].id)
      }, 500)
    }
  },
  // 监听active 发生改变时重新加载分类下的数据
  watch: {
    active (value) {
      this.newsList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true

      setTimeout(() => {
        this.getNewsList(this.tabList[value].id)
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    height: 50px;
    background-color: #ff0000;
    line-height: 50px;
    text-align: center;
    color: #fff;
    .logo,
    .user {
      width: 70px;
    }
    .logo {
      span {
        font-size: 50px;
      }
    }
    .user {
      span {
        font-size: 24px;
      }
    }
    .search {
      flex: 1;
      .search-box {
        height: 34px;
        line-height: 34px;
        background-color: rgba(255, 255, 255, .5);
        margin-top: 8px;
        border-radius: 17px;
        font-size: 14px;
        span:first-child {
          margin-right: 5px;
        }
      }
    }
  }
  /deep/ .van-tabs__wrap {
  width: 85%;
  }
  .more {
    width: 15%;
    height: 44px;
    position: absolute;
    right: 0;
    z-index: 999;
    background-color: #fff;
    text-align: center;
    line-height: 44px;
  }
  .more-sticky {
  /deep/ .van-sticky--fixed {
    z-index: 100;
  }
}
</style>
