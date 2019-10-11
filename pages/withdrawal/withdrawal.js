const app = getApp()
import { examineToken, isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken, getMyOrder } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    choseNum:[20,50,100],
    currentIndex:-1,
    isnext:false
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
    
  },
  onPullDownRefresh() { //下拉刷新
    
  },
  choseNum:function(e){//选择充值金额
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.num;
    console.log(index);
    var that = this;
    that.setData({
      currentIndex: index,
      isnext:true,
      fillNum: num
    })
  },
  getFillVal:function(e){
    console.log(e.detail.value);
    var num = e.detail.value;
    var that = this;
    if (num){
      that.setData({
        isnext: true,
        fillNum: num
      })
    }else{
      that.setData({
        isnext: false,
        fillNum: num
      })
    }
  }
})