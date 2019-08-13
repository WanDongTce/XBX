const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {
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
    onUnload: function() {

    }
})