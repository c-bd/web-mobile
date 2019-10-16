<template>
  <div class="home">
      <van-search placeholder="搜索" input-align="center" shape="round" background="#3196fa" />
          <!-- 频道列表 -->
        <van-tabs v-model="active" swipeable>
          <div class="wap-nav" @click="show=true" slot="nav-right">
            <van-icon name="wap-nav" size="24"  />
          </div>
       <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 文章列表 -->
        <van-pull-refresh v-model="channel.isLoading" @refresh="onRefresh">
        <van-list v-model="channel.loading" :finished="channel.finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="(article,index) in channel.articles" :key="index" :title="article.title" >
            <div slot="label">
                    <van-grid :border="false" :column-num="3">
                      <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                      <van-image height="80" :src="img" lazy-load/>
                    </van-grid-item>
                  </van-grid>
                  <div class="article-info">
                      <div class="meta">
                        <span>{{ article.aut_name }}</span>
                        <span>{{ article.comm_count }}评论</span>
                        <span>{{ article.pubdate | relativeTime }}</span>
                      </div>
                      <van-icon name="close" />
                    </div>
                </div>
          </van-cell>
        </van-list>
        </van-pull-refresh>
        <!-- 文章列表 -->
      </van-tab>
        <!-- 弹层组件 -->
      </van-tabs>
     <van-popup
        v-model="show"
        round
        position="bottom"
        :style="{ height: '95%' }"
        closeable
        close-icon-position="top-left"
      >
        <div class="channellist">
          <van-cell title="我的频道" :border="false">
            <van-button type="danger" size="mini" @click="isEditShow=!isEditShow">{{isEditShow?"完成":"编辑"}}</van-button>
          </van-cell>
          <van-grid :gutter="10">
            <van-grid-item
              v-for="(channel,index) in channels"
              :key="index"
              :text="channel.name"
               @click="onMyChannelClick(index)"
            >
            <van-icon v-show="isEditShow" class="close-icon" slot="icon" name="close" />
            </van-grid-item>
          </van-grid>
          <van-cell title="推荐频道" :border="false" />
          <van-grid :gutter="10">
            <van-grid-item
              v-for="(channel,index) in recommondChannels"
              :key="index"
              :text="channel.name"
              @click="onAddChannel(channel)"
            />
          </van-grid>
        </div>
      </van-popup>
  </div>
</template>
<script>
// import { getChannelList } from '@/api/channel'
import { getALLChannels, getDefaultChannels } from '@/api/channel'
import { getArticls } from '@/api/articls'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 控制当前激活的标签页
      channels: [], // 频道列表
      // loading: false, // 控制内容列表得加载状态
      // finished: false, // 是否已经加载完成，加载完成后不再触发load事件
      show: false,
      allChannels: [], // 全部频道列表
      isEditShow: false// 判断是什么状态
    }
  },
  // 这里监视频道得变化把他存储到本地中
  watch: {
    channels (newValue) {
      setItem('channels', newValue)
    }
  },
  computed: {
    recommondChannels () {
      let arr = []
      this.allChannels.forEach((channel) => {
        // 寻找这里面有没有和当前频道对应下标相同得列表项
        let ref = this.channels.find(item => item.id === channel.id)
        // 没有找到一样的就往里面push一个
        if (!ref) {
          arr.push(channel)
        }
      })
      return arr
    }
  },
  // 获取完数据之后data内的数据进一步的发生改变  这里对data进行的操作较为复杂所以使用计算属性
  methods: {
    // 点击在编辑状态下移除我的频道列表中的点击项
    onMyChannelClick (index) {
      // 判断当前的状态是什么   编辑状态还是非编辑状态
      if (this.isEditShow) {
        this.channels.splice(index, 1)
      } else {
        this.active = index
        this.show = false
      }
    },
    // 获取全部频道
    async loadAllChannels () {
      const { data } = await getALLChannels()
      const channels = data.data.channels
      this.extendData(channels)
      this.allChannels = channels
    },
    // 点击下面得列表里的数据上到我的频道中
    onAddChannel (channel) {
      this.channels.push(channel)
    },
    // async getChannel () {
    //   const { data } = getChannelList(this.channels)
    //   this.list = data
    // },
    // 下拉方法
    async onRefresh () {
      const currentChannels = this.channels[this.active]
      const { data } = await getArticls({
        channel_id: currentChannels.id, // 当前频道
        timestamp: Date.now(), // 这里我们如果时第一页 那么就是最新的时间戳  如果是下一页或者是上一页 那么就是返回数据结果中的时间戳
        with_top: 1
      })
      // 2. 将数据添加到当前频道.articles数据中（顶部）
      currentChannels.articles.unshift(...data.data.results)
      // 3. 关闭当前频道下拉刷新的 loading 状态
      currentChannels.isLoading = false
      // 4. 提示用户刷新成功
      this.$toast('刷新成功')
    },
    // 获取频道列表
    // 获取到频道列表之后我们需要根据频道得不同来处理不同的数据列表
    // 每个频道都有自己得文章列表[]   和控制加载状态的值和视口已经加载完成得处理值
    async getChannels () {
      let channels = []
      let localChannel = getItem('channels')
      // 在这里我们判断一下本地有没有列表数据
      if (localChannel) {
        channels = localChannel
      } else {
        const { data } = await getDefaultChannels()
        channels = data.data.channels
      }
      //   在这里获取到得数据我们填入一些数据进去到列表的中
      // item就是数组里面的值
      this.extendData(channels)
      // console.log(channels)

      this.channels = channels
      // this.channels.loading = false
      // this.channels.finished = true
    },
    extendData (channels) {
      channels.forEach(item => {
        item.articles = []// 频道文章列表
        item.loading = false// 是否加载
        item.finished = false// 是否加载结束
        item.timestamp = null // 用于获取下一页数据的时间戳（页码）
        item.isLoading = false // 频道的下拉刷新 loading 状态
      })
    },
    // 滚动条与底部距离小于 offset 时触发
    async onLoad () {
      // 获取当期激活的频道对象
      const activeChannel = this.channels[this.active]

      // 1. 请求获取数据
      const { data } = await getArticls({
        channel_id: activeChannel.id, // 频道ID
        // a: 3 b: 2
        // 4    3
        // 这里的这个时间戳就好比当前频道下一页的页码
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 2. 将数据添加到当前频道.articles中
      // activeChannel.articles = activeChannel.articles.concat(data.data.results)
      activeChannel.articles.push(...data.data.results)

      // 3. 结束当前频道.loging = false
      activeChannel.loading = false

      // 4. 如果还有下一页数据
      if (data.data.pre_timestamp) {
        // 更新获取下一页数据的页码时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        // 如果没有下一页数据了，就意味着后面没有数据了
        activeChannel.finished = true
      }
    }

  },
  created () {
    this.getChannels()
    // this.getChannel()
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.home{
    .van-search{
        padding: 10px 40px;

    }

    .van-tabs {
      // 这样可以获取到子组件中的类名来设置样式
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 54px;
      z-index: 2;
      left: 0;
      right: 15px;
    }

    /deep/ .van-tabs__content {
      margin-top: 30px;
      margin-bottom: 40px;
    }
  }
   .wap-nav{
      position: sticky;
      right: 0;
      display: flex;
      align-items: center;
      background-color: #fff;
      opacity: 0.8;
   }
   .channellist{
     padding-top:30px;
     position: relative;
     .close-icon{
       position: absolute;
       top:-8px;
       right:-5px;
     }
   }
}
</style>
