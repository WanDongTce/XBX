// pages/emptypage/emptypage.js
Page({

  data: {

  },

  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
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