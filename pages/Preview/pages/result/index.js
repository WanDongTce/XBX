// pages/Preview//pages/no-question/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: {
      middle: false,
      top: false,
      bottom: false,
      right: false,
      right2: false
    }
  },

  onTransitionEnd() {
    console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  togglePopup() {
    this.toggle('middle');
  },

  toggleRightPopup() {
    this.toggle('right');
  },

  toggleRightPopup2() {
    this.toggle('right2');
  },

  toggleBottomPopup() {
    this.toggle('bottom');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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