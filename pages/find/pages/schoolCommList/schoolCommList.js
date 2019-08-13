const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        this.addAgre = this.selectComponent("#schoolEcyAddAgree"); 
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onShow: function () {
        var that = this;
        that.getList();
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
    getList() {
        var that = this;
        network.POST({
            url: 'v11/community-about/my-content-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                //    console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0? true: false
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