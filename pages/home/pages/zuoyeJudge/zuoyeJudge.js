// pages/ls2/ls2.js
const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    onLoad:function(){
        idname: app.idname
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
  },
    click_btn:function(){
        // wx.showToast({
        //     title: '暂未开通',
        //     image: '../../../../images/error.png',
        //     duration: 1000

        // })
        wx.navigateTo({
            url: '/pages/home/pages/zuoyePay/zuoyePay',
        })
    }
  
})