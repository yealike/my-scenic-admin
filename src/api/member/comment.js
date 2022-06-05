import request from '@/utils/request'

const baseUrl = '/member/comment'

export default {
  // 条件查询评论列表
  getPageWithQuery(queryInfo, current, limit) {
    return request({
      url: `${baseUrl}/query/${current}/${limit}`,
      method: 'post',
      data: queryInfo
    })
  },
  // 删除评论
  delComments(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'DELETE'
    })
  },
  // 修改公众显示状态
  updateStatus(statusInfo) {
    return request({
      url: `${baseUrl}/status`,
      method: 'PUT',
      data: statusInfo
    })
  },
  // 新增一条评论
  saveOneComment(commentInfo) {
    return request({
      url: `${baseUrl}/save`,
      method: 'POST',
      data: commentInfo
    })
  },
  // 修改置顶信息
  updateTop(commentInfo) {
    return request({
      url: `${baseUrl}/top`,
      method: 'PUT',
      data: commentInfo
    })
  }

}
