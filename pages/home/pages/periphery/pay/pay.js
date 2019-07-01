const network = require("../../../../../utils/main.js");
const md5 = require("../../../../../utils/md5.js");
const app = getApp();
var password = '';

Page({
    data: {
        payinfo: '',
        payType: null, //0:余额，1:支付宝， 2:微信
        account: 0,
        showPwd: false
    },
    onLoad: function (options) {
        // console.log(JSON.parse(options.payinfo));
        this.passwordDialog = this.selectComponent("#passwordDialog");
        this.setData({
            idname:app.idname
        })
        if (options.payinfo) {
            this.setData({
                payinfo: JSON.parse(options.payinfo)
            });
        }
    },
    onShow: function () {
        var that = this;
        that.getAccount();  
    },
    getAccount(){
        var that = this;
        network.POST({
            url: 'v13/shop-order/order-price',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "idsn": that.data.payinfo.order_sn
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        account: res.data.data[0].account
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
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
    checkPayMethod(e){
        var that = this;
        var b = that.data.payinfo;
        var a = e.currentTarget.dataset.type;

        if (a == 0 && that.data.account < b.price_all){
            wx.showToast({
                title: "余额不足",
                icon: 'none',
            });
        }else{
            that.setData({
                payType: a
            });
        }
    },
    hidePwdDialog(){
        this.setData({
            showPwd: false
        });
    },
    getPwd(e){
        // console.log(e);
        var that = this;
        password = e.detail;
        that.setData({
            showPwd: false
        });
        that.accountPay();
    },
    pay(){
        var that = this;
        if (that.data.payType === null){
            wx.showToast({
                title: "请选择支付方式",
                icon: 'none',
            })
        }else{
            var a = parseInt(that.data.payType);
            switch (a){
                case 0:
                    that.setData({
                        showPwd: true
                    });
                    break;
                case 1:
                    break;
                case 2:
                    break;
            }
        }
    },
    accountPay(){
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
                        success: function(){
                            wx.navigateTo({
                                url: '/pages/home/pages/periphery/myOrder/myOrder?index=0'
                            })
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
    onUnload(){
        password = '';
    }
})