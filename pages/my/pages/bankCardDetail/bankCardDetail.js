var network = require("../../../../utils/main.js");
var app = getApp();
var md5 = require("../../../../utils/md5.js");
var password = '';


Page({
    data: {
        IMGURL: app.imgUrl,
        item: '',
        showPwd: false
    },
    onLoad: function (options) {
        // console.log(options.item);
        this.passwordDialog = this.selectComponent("#passwordDialog");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            item: JSON.parse(options.item)
        });
    },
    hidePwdDialog() {
        this.setData({
            showPwd: false
        });
    },
    getPwd(e) {
        // console.log(e);
        var that = this;
        password = e.detail;
        that.setData({
            showPwd: false
        });
        that.delFn();
    },
    bankcardDel: function () {
        var that = this;
        that.setData({
            showPwd: true
        });
    },
    delFn(){
        var that = this;
        var id = that.data.item.id;
        network.POST({
            url: 'v12/my-should/bankcard-del',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id,
                "password": md5.hexMD5(password)
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) { 
                    var a = wx.getStorageSync('wCashBankCard');
                    if(a && a.id == id){
                        wx.removeStorageSync('wCashBankCard');
                    }

                    network.getUserBankCard(function () {
                        wx.navigateTo({
                            url: '/pages/my/pages/bankCard/bankCard'
                        })
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
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    setDefault(){
        var that = this;
        network.POST({
            url: 'v12/my-should/bankcard-set-default',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": that.data.item.id
            },
            success: function (res) {
                wx.hideLoading();
                // console.log(res);
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '/pages/my/pages/bankCard/bankCard'
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
})