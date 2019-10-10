const app = getApp()
import {  examineToken, isTokenFailure } from '../../utils/util.js'
import { getOrderDetail } from '../../service/api/order.js'
import { TOKEN } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
Page({
  data: {
    token:'',
    orderMsg:{},
    order_id:''
  },
  onShow:function(){
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
    this.setData({
      order_id: options.order_id
    })
  },
  // 网络请求
  _getData(){
    this.getDetail()
  },
  getDetail: function (){
    var that = this;//that.data.order_id
    var params = {
      order_id: that.data.order_id,
      token: that.data.token
    }
    getOrderDetail(params).then(res => {
      console.log(res.data);
      wx.stopPullDownRefresh();
      if (res.statusCode == 200) {
        that.setData({
          orderMsg: res.data
        })
      }

    })
  },
  onPullDownRefresh() {//下拉刷新
    var that = this;
    that.setData({
      orderMsg:{}
    })
    that.getDetail();
  }
})