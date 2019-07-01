var network = require("../../../../../utils/main.js");
var md5 = require("../../../../../utils/md5.js");
var app = getApp();

Page({
    data: {
        password: [],
        showKeyboard: true,
        pwd: '',
        pwd1: '',
        pwd2: '',
        flag: 1
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.pwdKeyboard = this.selectComponent("#keyboard");
        this.setData({
            idname:app.idname
        })
    },
    watchPwd(e){
        // console.log(e);
        var arr = e.detail;
        var that = this;
        that.setData({
            password: arr
        });
        if (arr.length == 6) {
            that.getPwd();
        }
    },
    getPwd(e){
        var that = this;
        var flag = that.data.flag;
        var pwd = that.data.password.join('');
        // that.hideKeyboard();

        switch(parseInt(flag)){
            case 1:
                that.setData({
                    pwd: pwd
                });
                break;
            case 2:
                that.setData({
                    pwd1: pwd
                });
                break;
            case 3:
                that.setData({
                    pwd2: pwd
                });
                that.send();
                break;
        }

        flag < 3 && flag++;
        that.setData({
            flag: flag,
            password: []
        });
    },
    send(){
        var that = this;
        network.POST({
            url: 'v12/pay-setting/up-pwd',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "password": md5.hexMD5(that.data.pwd),
                "password1": md5.hexMD5(that.data.pwd1),
                "password2": md5.hexMD5(that.data.pwd2)
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '修改成功',
                        success: function(){
                            wx.redirectTo({
                                url: '/pages/my/pages/wallet/wallet'
                            });
                        }
                    });
                } else {
                    that.setData({
                        password: [],
                        pwd: '',
                        pwd1: '',
                        pwd2: '',
                        flag: 1
                    });
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
    hideKeyboard(){
        this.setData({
            showKeyboard: false,
            password: []
        });
    },
    showKeyboardFn(){
        this.setData({
            showKeyboard: true
        });
    },
    onUnload() {
        this.setData({
            password: [],
            pwd: '',
            pwd1: '',
            pwd2: '',
            flag: 1
        });
    }
})