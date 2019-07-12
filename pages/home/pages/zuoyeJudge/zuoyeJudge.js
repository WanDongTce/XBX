// pages/ls2/ls2.js
const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    onLoad:function(){
        idname: app.idname
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