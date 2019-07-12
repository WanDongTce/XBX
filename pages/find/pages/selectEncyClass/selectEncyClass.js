const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../',
        seletedPid: '',
        items: [],
        sort: []
    },
    onLoad: function (options) {
        // console.log(app);
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            sort: app.encyClass
        });
    },
    onShow(){
        var that = this;
        var a = wx.getStorageSync('createEncyClass');
        if (a) {
            that.setData({ seletedPid: a.pid });
        } else {
            that.setData({ seletedPid: that.data.sort[0].id });
        }
        that.getItems(that.data.seletedPid);  
    },
    getContent(e){
        var that = this;
        var a = e.currentTarget.dataset.id;
        
        that.setData({
            seletedPid: a
        });
        that.getItems(a);
    },
    getItems(id){
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
                        items: a
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
    back(e){
        var that = this;
        var a = e.currentTarget.dataset;
        a.pid = that.data.seletedPid;
        wx.setStorageSync('createEncyClass', a);
        wx.navigateTo({
            url: '/pages/find/pages/createEncy/createEncy',
            complete(err) {
                // console.log(err);
                if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                    app.webViewLimitate();
                }
            }
        })
    }
})