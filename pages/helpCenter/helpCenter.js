const app = getApp()
import { isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
Page({
  data: {
    helpData: [
      {
        ques: '1，如何在回收机断网时候取货？',
        ans: '如果回收机处于断网状态是无法进行取货操作,请等待回收机网络恢复正常后在前往回收机进行取货。',
        isOpen: true
      },
      {
        ques: '2，如何在回收机断网时候取货？',
        ans: '如果回收机处于断网状态是无法进行取货操作,请等待回收机网络恢复正常后在前往回收机进行取货。',
        isOpen: false
      },
      {
        ques: '3，如何在回收机断网时候取货，回收机断网时候取货不成功怎么办？',
        ans: '如果回收机处于断网状态是无法进行取货操作,请等待回收机网络恢复正常后在前往回收机进行取货。',
        isOpen: false
      },
      {
        ques: '4，如何在回收机断网时候取货？',
        ans: '如果回收机处于断网状态是无法进行取货操作,请等待回收机网络恢复正常后在前往回收机进行取货。',
        isOpen: false
      },
      {
        ques: '5，如何在回收机断网时候取货，回收机断网时候取货不成功怎么办？',
        ans: '如果回收机处于断网状态是无法进行取货操作,请等待回收机网络恢复正常后在前往回收机进行取货。',
        isOpen: false
      },
      {
        ques: '6，如何在回收机断网时候取货？',
        ans: '如果回收机处于断网状态是无法进行取货操作,请等待回收机网络恢复正常后在前往回收机进行取货。',
        isOpen: false
      }
    ]
  },
  onLoad: function (options) {
    var that = this;
    const token = wx.getStorageSync(TOKEN);
    if (isTokenFailure()) {
      // token有效
      that.setData({
        token: token
      })
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
  onPullDownRefresh() {//下拉刷新
   
  },
  openQues:function(e){//展开
    console.log(e.currentTarget.dataset.index);
    var that = this;
    var currentIndex = e.currentTarget.dataset.index;
    var helpData = that.data.helpData;
    helpData[currentIndex].isOpen = !helpData[currentIndex].isOpen;
    that.setData({
      helpData: helpData
    })
  },
  tellUs:function(){//拨打电话
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneNumber //仅为示例，并非真实的电话号码
    })
  },
  onPullDownRefresh() { //下拉刷新
    wx.stopPullDownRefresh();
  },
})