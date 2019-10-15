const app = getApp()
import { isTokenFailure } from '../../utils/util.js'
import { TOKEN, USERINFO } from '../../common/const.js'
import { updateToken, userInfoShow } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    userInfo:{}
  },
  onShow: function () {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
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
          url: '../../pages/index/index'
        })
      }
    }
  },
  onLoad: function (options) {

  },
  // 网络请求
  _getData() {
    this.getUserMsg();
  },
  getUserMsg: function () {//获取回收员信息
    var that = this;
    var requestData = {
      token: that.data.token
    }
    userInfoShow(requestData).then(res => {
      if (res.statusCode == 200) {
        that.setData({
          userInfo: res.data
        })
        console.log(res.data);
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
  onPullDownRefresh() { //下拉刷新
    this.getUserMsg();
  }
})