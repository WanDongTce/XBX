const network = require("../../../../../utils/main.js");
const app = getApp();
// console.log(app);
var i = 0;
var flag = true;
var uploadStyle='';//1为图片，2为视频
Page({
    data: {
        imgList: [],
        videoList: [],
        msg: '',
        ifchoicetopic: "选择话题",
        // ifbindtap:'',
        plateid: '',
        topicid: '',
        array: ['照片', '视频'],
        base: '../../../../../'
    },
    bindPickerChange: function (e) {
      this.setData({
        index: e.detail.value
      })
      var that = this;
      if (that.data.videoList.length >= 1){
        wx.showModal({
          title: '提示',
          content: '视频图片不能同时选择',
          showCancel: true
        })
      }
      if (that.data.imgList.length >=1) {
        if (that.data.index == 0){
          wx.showModal({
            title: '提示',
            content: '图片至多为1张',
            showCancel: true
          })
        }
        else{
          wx.showModal({
            title: '提示',
            content: '视频图片不能同时选择',
            showCancel: true
          })
        }        
      }
      else{
        if (that.data.index == 0) {
          that.addImg();
        }
        else {
          that.addVideo();
        }
      }
      
      
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
        var that = this;
        // console.log(options);
        if (options.plateid) {
            that.setData({
                plateid: options.plateid,
                topicid: options.topicid,
                ifchoicetopic: options.ifchoicetopic,
            })
        }
        var b = '';
        b = wx.getStorageSync('classmatewriting');
        // console.log(b)
        if (b !== '') {
            that.setData({
                msg: b.content,
                imgList: b.list,
                videoList: b.videoList,
            })
        }
    },
    saveMsg: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            msg: a
        });
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
                    imgList: a
                });
            }
        });
    },
    addVideo: function () {
      var that = this;
      wx.chooseVideo({              
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          var a = that.data.videoList.concat(res.tempFilePath);
          that.setData({
            videoList: a
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
    delVideo: function (e) {
      console.log(e);
      var that = this;
      var idx = e.currentTarget.dataset.idx;
      var list = that.data.videoList;
      var a = list.slice(0, idx).concat(list.slice(idx + 1));
      that.setData({
        videoList: a
      });
    },
    submit: function () {
        var that = this;
        // var list = that.data.imgList;
        // console.log(list);
        var content = that.data.msg;
        if (!content) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 1000
            })
        }
        else if (that.data.ifchoicetopic == "选择话题") {
            wx.showToast({
                title: '请选择话题',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            app.showLoading();
            flag = false;
            // that.uploadImgs(list, content);
            if(that.data.imgList.length>0){
              var uploadlist = that.data.imgList;
              var uploadStyle = 1;
              //有图片直接
              that.uploadImgs(that.data.imgList, content);            
            }
            else if (that.data.videoList.length > 0){
              var uploadlist = that.data.videoList;
              var uploadStyle = 2;
              //有视频先upload
              that.newupload(uploadlist);         
            }
            else{
              //无视频 图片，直接上传
              that.setData({
                videourl: ''
              })
              that.newPublish();
            }
        }
    },
    //上传视频
    newupload: function (uploadlist){
      var that=this;
      network.publicUpload(uploadlist, function (res) {
        var videourl = res.data[0].list[0].file_url;
        if (videourl) {
          that.setData({
            videourl: videourl
          })
          that.newPublish();
        } else {
          wx.showToast({
            title: '上传失败',
              icon: 'none'
          })
        }
      }); 
      
    },
    //无图片提交
    newPublish:function(){
      var that = this;
      network.POST({
        url: 'v5/posts',
        params: {
          'mobile': app.userInfo.mobile,
          'token': app.userInfo.token,
          'forum_id': that.data.topicid,
          'community_id': app.userInfo.register_community_id,
          'community_city_id': app.userInfo.register_city_id,
          'content': that.data.msg,
          'lng': app.userInfo.lng,
          'lat': app.userInfo.lat,
          'video_url': that.data.videourl
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
                title: '发布成功',
                success: function () {
                    wx.removeStorageSync('classmatewriting');
                    wx.navigateTo({
                        url: '/pages/home/pages/classmate/classmate'
                    });
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
    uploadImgs: function (list, content) {
        var that = this;
        network.upload('v5/posts', list, {
            'mobile': app.userInfo.mobile,
            'token': app.userInfo.token,
            'forum_id': that.data.topicid,
            'community_id': app.userInfo.register_community_id,
            'community_city_id': app.userInfo.register_city_id,
            'content': content,
            'lng': app.userInfo.lng,
            'lat': app.userInfo.lat
        }, function (res) {
            wx.showToast({
                title: '发布成功',
                success: function () {
                    wx.removeStorageSync('classmatewriting');
                    wx.navigateTo({
                        url: '/pages/home/pages/classmate/classmate'
                    });
                }
            });
        });
    },
    //点击选择话题
    choicetopic: function (e) {
        var that = this;
        var classmatewriting2 = {};
        classmatewriting2.content = that.data.msg;
        classmatewriting2.list = that.data.imgList;
        classmatewriting2.videoList = that.data.videoList;
        // console.log(classmatewriting2)
        wx.setStorageSync('classmatewriting', classmatewriting2)
        wx.navigateTo({
            url: '/pages/home/pages/classmate/topic/topic',
        })
    },
    onUnload: function () {

    }
})