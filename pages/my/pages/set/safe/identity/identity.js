var network = require("../../../../../../utils/main.js");
var app = getApp();

Page({
    data: {
        username: '',
        userId: '',
        info: '',
        mobile: ''
    },
    onLoad: function () {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        // console.log(app);
        this.setData({
            info: app.userInfo,
            mobile: app.userInfo.mobile.slice(0, 3) + '*****' + app.userInfo.mobile.slice(7)
        });
    },
    userNameInput: function (e) {
        //console.log("username:" + e.detail.value)
        this.setData({
            username: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    userIdInput: function (e) {
        this.setData({
            userId: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    btnClick: function () {
        var that = this;
        var username = that.data.username;
        var userId = that.data.userId;
        if (username.length == 0 || userId.length == 0) {
            wx.showToast({
                title: '不能为空',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!(/^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/.test(username))) {
            wx.showToast({
                title: '姓名不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(userId))) {
            wx.showToast({
                title: '身份证号不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            network.POST({
                url: 'v12/my-should/user-set-certification',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "realname": username,
                    "user_card": userId
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '认证成功',
                            success(){
                                wx.navigateTo({
                                    url: '/pages/my/pages/set/safe/safe'
                                })
                            }
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
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });
        }
    }
})