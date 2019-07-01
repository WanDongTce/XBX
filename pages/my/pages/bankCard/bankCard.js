var network = require("../../../../utils/main.js");
var app = getApp();

Page({
    data: {
        IMGURL: app.imgUrl,
        list: [],
        showAdd: false,
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getList();
    },
    addCard: function () {
        this.getCerStatus();
    },
    getCerStatus() {
        var that = this;
        network.POST({
            url: 'v12/my-should/user-certification',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    if (res.data.data[0].status == 1) {
                        wx.navigateTo({
                            url: '/pages/my/pages/set/safe/identity/identity'
                        })
                    } else {
                        wx.navigateTo({
                            url: '/pages/my/pages/addBankCard/addBankCard'
                        });
                    }
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
    getList(){
        var that = this;
        // console.log(app.bankCardList);
        that.setData({
            list: app.bankCardList,
            showAdd: app.bankCardList.length == 0 ? true : false
        });
    },
    toDetail(e){
        wx.navigateTo({
            url: '/pages/my/pages/bankCardDetail/bankCardDetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
        })
    }
})
