var network = require("../../../../utils/main.js");
var app = getApp();


Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function () {
        var that = this;
        that.getList();
    },
    getList() {
        var that = this;
        network.POST({
            url: 'v14/task/group-plan',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    })
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
    toGetTask(e) {
        var a = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/task/pages/gettask/gettask?id=' + a.id + '&seletype=' + a.seletype
        })
    },
    joinProcess(e){
        var that = this;
        var a = e.currentTarget.dataset;
        network.POST({
            url: 'v14/task/join-process',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": a.type,
                "taskreceiveid": a.taskreceiveid
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.switchTab({
                        url: '/pages/main/pages/task/task'
                    })
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
    toDetail: function (e) {
        var a = e.currentTarget.dataset;
        if(a.status != 3){
            var flag = a.status  == 0? 2: 1
            wx.navigateTo({
                url: '/pages/task/pages/taskdetail/taskdetail?id=' + a.id + '&flag=' + flag
            })
        }
    }

})