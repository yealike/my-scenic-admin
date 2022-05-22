import request from '@/utils/request'

const baseUrl = '/scenic/city'

export default {
  // 按照省市结构获取城市列表
  getCityListWithProvince() {
    return request({
      url: `${baseUrl}/list`,
      method: 'get'
    })
  },
  // 新增城市
  insertNewCity(city) {
    return request({
      url: `${baseUrl}/save`,
      method: 'post',
      data: city
    })
  },
  // 删除城市
  removeCityByName(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'delete'
    })
  },
  // 修改城市名称
  updateCityById(city) {
    return request({
      url: `${baseUrl}/`,
      method: 'put',
      data: city
    })
  }
}
