//index.js
//获取应用实例
const app = getApp()
import { checkIsEmpty, examineToken, isTokenFailure } from '../../utils/util.js'
import { getToken, updateToken,userInfoShow } from '../../service/api/user.js'
import { TOKEN,USERINFO,VALIDTIME } from '../../common/const.js'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    token:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModal:true,//登录弹窗
    inaccount:'',//账号
    pwd:''//密码
  },
  onShow:function(){
    const token = wx.getStorageSync(TOKEN);
    const userinfo = wx.getStorageSync(USERINFO);
    console.log(userinfo);
    var that = this;
    if (isTokenFailure()) {
      // token有效
      that.data.token = token;
      that.setData({
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
    // if (app.globalData.userInfo) {
    //   that.setData({
    //     userInfo: app.globalData.userInfo,
    //     showModal: false
    //   })
    // }else {
    //  that.setData({
    //    showModal:true
    //  })
    // }

  },
  _getData:function(){
    this.getUserMsg();
  },
  getUserMsg:function(){//获取回收员信息
    var that = this;
    var requestData = {
      token: that.data.token
    }
    userInfoShow(requestData).then(res => {
      console.log(res);
      if (res.statusCode == 200) {
        wx.setStorage({
          key: USERINFO,
          data: res.data
        })
        that.setData({
          userInfo: res.data
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
  bluraccount:function(e){
    var that = this;
    that.setData({
      inaccount: e.detail.value
    })
  },
  blurpwd: function (e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
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
          this._getData();
          that.setData({
            showModal: false,
            token: token
          })
        }else{
          wx.showToast({
            title:'登陆失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})
