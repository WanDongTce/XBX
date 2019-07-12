const network = require("../../../utils/main.js");
const app = getApp();
var districtId = '';
var cityId = '';
var provinceId = '';
var params = '';

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
    onLoad: function () {
        this.addressPicker = this.selectComponent("#addressPicker");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        params = wx.getStorageSync('editAddress');
        // console.log(params);
        var a = [
            {id: params.priovince_id, name: params.priovince_name}, 
            {id: params.city_id, name: params.city_name}, 
            {id: params.district_id, name: params.district_name}
        ];
        this.setData({
            isDefat: params.is_default == 2? true: false,
            uname: params.name,
            mobile: params.tel,
            addrText: params.address,
            address: a
        });
        provinceId = params.priovince_id;
        cityId = params.city_id;
        districtId = params.district_id;
    },
    showPicerFn() {
        this.setData({
            showPicker: true
        });
    },
    getAddressInfo(e) {
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
    hidePicker() {
        this.setData({
            showPicker: false
        });
    },
    setDefauAddr: function (e) {
        this.setData({
            isDefat: !this.data.isDefat
        });
        // console.log(this.data.isDefat);
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
        if (!/^1(3|4|5|7|8)\d{9}$/.test(a)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
        } else {
            this.setData({
                mobile: a
            });
        }
    },
    saveAddr: function (e) {
        // console.log(e);
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            addrText: a
        });
    },
    submitAddr: function () {
        var that = this;
        var flag = that.validInput();
        if (flag) {
            var that = this;
            network.POST({
                url: 'v13/user-address/update',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "ad_id": params.id,
                    "name": that.data.uname,
                    "tel": that.data.mobile,
                    "priovince_id": provinceId,
                    "city_id": cityId,
                    "district_id": districtId,
                    "address": that.data.addrText,
                    "is_default": that.data.isDefat? 2: 1
                },
                success: function (res) {
                    //   console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.navigateTo({
                            url: '/pages/common/address/address',
                            complete(err){
                                // console.log(err);
                                if (err.errMsg == 'navigateTo:fail webview count limit exceed'){
                                    app.webViewLimitate();
                                }
                            }
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
                    })
                }
            });

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
                title: '请输入手机',
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
    }
})