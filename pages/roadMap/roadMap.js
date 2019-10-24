const app = getApp()
import {
  examineToken,
  isTokenFailure,
  forbiddenReLaunch
} from '../../utils/util.js'
import {
  TOKEN
} from '../../common/const.js'
import {
  updateToken,
  getMyMachine
} from '../../service/api/user.js'
var QQMapWX = require('../../common/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
  key: 'OUTBZ-V6R3O-A7AW2-SLGR3-IF27F-VOFTS'
});
Page({
  data: {
    token: '',
    lat: '',
    lng: '',
    mapData: [],
    fullData: [
      {}
    ], //满箱数据
    polyline: [{
      points: [],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    markers: [],
    lastPoint: {},
    waypoints: '' //途经点
  },
  onShow: function() {
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
  onLoad: function(options) {

  },
  // 网络请求
  _getData() {
    this.getLocation();
    this.getFullMachine();
  },
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  onPullDownRefresh() { //下拉刷新
    this.getLocation();
    this.getFullMachine();
  },
  formSubmit() {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      //from: params.from,
      to: _this.data.lastPoint,
      waypoints: _this.data.waypoints,
      success: function(res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function(error) {
        console.error(error);
      }
    });
  },
  openMapChoose() { //打开地图
    wx.openLocation({
      latitude: Number(this.data.fullData[0].lat),
      longitude: Number(this.data.fullData[0].lng),
      scale: 18,
      address: this.data.fullData[0].address
    })
  },
  getFullMachine: function() { //获取满箱列表
    var that = this;
    var params = {
      token: that.data.token
    }
    var temp = [];
    getMyMachine(params).then(res => {
      wx.stopPullDownRefresh();
      if (res.statusCode == 403) {
        forbiddenReLaunch();
        return;
      } else if (res.statusCode == 200) {
        console.log(res.data.data);

        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].type_fabric.status == 'full' || res.data.data[i].type_paper.status == 'full') {
            temp.push(res.data.data[i]);
          }
        }
        that.setRoadLine(temp);
      }
    })
  },
  chosePoint: function(e) { //选择路线
    var that = this;
    var fullData = that.data.fullData;
    var waypoints = that.data.waypoints.split(';');
    if (e.markerId != fullData[0].id) {
      for (var i = 0; i < fullData.length; i++) {
        if (e.markerId == fullData[i].id) {
          fullData.splice(0, 0, fullData[i]);
          fullData.splice(i + 1, 1);

        }
      }

    }
    that.setRoadLine(fullData);
  },
  setRoadLine: function(roadData) { //路线规划
    var that = this;
    var markers = [];
    var polyline = [{
      points: [],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }];
    var lastPoint = {};
    var waypoints = ''; //途经点
    for (var i = 0; i < roadData.length; i++) {
      
      var temp1 = {
        latitude: roadData[i].lat,
        longitude: roadData[i].lng
      }
      var marker_temp = {
        iconPath: "../../assets/images/map/ad_icon.png",
        id: roadData[i].id,
        latitude: roadData[i].lat,
        longitude: roadData[i].lng,
        width: 30,
        height: 36
      }
      if (i < roadData.length - 1) {
        waypoints = waypoints + roadData[i].lat + ',' + roadData[i].lng + ';'
      } else if (i == roadData.length - 1) {
        lastPoint = roadData[i].lat + ',' + roadData[i].lng;
      }
      polyline[0].points.push(temp1);
      markers.push(marker_temp);
    }
    waypoints = waypoints.substring(waypoints, waypoints.length - 1)
    that.setData({
      polyline: polyline,
      markers: markers,
      fullData: roadData,
      lastPoint: lastPoint,
      waypoints: waypoints
    })
    if (roadData.length > 0) {
      that.formSubmit();
    } else {
      wx.showToast({
        title: '暂无满箱记录',
        icon: 'none',
        duration: 2000
      })
    }
  }
})