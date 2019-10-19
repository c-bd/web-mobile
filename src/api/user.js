import request from '@/utils/request'
export const login = ({ mobile, code }) => {
  return request({
    method: 'POSt',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
export const mobile = data => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${data.mobile}`
  })
}
// 关注用户
export const followings = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: data
    }
  })
}
// 取消关注用户
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
// 获取用户自己的信息
export const getUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
// 获取个人资料
// export const getProfile = (userId) => {
//   return request({
//     method: 'GET',
//     url: ' /app/v1_0/user/profile'
//   })
// }
export function getProfile (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}
// 编辑用户保存头像
export function userPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
// 更新用户基本信息
export const updateUserProfile = ({
  name,
  gender,
  birthday
}) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name, // 昵称
      gender, // 性别
      birthday // 生日
    }
  })
}
