const network = require("../../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        imgList: [],
        msg: '',
        base: '../../../../../',
    },
    saveMsg: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            msg: a
        });
    },
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var a = that.data.imgList.concat(res.tempFilePaths);
                that.setData({
                    imgList: a
                });
            }
        });
    },
    delImg: function (e) {
        // console.log(e);
        var that = this;
        var idx = e.currentTarget.dataset.idx;
        var list = that.data.imgList;
        var a = list.slice(0, idx).concat(list.slice(idx + 1));
        that.setData({
            imgList: a
        });
    },
    submit: function () {
        var that = this;
        var list = that.data.imgList;
        var msg = that.data.msg;
        if(!msg){           
            wx.showModal({
              title: '提示',
              content: '请描述您需要的商品',
              showCancel: false
            })
        }else{
          if (list.length == 0){
            that.noPictureLoad(msg);
          }
          else{
            app.showLoading();
            that.uploadImgs(list,msg);
          }
        }
    },
    //无图片时上传
    noPictureLoad: function (msg){
      var that=this;
      network.POST({
        url: 'v14/shop-point/expect',
        params: {
          'mobile': app.userInfo.mobile,
          'token': app.userInfo.token,
          'content': msg
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
              wx.showToast({
                  title: '提交成功',
                  success: function () {
                      wx.navigateTo({
                          url: '/pages/home/pages/integralMall/PurchaseInAdvance/PurchaseInAdvance'
                      });
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
    },
    uploadImgs: function (list, msg) {
        var that = this;

        network.upload('v14/shop-point/expect', list, {
            'mobile': app.userInfo.mobile,
            'token': app.userInfo.token,
            'content': msg
        }, function (res) {
            wx.showToast({
                title: '提交成功',
                success: function(){
                    wx.navigateTo({
                        url: '/pages/home/pages/integralMall/integralMall'
                    });
                }
            });
        });
    }
})