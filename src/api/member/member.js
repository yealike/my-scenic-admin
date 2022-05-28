import request from '@/utils/request'

const baseUrl = '/member/member'

export default {
  // 获取注册用户列表
  getUserList(current, limit, queryInfo) {
    return request({
      url: `${baseUrl}/user/${current}/${limit}`,
      method: 'post',
      data: queryInfo
    })
  },
  // 修改显示状态
  updateStatus(statusInfo) {
    return request({
      url: `${baseUrl}/update`,
      method: 'PUT',
      data: statusInfo
    })
  },
  // 删除一条记录
  deleteOne(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'delete'
    })
  },
  // 修改一条记录
  updateOne(updateInfo) {
    return request({
      url: `${baseUrl}/updateUser`,
      method: 'put',
      data: updateInfo
    })
  }
}
