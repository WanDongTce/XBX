const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';


Page({
    data: {
        tabs: [{ index: 11, title: '易货商品', width: '30%' }, { index: 6, title: '积分商品', width: '30%' }, { index: 4, title: '视频课程', width: '30%' }],
        tabindex: 11, //4课程 6积分物品 11易货物品
        list: [],
        showEmpty: false
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow(){
        this.getList(11, false);
    },
    swiTab(e){
        var a = e.currentTarget.dataset.index;
        var that = this;
        page = 1;
        that.setData({
            tabindex: a
        });
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
        that.getList(a, false);
    },
    getList(resourcetypeid, flag){
        var that = this;
        network.POST({
            url: 'v14/news/collect-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid": resourcetypeid,
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
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
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(that.data.tabindex, true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    del(e) { 
        var that = this;
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success(res){
                if (res.confirm){
                    that.sendDel({'0': id});
                }
            }
        })
    },
    sendDel(obj){
        var that = this;
        network.POST({
            url: 'v14/news/collect-del-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "collectid": JSON.stringify(obj)
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getList(that.data.tabindex, false);
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
    onUnload: function() {
        page = 1;
        hasmore = '';
    }
})