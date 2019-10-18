import request from '@/utils/request'
// 评论列表
export function getComments (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}
// 评论列表点赞
export const addCommentLike = (commentId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}
// 取消点赞
export const deleteCommentLike = (commentId) => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/comment/likings/' + commentId
  })
}
/**
 * 发布评论
 */
export function addComment (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
