<template>
  <div class="home">
      <van-search placeholder="搜索" input-align="center" shape="round" background="#3196fa"/>
      <van-tabs v-model="active">
          <!-- 频道列表 -->
        <van-tab v-for="item in channels" :key="item.id" :title="item.name" swipeable>
            <!-- 内容列表 -->
            <van-pull-refresh v-model="channels.pullDownLoading" @refresh="onRefresh">
                <van-list
                v-model="channels.loading"
                :finished="channels.finished"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <van-cell
                v-for="article in channels.articles"
                :key="article.art_id.toString()"
                :title="article.title"
                />
            </van-list>
            </van-pull-refresh>

        </van-tab>
      </van-tabs>
  </div>
</template>

<script>
import { getALLChannels } from '@/api/home'
import { getArticls } from '@/api/articls'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [], // 频道列表
      loading: false, // 控制内容列表得加载状态
      finished: false, // 是否已经加载完成，加载完成后不再触发load事件
      list: []
    }
  },
  // 获取完数据之后data内的数据进一步的发生改变  这里对data进行的操作较为复杂所以使用计算属性
  computed: {
    currentChannel () {
      // active 是动态的
      return this.channels[this.active]
    }
  },
  methods: {
    // 下拉方法
    async onRefresh () {
      const currentChannel = this.currentChannel
      const data = await getArticls({
        channel_id: currentChannel.id, // 当前频道
        timestamp: Date.now(), // 这里我们如果时第一页 那么就是最新的时间戳  如果是下一页或者是上一页 那么就是返回数据结果中的时间戳
        withTop: 1
      })
      // 2. 将数据添加到当前频道.articles数据中（顶部）
      currentChannel.articles.unshift(...data.data.results)

      // 3. 关闭当前频道下拉刷新的 loading 状态
      currentChannel.pullDownLoading = false

      // 4. 提示用户刷新成功
      this.$toast('刷新成功')
    },
    // 获取频道列表
    // 获取到频道列表之后我们需要根据频道得不同来处理不同的数据列表
    // 每个频道都有自己得文章列表[]   和控制加载状态的值和视口已经加载完成得处理值
    async getChannels () {
      const { data } = await getALLChannels()

      //   在这里获取到得数据我们填入一些数据进去到列表的中
      // item就是数组里面的值
      data.data.channels.forEach(item => {
        item.articles = []// 频道文章列表
        item.loading = false
        item.finished = false
        item.timestamp = null // 用于获取下一页数据的时间戳（页码）
        item.pullDownLoading = false // 频道的下拉刷新 loading 状态
      })
      this.channels = data.data.channels
    },
    // 滚动条与底部距离小于 offset 时触发
    async onLoad () {
      const currentChannel = this.currentChannel
      const data = await getArticls({
        channel_id: currentChannel.id, // 当前频道
        timestamp: currentChannel.timestamp || Date.now(), // 这里我们如果时第一页 那么就是最新的时间戳  如果是下一页或者是上一页 那么就是返回数据结果中的时间戳
        withTop: 1
      })
      // 2.将得到的文章里表添加到当前的actils中
      const { pre_timestamp: preTimestamp, results } = data.data
      // currentChannel.articles.concat(results) // 之前合并数组的方式
      currentChannel.articles.push(...results) // es6 也可以这么玩儿

      // 3. 本次 onLoad 数据加载完毕，将 loading 设置为 false
      currentChannel.loading = false

      // 4. 判断是否还有下一页数据
      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        // 还有数据，将本次得到的 preTimestamp 存储到当前频道，用于加载下一页数据
        currentChannel.timestamp = preTimestamp
      }
    }
  },

  created () {
    this.getChannels()
  }
}
</script>

<style lang="less" scoped>
.home{
    .van-search{
        padding: 10px 40px;

    }
    .van-tabs__content {
       margin-bottom: 50px;
   }
}
</style>
