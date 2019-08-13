const network = require("../../../../utils/main.js");
const moment = require("../../../../utils/moment.js");
const app = getApp();
var date = moment().format('YYYY-MM-DD');
// console.log(date);

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        date: date,
        step: 0
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.setData({
            idname: app.idname
        })
    },
    onShow: function () {
        var that = this;
        wx.login({
            success: function (res) {
                // console.log(res);
                that.getStep();
            },
            error(){
                wx.showToast({
                    title: '微信登录失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }); 
      var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getStep(){
        wx.getWeRunData({
            success(res) {
                if (res.errMsg == "getWeRunData:ok"){
                    var encryptedData = res.encryptedData;
                    console.log(encryptedData);
                    //todo:  数据需要解密https://developers.weixin.qq.com/miniprogram/dev/api/signature.html#wxchecksessionobject
                }
            }
        });
    },
    bindDateChange(e) {
        // console.log(e);
        this.setData({
            date: e.detail.value
        });
    },
    onUnload: function () {

    }
})