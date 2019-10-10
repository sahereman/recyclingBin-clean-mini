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
// 获取订单详情
export function getOrderDetail(requestData) {
  return request({
    url: 'orders/' + requestData.order_id,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
} 