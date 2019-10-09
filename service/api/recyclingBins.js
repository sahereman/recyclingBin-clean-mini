// 回收箱相关
import request from '../network.js'

// 获取距离最近的回收箱
export function getNearbyBin(requestData) {
  return request({
    url: 'bins/nearby',
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    data: {
      lat: requestData.lat,
      lng: requestData.lng
    }
  })
} 
// 获取回收箱列表
export function getBinLists(requestData) {
  let url = '';
  if (requestData.page == 1){
    url = 'bins?page=' + requestData.page
  }else {
    url = 'bins?lat=' + requestData.lat + '&lng=' + requestData.lng + '&count=' + requestData.count +'&page=' + requestData.page
  }
  return request({
    url: url,
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    data: {
      lat: requestData.lat,
      lng: requestData.lng,
      count: requestData.count
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

// 判读投递是否成功
export function checkscanSuccess(requestData) {
  return request({
    url: 'bins/orderCheck/' + requestData.token_id,
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    showloading:1
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

// 解密手机号
export function getPhoneNumberajax(requestData) {
  return request({
    url: 'wechats/decryptedData',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data: {
      encryptedData: requestData.encryptedData,
      iv: requestData.iv
    }
  })
}
