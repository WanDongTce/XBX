const network = require("../../../../utils/main.js");
const app = getApp();
var id = '';


Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        // console.log(options.id);
        id = options.id;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow(){
        var that = this;
        that.getList();
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
    getList (){
        var that = this;
        network.POST({
            url: 'v11/baike/sort-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "pid": id
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    // console.log(res);
                    var a = res.data.data;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
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