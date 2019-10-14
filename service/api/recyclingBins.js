// 回收箱相关
import request from '../network.js'

// 获取最新回收价格
export function getNewPrice(requestData) {
  return request({
    url: 'cleanPrices',
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
} 
