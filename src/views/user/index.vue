<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-right="onSave"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="userChange">
        <van-image
          round
          width="30"
          height="30"
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link @click="show=true"/>
      <van-cell title="性别" :value="user.gender===1?'男':'女'" is-link  @click="genderShow=true"/>
      <van-cell title="生日" :value="user.birthday" is-link @click="isEditBirthdayShow=true"/>
    </van-cell-group>
    <!-- 文件上传 -->
    <input type="file" hidden ref="file" @change="taggetPhoto">
    <!-- 昵称 -->
    <van-dialog
      v-model="show"
      title="修改昵称"
      show-cancel-button
      @confirm="onNameChange"
    >
    <van-field
    :value="user.name"
    placeholder="请输入用户名"
    @input="onUserNameInput"
    />
    </van-dialog>
    <!-- /昵称 -->
    <!-- 性别 -->
    <van-action-sheet
      v-model="genderShow"
      :actions="actions"
      cancel-text="取消"
     @select="genderChange"
    />
    <!-- /性别 -->
    <!-- 选择年月日 -->
     <van-popup
      v-model="isEditBirthdayShow"
     position="bottom"
     :style="{ height: '30%' }"
    >
      <van-datetime-picker
        type="date"
        @confirm="onUserBirthdayConfirm"
        @cancel="isEditBirthdayShow = false"
      />
   </van-popup>
<!-- /选择年月日 -->
  </div>
</template>

<script>
import { getProfile, userPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {},
      show: false,
      nameValue: '',
      genderShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false
    }
  },
  created () {
    this.getProfileList()
  },
  methods: {
    // 改变头像
    userChange () {
      // 这里我们点击的时候触发input的点击事件
      this.$refs.file.click()
    },
    async getProfileList () {
      const { data } = await getProfile()
      this.user = data.data
    },
    // 切换头像上传
    taggetPhoto () {
      this.user.photo = window.URL.createObjectURL(this.$refs.file.files[0])
    },
    // 保存
    async onSave () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })
      try {
        const photo = this.$refs.file.files[0]
        if (photo) {
          const formData = new FormData()
          formData.append('photo', this.$refs.file.files[0])
          await userPhoto(formData)
        }
        await updateUserProfile(this.user)
        this.$toast.success('保存成功')
      } catch (error) {
        console.log(error)
        this.$toast.file('保存失败')
      }
    },
    // 修改昵称
    onNameChange () {
      this.user.name = this.nameValue
    },
    // 输入昵称框发生改变时触发的事件
    onUserNameInput (value) {
      this.nameValue = value
    },
    // 选择性别
    genderChange (item) {
      this.user.gender = item
      this.genderShow = false
    },
    // 时间改变
    onUserBirthdayConfirm (value) {
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.isEditBirthdayShow = false
    }
  }
}
</script>
