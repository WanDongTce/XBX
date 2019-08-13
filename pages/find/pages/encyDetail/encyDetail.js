const network = require("../../../../utils/main.js");
const app = getApp();
var id = '';


Page({
    data: {
        base: '../../../../',
        detail: []
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
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.addAgre = this.selectComponent("#addAgre"); 
        // console.log(options.id);
        id = options.id;
    },
    onShow() {
        var that = this;
        that.getList();
    },
    getList() {
        var that = this;
        network.POST({
            url: 'v11/baike/about-info',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    // console.log(res);
                    that.setData({
                        detail: res.data.data[0]
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
    }
})