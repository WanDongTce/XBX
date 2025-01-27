// pages/ls2/ls2.js
const network = require("../../../../utils/main.js");
const app = getApp();
var access_token
var id='';
Page({

  data: {
     
      base:'../../../../',
      imgList: [],
      savetextarea:'',
      csArr: [
        

      ],
      csIndex: 0,
      subjectid: 0,
  },

  onLoad: function (options) {
    //   console.log(app.studyOptions.kemu)
    //   this.getSubject() 
    var that=this;
    that.setData({
        csArr: app.studyOptions.kemu,
        csIndex: 0,
    })

  },
    bindPickerCs: function (e) {
        var that = this;
        that.setData({
            csIndex: e.detail.value
        });
      
        for (var i = 0; i < that.data.csArr.length; i++) {
            if (that.data.csArr[that.data.csIndex].title == that.data.csArr[i].title) {
                that.setData({
                    subjectid: that.data.csArr[i].id
                })
            }
        }
        // console.log(that.data.subjectid)
    },
  onShow: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
    that.gettoken()
  },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {

                var a = that.data.imgList.concat(res.tempFilePaths);
                that.setData({
                    imgList: a,

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
    savetextarea: function (e) {
        // console.log(e);
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            savetextarea: a
        });
    },

    bindFormSubmit: function (e) {
        var that = this;
        var list = that.data.imgList;//图片
        console.log(11)
        var subjectid = that.data.subjectid;
        
        
        // console.log(list);
        var savetextarea = that.data.savetextarea;
        // console.log(starttimeTemp)
        if (savetextarea.length == 0) {
            wx.showToast({
                title: '请输入作业内容',
                icon: 'none',
                duration: 1000
            })
        }
        else if (that.data.csIndex==0) {
            wx.showToast({
                title: '请选择科目',
                icon: 'none',
                duration: 1000
            })
        }
        else if (list.length == 0){
            wx.showToast({
                title: '请上传图片',
                icon: 'none',
                duration: 1000
            })
        }
        else {
          console.log(list)
            var text
            var img
            wx.request({
              url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
              data: {

                "content": savetextarea
              },
              method: 'POST',
              success:function(res){
                if (res.data.errcode == 0){
                  wx.request({
                    url: 'https://api.weixin.qq.com/wxa/img_sec_check?access_token=' + access_token,
                    data: {

                      media: list
                    },
                    method: 'POST',
                    header: {
                      'Content-Type': 'application/octet-stream'
                    },
                    success: function (ress) {
                      console.log(ress)
                      if (ress.data.errcode == 0){
                        app.showLoading();
                        network.publicUpload(that.data.imgList, function (res) {
                          console.log(res);
                          var img = res.data[0].list[0].file_url;
                          // console.log(img);
                          // console.log(typeof(img));
                          var arrimg = [];
                          arrimg.push(img);
                          console.log(arrimg)
                          // console.log(typeof (arrimg))


                          network.POST({
                            url: 'v14/home-work-custom/add',
                            params: {
                              "mobile": app.userInfo.mobile,
                              "token": app.userInfo.token,
                              "name": savetextarea,
                              "subjectid": subjectid,

                              "images_json": JSON.stringify(arrimg)
                            },
                            success: function (resnew) {
                              wx.hideLoading();
                              if (resnew.data.code == 200) {
                                console.log(resnew)
                                wx.navigateBack({

                                })
                              } else {
                                wx.showToast({
                                  title: resnew.data.message,
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

                        });
                      }
                      
                    }
                  })
                }
               
              }
            })
         
          if(text==0&&img==0){
           
          }
                


            // network.uploadimg({
                
            //     path: that.data.imgList//这里是选取的图片的地址数组
            // });
            // network.uploadimg(that.data.imgList, function (res) {
            //     console.log(res);
                

            // });
            }
            
        },
    
    
  
      gettoken: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var userid = userInfo.id
    console.log(userid)
    wx.request({
      url: app.requestUrl + 'v14/public/get-new-token',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'userid': userid,
        "mini_type": 'xuabaxue'

      },
      success: function (res) {
        console.log(res.data.data[0].access_token)
        access_token = res.data.data[0].access_token
      }
    })
  },
  
})