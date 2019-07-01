const network = require("../../../../utils/main.js");
const md5 = require("../../../../utils/md5.js");
const app = getApp();
var password = '';

Page({
    data: {
        rechargeType: null, //0:银行卡，1:支付宝， 2:微信
        showPwd: false,
        total: 0
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.passwordDialog = this.selectComponent("#passwordDialog");
    },
    saveMoney(e){
        this.setData({
            total: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    checkPayMethod(e) {
        var that = this;
        var a = e.currentTarget.dataset.type;
        that.setData({
            rechargeType: a
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
        // var a = parseInt(that.data.rechargeType);
        // switch (a) {
        //     case 0:

        //         break;
        //     case 1:
        //         break;
        //     case 2:

        //         break;
        // }
        that.recharge();
        that.setData({
            showPwd: false
        });
    },
    next() {
        var that = this;
        if (that.data.rechargeType === null) {
            wx.showToast({
                title: "请选择支付方式"
            })
        } else {
            that.setData({
                showPwd: true
            });
        }
    },
    recharge() {
        var that = this;
        var total = that.data.total;
        if(total >= 10){
            network.POST({
                url: 'v12/pay/recharge',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "total": that.data.total,
                    "type": that.data.rechargeType,
                    "password": md5.hexMD5(password)
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '充值成功',
                            success: function () {
                                wx.navigateTo({
                                    url: '/pages/my/pages/wallet/wallet'
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
        }else{
            wx.showToast({
                title: '金额不少于10元',
                icon: 'none',
            })
        }
    },
    wxRecaharge(){
        wx.requestPayment({

        });
    },
    onUnload() {
        password = '';
    }
})