const network = require("../../../../utils/main.js");
const app = getApp();

Page({
  data: {
        info: ''
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            info: JSON.parse(options.info)
        });
  },
  onShow: function () {
  
  }
})