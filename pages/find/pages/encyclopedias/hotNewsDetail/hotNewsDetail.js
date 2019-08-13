const network = require("../../../../../utils/main.js");
const wxParse = require('../../../../../wxParse/wxParse.js');
const app = getApp();
var id = '';


Page({
    data: {
        detail: '',
        content: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
        id = options.id;
        that.getDetail();
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
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v11/head/head-view',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "head_id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        detail: a
                    });
                    wxParse.wxParse('content', 'html', a.content, that, 0);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
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