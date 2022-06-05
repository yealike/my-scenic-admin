import request from '@/utils/request'

const baseUrl = '/article/image'

export default {
  // 获取所有图片
  getAllWithPage(queryInfo, current, limit) {
    return request({
      url: `${baseUrl}/query/${current}/${limit}`,
      method: 'POST',
      data: queryInfo
    })
  },
  // 修改图片
  updateImage(imageInfo) {
    return request({
      url: `${baseUrl}/update`,
      method: 'PUT',
      data: imageInfo
    })
  },
  // 删除一张图片
  delOneImage(id) {
    return request({
      url: `${baseUrl}/${id}`,
      method: 'DELETE'
    })
  },
  // 添加一张图片
  addOneImage(imageInfo) {
    return request({
      url: `${baseUrl}/save`,
      method: 'POST',
      data: imageInfo
    })
  }

}
