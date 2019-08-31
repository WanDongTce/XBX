const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        showTab: true
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
      if (app.userInfo.mobile == '18647993992') {
        this.setData({
          showTab: false
        })
      }   
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