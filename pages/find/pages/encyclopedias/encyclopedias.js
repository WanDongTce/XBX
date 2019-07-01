const network = require("../../../../utils/main.js");
const app = getApp();
var interval = null;
var id = 0;
var duration = 1000;


Page({
    data: {
        base: '../../../../',
        info: '',
        hotNews: [],
        scrollTop: 0,
        typeList: []
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getUserInfo();
        that.getHotNews();
        that.getTypeList(); 
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function(res){
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });
    },
    getTypeList: function(){
        var that = this;
        network.POST({
            url: 'v11/baike/sort-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "pid": 0
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data;
                    // console.log(res);
                    that.setData({
                        typeList: a
                    });
                    app.encyClass = a;
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
    getHotNews: function () {
        var that = this;
        network.POST({
            url: 'v11/head/head-hot',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    // console.log(res);
                    var a = res.data.data[0].item;
                    that.setData({
                        hotNews: a
                    });
                    that.scollHotNews();
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
    scollHotNews: function(){
        var that = this;
        interval = setInterval(function(){
            var a = that.data.scrollTop;

            a += 5;
            if(a > 94){
                a = 0;
            }
      
            that.setData({
                scrollTop: a
            });         
        }, duration);
    },
    onUnload: function () {
        clearInterval(interval);
        interval = null;
  
        this.setData({
            scrollTop: 0
        });
    },
    toDetail: function(e){
        var a = e.currentTarget.dataset.id;
        // console.log(a);
        wx.navigateTo({
            url: '/pages/find/pages/encyclopedias/hotNewsDetail/hotNewsDetail?id=' + a,
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        });
    },
    toTypeList: function(e){
        var a = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/find/pages/encyClassList/encyClassList?id=' + a.id + '&title=' + a.title,
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        });
    }
})