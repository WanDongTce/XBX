const network = require("../../../utils/main.js");
var app = getApp();
var rec_type = '';


Page({
    data: {
        base: '../../../',
        agtList: [{ type: 1, name: '学生' }, { type: 2, name: '代理' }],
        agtIndex: ''
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    bindPickerChange: function (e) {
        var a = e.detail.value;
        this.setData({
            agtIndex: e.detail.value
        });
        rec_type = this.data.agtList[a].type;
        // console.log(rec_type);
    },
    //提交表单
    bindFormSubmit: function (e) {
        var that = this;
        var phone = e.detail.value.phone.replace(/^\s*|\s*$/, '');
        var regMobile = /^1(3|4|5|7|8)\d{9}$/;

        if (!rec_type) {
            wx.showToast({
                title: '请选择推荐人类型',
                icon: 'none',
                duration: 1000
            })
        } else if (!regMobile.test(phone)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
        } else {
            network.POST({
                url: 'v14/user-info/recommend',
                params: {
                    'mobile': app.userInfo.mobile,
                    'token': app.userInfo.token,
                    'rec_mobile': phone,
                    'rec_type': rec_type
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        wx.switchTab({
                            url: '/pages/main/pages/home/home'
                        });
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
                    });
                }
            });
        }
    },
    next: function () {
        wx.switchTab({
            url: '/pages/main/pages/home/home'
        });
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
  }
})