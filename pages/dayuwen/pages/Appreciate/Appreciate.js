const network = require("../../../../utils/main.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:""
  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  dealt: function (options) {
    var postId = options.id
    var that = this
    console.log(options)
    wx.request({
      url: app.requestUrl + 'v14/chinese/poetryinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": app.app_source_type,
        "read_id": postId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          text: res.data.data[0].item.translation,
          
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dealt(options)
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