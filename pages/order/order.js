const app = getApp()
import {  examineToken, isTokenFailure } from '../../utils/util.js'
import { getTopicCategories } from '../../service/api/order.js'
import { TOKEN } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
Page({
  data: {
    token:'',
    page:1,
    orderLists:[],
    isLast:false,//最后一页
    total_pages:1//总页数
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
    
  },
  // 网络请求
  _getData(){
    this.getOrderList();
  },
  getOrderList:function(){
    var that = this;
    var orderLists = that.data.orderLists;
    var page = that.data.page;
    var params = {
      page: page,
      token:that.data.token
    }
    getTopicCategories(params).then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200){
        page++;
        for (var i = 0; i < res.data.data.length; i++) {
          orderLists.push(res.data.data[i]);
          console.log(res.data.data[i]);
        }
        that.setData({
          orderLists: orderLists,
          page: page,
          total_pages:res.data.meta.pagination.total_pages
        })
      }
      
    })
    
  },
  onPullDownRefresh() {//下拉刷新
    var that = this;
    that.setData({
      page:1,
      total_pages:1,
      orderLists:[],
      isLast:false
    })
    that.getOrderList();
  },
  onReachBottom:function(){
    var that = this;
    if (that.data.page <= that.data.total_pages){
      that.getOrderList();
    }else{
      that.setData({
        isLast:true
      })
    }
  }
})