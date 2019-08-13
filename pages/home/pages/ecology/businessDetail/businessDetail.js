const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var variable;

Page({
    data: {
        // tabs: [{ index: 4, title: '视频课程', width: '25%' }, { index: 1, title: '教育动态', width: '25%' }, { index: 11, title: '易货商品', width: '25%' }, { index: 6, title: '积分商品', width: '25%' }],
        // tabindex: 4, //1教育动态 4课程 6积分物品 11易货物品

        detail_tab: '',
        // curTabIndex: 0,

        variable: 200,
        businessid: '',
        detail: [],
        search: '',
        currenttabid: '',
    },
    scroll_view_click: function (e) {
        var that = this;
        // console.log(e.currentTarget.dataset.tabid)
        that.setData({
            currenttabid: e.currentTarget.dataset.tabid
        })
        that.getListnew(false);
    },
    // tabFun: function (e) {
    //   page = 1;
    //   hasmore = '';
    //   this.setData({
    //     curTabIndex: e.currentTarget.dataset.typeid
    //   });

    // },
    // scroll: function (e) {
    //   this.setData({
    //     scrollTop: e.detail.scrollTop
    //   })
    // },
    onLoad: function (options) {
        // console.log(options)
        var that = this;
        that.setData({
            businessid: options.businessid
            // businessid: 1
        })
        that.getDetail();
        
        // 获取tabs距离顶端高度        
        // that.setData({
        //   tabsTotop: that.data.windowHeight - that.data.top
        // })
        // console.log(that.data.top);
    },
    backReturn: function () {
        wx.navigateBack({
        })
    },
    onShow() {
        // this.setData({
        //   tabindex: 4
        // })
        this.getListnew(false);
        // this.getList(4, false);
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

    // swiTab(e) {
    //   var a = e.currentTarget.dataset.index;
    //   var that = this;
    //   page = 1;
    //   that.setData({
    //     tabindex: a
    //   });
    //   wx.pageScrollTo({
    //     scrollTop: 0,
    //     duration: 0
    //   });
    //   // that.getList(a, false);
    // },
    getListnew: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "search": that.data.search,
                "c_id": that.data.currenttabid,//系统分类
                // "cb_id": that.data.currenttabid,//商家分类
                "bid": that.data.businessid,//商家id
                "price_sort": '',
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.listnew.concat(a);
                    }
                    that.setData({
                        listnew: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    hasmore = res.data.data[0].hasmore;
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
        })
    },

    onReachBottom: function () {
        var that = this;
        if (that.data.listnew.length > 0) {
            if (hasmore) {
                page++;
                that.getListnew(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    //详情
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v13/bus-shop-goods/bus-info',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bid": that.data.businessid,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        detail: a,
                        detail_tab: a.category_list
                    });                   
                    // console.log(that.data.detail_tab)
                    wx.getSystemInfo({
                        success: function (res) {
                            that.setData({
                                windowHeight: res.windowHeight
                            });
                            if (that.data.detail_tab.length != 0) {                               
                                var query = wx.createSelectorQuery();
                                query.select('#tabs').boundingClientRect(function (rect) {
                                    that.setData({
                                        tabsTotop: rect.top - res.windowHeight * 0.08,
                                    })
                                }).exec();
                            }
                        }
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
    onPageScroll: function (ev) {
        var that = this;
        if (ev.scrollTop > that.data.tabsTotop) {
            that.setData({
                changeTabsCss: true
            })
        }
        else {
            that.setData({
                changeTabsCss: false
            })
        }
    },
    //搜索
    saveSearch: function (e) {
        this.setData({
            search: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    submit: function (e) {
        var that = this;
        that.setData({
            search: e.detail.value
        });
        page = 1;
        that.getListnew(false);
    },
})
