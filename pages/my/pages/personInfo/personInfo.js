const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        sexArr: [{ id: 0, name: '未知' }, { id: 1, name: '男' }, { id: 2, name: '女' }],
        sexIndex: 0,
        date: '',
        nationArr: [],
        nationIndex: 0,
        info: '',
        headImg: '../../../../images/default-user-2.png',
        labelList: []
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        var that = this;
        that.getUserInfo();
        that.getLabel(); 
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function(res){
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a,
                    sexIndex: a.sex,
                    headImg: a.avatar
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });
    },
    getLabel: function () {
        var that = this;
        network.getUserLabel(function(res){
            // console.log(res);
            that.setData({
                labelList: res.data.data
            });
        });
    },
    bindPickerChange: function (e) {
        var that = this;
        that.setData({
            sexIndex: e.detail.value
        });
        network.modifyPartInfo({"sex": that.data.sexIndex}, function (res) {
            // console.log(res)
            if (res.data.code == 200) {
                that.getUserInfo();
            }
        });
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        });
    },
    nationChange:function(e){
        console.log(e);
        this.setData({
            nationArr: e.detail.value
        })
    },
    modHead: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                // console.log(res.tempFilePaths);
                that.setData({
                    headImg: res.tempFilePaths[0]
                });
                that.uploadImg();
            }
        });
    },
    uploadImg: function () {
        var that = this;
        app.showLoading();
        // console.log(that.data.headImg);
        wx.uploadFile({
            url: app.requestUrl + 'v14/user-info/update-avatar',
            filePath: that.data.headImg,
            name: "avatar",
            formData: {
                'mobile': app.userInfo.mobile,
                'token': app.userInfo.token,
                'app_source_type': app.app_source_type,
                'app_source_school_id': app.app_source_school_id,
            },
            success: function (res) {
                wx.hideLoading();
                var a = JSON.parse(res.data);
                var b = wx.getStorageSync('userInfo');
                // console.log(a);
                if (a.code == 200) {
                    that.setData({
                        headImg: a.data[0].avatar
                    });
                    b.avatar = app.userInfo.avatar = a.data[0].avatar;
                    wx.setStorageSync('userInfo', b);
                } else {
                    wx.showToast({
                        title: '上传失败',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: (res) => {
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    }
})