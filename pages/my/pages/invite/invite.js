var network = require("../../../../utils/main.js");
var app = getApp();
Page({
    data: {
        base: '../../../../'
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {

    },
    onShareAppMessage() {
        var that = this;
        return {
            title: '邀请好友',
            path: '/pages/main/pages/home/home',
            success: function(res) {
                // network.share(1, id);
            }
        };
    }
})