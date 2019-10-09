import {
  checkIsEmpty,
  examineToken,
  isTokenFailure,
  isPoneAvailable
} from '../../utils/util.js'
import {
  updateToken,
  sendVerification,
  resetPwd
} from '../../service/api/user.js'
import {
  TOKEN,
  USERINFO
} from '../../common/const.js'
Page({
  data: {
    token: '',
    closeTimerNum: true,
    timerNum: 10,
    account_true: false, //校验手机号码
    accountNum: '', //手机号
    pwd_true: '', //校验密码
    pwd: '',
    repwd_true: false, //校验二次密码输入
    rePwd: '',
    verification_key: '',
    expired_at: '' //短信验证码过期时间
  },
  onShow: function() {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    wx.getStorage({
      key: USERINFO,
      success(res) {
        that.setData({
          accountNum: res.data.phone
        })
      }
    })
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

  },
  onPullDownRefresh() { //下拉刷新
    
  },
  getAccountVal: function(e) {
    var that = this;
    var temp = that.data.account_true
    if (isPoneAvailable(e.detail.value)) {
      temp = true;
    } else {
      temp = false;
    }
    that.setData({
      account_true: temp,
      accountNum: e.detail.value
    })
  },
  // 获取验证码
  _sendVerification() {
    var that = this;
    if (that.data.account_true == true) {
      const requestData = {
        token: that.data.token,
        phone: that.data.accountNum
      }
      that.setData({
        closeTimerNum: false
      })
      var timerNumtemp = that.data.timerNum;

      that.data.timer = setInterval(function() {
        timerNumtemp--;
        that.setData({
          timerNum: timerNumtemp
        })
        if (timerNumtemp <= 0) {
          clearInterval(that.data.timer);
          that.setData({
            closeTimerNum: true
          })
        }

      }, 1000)

      sendVerification(requestData).then(res => {
        console.log(res);
        if (res.statusCode == 201) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            verification_key: res.data.verification_key,
            expired_at: res.data.expired_at
          })
        } else if (res.statusCode == 422) {
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            duration: 2000
          })
        }

      }).catch(res => {
        console.log(res);
      })
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getPwdVal: function(e) { //校验密码
    var that = this;
    var temp = that.data.pwd_true;
    var temp2 = that.data.repwd_true;
    if (e.detail.value.length >= 6 && e.detail.value.length < 20) {
      temp = true;
      if (e.detail.value == that.data.rePwd){
        temp2 = true;
      }else{
        temp2 = false;
      }
    } else {
      temp = false;
    }
    that.setData({
      pwd_true: temp,
      pwd: e.detail.value,
      repwd_true:temp2
    })
  },
  getrePwdVal: function (e){//校验二次密码
    var that = this;
    var temp = that.data.repwd_true;
    if (e.detail.value.length >= 6 && e.detail.value.length < 20 && e.detail.value == that.data.pwd) {
      temp = true;
    } else {
      temp = false;
    }
    that.setData({
      repwd_true: temp,
      rePwd: e.detail.value
    })
  },
  formSubmit(e) {//修改密码
    var that = this;
    console.log(e.detail.value);
    // if (!that.data.account_true) {
    //   wx.showToast({
    //     title: '请输入11位正确手机号',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else 
    if (!that.data.verification_key) {
      wx.showToast({
        title: '请先获取验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.msgNum){
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.pwd_true) {
      wx.showToast({
        title: '请输入6~20位密码',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.repwd_true) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 2000
      })
    }else{
      var requestData = {
        phone: that.data.accountNum,
        verification_key: that.data.verification_key,
        verification_code: e.detail.value.msgNum,
        password: e.detail.value.pwd,
        password_confirmation: e.detail.value.rePwd
      }
      resetPwd(requestData).then(res => {
        console.log(res);
        if (res.statusCode == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.statusCode == 422) {
          wx.showToast({
            title: res.data.errors.verification_code[0],
            icon: 'none',
            duration: 2000
          })
        }

      }).catch(res => {
        console.log(res);
      })
    }
  }
})