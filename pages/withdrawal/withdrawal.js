const app = getApp()
import { examineToken, isTokenFailure, checkIsEmpty } from '../../utils/util.js'
import { TOKEN, USERINFO } from '../../common/const.js'
import { updateToken, userInfoShow, withdrawal } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    currentIndex:-1,
    isnext:false,
    usefulMoney:0,
    fillNum:'',
    username:'',//收款人户名
    useraccount:'',//收款账号
    bankname:'',//银行名称
    bankad:''//开户银行
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
          url: '../../pages/login/login'
        })
      }
    }
  },
  // 网络请求
  _getData() {
    this.getUserMsg()
  },
  getUserMsg: function () {//获取回收员信息
    var that = this;
    var requestData = {
      token: that.data.token
    }
    userInfoShow(requestData).then(res => {
      if (res.statusCode == 200) {
        that.setData({
          usefulMoney: res.data.money
        })
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
  giveAll:function(){//提现全部
    this.setData({
      fillNum: this.data.usefulMoney,
      isnext: true
    })
  },
  onPullDownRefresh() { //下拉刷新
    
  },
  getFillVal:function(e){
    var num = e.detail.value;
    var that = this;
    if (num){
      that.setData({
        fillNum: num
      })
    }else{
      that.setData({
        fillNum: num
      })
    }
    this.isNextStep()
  },
  isNextStep:function(){
    var that = this;
    if (checkIsEmpty(that.data.username) == false && checkIsEmpty(that.data.useraccount) == false && checkIsEmpty(that.data.bankname) == false && checkIsEmpty(that.data.bankad) == false && checkIsEmpty(that.data.fillNum) == false){
      that.setData({
        isnext:true
      })
    }else{
      that.setData({
        isnext: false
      })
    }
  },
  blurname:function(e){//输入用户名
    var that = this;
    that.setData({
      username: e.detail.value
    })
    this.isNextStep()
  },
  bluraccount: function (e) {//输入用户名
    var that = this;
    that.setData({
      useraccount: e.detail.value
    })
    this.isNextStep()
  },
  blurbank: function (e) {//输入用户名
    var that = this;
    that.setData({
      bankname: e.detail.value
    })
    this.isNextStep()
  },
  blurbankAd: function (e) {//输入用户名
    var that = this;
    that.setData({
      bankad: e.detail.value
    })
    this.isNextStep()
  },
  formSubmit:function(e){
    console.log(e);
    var that = this;
    var param = {
      token: that.data.token,
      name: e.detail.value.name,
      bank: e.detail.value.bank,
      account: e.detail.value.account,
      money: that.data.fillNum,
      bank_name: e.detail.value.bankname
    }
    withdrawal(param).then(res => {
      console.log(res);
      if (res.statusCode == 201){
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 2000
        })
        var timer = setInterval(function () {
          wx.navigateBack({
            delta: 1
          })
          clearInterval(timer);
        }, 1000)
      } else if (res.statusCode == 422) {
        wx.showToast({
          title: res.data.errors.money[0],
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})