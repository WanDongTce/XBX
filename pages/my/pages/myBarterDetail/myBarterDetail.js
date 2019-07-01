const network = require("../../../../utils/main.js");
const app = getApp();
var id = '';


Page({
    data: {
        direction: '',
        url: '/pages/my/pages/myBarter/myBarter'
    },
    onLoad: function (options) {
        // console.log(options);
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
        
        id = options.id;
        that.setData({
            direction: options.direction
        })
        if (options.direction == 1) {
            that.getList();
        }
        else if (options.direction == 2) {
            that.getListRight();
        }
    },
    //左侧-易货详情
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/exchange-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res)
                wx.hideLoading();
                if (res.data.code == 200) {

                    that.setData({
                        leftlist: res.data.data[0]
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
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });

    },
    //右侧-易货详情
    getListRight: function () {

        var that = this;

        network.POST({
            url: 'v14/easy-goods/to-exchange-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "log_id": id
            },
            success: function (res) {
                // console.log(res)
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        rightlist: res.data.data[0]
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
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });

    }
})