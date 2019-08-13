// pages/song/song.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goTo: function(e){
    let url = '/pages/dayuwen/pages/songdetail/songdetail';
    wx.navigateTo({
      url: '/pages/dayuwen/pages/songdetail/songdetail'
    })
  },

  goTo02: function (e) {
    
    wx.navigateTo({
      url: '/pages/link/pages/composition/composition'
    })
  },
  goTo03: function (e) {

    wx.navigateTo({
      url: '/pages/link/pages/emptypage/emptypage'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})