const network = require("../../../../utils/main.js");
const app = getApp();
// console.log(app);
var hasmore = '';
var page = 1;

Page({
    data: {
        base: '../../../../',
        selectedTab: 0,
        list: [],
        itemStyle: [],
        showEmpty: false,
        info: '',
        recordCount:'',
        imgUrls: [],
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");        
        this.getSwipImgs();
        this.getGoodsType();
        this.getList();
        this.getUserInfo();

        var that=this;
        that.setData({
            changeTabsCss: true
        })
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    threshold: res.windowWidth / 750 * 100,
                    scrollHeight: res.windowHeight
                });
            }
        });
    },
    onShow(){
        
    },
    swiScrollTab: function (e) {
        var a = e.currentTarget.dataset.index;
        console.log(a)
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/integralMallType/integralMallType?selectedTab=' + e.currentTarget.dataset.index,
        })

    },
    getSwipImgs: function () {
        var that = this;
        network.getSwiperImgs(3, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });
            }
            else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getGoodsType() {
        var that = this;
        network.POST({
            url: 'v14/shop-point/type-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;                   
                    app.goodsType = a;
                    that.setData({
                        itemStyle: app.goodsType
                    });
                                                    
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
    },
    
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            // console.log(res);
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
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/shop-point/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "typeid": that.data.selectedTab,
                "isrec": 1
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {                  
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    hasmore = res.data.data[0].hasmore;
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
    },
    
    //跳转到详情
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + e.currentTarget.dataset.id
        });
    },
    toSetm: function (e) {
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        wx.setStorageSync("goods", a);
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/settlement/settlement'
        });
    },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    },
    onPageScroll: function (ev) {
        console.log(ev)
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
    },
    backReturn: function () {
        wx.switchTab({
            url: '/pages/main/pages/home/home'
        })
    },
    tz_periphery:function(){
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/periphery/periphery?showSearchType=' + 2,
        })
    }
})
