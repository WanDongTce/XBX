// pages/meditation//pages/review/review.js
var options
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zjmc:""
  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  Article: function () {
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: '../Article/Article?id=' + options
    })
  },
  endSetInter: function () {
    wx.navigateTo({
      //url: 'post-detail/post-detail'  //跳转详情页  切记配置app.json文件 
      url: '/pages/meditation/pages/question/index?id=' + options
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (postad) {
    var that=this
    console.log(postad.id)
    options=postad.id
    var zjmc = wx.getStorageSync("zjmc")
    that.setData({
      zjmc: zjmc
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