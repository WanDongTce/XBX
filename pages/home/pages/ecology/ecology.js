const network = require("../../../../utils/main.js");
const app = getApp();
Page({
    data: {
        imgUrls: [],
        IMGURL: app.imgUrl,
        classifyList: [],
        search: '',
        list: [],
        threshold: ''
    },
    backReturn: function() {
        wx.switchTab({
            url: '/pages/main/pages/home/home'
        })
    },
    toH5(e) {
        var a = e.currentTarget.dataset;
        network.swipLink(a);
    },
    getSwipImgs: function() {
        var that = this;
        network.getSwiperImgs(6, function(res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getClassify: function() {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/category',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "ishead": 1
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        classifyList: a,
                    });

                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
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
    onLoad: function(options) {
        this.search = this.selectComponent("#search");
        var that = this;
        that.setData({
            changeTabsCss: true
        })
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    threshold: res.windowWidth / 750 * 100,
                    scrollHeight: res.windowHeight
                });
            }
        });
        that.getSwipImgs();
        that.getClassify();
        that.getList();
    },
    getList: function() {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/tag-index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                    });

                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
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
    onShow: function() {

    },
    tz_classify: function(e) {
        // wx.navigateTo({
        //   url: '/pages/ecology/periphery/periphery?classifyid=' + e.currentTarget.dataset.classifyid,
        // })

        wx.navigateTo({
            url: '/pages/home/pages/ecology/classify/classify?classifyid=' + e.currentTarget.dataset.classifyid,
        })
    },
    tz_periphery: function(e) {
        wx.navigateTo({
            url: '/pages/home/pages/ecology/periphery/periphery?showSearchType=' + 2,
        })
    },
    onPageScroll: function(ev) {
        // console.log(ev)
        var that = this;
        if (ev.scrollTop < 80) {
            that.setData({
                changeTabsCss: true
            })
        } else {
            that.setData({
                changeTabsCss: false
            })
        }
    }
})