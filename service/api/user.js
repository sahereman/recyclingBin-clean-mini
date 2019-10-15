// 用户相关
import request from '../network.js'
import { TOKEN } from '../../common/const.js'
import { examineToken } from '../../utils/util.js'

// 登录获取token
export function getToken(requestData) {
  return request({
    url: 'authorizations',
    method: "POST",
    data: {
      username: requestData.username,
      password: requestData.password
    }
  })
} 
// 刷新token
export function updateToken(requestData,page) {
  return request({
    url: 'authorizations',
    method: "PUT",
    header: {
      Authorization: requestData
    }
  }).then(res => {
    const token = res.data.token_type + " " + res.data.access_token
    const validTime = res.data.expires_in
    wx.setStorageSync(TOKEN, token)
    examineToken(validTime)
    page.data.token = token;
    console.log("刷新了token")
    page._getData()
  }).catch(res => {
    wx.setStorageSync(TOKEN, "")
  })
} 
// 删除token
export function deleteToken(requestData) {
  return request({
    url: 'authorizations',
    method: "DELETE",
    header: {
      Authorization: requestData
    }
  })
} 
// 发送手机验证码
export function sendVerification(requestData) {
  return request({
    url: 'sms/verification',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data: {
      phone: requestData.phone
    }
  })
} 
// 绑定手机号
export function bindPhone(requestData) {
  return request({
    url: 'users/bindPhone',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      phone: requestData.phone,
      verification_key: requestData.verification_key,
      verification_code: requestData.verification_code
    }
  })
}
// 获取用户信息
export function userInfoShow(requestData) {
  return request({
    url: 'recyclers/show',
    method: "GET",
    header: {
      Authorization: requestData.token
    },
  })
}

// 获取用户openid
export function getUserOpenid(requestData) {
  return request({
    url: 'recyclers/wechatAuthorization',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data:{
      jsCode: requestData.jsCode,
      iv: requestData.iv,
      encryptedData: requestData.encryptedData,
    }
  })
}
// 获取金钱账单列表
export function getBillList(requestData) {
  return request({
    url: 'users/moneyBill?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    },
    data:{
      type: requestData.type,
      date: requestData.date
    }
  })
}
// 用户银联提现
export function withdrawal(requestData) {
  return request({
    url: 'recyclers/withdraw/unionPay',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data: {
      name: requestData.name,
      bank: requestData.bank,
      account: requestData.account,
      money: requestData.money,
      bank_name: requestData.bank_name
    }
  })
}
// 用户实名认证
export function realAuthentication(requestData) {
  return request({
    url: 'users/real_authentication',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      real_name: requestData.real_name,
      real_id: requestData.real_id
    }
  })
}

// 获取消息提醒列表
export function getMessageData(requestData) {
  return request({
    url: 'recyclers/notifications?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
}

// 回收员重置密码
export function resetPwd(requestData) {
  return request({
    url: 'recyclers/passwordReset',
    method: "PUT",
    header: {
      Authorization: requestData.token
    },
    data: {
      phone: requestData.phone,
      verification_key: requestData.verification_key,
      verification_code: requestData.verification_code,
      password: requestData.password,
      password_confirmation: requestData.password_confirmation
    }
  })
}

// 获取我的回收机
export function getMyMachine(requestData) {
  return request({
    url: 'recyclers/bins?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
}

// 获取我的工蚁账单
export function getMyOrder(requestData) {
  return request({
    url: 'recyclers/moneyBill?page=' + requestData.page,
    method: "GET",
    header: {
      Authorization: requestData.token
    }
  })
}

// 充值
export function fillMyCount(requestData) {
  return request({
    url: 'deposits/wechat',
    method: "POST",
    header: {
      Authorization: requestData.token
    },
    data:{
      money: requestData.money	
    }
  })
}