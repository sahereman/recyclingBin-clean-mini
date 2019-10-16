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
    timerNum: 60,
    account_true: false, //校验手机号码
    accountNum: '', //手机号
    truePhone: '', //真实手机号
    pwd_true: '', //校验密码
    pwd: '',
    verification_key: '',
    checkMsg: '', //验证码
    expired_at: '', //短信验证码过期时间
    isfinish: false,
    ishidePwd:true
  },
  onShow: function() {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    wx.getStorage({
      key: USERINFO,
      success(res) {
        var reg = /^(\d{3})(\d{4})(\d{4})$/;
        var matches = reg.exec(res.data.phone);
        var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3];
        that.setData({
          accountNum: res.data.phone,
          account_true: true,
          truePhone: res.data.phone
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
  changeShowPwd:function(){//展示或隐藏密码
    var that = this;
    var temp = that.data.ishidePwd;
    that.setData({
      ishidePwd: !temp
    })
  },
  getAccountVal: function(e) {
    var that = this;
    var tell = e.detail.value;
    var temp = that.data.account_true;
    var truePhone = tell.replace(/\s*/g, "");
    if (isPoneAvailable(tell)) {
      temp = true;
    } else {
      temp = false;
    }

    // if (tell.length == 3 || tell.length == 8) {
    //   if (tell.length > that.data.accountNum.length) {
    //     tell = tell + " "
    //   }
    // }
    if (that.data.pwd_true == true && that.data.checkMsg == true && temp == true) {
      that.setData({
        account_true: temp,
        accountNum: tell,
        truePhone: truePhone,
        isfinish:true
      })
    } else {
      that.setData({
        account_true: temp,
        accountNum: tell,
        truePhone: truePhone,
        isfinish: false
      })
    }
  },
  // 获取验证码
  _sendVerification() {
    var that = this;
    if (that.data.account_true == true) {
      console.log(that.data.token);
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
    //var temp = that.checkPwd(e.detail.value);
    var temp = false;
    if (e.detail.value.length >= 6){
      temp = true;
    }
    if (temp && that.data.checkMsg && that.data.account_true) {
      that.setData({
        pwd_true: temp,
        pwd: e.detail.value,
        isfinish: true
      })
    } else {
      that.setData({
        pwd_true: temp,
        pwd: e.detail.value,
        isfinish: false
      })
    }
  },
  getMsgVal: function(e) { //验证码
  var that = this;
    if (that.data.pwd_true && e.detail.value && that.data.account_true) {
      that.setData({
        checkMsg: e.detail.value,
        isfinish: true
      })
    } else {
      that.setData({
        checkMsg: e.detail.value,
        isfinish: false
      })
    }
  },
  formSubmit(e) { //修改密码
    var that = this;
    if (!that.data.account_true) {
      wx.showToast({
        title: '请输入11位正确手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.verification_key) {
      wx.showToast({
        title: '请先获取验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.msgNum) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.pwd_true) {
      wx.showToast({
        title: '请输入6-16位数字字母组合密码',
        icon: 'none',
        duration: 2000
      })
    } else {
      var requestData = {
        phone: that.data.accountNum,
        verification_key: that.data.verification_key,
        verification_code: e.detail.value.msgNum,
        password: e.detail.value.pwd,
        password_confirmation: e.detail.value.pwd
      }
      resetPwd(requestData).then(res => {
        console.log(res);
        if (res.statusCode == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.clearStorage();
          var timer = setInterval(function () {
            wx.reLaunch({
              url: '../../pages/login/login'
            })
            clearInterval(timer);
          }, 2000)
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
  },
  checkPwd: function(pwd) {
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    var re = new RegExp(reg)
    if (re.test(pwd)) {
      return true;
    } else {
      return false;
    }
  }
})