import request from '@/utils/request'

const baseUrl = '/scenic/description'

export default {
  // 添加景点描述信息
  saveDescription(description) {
    return request({
      url: `${baseUrl}/save`,
      method: 'post',
      data: description
    })
  },
  // 根据ID获取景点提示信息
  getDescriptionById(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'get'
    })
  },
  // 更新数据库信息
  updateDescription(description) {
    return request({
      url: `${baseUrl}/update`,
      method: 'put',
      data: description
    })
  }
}
