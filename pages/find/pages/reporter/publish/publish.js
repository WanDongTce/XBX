// pages/reporter/publish/publish.js
const network = require("../../../../../utils/main.js");
const app = getApp();

var flag = false;


Page({
  data: {
    base: '../../../../../',
    imgList: [],
    content: '',
    title: ''
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
    // console.log(options);
    // id = options.id;
    // this.setData({
    //   title: options.title
    // });
  },
  onShow: function () {
    
  },
  saveTitle: function (e) {
    var a = e.detail.value.replace(/^\s*|\s*$/, '');
    this.setData({
      title: a
    });
    // console.log(this.data.title)
  },
  saveContent: function (e) {
    var a = e.detail.value.replace(/^\s*|\s*$/, '');
    this.setData({
      content: a
    });
  },
 
  // addImg: function () {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       var a = res.tempFilePaths;
  //       network.publicUpload(a, function (res) {
  //         var b = that.data.imgList.concat(res.data[0].list);
  //         that.setData({
  //           imgList: b
  //         });
  //         flag = true;
  //       });
  //     }
  //   });
  // },

  // delImg: function (e) {
  //   var that = this;
  //   var idx = e.currentTarget.dataset.idx;
  //   var list = that.data.imgList;
  //   var a = list.slice(0, idx).concat(list.slice(idx + 1));
  //   that.setData({
  //     imgList: a
  //   });
  // },
  // submit: function () {
  //   var that = this;
  //   var list = that.data.imgList;
  //   // console.log(list);
  //   var content = that.data.content;
  //   if (!content) {
  //     wx.showToast({
  //       title: '请输入内容',
  //       icon: 'none',
  //       duration: 1000
  //     });
  //   }
  //   else if (list.length > 0 && !flag) {
  //     wx.showToast({
  //       title: '图片上传中,请稍后...',
  //       icon: 'none',
  //       duration: 1000
  //     });
  //   }
  //   else {
  //     if (list.length == 0) {
  //       content = '<p>' + content + '</p>';
  //     } else {
  //       content = '<p>' + content + '</p><p>' + '<img src="' + list[0].file_url + '"/>' + '</p>';
  //     }
  //     that.submitFn(content);
  //   }
  // },
  // submitFn: function (content) {
  //   network.POST({
  //     url: 'v14/news/create-news',
  //     params: {
  //       'mobile': app.userInfo.mobile,
  //       'token': app.userInfo.token,
  //       'questionid': id,
  //       'content': content
  //     },
  //     success: function (res) {
  //       // console.log(res);
  //       wx.hideLoading();
  //       if (res.data.code == 200) {
  //         wx.showToast({
  //           title: '提交成功',
  //           duration: 1000,
    // icon: 'none'
  //         });
  //         wx.navigateBack({
  //           delta: 1
  //         });
  //       } else {
  //         wx.showToast({
  //           title: res.data.message,
  //           icon: 'none',
  //           duration: 1000
  //         });
  //       }
  //     },
  //     fail: function () {
  //       wx.hideLoading();
  //       wx.showToast({
  //         title: '服务器异常',
  //         icon: 'none',
  //         duration: 1000
  //       })
  //     }
  //   });
  // }
  submit: function () {
    var that = this;
    var list = that.data.imgList;
    // console.log(list.length)
    if (that.data.title.length == 0) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.content.length == 0) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
    }
    else if (list.length > 10) {
      wx.showToast({
        title: '至多9张图片',
        icon: 'none',
        duration: 1000
      })
    }
    else {
      if (list.length == 0) {
        // console.log('111')
        that.getSubmit();
      }      
      else {
        // console.log('2222222')
        app.showLoading();
        that.uploadImgs(list);
      }
    }
    
   
  },
  uploadImgs: function (list) {
    var that = this;
    network.upload('v14/news/create-news', list, {
      'mobile': app.userInfo.mobile,
      'token': app.userInfo.token,
      'title': that.data.title,
      'content': that.data.content,
    
    }, function (res) {
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 1000
      });
      wx.navigateBack({
      })
    });
  },
  
  addImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
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
  getSubmit:function(){
    var that=this;
    network.POST({
      url: 'v14/news/create-news',
      params: {
        'mobile': app.userInfo.mobile,
        'token': app.userInfo.token,
        'title': that.data.title,
        'content': that.data.content,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
              icon: 'none',
            duration: 1000
          });
          wx.navigateBack({
            
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