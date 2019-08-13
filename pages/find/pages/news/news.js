const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = null;

Page({
    data: {
        base: '../../../../',
        news: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.getNewsList();
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
    getNewsList: function () {
        var that = this;

        network.getNews(page, function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = that.data.news.concat(res.data.data[0].list);
                // console.log(a);
                that.setData({
                    news: a,
                    showEmpty: a.length == 0? true: false
                });
                // console.log(res.data.data[0]);
                hasmore = res.data.data[0].hasmore;
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        }, function () {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });

    },
    onReachBottom: function () {
        var that = this;
        if (that.data.news.length > 0){
            if (hasmore) {
                page++;
                that.getNewsList();
            } else{
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    onUnload: function(){
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    }
})