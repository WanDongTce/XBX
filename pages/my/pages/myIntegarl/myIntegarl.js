const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';


Page({
    data: {
        score: '',
        scoreList: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.setData({
            score: options.score
        });
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.setData({
            scoreList: []
        });
        that.getScoreHis();
    },
    getScoreHis: function () {
        var that = this;
        network.POST({
            url: 'v14/shop-point/my-score-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var b = res.data.data[0].list;
                    var a = that.data.scoreList.concat(b);
                    that.setData({
                        scoreList: a,
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
    onReachBottom: function () {
        var that = this;
        if (that.data.scoreList.length > 0) {
            if (hasmore) {
                page++;
                that.getScoreHis();
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    //跳转到积分说明
    tz_jfsm: function () {
        wx.navigateTo({
            url: '/pages/home/pages/integralMall/integralMallNote/integralMallNote'
        })
    },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    }
})