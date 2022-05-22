/**
 * 旅游景点信息api
 * 后端controller===>InformationController
 */
import request from '@/utils/request'

const baseUrl = '/scenic/information'

export default {
  // 新增提示
  saveTips(Tips) {
    return request({
      url: `${baseUrl}/save`,
      method: 'post',
      data: Tips
    })
  },
  // 修改提示
  updateTips(Tips) {
    return request({
      url: `${baseUrl}/update`,
      method: 'put',
      data: Tips
    })
  },
  // 根据ID获取提示信息
  getTipsById(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'get'
    })
  }
}
