import request from '@/utils/request'

const baseUrl = '/member/history'

export default {
  // 获取历史记录列表
  getAllHistory(queryInfo, current, limit) {
    return request({
      url: `${baseUrl}/queryUser/${current}/${limit}`,
      method: 'post',
      data: queryInfo
    })
  },
  // 修改一条记录
  updateOneHistory(history) {
    return request({
      url: `${baseUrl}/update`,
      method: 'put',
      data: history
    })
  },
  // 删除一条记录
  delOneHistory(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'delete'
    })
  }
}
