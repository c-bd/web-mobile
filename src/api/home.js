import request from '@/utils/request'
// 获取全部频道列表
export const getALLChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
