<template>
  <div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count+'条回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')"/>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px;"
        :src="comment.aut_photo"
      />
      <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
      <div slot="label">
        <p style="color: #363636;">{{comment.content}}</p>
        <p>
          <span style="margin-right: 10px;">{{comment.pubdate | relativeTime}}</span>
          <van-button
            size="mini"
            type="default"
          >回复{{comment.reply_count}}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->

    <van-cell title="全部评论" />

    <!-- 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.aut_name"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">hello</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ item.pubdate | relativeTime }}</span>
          </p>
        </div>
        <van-icon
          slot="right-icon"
          :name="item.is_liking ? 'like' : 'like-o'"
          @click="onCommentLike(item)"
        />
      </van-cell>
    </van-list>
    <!-- 回复列表 -->
<!-- 评论列表 -->

<!-- /评论列表 -->
    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
        v-model="commentText"
        clearable
        placeholder="请输入评论内容"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
          @click="commentForm"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import { getComments, addCommentLike, deleteCommentLike, addComment } from '@/api/comment'
export default {
  name: 'ArticleReply',
  props: ['comment'],
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      commentText: ''
    }
  },

  methods: {
    // 点击跳转到具体评论页面
    async onReplyShow (comment) {
      this.curentComment = comment // 我们把当前的评论传进来
      this.show = true
    },
    // 发布评论
    async commentForm () {
      const contentText = this.commentText.trim()
      if (!contentText) {
        return
      }
      const { data } = await addComment({
        target: this.$route.params.article_id,
        // 清空输入框
        content: contentText
      })
      this.list.unshift(data.data.new_obj)
      this.commentText = ''
      this.comment.reply_count++
    },
    // 点击收藏
    async onCommentLike (comment) {
      const artileid = comment.com_id.toString()
      if (comment.is_liking) {
        deleteCommentLike(artileid)
      } else {
        addCommentLike(artileid)
      }
      comment.is_liking = !comment.is_liking
    },
    // 加载评论列表
    async onLoad () {
      const { data } = await getComments({
        type: 'c',
        source: this.comment.com_id.toString(),
        offset: this.offset
      })
      this.list.push(...data.data.results)
      this.loading = false
      if (data.data.results.length) {
        this.offset = data.data.last_id
      }
      this.finished = true
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
