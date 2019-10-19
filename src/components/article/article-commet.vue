<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,index) in list"
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
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
            <van-button size="mini" type="default" @click="onReplyShow(item)">{{item.reply_count}}回复</van-button>
          </p>
        </div>
        <van-icon
        slot="right-icon"
        name="like-o"
        @click="onCommentLike(item)"
        />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        v-model="contentText"
        clearable
        placeholder="请输入评论内容"
      >
        <van-button slot="button" size="mini" type="info" @click="commentForm">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
    <!-- 评论弹层 -->
    <van-popup
        v-model="show"
        round
        position="bottom"
        :style="{ height: '90%' }"
        >
        <comment-reply
        :comment="curentComment"
        v-if="show"
        @close="show=false"
        />
    </van-popup>
     <!-- /评论弹层 -->
  </div>
</template>

<script>
import { getComments, addCommentLike, deleteCommentLike, addComment } from '@/api/comment'
import commentReply from '@/components/article/comment-reply'
export default {
  name: 'ArticleComment',
  components: {
    commentReply
  },
  props: {},
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      contentText: '',
      show: false,
      curentComment: {}// 查看当前频道
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
      const contentText = this.contentText.trim()
      if (!contentText) {
        return
      }
      const { data } = await addComment({
        target: this.$route.params.article_id,
        // 清空输入框
        content: contentText
      })
      this.list.unshift(data.data.new_obj)
      this.contentText = ''
    },
    // 点击收藏
    async onCommentLike (comment) {
      const artileid = comment.com_id.toString()
      if (comment.is_liking) {
        debugger
        await deleteCommentLike(artileid)
      } else {
        await addCommentLike(artileid)
      }
      comment.is_liking = !comment.is_liking
    },
    // 加载评论列表
    async onLoad () {
      const { data } = await getComments({
        type: 'a',
        source: this.$route.params.article_id,
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
