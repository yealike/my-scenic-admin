import request from '@/utils/request'

const baseUrl = '/scenic/scenic'

export default {
  // 获取景点列表
  getScenicList(current, limit, queryInfo) {
    return request({
      url: `${baseUrl}/page/${current}/${limit}`,
      method: 'post',
      data: queryInfo
    })
  },
  // 根据id删除景点
  deleteScenicById(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'delete'
    })
  },
  // 根据id获取景点基本数据
  getScenicById(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'get'
    })
  },
  // 修改景点基本信息
  updateScenic(scenicInfo) {
    return request({
      url: `${baseUrl}/update`,
      method: 'put',
      data: scenicInfo
    })
  },
  // 添加景点基本数据
  addScenic(scenic) {
    return request({
      url: `${baseUrl}/save`,
      method: 'post',
      data: scenic
    })
  },
  // 上传图片
  addImage(image) {
    return request({
      url: `${baseUrl}/oss`,
      method: 'post',
      data: image
    })
  }
}
