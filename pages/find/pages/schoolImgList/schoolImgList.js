const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../',
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onShow: function(){
        var that = this;
        that.getList();
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
    getList(){
        var that = this;
        network.POST({
            url: 'v11/community-about/my-image-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                //    console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0? true: false
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
    addImg(){
        var that = this;
        wx.chooseImage({
            count: 1, 
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'], 
            success: function (res) {
                network.publicUpload(res.tempFilePaths, function (res) {
                    // console.log(res);
                    var img = res.data[0].list[0].file_url;
                    // console.log(img);
                    if(img){
                        that.submit(img);
                    }else{
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none'
                        })
                    }
                });  
            }
        })
    },
    submit(img) {
        var that = this;
        network.POST({
            url: 'v11/community-about/add',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "qid": app.userInfo.register_community_id,
                "type": 2,
                "imgurl": img
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getList();
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