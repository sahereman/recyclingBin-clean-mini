//index.js 
//获取应用实例 
const app = getApp()
import { checkIsEmpty, examineToken, isTokenFailure } from '../../utils/util.js'
import { getToken, updateToken, userInfoShow, getUserOpenid } from '../../service/api/user.js'
import { TOKEN, USERINFO, VALIDTIME } from '../../common/const.js'
Page({
  data: {
    avatar_url: '',
    username: '',
    userInfo: {},
    token: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onShow: function () {
    const token = wx.getStorageSync(TOKEN);
    const userinfo = wx.getStorageSync(USERINFO);
    var that = this;
    if (isTokenFailure()) {
      // token有效 
      var temp = false;
      if (!userinfo.wx_openid) {
        temp = true;
      }
      that.setData({
        token: token,
        userinfo: userinfo
      })
      that._getData();
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                console.log("用户地理位置授权成功")
              },
              fail() {
                console.log("用户地理位置授权失败")
              }
            })
          }
        }
      })
    } else {
      // token无效 
      if (token && token.length != 0) {
        // 当token存在只需要进行更新 
        // 刷新token 
        updateToken(token, that);
      } else {
        // token不存在需用户重新登录 
        wx.reLaunch({
          url: '../../pages/login/login'
        })
      }
    }
  },
  onLoad: function () {
    var that = this;
  },
  _getData: function () {
    this.getUserMsg();
  },
  getUserMsg: function () {//获取回收员信息 
    var that = this;
    var requestData = {
      token: that.data.token
    }
    userInfoShow(requestData).then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200) {
        that.setData({
          userInfo: res.data,
          avatar_url: res.data.avatar_url,
          username: res.data.name
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
  scanGetGoods: function () {//扫码取货 
    const that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result) {
          if (res.result.split('/')[2] != 'www.gongyihuishou.com') {
            wx.showModal({
              title: '二维码识别识别',
              content: '请扫描工蚁回收相关二维码',
              confirmText: '重新扫描',
              success(res) {
                if (res.confirm) {
                  that.scanGetGoods();
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else {
            const requestData = {
              token: token,
              resultToken: res.result.split("?")[1].split('=')[1]
            }
            // scanSuccess(requestData).then(res => { 
            //   if (res.statusCode == 422) { 
            //     wx.showModal({ 
            //       title: '二维码识别识别', 
            //       content: '请扫描工蚁回收相关二维码', 
            //       confirmText: '重新扫描', 
            //       success(res) { 
            //         if (res.confirm) { 
            //           that.getScanCode(); 
            //         } else if (res.cancel) { 
            //           console.log('用户点击取消') 
            //         } 
            //       } 
            //     }) 
            //   }  
            // }).catch(res => { 
            //   console.log(res) 
            // }) 
          }
        }
      }
    })
  },
  onPullDownRefresh() {//下拉刷新 
    var that = this;
    that.getUserMsg();
  },
  goRoadMap: function () {//进入路线规划 
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)
              res.authSetting = {
                "scope.userLocation": true
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../../pages/roadMap/roadMap'
          })
        }
      }
    })
  }
}) 