<template>
<div class="search">
  <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      @input="onSearchAll"
    >
      <div slot="action" @click="onSearch(value)">搜索</div>
    </van-search>
     <van-cell-group v-if="value">
        <van-cell
        icon="search"
        v-for="(item,index) in searchSuggestions"
        :key="index"
        @click="onSearch(item)"
        >
          <div v-html="hightlight(item)" slot="title"></div>
        </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isTure">
          <span @click="searchHistories=[]">全部删除</span>&nbsp;&nbsp;
          <span @click="isTure=false">完成</span>
        </template>
         <van-icon v-else name="delete" @click="isTure=true"/>
      </van-cell>
      <van-cell
      v-for="(item,index) in searchHistories"
      :key="index"
      :title="item"
      @click="onSearch(item)"
      >
        <van-icon name="close"
         v-show="isTure"
         @click="searchHistories.splice(index,1)"
         />
      </van-cell>
    </van-cell-group>
</div>

</template>

<script>
import { getSuggestion } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'
import { debounce } from 'lodash'// 函数防抖优化
export default {
  name: 'Search',
  data () {
    return {
      value: '',
      searchSuggestions: [], // 联想建议列表
      isTure: false,
      searchHistories: getItem('search') || []// 判断没有值 就让他等于一个数组塞进去
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) {
        this.searchSuggestions = []
      }
    },
    // 解决刷新就不在的问题
    searchHistories (newValue) {
      setItem('search', newValue)
    }
  },
  methods: {
    async onSearch (q) {
      // 判断搜索历史中是否存在jilu
      // 本地持久化搜索记录
      const index = this.searchHistories.indexOf(q)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 然后把最新得放到第一个
      this.searchHistories.unshift(q)
      setItem('search', this.searchHistories)
      this.$router.push(`/search/${q}`)
    },
    // 值改变进行搜索
    onSearchAll: debounce(async function (params) {
      // 没有值得时候我们不可以进行搜索
      const value = this.value.trim()
      if (!value) {
        return
      }
      const { data } = await getSuggestion({
        q: this.value
      })
      this.searchSuggestions = data.data.options
    }, 1000),

    // 创建一个正则表达式
    // const reg = new RegExp(value, 'gi')
    // searchSuggestions.forEach((item, index) => {
    //   searchSuggestions[index] = item.replace(reg, '<span style="color: red">' + value + '</span>')
    // })
    // this.searchSuggestions = searchSuggestions

    // 定义一个方法用于渲染搜索内容高亮  传入当前输入得内容
    hightlight (item) {
      const reg = new RegExp(this.value, 'gi')
      return item.replace(reg, '<span style="color: red">' + this.value + '</span>')
    }
  }
}
</script>

<style>

</style>
