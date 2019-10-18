const app = getApp()
import { isTokenFailure } from '../../utils/util.js'
import { TOKEN, USERINFO } from '../../common/const.js'
import { updateToken, userInfoShow } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    username:'',
    user_tell: '',
    user_head:''
  },
  onShow: function () {
    
  },
  onLoad: function (options) {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    const userinfo = wx.getStorageSync(USERINFO);
    if (!userinfo.wx_openid) {
      wx.reLaunch({
        url: '../../pages/index/index'
      })
    }
    if (isTokenFailure()) {
      // token有效
      that.setData({
        token: token
      })
      that._getData()
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        // 刷新token
        updateToken(token, that);
      } else {
        //跳转首页 重新登陆
        wx.reLaunch({
          url: '../../pages/login/login'
        })
      }
    }
  },
  // 网络请求
  _getData() {
    this.getUserMsg()
  },
  getUserMsg: function () {//获取回收员信息
    var that = this;
    var requestData = {
      token: that.data.token
    }
    userInfoShow(requestData).then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200) {
        var reg = /^(\d{3})\d{4}(\d{4})$/
        var _temp = res.data.phone;
        that.setData({
          user_tell: _temp.replace(reg, '$1****$2'),
          username: res.data.name,
          user_head: res.data.avatar_url
        })
        wx.setStorage({
          key: USERINFO,
          data: res.data
        })
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onPullDownRefresh() {//下拉刷新
    this.getUserMsg()
  }
})