const app = getApp()
import { examineToken, isTokenFailure } from '../../utils/util.js'
import { TOKEN, USERINFO } from '../../common/const.js'
import { updateToken, fillMyCount } from '../../service/api/user.js'
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
    const userinfo = wx.getStorageSync(USERINFO);
    var that = this;
    if (!userinfo.wx_openid) {
      wx.reLaunch({
        url: '../../pages/login/login'
      })
    }
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
          url: '../../pages/login/login'
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
    var num = e.detail.value;
    var that = this;
    if (num>0){
      that.setData({
        isnext: true,
        fillNum: num,
        currentIndex:-1
      })
    }else{
      that.setData({
        isnext: false,
        fillNum: num,
        currentIndex:-1
      })
    }
  },
  goWeChatPay:function(){//充值
    var that = this;
    var param = {
      token: that.data.token,
      money: that.data.fillNum
    }
    fillMyCount(param).then(res => {
      console.log(res);
      if (res.statusCode == 200){
        wx.requestPayment({
          timeStamp: res.data.wx_pay.timestamp,
          nonceStr: res.data.wx_pay.nonceStr,
          package: res.data.wx_pay.package,
          signType: res.data.wx_pay.signType,
          paySign: res.data.wx_pay.paySign,
          success(response) {
            wx.showToast({
              title: '充值成功',
              icon: 'success',
              duration: 2000
            })
            var timer = setInterval(function () {
              wx.navigateBack({
                delta: 1
              })
              clearInterval(timer);
            }, 1000)
          },
          fail(response) {
            wx.showToast({
              title: '充值失败,请稍后重试',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }else{
        wx.showToast({
          title: res.errMsg.money[0],
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})