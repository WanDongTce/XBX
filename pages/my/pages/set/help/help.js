var app = getApp();

Page({
    data: {
        version: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            version: app.systemInfo.version
        });
    },
    onShow: function () {

    },
    makePhoneCall: function () {
        wx.makePhoneCall({
            phoneNumber: app.contactTel
        })
    },
})