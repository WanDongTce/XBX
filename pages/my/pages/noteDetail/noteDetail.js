const network = require("../../../../utils/main.js");
const app = getApp();
var id = '';

Page({
    data: {
        detail: {}
    },
    onLoad(options){
        this.compontNavbar = this.selectComponent("#compontNavbar");
        id = options.id;
        // console.log(options);
        this.getDetail();
    },
    getDetail(){
        var that = this;
        network.POST({
            url: 'v14/news/comments-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        detail: res.data.data[0].item
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    onUnload: function () {

    }
})