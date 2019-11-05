const app = getApp()
import { isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
Page({
  data: {
    token:'',
    tell: app.globalData.phoneNumber
  },
  onShow: function () {
    
  },
  onLoad: function(options) {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      that.setData({
        token: token,
        tell: app.globalData.phoneNumber
      })
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

  },
  onPullDownRefresh() { //下拉刷新
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function (options) {
    return {
      title: '小黑点回收员',
      path: '/pages/index/index',
      imageUrl: '../../assets/images/aboutUs/share_img.png'
    }
  },
})