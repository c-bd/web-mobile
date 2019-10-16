<template>
  <div class="search-result">
      <van-nav-bar
        left-arrow
        fixed
        :title="$route.params.q+'得搜索结果是'"
        @click-left="$router.back()"
      />
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
        />
        </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      page: 1,
      per_page: 10
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getSearch({
        page: this.page,
        per_page: this.per_page,
        q: this.$route.params.q
      })
      this.list.push(...data.data.results)
      this.loading = false// 结束加载 满一屏幕
      //   判断还有没有数据
      if (data.data.page) {
        //   如果还有下一页 那么 就让当前页++ 变成新的一页
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style>

</style>
