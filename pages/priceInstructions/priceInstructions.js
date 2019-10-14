const app = getApp()
import { examineToken, isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
import { getNewPrice } from '../../service/api/recyclingBins.js'

Page({
  data: {
    token:'',
    priceData:[]
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
  onLoad: function(options) {

  },
  // 网络请求
  _getData() {
    this.getNewPriceData();
  },
  onPullDownRefresh() { //下拉刷新
    this.getNewPriceData();
  },
  getNewPriceData: function () {//获取最新价格  getNewPrice
    var that = this;
    var params = {
      token: that.data.params
    }
    getNewPrice(params).then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200) {
        that.setData({
          priceData:res.data.data
        })
      }
    })
  }
})