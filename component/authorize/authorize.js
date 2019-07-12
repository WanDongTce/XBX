const network = require("../../utils/main.js");
const app = getApp();

Component({    
    data: {
        hideMask: false
    },
    methods: {        
        judge(e) {
            var that = this;
            that.authorize(e);
        },
        authorize(e) {
            // console.log(e);
            app.showLoading();
            var that = this;
            var a = e.detail;
            if (a.errMsg == 'getUserInfo:fail auth deny') {
                wx.hideLoading();
                wx.showToast({
                    title: '需要您授权',
                    icon: 'none'
                });
            } else {
                wx.hideLoading();
                that.checkSession();
            }
        },

        checkSession() {
            var that = this;
            wx.checkSession({
                success: function (res) {
                    var rdtoken = wx.getStorageSync('rdtoken');
                    if (rdtoken) {
                        that.getUnionId();
                    } else {
                        that.wxLogin();
                    }
                },
                fail: function (res) {
                    that.wxLogin();
                }
            });
        },
        wxLogin() {
            var that = this;
            network.wxLogin(function () {
                that.getUnionId();
            });
        },
        getUnionId() {
            var that = this;
            var rdtoken = wx.getStorageSync('rdtoken');
            network.getUnionId(rdtoken, function () {
                that.checkUnionId();
            });
        },
        checkUnionId() {
            var that = this;
            var a = getCurrentPages();
            // console.log(a)
            network.checkUnionId(function () {
                that.setData({
                    hideMask: true
                });                
                wx.navigateTo({
                    url: '/'+a[0].route,
                })
            }, function () { });
        }
    }
})
