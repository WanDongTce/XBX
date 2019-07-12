const network = require("../../../../utils/main.js");
const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
  },
  exitLogin: function () {    
    wx.clearStorageSync();
    wx.reLaunch({
        url: '/pages/common/login/login'
    })
  }
})