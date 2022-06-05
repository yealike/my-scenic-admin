/**
 * 酒店管理API
 */
import request from '@/utils/request'

const baseUrl = '/scenic/hotel'

export default {
  // 获取酒店分页数据
  getPage(queryInfo, current, limit) {
    return request({
      url: `${baseUrl}/query/${current}/${limit}`,
      method: 'post',
      data: queryInfo
    })
  },
  // 获取必要查询条件
  getCategory() {
    return request({
      url: `${baseUrl}/category`,
      method: 'get'
    })
  },
  // 修改酒店信息
  updateHotel(hotel) {
    return request({
      url: `${baseUrl}/update`,
      method: 'PUT',
      data: hotel
    })
  },
  // 删除酒店信息
  delOneHotel(id){
    return request({
      url: `${baseUrl}/${id}`,
      method: 'DELETE'
    })
  },
  // 根据id查询酒店
  getHotelById(id){
    return request({
      url: `${baseUrl}/${id}`,
      method: 'GET'
    })
  }
}
