const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        showTab: true,
      find:""
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that=this
      that.getshow()
      if (app.userInfo.mobile == '18647993992') {
        this.setData({
          showTab: false
        })
      }   
    },
  getshow: function () {
    var that = this
    wx.request({
      url: app.requestUrl + 'v14/public/display',
      data: {},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.data[0].list[0].find)
        that.setData({
          find: res.data.data[0].list[0].find,
         
        })
      }
    })
  },
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
  }
})