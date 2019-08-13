const network = require("../../../../utils/main.js");
const app = getApp();


Page({
    data: {
        base: '../../../../',
        contLength: 0,
        maxLength: 500,
        focus: true,
        content: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
  onShow: function () {
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
    inputFn(e){
        // console.log(e.detail.value);
        var that = this;
        var b = that.data.maxLength;
        var a = e.detail.value.replace(/[\u0391-\uFFE5]/g, "aa").length;
        var c = e.detail.value.replace(/^\s*|\s*$/, '');
        that.setData({
            contLength: a,
            content: c
        });

        if (a > b){
            wx.showToast({
                title: '字数超限',
                icon: 'none'
            });
            that.setData({
                focus: false,
                contLength: b
            });
        }
    },
    submitFn(e){
        var that = this;
        if (that.data.content){
            that.submit();
        }else{
            wx.showToast({
                title: '请输入内容',
                icon: 'none'
            });
        }
    },
    submit(){
        var that = this;
        network.POST({
            url: 'v11/community-about/add',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "qid": app.userInfo.register_community_id,
                "type": 1,
                "content": that.data.content 
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发布成功',
                        success: function(){
                            wx.navigateTo({
                                url: "/pages/find/pages/schoolCommList/schoolCommList",
                                complete(err) {
                                    // console.log(err);
                                    if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                                        app.webViewLimitate();
                                    }
                                }
                            })
                        }
                    })
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