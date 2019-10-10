Page({
  data: {
    phoneHeight:''
  },
  onLoad: function(options) {

  },
  // 网络请求
  _getData() {

  },
  onPullDownRefresh() { //下拉刷新

  },
  onShareAppMessage: function (options) {
    return {
      title: '工蚁回收',
      path: '/pages/index/index',
      imageUrl: '../../assets/images/aboutUs/logo.png'
    }
  },
})