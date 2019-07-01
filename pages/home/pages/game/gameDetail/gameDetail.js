const network = require("../../../../../utils/main.js");
const QR = require("../../../../../utils/qrcode.js");
const app = getApp();
var info = '';


Page({
    data: {
        IMGURL: app.imgUrl,
        base: '../../../../../',
        showCanvas: false,
        size: {}
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var a = JSON.parse(options.info);
        info = a;
        console.log(a);
        var that = this;
        var size = that.setCanvasSize();
        // console.log(size);
        that.createQrCode(a.dizhi, "mycanvas", size.w, size.h);
        that.setData({
            showCanvas: true,
            size: size
        });
    },
    onShow: function () {

    },
    setCanvasSize: function () {
        //   console.log(app);
        var size = {};
        var res = app.systemInfo;
        var width = res.windowWidth * .6;
        var height = width;
        size.w = width;
        size.h = height;
        return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH) {
        QR.qrApi.draw(url, canvasId, cavW, cavH);
    },
    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                //   console.log("********" + tempFilePath);
                that.setData({
                    imagePath: tempFilePath,
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    saveImg: function (e) {
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                //   console.log(res);
                var tempFilePath = res.tempFilePath;
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        wx.showToast({
                            title: '已保存到相册',
                            icon: 'none'
                        });
                    },
                    fail(res) {
                    }
                })

            },
            fail: function (res) {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 1000
                });
            }
        });
    },
    collection() {
        network.collect(14, info.id, function(res){
            // console.log(res);
            if(res.data.code == 200){
                if(res.data.data[0].item.isdo == 1){
                    wx.showToast({
                        icon: 'none',
                        title: '收藏成功'
                    })
                }else{
                    wx.showToast({
                        icon: 'none',
                        title: '取消收藏'
                    })
                }
            }
        });
    },
    onShareAppMessage() {
        // console.log(info);
        var that = this;
        return {
            title: info.title,
            path: '/pages/home/pages/game/gameDetail/gameDetail?info=' + JSON.stringify(info),
            imageUrl: that.data.IMGURL + 'game/playgame.png',
            success: function (res) {
                network.share(14, info.id);
            }
        };
        // return {
        //     title: info.title,
        //     // path: "/pages/common/webView/webView?src=" + info.dizhi,
        //     // path: info.dizhi,
        //     path: 'https://www.baidu.com',
        //     imageUrl: that.data.IMGURL + 'game/playgame.png',
        //     success: function (res) {
        //         // 转发成功
        //         network.share(14, info.id);
        //     },
        //     fail: function (res) {
        //         // 转发失败
        //     }
        // }
    },
    onUnload: function () {
        this.setData({
            showCanvas: false
        });
    }
})