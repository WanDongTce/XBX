// pages/Preview//pages/no-question/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0, //课文id
    value: ''
  },
  input: function(e){
    this.setData({
      value: e.detail.value
    });
  },
  bindFormSubmit: function(){
    let that = this;
    wx.request({
      url: app.questionUrl + 'index/Textbook/writeNote',
      method: 'POST',
      data: {
        "read_id": that.data.id,
        "user_id": app.userInfo.id,
        "content": that.data.value
      },
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: '提交成功',
          duration: 1000,
          success: function(res){
             setTimeout(function(){
               wx.navigateBack({
                 delta: 1
               });
             },1000);
          }
        });
      }
    });
  },
  goBack: function(){
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id; //课文id
    this.setData({
      id
    });
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