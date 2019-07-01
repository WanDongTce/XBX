const network = require("../../../../../utils/main.js");
const app = getApp();
var content = '';

Page({
    data: {

    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    inputFn: function (e) {
        //   console.log(e);
        content = e.detail.value;
    },
    save: function () {
        network.modifyPartInfo({"personal_sign": content}, function (res) {
            // console.log(res)
            var b = wx.getStorageSync('userInfo');
            if (res.data.code == 200) {
                b.personal_sign = app.userInfo.personal_sign = content;
                wx.setStorageSync('userInfo', b);
                wx.navigateTo({
                    url: '/pages/my/pages/personInfo/personInfo'
                })
            }
        });
    }
})