<template>
  <div class="article-container">
      <!-- 文章导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
     <!-- /文章导航 -->
     <!-- 文章加载 -->
    <van-loading class="article-loading" v-if="loading"/>
    <!-- /文章加载 -->
    <!-- 文章详情 -->
    <div class="detail" v-else-if="article.aut_name">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relativeTime}}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="onfollow"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" hairline type="primary" @click="onlike" :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'">{{article.attitude === 1?'取消点赞':'+点赞'}}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" plain :icon="article.attitude === 0?'default':'danger'" @click="addLikes">{{article.attitude === 0?'取消不喜欢':'不喜欢'}}</van-button>
      </div>
    </div>

    <!-- 文章详情 -->
    <!-- 失败超时 -->
    <div class="error" v-else>
      <p>网络超时，点击 <a href="#" @click.prevent="loadArticle">刷新</a> 试一试。</p>
    </div>
     <!-- 文章评论 -->
      <ArticleComment/>
    <!-- /文章评论 -->
    <!-- /失败超时 -->
  </div>
</template>

<script>
import { getArticle, addLike, deleteLike, addDislike, deleteDislike } from '@/api/articls'
import { followings, unFollowUser } from '@/api/user'
import ArticleComment from '@/components/article/article-commet'
export default {
  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true,
      article: {
      }
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    // 点赞取消点赞
    async onlike () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 1) {
        await deleteLike(articleId)
        this.article.attitude = -1
      } else {
        await addLike(articleId)
        this.article.attitude = 1
      }
    },
    // 喜欢
    async addLikes () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 0) {
        await deleteDislike(articleId)
        this.this.article.attitude = -1
      } else {
        await addDislike(articleId)
        this.this.article.attitude = 0
      }
    },
    // 关注用户
    async onfollow () {
      // 判断当前是否已经关注用户
      if (this.article.is_followed) {
        await unFollowUser(this.article.aut_id.toString())
      } else {
        await followings(this.article.aut_id.toString())
      }
      this.article.is_followed = !this.article.is_followed
    },

    async loadArticle () {
      // 上来开始加载是的时候 我们让loading为true加载状态 等到拿到数据 =时 就让列表渲染
      this.loading = true
      try {
        const { data } = await getArticle(this.$route.params.article_id)
        this.article = data.data
      } catch (error) {
        throw error
      }
      // 不管是否是成功或许失败 我们这时候都应该让loading结束加载状态
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
