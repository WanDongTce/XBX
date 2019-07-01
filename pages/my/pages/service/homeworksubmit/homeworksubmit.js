// pages/edutlList/operation/operation.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var starttime='';
var endtime = '';
var subjectid = '';
Page({
  data: {
    imgList: [],
    url:''
  },
  onLoad: function (options) {
    // console.log(options)
    starttime = options.starttime;
    endtime = options.endtime;
    subjectid = options.subjectid;
    this.setData({
      // url: '/pages/service/dohomework/dohomework?subjectid=' + sexIndex'
      url:'/pages/my/pages/service/dohomework/dohomework?subjectid=' + subjectid+ '&subjectname=' + options.subjectname
    })
  },
  
  submit: function () {
    var that = this;
    var list = that.data.imgList;
    if(list.length==0){
      wx.showToast({
        title: '请选择图片',
          icon: 'none',
        duration: 1000
      })
    }
    else if (list.length >10){
      wx.showToast({
        title: '至多9张图片',
          icon: 'none',
        duration: 1000
      })
    }
    else{
      app.showLoading();
      that.uploadImgs(list);
    }
    // if () {
      
    //   } else {
    //     app.showLoading();
    //     that.uploadImgs(list);
    //   }
    // }
  },
  uploadImgs: function (list) {
    var that = this;
    network.upload('v14/study/creat-work', list, {
      'mobile': app.userInfo.mobile,
      'token': app.userInfo.token,
      'subject': subjectid,
      'start_time': starttime,
      'end_time': endtime,
      
    }, function (res) {
      wx.showToast({
        title: '提交成功',
        success: function () {
          wx.navigateTo({
            url: '/pages/my/pages/service/homework/homework'
          })
        }
      });
    });
  },
  submitFn: function (content, point) {
    network.POST({
      url: 'v14/question/add',
      params: {
        'mobile': app.userInfo.mobile,
        'token': app.userInfo.token,
        'gradeid': gradeId,
        'subjectid': subjectId,
        'name': content,
        'point': point
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
            success: function () {
              wx.navigateTo({
                url: '/pages/my/pages/homework/homework?index=0'
              })
            }
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
})