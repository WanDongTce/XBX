const network = require("../../../../utils/main.js");
const app = getApp();
var hasmore = '';
var page = 1;
Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false,
        
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function() {
        this.getList(false);
    },
    previewImg(e) {
        
        var a = e.currentTarget.dataset;

        var c = a.imgs.split(' ');
        
        network.previewImg(a.img, c);
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/home-work-custom/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": 2,
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        var a = that.data.list.concat(a);
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
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/my/pages/teacherDrawListDetail/teacherDrawListDetail?id=' + e.currentTarget.dataset.zuoyeid
        });
    },
    tz_pigai:function(e){
        // quespic
        // console.log(e.currentTarget.dataset.quespic[0])
        wx.navigateTo({
            url: '/pages/my/pages/teacherDraw/answer/answer?id=' + e.currentTarget.dataset.zuoyeid + '&quespic=' + e.currentTarget.dataset.quespic[0],
        });
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    image: '../../../../images/error.png',
                    duration: 1000
                })
            }
        }
    },
})