/**
 * 景点价格列表APi
 */
import request from '@/utils/request'

const baseUrl = '/scenic/price'

export default {
  // 根据景点ID查询价格列表
  getPriceListById(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'get'
    })
  },
  // 修改景点价格
  updatePriceByScenicId(price) {
    return request({
      url: `${baseUrl}/update`,
      method: 'put',
      data: price
    })
  },
  // 删除景点某个价格
  deletePrice(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'delete'
    })
  },
  // 添加一个景点价格
  saveScenicPrice(price) {
    return request({
      url: `${baseUrl}/save`,
      method: 'post',
      data: price
    })
  }
}
