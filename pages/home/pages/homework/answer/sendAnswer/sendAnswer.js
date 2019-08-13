// pages/home/my_study/answer/sendAnswer/sendAnswer.js
const network = require("../../../../../../utils/main.js");
var app = getApp();
var jsonall={};
var id;
Page({
  data: {
      coverImg: '',
      coverImg2: '',
      mp3: '',
      path: '',
      temptime: '',
      val: ''
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
  onLoad: function (options) {
      console.log(options);
      id = options.id;
    
      
      jsonall.path = options.allStroker;
      jsonall.coverImg = options.img;
      jsonall.flag = options.flag;
      jsonall.mp3 = options.mp3;
      jsonall.temptime = options.temptime;
      jsonall.bgImg = options.bgImg;
    //   console.log(jsonall)

        this.setData({
            coverImg: options.img,
            mp3: options.mp3,
            path: options.path,
            coverImg2: options.img2,
            temptime: options.temptime
        });
  },
  
    saveContent: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            val: a
        });
    },
  send: function(){
      var data = this.data;
    //   var a = wx.getStorageSync('ques');
    //   console.log(data.mp3);
      var that=this;
    //   console.log(that.data.val)
      console.log(jsonall)
      network.POST({
          url: 'v14/question/answer-add',
          params: {
              'mobile': app.userInfo.mobile,
              'token': app.userInfo.token,
              'questionid': id,
              'content': that.data.val,
              'an_type': 2,
              'wx_json': JSON.stringify(jsonall)
          },
          success: function (res) {
              // console.log(res);
              wx.hideLoading();
              if (res.data.code == 200) {
                  wx.showToast({
                      title: '提交成功',
                      duration: 1000,
                      icon: 'none'
                  });
                  wx.navigateTo({
                      url: '/pages/home/pages/homework/homework'
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

      
    //   if (data.mp3){
    //       wx.showLoading({
    //           title: '上传中....'
    //       });
    //     var schoolId = app.userData.userinfo.school;
    //     var userId = app.userData.userinfo.id;
    //     var token = app.userData.userinfo.logintoken;
        
    //     wx.uploadFile({
    //         url: app.userData.uploadURL + 'tiwen/addWXhuifu',
    //         filePath: data.mp3,
    //         header: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //             "schoolId": schoolId,
    //             "userId": userId,
    //             "token": token
    //         },
    //         name: 'mp3filepath',
    //         formData: {
    //             'tiwenId': a.zaixiantiwen_id,
    //             'nianji': a.nianji,
    //             'kemu': a.kemu,
    //             'context': data.val,
    //             'pointlist': data.path,
    //             'img': data.coverImg,
    //             'luzhitime': data.temptime
    //         },
    //         success: function (res) {
    //             if (res.data == "S000") {
    //                 // console.log(res);
    //                 wx.hideLoading();
    //                 wx.navigateBack({
    //                     delta: 3
    //                 });
    //             } else {
    //                 wx.showToast({
    //                     title: '上传失败',
    //                     image: '../../../../../images/home/error.png',
    //                     duration: 1000
    //                 })
    //             }
    //         },
    //         fail: function () {
    //             wx.showToast({
    //                 title: '服务器异常',
    //                 image: '../../../../../images/home/error.png',
    //                 duration: 1000
    //             })
    //         }
    //     });
    //   }

  }
})