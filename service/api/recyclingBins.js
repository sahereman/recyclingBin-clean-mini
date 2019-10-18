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

// 扫码开箱
export function scanSuccess(requestData) {
  return request({
    url: 'bins/qrLogin',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      token: requestData.resultToken,
    }
  })
} 


