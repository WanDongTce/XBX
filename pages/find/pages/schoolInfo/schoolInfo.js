const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../',
        info: '',
        list: [],
        imgs: []
    },
    onLoad: function(options) {
        this.addAgre = this.selectComponent("#schoolEcyAddAgree");
        this.compontNavbar = this.selectComponent("#compontNavbar");
 
        this.setData({
            info: app.userInfo
        });
    },
    onShow() {
        var that = this;
        that.getInfo();
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getInfo() {
        var that = this;
        network.POST({
            url: 'v11/community-about/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "qid": app.userInfo.register_community_id
            },
            success: function(res) {
                //    console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        list: a.list,
                        imgs: a.image
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    toImgList() {
        var that = this;
        wx.navigateTo({
            url: '/pages/find/pages/schoolImgList/schoolImgList',
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        })
    },
    toCommList() {
        var that = this;
        wx.navigateTo({
            url: '/pages/find/pages/schoolCommList/schoolCommList',
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        })
    }
})