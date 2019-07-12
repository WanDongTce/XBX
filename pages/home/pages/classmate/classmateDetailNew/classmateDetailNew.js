const network = require("../../../../../utils/main.js");
var app = getApp();
var page = 1;
var contaFlag = false;
var hasmore = null;
Page({
  data: {
    list: [],
    showzanList: [],
    is_thumbs: '',
    thumbs: '',
    myshow: false,
    hasmore: '',
    author_mobile: '',
    showbottom: false,      //底部评论
    msg: '',
    c_type: '',
    c_commentid: '',
    c_author_mobile: '',
      base: '../../../../../'
  },
  onLoad: function (options) {
    this.compontNavbar = this.selectComponent("#compontNavbar");
    
    var that = this;
    var b = wx.getStorageSync('classmate');
    // console.log(b)
    that.setData({
      list: b,      
      is_thumbs: b.is_thumbs,
      thumbs: b.thumbs,
      commentBigId: b.id,
      author_mobile: b.mobile,
    })    
    var showpop=that.data.list;
    showpop.isShowPop=false;
    that.setData({
      list:showpop
    })
    // console.log(that.data.list)
  },
  onShow: function () {
    var that = this;
    that.setData({
      myshow: false
    })
    page = 1;   
    that.getShowZan();
    that.getComment(false);
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
  //评论列表
  getComment: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v10/post/comments-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "post_id": that.data.list.id,
        "page": page,
        "page_size": 5,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data;          
          if (contaFlag ) {            
            a=that.data.commentList.concat(a);                         
          }          
          that.setData({
            commentList: a,
            myshow: a.length == 0 ? true : false,            
          })
          hasmore: res.data.data.length
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
  //点赞用户
  getShowZan:function(){
    var that = this;
    network.POST({
      url: 'v6/post/show-zan',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "post_id": that.data.list.id,
       
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {         
            that.setData({
              showzanList: res.data.data[0].list,              
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
  // 点赞
  addAgree: function (e) {
    var that = this;
    var list = that.data.list;
    list.isShowPop = !list.isShowPop;
    that.setData({
      list: list,      
    })
    // console.log(e.currentTarget.dataset.dianzan)
    if (e.currentTarget.dataset.dianzan == 1) {
      wx.showToast({
        title: '您已点赞',
          icon: 'none',
        duration: 1000
      });
    }
    else {
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
            that.setData({
              is_thumbs: 1,
              thumbs: Number(parseInt(that.data.thumbs) + 1),
            })
            that.setData({
              myshow: false,
            })
            page = 1;
            that.getShowZan();
            that.getComment(false);
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
  comment_zan: function (e) {
    var that = this;
    // console.log(e.currentTarget.dataset.dianzancomment)
    if (e.currentTarget.dataset.dianzancomment == 1) {
      wx.showToast({
        title: '您已点赞',
          icon: 'none',
        duration: 1000
      });
    }
    else {
      network.POST({
        url: 'v10/post/thumbs-for-comments',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "author_mobile": e.currentTarget.dataset.authorphone,
          "comment_id": e.currentTarget.dataset.commentid
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
            for (var i = 0; i < that.data.commentList.length; i++) {
              if (that.data.commentList[i].id == e.currentTarget.dataset.commentid) {
                var commentList2 = that.data.commentList
                commentList2[i].thumbs = Number(parseInt(that.data.commentList[i].thumbs) + 1)
                commentList2[i].is_thumbs = 1;
                that.setData({
                  commentList: commentList2
                })
              }
            }

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
  onReachBottom: function () {    
    var that = this;
    if (that.data.commentList.length > 0) {
      if (hasmore) {
        page++;
        that.getComment(true);
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        });
      }
    }
    else {
      wx.showToast({
        title: '没有更多了',
          icon: 'none',
        duration: 1000
      })
    }


  },
  //发布评论
  publish: function (e) {
    // var showbottom=false;
    var that=this;
    if (that.data.showbottom==false){
      var list = that.data.list;
      list.isShowPop = !list.isShowPop;
      that.setData({
        showbottom:true,
        list: list,
        placeholder:"评论"
      })
    }
    else{
      that.setData({
        showbottom: false
      })
    }    
    that.setData({
      c_type: 1,
      c_author_mobile: that.data.author_mobile,
    })
              
    // wx.navigateTo({
    //   url: '/pages/classmate/comment/comment?type=' + 1 + '&commentid=' + this.data.commentBigId + '&author_mobile=' + this.data.author_mobile,
    // })

  },
  //评论列表中点击评论
  comment_comment: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/home/pages/classmate/comment/comment?type=' + 2 + '&commentid=' + e.currentTarget.dataset.commentid + '&author_mobile=' + e.currentTarget.dataset.author_mobile,
    })
  },
  //点击弹出评论和点赞
  btn_rt_catchtap: function (e) {
    // console.log(e)          
    var that = this;
    var list = that.data.list;
    list.isShowPop = !list.isShowPop;
    that.setData({
      list: list,
      showbottom: false
    })
    // console.log(that.data.list[0].popupnum)
  },
  //输入的评论
  bindinput:function(e){
    var a = e.detail.value.replace(/^\s*|\s*$/, '');
    this.setData({
      msg: a
    });
  },
  //输入评论时失去焦点
  bindblur:function(e){
    // console.log(e)
    this.setData({
      showbottom: false
    })
  },
  //评论
  submit: function () {
    var that = this;
    network.POST({
      url: 'v11/postcomments/comment',
      params: {
        "mobile": app.userInfo.mobile,
        "author_mobile": that.data.c_author_mobile,
        "type": that.data.c_type,        
        "post_id": that.data.commentBigId,
        "content": that.data.msg,
        "token": app.userInfo.token,
        "pid": that.data.pid,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          page = 1;
          that.getComment(false);
          that.setData({
            showbottom: false
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
  catchtap_huifu:function(e){
    // console.log(e)
    var that=this;
    var placeholder = "回复" + e.currentTarget.dataset.forplaceholder+':'
    var list = that.data.list;
    list.isShowPop = false
    that.setData({
      list:list,
      showbottom: true,
      placeholder: placeholder,
      c_type: 2,
      c_author_mobile: e.currentTarget.dataset.authorphone,
      pid: e.currentTarget.dataset.pid,
    })
    
  }
})
