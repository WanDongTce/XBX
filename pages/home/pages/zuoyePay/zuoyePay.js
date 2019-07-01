const network = require("../../../../utils/main.js");
const md5 = require("../../../../utils/md5.js");
const app = getApp();
var password = '';

Page({
    data: {
        payinfo: '',
        payType: null, //0:余额，1:支付宝， 2:微信
        showPwd: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.passwordDialog = this.selectComponent("#passwordDialog");
        // this.setData({
        //     payinfo: JSON.parse(options.info)
        // });
        // console.log(this.data.payinfo);
        this.createOrder();
    },
    createOrder() {
        var that = this;
        network.POST({
            url: 'v14/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": 1
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        payinfo: a
                    })
                    
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
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        });
    },
    checkPayMethod(e) {
        var that = this;
        var a = e.currentTarget.dataset.type;
        var b = that.data.payinfo;

        if (a == 0 && parseFloat(b.account) < parseFloat(b.price_all)) {
            wx.showToast({
                title: "余额不足",
                image: '../../../../images/error.png',
                duration: 1000
            });
        } else {
            that.setData({
                payType: a
            });
        }
    },
    pay() {
        var that = this;
        if (that.data.payType === null) {
            wx.showToast({
                title: "请选择支付方式"
            })
        } else {
            var a = parseInt(that.data.payType);
            switch (a) {
                case 0:
                    that.setData({
                        showPwd: true
                    });
                    break;
                case 2:
                    that.wxPay();
                    break;
            }
        }
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
        that.accountPay();
    },
    accountPay() {
        var that = this;
        network.POST({
            url: 'v13/shop-pay/account-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "idsn": that.data.payinfo.order_sn,
                "password": md5.hexMD5(password)
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '支付成功',
                        success: function () {
                            wx.switchTab({
                                url: '/pages/home/pages/zuoyeEnter/zuoyeEnter',
                            });
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.data.message
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
    wxPay(){
        wx.showToast({
            title: '暂未开通',
            image: '../../../../images/error.png',
            duration: 1000

        })
        // var that = this;
        // var code = '';
        // wx.login({
        //     success: function(res){
        //         console.log(res);
        //         code = res.code;
        //         network.POST({
        //             url: 'v13/shop-pay/order',
        //             params: {
        //                 "mobile": app.userInfo.mobile,
        //                 "token": app.userInfo.token,
        //                 "idsn": that.data.payinfo.order_sn,
        //                 "type": 2,                                                                                                                                 
        //                 "code": code
        //             },
        //             success: function (res) {
        //                 console.log(res);
        //                 wx.hideLoading();
        //                 if (res.data.code == 200) {
        //                     network.wxPay(res.data.data[0], function (res) {
        //                         console.log(res);
        //                     });
        //                 } else {
        //                     wx.showToast({
        //                         title: res.data.message
        //                     });
        //                 }
        //             },
        //             fail: function () {
        //                 wx.hideLoading();
        //                 wx.showToast({
        //                     title: '服务器异常',
        //                     icon: 'none',
        //                     duration: 1000
        //                 })
        //             }
        //         });
        //     }
        // });
    },
    onUnload() {
        password = '';
    }
})