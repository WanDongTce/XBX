const network = require("../../../../utils/main.js");
var app = getApp();
var page = 1;
var hasmore = '';


Page({
    data: {
        showEmpty: false,
        list: [],
        topic: [],
        refreshFlag: true,
        base: '../../../../',
        cz_flag: false, // 控制点赞评论按钮
        cz_right: 0, // 点赞评论定位right
        cz_top: 80, // 点赞评论定位top
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.getTopic();
    },
    onShow: function () {
        var that = this;
        if (that.data.refreshFlag){
            page=1;
            that.getList(false);
        }
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    getTopic: function () {
        var that = this;
        network.POST({
            url: 'v10/post-topic/topic',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        topic: res.data.data
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
    },
    getList: function (contaFlag) {
        var that = this;
        network.POST({
            url: 'v11/post/post-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "community_id": app.userInfo.register_community_id,
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    // var a = that.data.list.concat(res.data.data.item);
                    // that.setData({
                    //     list: a,
                    //     showEmpty: a.length == 0 ? true : false
                    // });
              
                    // hasmore = res.data.data.pageCount;
                  
                  var a = res.data.data.item;
                  for (var i = 0; i < a.length; i++) {
                    a[i].isShowPop = false;
                    // that.setData({
                    //   list: popnumlist
                    // })
                  }  
                  if (contaFlag) {
                    a = that.data.list.concat(a);
                  }
                  that.setData({
                    list: a,
                    showEmpty: a.length == 0 ? true : false
                  });
                  hasmore = res.data.data.pageCount;
                  //将所有popnumlist的popupnum为0
                  // var popnumlist = that.data.list;
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
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    toDetail: function (e) {
        var a = e.currentTarget.dataset.item;
        wx.setStorageSync("classmate", a);
        // wx.navigateTo({
        //     url: '/pages/classmate/classmateDetail/classmateDetail'
        // })
        wx.navigateTo({
          url: '/pages/home/pages/classmate/classmateDetailNew/classmateDetailNew'
        })
    },
    toWrite: function () {
        wx.navigateTo({
            url: '/pages/home/pages/classmate/classmateWrite/classmateWrite'
        })
    },
    onUnload: function () {
        page = 1;
        hasmore = '';
        this.setData({
          showEmpty: false
        });
    },
    tz_topicdetail: function (e) {
        var a = e.currentTarget.dataset.topicitem;
        wx.setStorageSync("topic", a);
        wx.navigateTo({
            url: '/pages/home/pages/classmate/topicDetail/topicDetail?topicid=' + e.currentTarget.dataset.topicid + '&topicname=' + e.currentTarget.dataset.topicname
        })
    },
    previewImg(e) {
        this.setData({
            refreshFlag: false
        });
        // console.log(e);
        var a = e.currentTarget.dataset;
        // console.log(a);
        var b = [];
        for (var i = 0; i < a.imgs.length; i++) {
            b.push(a.imgs[i].photo);
        }

        network.previewImg(a.img, b);
    },
    //点击弹出评论和点赞
    btn_rt_catchtap:function(e){
      // console.log(e)          
      var that=this;
      var id = e.currentTarget.dataset.popupimgid;
      var list = that.data.list;
      // that.setData({
      //   popupimgid:e.currentTarget.dataset.popupimgid,        
      // })     
      for (var i = 0; i < list.length; i++) {
        if (id == list[i].id) {
          // var popnumlist2 = that.data.list
          // console.log(parseInt(that.data.list[i].popupnum))
          // popnumlist2[i].popupnum = Number(parseInt(that.data.list[i].popupnum) + 1)
          list[i].isShowPop = !list[i].isShowPop;
          break;
        }
      }   

      that.setData({
          list: list
      }) 
      // console.log(that.data.list[0].popupnum)
      
      
    },
    // 点赞
    addAgree: function (e) {
      var that = this;
      if (e.currentTarget.dataset.dianzan == 1 ) {
        wx.showToast({
          title: '您已点赞',
            icon: 'none',
          duration: 1000
        });
      }
      
      else {
        for (var i = 0; i < that.data.list.length; i++) {
          if (that.data.list[i].id == e.currentTarget.dataset.postid) {
            var list2 = that.data.list
            // list2[i].agreenum = Number(parseInt(that.data.list[i].agreenum) + 1)
            list2[i].is_thumbs = 1;
            that.setData({
              list: list2
            })
          }
        }
        network.POST({
          url: 'v6/post/thumbs-for-post',
          params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "author_mobile": e.currentTarget.dataset.ftrphone,
            "post_id": e.currentTarget.dataset.postid
          },
          success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
              // that.setData({
              //   is_thumbs: 1,
              //   thumbs: Number(parseInt(that.data.thumbs) + 1),
              // })

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
    },
    
    //发布评论
    publish: function (e) {
      wx.navigateTo({
        url: '/pages/home/pages/classmate/comment/comment?type=' + 1 + '&commentid=' + e.currentTarget.dataset.postid + '&author_mobile=' + e.currentTarget.dataset.ftrphone,
        // url: '/pages/classmate/comment/comment?type=' + 1
      })
    },
})
