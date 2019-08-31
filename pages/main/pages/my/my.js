const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        info: '',
        msgCount: 0,
        showTab: true
    },
    onLoad(){
        this.compontNavbar = this.selectComponent("#compontNavbar");
      if (app.userInfo.mobile == '18647993992') {
        this.setData({
          showTab: false
        })
      }  
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onShow: function () {
        // console.log(app);
        var that = this;
        that.getUserInfo(); 
        that.getMsg();
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function(res){
            console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a
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
    getMsg(){
        var that = this;
        network.POST({
            url: 'v9/message/read',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        msgCount: a.message
                    });
                } else {
                    console.log(res.data.message);
                }
            },
            fail: function (err) {
                console.log(err);
            }
        }, true);
    },
    toInfo(e) {
        // console.log(app);
        if (app.userInfo.step == 8) {
            // wx.navigateTo({
            //     url: '/pages/my/pages/personInfo/personInfo'
            // });
            wx.navigateTo({
                url: '/pages/my/pages/setPage/setPage'
            });
        } else {
            wx.navigateTo({
                //url: '/pages/login/presonalInfo/presonalInfo'
              url: '/pages/my/pages/setPage/setPage'
            });
        }

    },
    toNote:function(){
      wx.navigateTo({
          url: '/pages/my/pages/myMsgNew/myMsgNew'
      });
        // wx.navigateTo({
        //     url: '/pages/my/pages/myMsg/myMsg'
        // });
    },
    toTuiguang:function(e){
        wx.navigateTo({
            url: '/pages/my/pages/tuiguangNew/tuiguangNew'
        });
    },
    toRecharge() {
        wx.showToast({
            title: '敬请期待',
            icon: 'none'
        });
        // wx.navigateTo({
        //     url: '/pages/my/recharge/recharge'
        // })
    },
    toMemberRenewal(){
        wx.navigateTo({
            url: '/pages/my/pages/memberRenewalNew/memberRenewalNew'
        })
    },
    toIntegarl(){
        var that = this;
        wx.navigateTo({
            url: '/pages/my/pages/myIntegarl/myIntegarl?score=' + that.data.info.score
        })
    },
    toMyAns(){
        wx.navigateTo({
            url: '/pages/common/webView/webView?src=' + app.ansHref + '&uid=' + app.userInfo.id + '&miniPro=1'
        });
    }
})