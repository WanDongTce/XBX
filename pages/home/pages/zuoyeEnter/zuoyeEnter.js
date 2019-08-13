// pages/ls2/ls2.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
Page({

  data: {
    imgUrls: [],
      showEmpty: false,
      questionList: [],
      refreshFlag: true,
      base: '../../../../',  

         
               
  },

  onLoad: function (options) {
    this.compontNavbar = this.selectComponent("#compontNavbar");
      
    this.getSwipImgs();
  },

    onShow() {
      
        if (this.data.refreshFlag) {
            this.getQuestionList(false);
        }
    },
    judge:function(){
        wx.navigateTo({
            url: '/pages/home/pages/zuoye/zuoye',
        })
        
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
  getSwipImgs: function () {
    var that = this;
    network.getSwiperImgs(9, function (res) {
      // console.log(res);
      if (res.data.code == 200) {
        that.setData({
          imgUrls: res.data.data[0].list
        });       
      }     
    });

  }, 

    getQuestionList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/question/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": 2
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.questionList.concat(a);
                    }
                    that.setData({
                        questionList: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    // console.log(that.data.questionList);          
                    hasmore = res.data.data[0].hasmore;
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
    onReachBottom: function () {
        var that = this;
        if (that.data.questionList.length > 0) {
            if (hasmore) {
                page++;
                that.getQuestionList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
    previewImg(e) {
        // console.log(e);
        this.setData({
            refreshFlag: false
        });
        var a = e.currentTarget.dataset;
        // console.log(a);
        var b = [];
        for (var i = 0; i < a.imgs.length; i++) {
            b.push(a.imgs[i].url);
        }

        network.previewImg(a.img, b);
    },
    toDetail: function (e) {
        var a = e.currentTarget.dataset;
        // console.log(a);
        var href = a.href.slice(0, a.href.indexOf('?'));
        var p = a.href.slice(a.href.indexOf('?') + 1);
        wx.navigateTo({
            url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
        });
    },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    } 
})