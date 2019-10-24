const app = getApp()
import { isTokenFailure, forbiddenReLaunch } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken, loginOutUs } from '../../service/api/user.js'
Page({
  data: {
    token:''
  },
  onLoad: function(options) {

  },
  onShow: function () {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      that.setData({
        token: token
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
  loginOut:function(){//退出登录
    var that = this;
    var param = {
      token: that.data.token
    }
    loginOutUs(param).then(res => {
      console.log(res);
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      } else if (res.statusCode == 204){
        wx.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 2000
        })
        wx.clearStorage();
        var timer = setInterval(function () {
          wx.reLaunch({
            url: '../../pages/login/login'
          })
          clearInterval(timer);
        }, 2000)
      }else{
        wx.showToast({
          title: '操作失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})