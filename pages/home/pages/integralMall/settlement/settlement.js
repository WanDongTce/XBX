const network = require("../../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../../',
        num: 1,
        totalPrice: 0,
        list: '',
        address: '',
        hasAddress: false
    },
    onShow: function () {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
        wx.removeStorageSync('enterAddressListFlag');
        var b = wx.getStorageSync('goods');
        // console.log(b);
        var a = wx.getStorageSync('receivingAddress');
        var c = a ? true : false;

        that.setData({
            list: b,
            address: a,
            hasAddress: c
        });
        that.getTotalPrice(b.point);  
    },
    // 增加事件
    addCount(e) {
        var that = this;
        var num = that.data.num;
        num++;
        this.setData({
            num: num
        });
        this.getTotalPrice(that.data.list.point);
    },
    // 减少事件
    minusCount(e) {
        var that = this;
        var num = that.data.num;
        const obj = e.currentTarget.dataset.obj;
        if (num > 1) {
            num--;
            this.setData({
                num: num
            });
            this.getTotalPrice(that.data.list.point);
        }
    },
    getTotalPrice(score) {
        var that = this;
        score = parseInt(score);
        var num = parseInt(that.data.num);
        that.setData({
            totalPrice: num * score
        });
    },
    //支付
    submit: function () {
        
        var that = this;
       
        if (that.data.hasAddress) {
            wx.showModal({
                title: '提示',
                content: '确认支付吗？',
                success: function (res) {
                    if (res.confirm) {
                        network.POST({
                            url: 'v14/shop-point/pay',
                            params: {
                                "mobile": app.userInfo.mobile,
                                "token": app.userInfo.token,
                                "id": that.data.list.id,
                                "num": that.data.num,
                                "ad_id": that.data.address.id
                            },
                            success: function (res) {
                                // console.log(res);
                                wx.hideLoading();
                                if (res.data.code == 200) {
                                    wx.showModal({
                                        title: '提示',
                                        showCancel: false,
                                        content: res.data.message,
                                        success: function (res) {
                                            if (res.confirm) {
                                                // console.log('用户点击确定')
                                                wx.navigateTo({
                                                    url: '/pages/home/pages/integralMall/integralMall',
                                                    complete(err) {
                                                        // console.log(err);
                                                        if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                                                            app.webViewLimitate();
                                                        }
                                                    }
                                                })
                                            }
                                        }
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
                    } else if (res.cancel) {}
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
    //跳转到地址页
    tz_address:function(){
      wx.navigateTo({
        url: '/pages/common/address/address?flag=1'
      })
    }
})