const app = getApp()
import { examineToken, isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken, getMyMachine } from '../../service/api/user.js'
Page({
  data: {
    token: '',
    orderLists: [],
    machineData:[],
    currentIndex:0,
    tabData:[
      {
        name:'全部'
      },
      {
        name: '正常'
      },
      {
        name: '满箱'
      }
    ],
    isFixed:false//导航栏是否浮动
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
  onLoad: function (options) {
 
  },
  // 网络请求
  _getData() {
    this.getOrderList();
  },
  getOrderList: function () {
    var that = this;
    var params = {
      token: that.data.token
    }
    getMyMachine(params).then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200) {
        console.log(res.data.data);
        that.setData({
          orderLists: res.data.data,
          machineData: res.data.data
        })
      }
    })
  },
  onPullDownRefresh() {//下拉刷新
    var that = this;
    that.setData({
      orderLists: []
    })
    that.getOrderList();
  },
  changeList:function(e){//tab切换
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var that = this;
    var temp = [];
    var orderLists = that.data.orderLists;
    if(index == 0){
      temp = orderLists;
    }else if(index == 1){
      for (var i = 0; i < orderLists.length; i++) {
        if (orderLists[i].type_fabric.status == 'normal' && orderLists[i].type_paper.status == 'normal') {
          temp.push(orderLists[i])
        }
      }
    } else if (index == 2) {
      for (var i = 0; i < orderLists.length; i++) {
        if (orderLists[i].type_fabric.status == 'full' || orderLists[i].type_paper.status == 'full') {
          temp.push(orderLists[i])
        }
      }
    }
    
    that.setData({
      currentIndex: e.currentTarget.dataset.index,
      machineData: temp
    })
  },
  onPageScroll:function(res){
    var that = this;
    var isFixed = that.data.isFixed;
    const query = wx.createSelectorQuery()
    query.select('#banner_part').boundingClientRect()
    query.exec(function (rel) {
      if (res.scrollTop > rel[0].height && isFixed == false) {
        that.setData({
          isFixed:true
        })
      } else if (res.scrollTop < rel[0].height && isFixed == true){
        that.setData({
          isFixed: false
        })
      }
    }) 
  }
})