const network = require("../../../utils/main.js");
const app = getApp();
var districtId = '';
var cityId = '';
var provinceId = '';

Page({
    data: {
        base: '../../../',
        isDefat: false,
        uname: '',
        mobile: '',
        addrText: '',
        showPicker: false,
        address: []
    },
    showPicerFn(){
        this.setData({
            showPicker: true
        });
    },
    getAddressInfo(e){
        var that = this;
        var res = network.getSelectedAdressInfo(e.detail);
        // console.log(res);
        that.setData({
            address: res
        });

        provinceId = res[0].id;
        cityId = res[1].id;
        districtId = res[2].id;

        that.hidePicker();
    },
    hidePicker(){
        this.setData({
            showPicker: false
        });
    },
    onLoad: function () {
        this.addressPicker = this.selectComponent("#addressPicker");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    setDefauAddr: function (e) {
        this.setData({
            isDefat: !this.data.isDefat
        });
    },
    saveName: function (e) {
        // console.log(e);
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            uname: a
        });
    },
    saveMobile: function (e) {
        // console.log(e);
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            mobile: a
        });
    },
    saveAddr: function (e) {
        // console.log(e);
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            addrText: a
        });
    },
    useNewAddr: function () {
        var that = this;
        var flag = that.validInput();
        // console.log(flag);
        if (flag) {
            that.submitAddr();
        }
    },
    validInput: function () {
        var that = this;
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        var uname = that.data.uname;
        var mobile = that.data.mobile;
        var region = that.data.region;
        var addr = that.data.addrText;
        var flag = true;
        if (!uname) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else if (!mobile) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else if (!reg.test(mobile)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else if (!addr) {
            wx.showToast({
                title: '请输入详细地址',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else { }
        return flag;
    },
    submitAddr: function () {
        var that = this;

        //console.log(app);
        network.POST({
            url: 'v13/user-address/create',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "name": that.data.uname,
                "tel": that.data.mobile,
                "priovince_id": provinceId,
                "city_id": cityId,
                "district_id": districtId,
                "address": that.data.addrText,
                "is_default": that.data.isDefat? 2: 1
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: "/pages/common/address/address",
                        complete(err) {
                            // console.log(err);
                            if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                                app.webViewLimitate();
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
    }
})