const app = getApp()
import { examineToken, isTokenFailure, forbiddenReLaunch } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken, getMyOrder } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    page:1,
    total_pages:1,
    orderList:[],
    isLast:false,
    isInit:false
  },
  onLoad: function(options) {

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
  // 网络请求
  _getData() {
    this.getMyorder()
  },
  getMyorder:function(){//获取我的工蚁账单
    var that = this;
    var orderList = that.data.orderList;
    var page = that.data.page;
    var param = {
      token: that.data.token,
      page: page
    }
    getMyOrder(param).then(res => {
      console.log(res);
      wx.stopPullDownRefresh();
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      } else if (res.statusCode == 200){
        page++;
        for(var i=0;i<res.data.data.length;i++){
          orderList.push(res.data.data[i]);
        }
        that.setData({
          orderList: orderList,
          page: page,
          total_pages: res.data.meta.pagination.total_pages,
          isInit:true
        })
      }
    })
  },
  onPullDownRefresh() { //下拉刷新
    var that = this;
    that.setData({
      isLast:false,
      isInit:false,
      orderList:[],
      page:1,
      total_pages:1
    })
    that.getMyorder();
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.page <= that.data.total_pages) {
      that.getMyorder();
    } else {
      that.setData({
        isLast: true
      })
    }
  }
})