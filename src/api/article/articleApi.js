import request from '@/utils/request'

const baseUrl = '/article/article'

export default {
  // 获取所有文章
  getAllWithPage(current, limit) {
    return request({
      url: `${baseUrl}/page/${current}/${limit}`,
      method: 'get'
    })
  },
  // 修改显示状态
  updateShowStatus(status) {
    return request({
      url: `${baseUrl}/status`,
      method: 'put',
      data: status
    })
  },
  // 修改文章
  updateArticle(article) {
    return request({
      url: `${baseUrl}/update`,
      method: 'put',
      data: article
    })
  },
  // 删除一片文章
  delOneArticle(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'delete'
    })
  }

}
