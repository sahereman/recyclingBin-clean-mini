

Page({
  data: {

  },
  onLoad: function (options) {

  },
  // 网络请求
  _getData() {

  },
  onPullDownRefresh() {//下拉刷新
    this.setData({
      orderListsData: [],
      currentPage: 1
    })
    this._getTopicCategories();
  }
})