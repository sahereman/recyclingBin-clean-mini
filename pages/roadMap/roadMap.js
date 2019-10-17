const app = getApp()
import { examineToken, isTokenFailure } from '../../utils/util.js'
import { TOKEN } from '../../common/const.js'
import { updateToken } from '../../service/api/user.js'
var QQMapWX = require('../../common/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
  key: 'OUTBZ-V6R3O-A7AW2-SLGR3-IF27F-VOFTS'
});
Page({
  data: {
    token: '',
    lat:'',
    lng:'',
    mapData:[],
    polyline:[{
      points:[
        {
          latitude: 36.08543,
          longitude: 120.37479
        },
        {
          latitude: 36.08943,
          longitude: 120.37779
        },
        {
          latitude: 36.08843,
          longitude: 120.37479
        }
      ],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    markers: [
      {
        iconPath: "../../assets/images/map/ad_icon.png",
        id: 0,
        latitude: 36.08543,
        longitude: 120.37479,
        width: 30,
        height:36
      },
      {
        iconPath: "../../assets/images/map/ad_icon.png",
        id: 1,
        latitude: 36.08943,
        longitude: 120.37779,
        width: 30,
        height: 36
      },
      {
        iconPath: "../../assets/images/map/ad_icon.png",
        id: 2,
        latitude: 36.08843,
        longitude: 120.37479,
        width: 30,
        height: 36
      }
    ]
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
    this.getLocation();
    
  },
  // 获取位置信息
  getLocation() {
    // 获取位置信息
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        wx.stopPullDownRefresh();
        var params = {
          from: res.latitude + ',' + res.longitude,
          to: '36.08943,120.37779'
        }
        this.formSubmit(params);
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
  onPullDownRefresh() {//下拉刷新
    this.getLocation();
  },
  formSubmit(params) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: params.from,
      to: params.to,
      waypoints:'36.08543,120.37479;36.08843,120.37479',
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = _this.data.mapData;
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          mapData: pl,
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  openMapChoose() {//打开地图
    wx.openLocation({
      latitude: this.data.lat,
      longitude: this.data.lng,
      scale: 18,
      address: '宁夏路社区，宁夏路60号，小区物业旁边'
    })
  },
})