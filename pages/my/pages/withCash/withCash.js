const network = require("../../../../utils/main.js");
const app = getApp();
const md5 = require("../../../../utils/md5.js");
var password = '';


Page({
    data: {
        cardInfo: '',
        hascard: false,
        account: '',
        total: 0,
        showPwd: false,
        tel: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.passwordDialog = this.selectComponent("#passwordDialog");
    },
    onShow: function () {
        var that = this;
        var a = wx.getStorageSync('wCashBankCard');
        that.setData({
            hascard: a? true: false,
            cardInfo: a,
            account: app.account,
            tel: app.contactTel
        });
    },
    addCard(){
        if (app.bankCardList.length > 0){
            wx.navigateTo({
                url: '/pages/my/pages/bankCardList/bankCardList'
            })
        }else{
            wx.navigateTo({
                url: '/pages/my/pages/addBankCard/addBankCard'
            })
        }
    },
    saveMoney(e) {
        this.setData({
            total: e.detail.value.replace(/^\s*|\s*$/, '')
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
        that.withdrawal();
        that.setData({
            showPwd: false
        });
    },
    submit(){
        var that = this;
        var a = Number(that.data.account.account);
        var total = Number(that.data.total);
        // console.log(total);
        if (total > a){
            wx.showToast({
                title: '可提现余额不足'
            })
        }else if(total < 100){
            wx.showToast({
                title: '最少提现100元'
            })
        }else{
            this.setData({
                showPwd: true
            });
        }
    },
    withdrawal(){
        var that = this;
        network.POST({
            url: 'v12/my-should/withdrawal',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": that.data.cardInfo.id,
                "password": md5.hexMD5(password),
                "price": that.data.total
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '/pages/my/pages/withCashDetail/withCashDetail?info=' + JSON.stringify(res.data.data[0])
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
    onUnload() {
        password = '';
    }
})