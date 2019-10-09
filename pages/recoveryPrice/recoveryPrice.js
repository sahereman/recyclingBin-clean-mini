const app = getApp()
import { examineToken, isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken, getMyMachine } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    page: 1,
    orderLists: [],
    total_pages: 1//总页数
  },
  onShow: function () {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      that.data.token = token;
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
    this.getOrderList();
  },
  getOrderList: function () {
    var that = this;
    var params = {
      token: that.data.token
    }
    getMyMachine(params).then(res => {
      wx.stopPullDownRefresh();
      console.log(res.data.data);
      if (res.statusCode == 200) {
        that.setData({
          orderLists: res.data.data
        })
      }
    })
  },
  onPullDownRefresh() {//下拉刷新
    var that = this;
    that.setData({
      orderLists: []
    })
    that.getOrderList();
  },
  onReachBottom: function () {
    var that = this;
    that.getOrderList();
  }
})