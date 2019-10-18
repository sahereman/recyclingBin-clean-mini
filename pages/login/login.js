//index.js
//获取应用实例
const app = getApp()
import { checkIsEmpty, examineToken, isTokenFailure } from '../../utils/util.js'
import { getToken, updateToken, userInfoShow, getUserOpenid } from '../../service/api/user.js'
import { TOKEN,USERINFO,VALIDTIME } from '../../common/const.js'
Page({
  data: {
    userInfo: {},
    token:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModal:false,//登录弹窗
    inaccount:'',//账号
    pwd:'',//密码
    showBtn:false,
    show:false,
    ishidePwd:true,//隐藏密码
    green_line_state:1//输入键盘聚焦
  },
  onShow:function(){
    const token = wx.getStorageSync(TOKEN);
    const userinfo = wx.getStorageSync(USERINFO);
    var that = this;

    if (isTokenFailure()) {
      // token有效
      that.setData({
        token: token,
        showModal: false,
        userinfo: userinfo
      })
      that._getData()
    } else {
      // token无效
      if (token && token.length != 0) {
        // 当token存在只需要进行更新
        that.setData({
          showModal: false
        })
        // 刷新token
        updateToken(token, that);
      } else {
        //wx.hideTabBar(); 
        // token不存在需用户重新登录
        that.setData({
          showModal: true
        })
      }
    }
  },
  onLoad: function () {
    var that = this;
  },
  _getData:function(){
    var that = this;
    if (that.data.showModal == false && that.data.show == false){
      wx.reLaunch({
        url: '../../pages/index/index'
      })
    }
  },
  giveBotLine:function(e){
    this.setData({
      green_line_state: e.currentTarget.dataset.line
    })
  },
  bluraccount:function(e){
    var that = this;
    var temp = false;
    if (!checkIsEmpty(e.detail.value) && !checkIsEmpty(that.data.pwd)) {
      temp = true;
    } else{
      temp = false;
    }
    that.setData({
      inaccount: e.detail.value,
      showBtn: temp
    })
  },
  blurpwd: function (e) {
    var that = this;
    var temp = false;
    if (!checkIsEmpty(that.data.inaccount) && !checkIsEmpty(e.detail.value)) {
      temp = true;
    } else {
      temp = false;
    }
    that.setData({
      pwd: e.detail.value,
      showBtn: temp
    })
  },
  loginus: function (e) {
    var that = this;
    if (checkIsEmpty(that.data.inaccount)){
      wx.showToast({
        title: '账号不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (checkIsEmpty(that.data.pwd)){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.pwd.length<6){
      wx.showToast({
        title: '密码至少为6个字符',
        icon: 'none',
        duration: 2000
      })
    }else{
      var requestData = {
        username: that.data.inaccount,
        password: that.data.pwd
      }
      getToken(requestData).then( res => {
        console.log(res);
        if (res.statusCode == 422){
          wx.showToast({
            title: res.data.errors.username[0],
            icon: 'none',
            duration: 2000
          })
        } else if (res.statusCode == 201){
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 2000
          })
          const token = res.data.token_type + " " + res.data.access_token
          const validTime = res.data.expires_in
          // token和有效期存入缓存
          wx.setStorageSync(TOKEN, token)
          examineToken(validTime);
          that.setData({
            showModal: false,
            token: token
          })
          wx.reLaunch({
            url: '../../pages/index/index'
          })
          //that.getUserMsg();
        }else{
          wx.showToast({
            title:'登陆失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  // 获取用户信息
  getUserInfo(e) {
    var that = this;
    if (app.globalData.code) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        app.globalData.userInfo = e.detail.userInfo
        const requestData = {
          token:that.data.token,
          jsCode: app.globalData.code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
        // 获取token
        this.getOpenId(requestData);
      } else {
        this.setData({
          show: true
        })
      }
    } else {
      app.login()
    }
  },
  getUserMsg: function () {//获取回收员信息
    var that = this;
    var requestData = {
      token: that.data.token
    }
    userInfoShow(requestData).then(res => {
      if (res.statusCode == 200) {
        if (res.data.wx_openid){
          that.setData({
            userInfo: res.data,
            avatar_url: res.data.avatar_url,
            username: res.data.name
          })
          wx.setStorage({
            key: USERINFO,
            data: res.data
          })
          wx.reLaunch({
            url: '../../pages/index/index'
          })
        }else{
          that.setData({
            show:true
          })
        }
        
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getOpenId: function (requestData){
    var that = this;
    const userinfo = wx.getStorageSync(USERINFO);
    getUserOpenid(requestData).then(res => {
      if (res.statusCode == 200){
        that.setData({
          userinfo: userinfo,
          show:false
        })
        wx.setStorage({
          key: USERINFO,
          data: res.data
        })
        wx.reLaunch({
          url: '../../pages/index/index'
        })
      }
    })
  },
  changeShowPwd: function () {//展示或隐藏密码
    var that = this;
    var temp = that.data.ishidePwd;
    that.setData({
      ishidePwd: !temp
    })
  },
  onPullDownRefresh() { //下拉刷新
    this.setData({
      userInfo: {},
      inaccount: '',//账号
      pwd: '',//密码
      showBtn: false,
      ishidePwd: true,//隐藏密码
      green_line_state: 1//输入键盘聚焦
    })
    wx.stopPullDownRefresh();
  }
})
