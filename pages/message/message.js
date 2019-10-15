const app = getApp()
import { isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken, getMessageData } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    page:1,
    total_pages:1,//总页码
    msgList:[],
    isLast:false
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
  onLoad: function(options) {

  },
  // 网络请求
  _getData() {
    this.getMsgData();
  },
  getMsgData:function(){
    var that = this;
    var msgList = that.data.msgList;
    var page = that.data.page;
    var param = {
      token: that.data.token,
      page: page
    }
    getMessageData(param).then(res => {
      wx.stopPullDownRefresh();
      console.log(res);
      if (res.statusCode == 200){
        page++;
        for(var i = 0;i < res.data.data.length;i++){
          msgList.push(res.data.data[i]);
        }
        that.setData({
          page: page,
          msgList: msgList,
          total_pages: res.data.meta.pagination.total_pages
        })
      }
    })
  },
  onPullDownRefresh() { //下拉刷新
    this.setData({
      page: 1,
      msgList: [],
      total_pages:1,
      isLast: false
    })
    this.getMsgData();
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.page <= that.data.total_pages) {
      that.getMsgData();
    } else {
      that.setData({
        isLast: true
      })
    }
  }
})