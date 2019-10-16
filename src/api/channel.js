import request from '@/utils/request'

export function getDefaultChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
export const getALLChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
