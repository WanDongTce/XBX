const network = require("../../../../../utils/main.js");
const app = getApp();
var flag = '';
var ids = '';
Math.formatFloat = function (f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}
Page({
    data: {
        totalPrice: 0,
        list: '',
        address: '',
        hasAddress: false,
        numAll: 0
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
    onLoad(options) {
        flag = options.flag;
        ids = options.ids;
    },
    onShow: function () {
        wx.removeStorageSync('enterAddressListFlag');

        var that = this;
        var b = wx.getStorageSync('goods');
        var a = wx.getStorageSync('receivingAddress');
        var c = a ? true : false;

        // var mynum=0;
        // var myprice=0;
        // var list=b.list
        // console.log(list)
        // for(var i=0;i<list.length;i++){            
        //     for (var j = 0; j <list[i].goods_list.length;j++){              
        //         mynum += Number(list[i].goods_list[j].num);
        //         // console.log(mynum)
        //         myprice += Number(list[i].goods_list[j].num) * Number(list[i].goods_list[j].price);
        //     }
        //     list[i].mynum = mynum;
        //     list[i].myprice = Math.formatFloat(myprice,1);
        // }
        that.setData({
            list: b.list,
            address: a,
            hasAddress: c,
            totalPrice: b.price_all,
            numAll: b.num_all || b.list[0].num
        });
    },
    submit: function (e) {
        var that = this;
        if (that.data.hasAddress) {
            wx.showModal({
                title: '提示',
                content: '确认支付吗？',
                success: function (res) {
                    if (res.confirm) {
                        if (flag == 1) {
                            that.buyFromDetail();
                        } else if (flag == 2) {
                            // that.buyFromGift();
                            wx.hideLoading();
                            if (app.openId) {
                                var a = e;
                                that.judgeLogin(a);
                            }
                            else {
                                that.wxLogin();
                            }
                        }
                    } else if (res.cancel) { }
                }
            });
        } else {
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none',
                duration: 1000
            })
        }

    },
    buyFromDetail() {
        var that = this;
        network.POST({
            url: 'v13/shop-order/buy-confirm',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "s_id": that.data.list[0].s_id,
                "num": that.data.list[0].num,
                "ad_id": that.data.address.id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '/pages/home/pages/periphery/pay/pay?payinfo=' + JSON.stringify(res.data.data[0])
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
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    buyFromGift() {
        var that = this;
        network.POST({
            url: 'v13/shop-order/go-buy-confirm',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "ids": ids,
                "ad_id": that.data.address.id
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        payinfo: res.data.data[0]
                    })
                    that.pay();
                    // wx.navigateTo({
                    //     url: '/pages/home/pages/periphery/pay/pay?payinfo=' + JSON.stringify(res.data.data[0])
                    // })
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
    pay: function (e) {
        // console.log('pay_function')
        var that = this;
        network.POST({
            url: 'v13/shop-pay/order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "idsn": that.data.payinfo.order_sn,
                "type": 3,
                "openid": app.openId
            },
            success: function (res) {
                console.log(res);
                // var a = res.data.data[0];
                wx.hideLoading();
                if (res.data.code == 200) {
                    network.wxPay(res.data.data[0], function (res) {
                        // console.log(res);
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        wx.navigateTo({
                            url: '/pages/my/pages/myOrder/myOrder?index=0'
                        })
                    }, function () {
                        wx.showToast({
                            title: '未支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        wx.navigateTo({
                            url: '/pages/my/pages/myOrder/myOrder?index=1'
                        })
                    });

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
    judgeLogin: function (a) {
        var that = this;
        app.showLoading();
        var that = this;
        var a = a.detail;
        if (a.errMsg == 'getUserInfo:fail auth deny') {
            wx.hideLoading();
            wx.showToast({
                title: '需要您授权',
                icon: 'none'
            });
        } else {
            wx.hideLoading();
            if (app.openId) {
                that.buyFromGift();
            }
            else {
                that.wxLogin();
            }

        }

    },

    wxLogin() {
        var that = this;
        network.wxLogin(function () {
            that.getOpenid();
        });
    },
    getOpenid: function () {
        var that = this;
        network.getOpenid(function () {
            that.buyFromGift();
        });

    },
    tz_address: function () {
        wx.navigateTo({
            url: '/pages/common/address/address?flag=2'
        })
    }
})