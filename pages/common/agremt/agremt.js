const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
      this.setData({
          idname:app.idname
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