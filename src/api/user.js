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
