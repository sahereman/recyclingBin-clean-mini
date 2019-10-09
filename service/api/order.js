// 订单相关相关
import request from '../network.js'

// 获取订单列表
export function getTopicCategories(requestData) {
  return request({
    url: 'orders?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
} 