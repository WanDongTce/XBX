// pages/reporter/apply/apply.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;
Page({

    data: {
        base: '../../../../../',
        state: '',
        list: '',
        IMGURL: app.imgUrl
    },

    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    getState: function() {
        var that = this;
        network.POST({
            url: 'v14/user-info/query-apply',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function(res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        state: a
                    })
                    if (that.data.state.agreestatus == 2) {
                        that.getList(false);
                    }
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
    onShow: function() {
        this.getState();
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
    tz_apply: function() {
        var that = this;
        network.POST({
            url: 'v14/user-info/apply-reporter',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function(res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '申请成功',
                        duration: 1000,
                        icon: 'none'
                    });
                    that.getState();
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
    getList: function(contaFlag) {
        var that = this;
        network.POST({
            url: 'v14/news/my-news-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
            },
            success: function(res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    // console.log(a)
                    if (contaFlag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
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
    onReachBottom: function() {
        if (this.data.list.length > 0) {
            if (hasmore) {
                page++;
                this.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    //删除
    listdel: function(e) {
        var that = this;
        network.POST({
            url: 'v14/news/my-news-delete',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": e.currentTarget.dataset.myid,

            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    for (var i = 0; i < that.data.list.length; i++) {
                        if (that.data.list[i].id == e.currentTarget.dataset.myid) {
                            var list2 = that.data.list
                            list2.splice(i, 1)
                            that.setData({
                                list: list2
                            })
                        }
                    }
                    wx.showToast({
                        title: '已删除',
                        icon: 'none'
                    })
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

    }
})