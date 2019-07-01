// pages/home/my_study/answer/sendAnswer/sendAnswer.js
const network = require("../../../../../../utils/main.js");
var app = getApp();
Page({
  data: {
      coverImg: '',
      coverImg2: '',
      mp3: '',
      path: '',
      temptime: '',
      val: ''
  },
  onLoad: function (options) {
        // console.log(options);
        this.setData({
            coverImg: options.img,
            mp3: options.mp3,
            path: options.path,
            coverImg2: options.img2,
            temptime: options.temptime
        });
  },
  getTxaVal: function(e){
    //   console.log(e.detail.value);
      this.setData({
          val: e.detail.value
      });
  },
  send: function(){
      var data = this.data;
      var a = wx.getStorageSync('ques');
    //   console.log(data.mp3);

      if (data.mp3){
          wx.showLoading({
              title: '上传中....'
          });
        var schoolId = app.userData.userinfo.school;
        var userId = app.userData.userinfo.id;
        var token = app.userData.userinfo.logintoken;
        
        wx.uploadFile({
            url: app.userData.uploadURL + 'tiwen/addWXhuifu',
            filePath: data.mp3,
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "schoolId": schoolId,
                "userId": userId,
                "token": token
            },
            name: 'mp3filepath',
            formData: {
                'tiwenId': a.zaixiantiwen_id,
                'nianji': a.nianji,
                'kemu': a.kemu,
                'context': data.val,
                'pointlist': data.path,
                'img': data.coverImg,
                'luzhitime': data.temptime
            },
            success: function (res) {
                if (res.data == "S000") {
                    // console.log(res);
                    wx.hideLoading();
                    wx.navigateBack({
                        delta: 3
                    });
                } else {
                    wx.showToast({
                        title: '上传失败',
                        image: '../../../../../images/home/error.png',
                        duration: 1000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '服务器异常',
                    image: '../../../../../images/home/error.png',
                    duration: 1000
                })
            }
        });
      }

  }
})