const network = require("../../../../../utils/main.js");
const app = getApp();

var gradeId = '';
var subjectId = '';
var access_token

Page({
    data: {
        base: '../../../../../',
        gardeIndex: '',
        gradeList: [],
        subjectIndex: '',
        subjectList: [],
        content: '',
        imgList: [],
        myPoint: '',
        point: 0
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
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
      that.gettoken()
        //   console.log(app.studyOptions);
        that.setData({
            gradeList: app.studyOptions.nianji,
            subjectList: app.studyOptions.kemu
        });
        that.getMyPoint();
    },
    getMyPoint: function () {
        var that = this;
        network.getMyPoint(function (res) {
            if (res.data.code == 200) {
                // console.log(res)
                that.setData({
                    myPoint: res.data.data[0].score
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });
    },
    savePoint: function (e) {
        var that = this;
        var a = parseInt(e.detail.value.replace(/^\s*|\s*$/, ''));
        if (a > that.data.myPoint) {

            wx.showToast({
                title: '可用积分不足',
                icon: 'none',
                duration: 1000
            });
        } else {
            this.setData({
                point: a
            });
        }
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
    bindPickerGrade: function (e) {
        var that = this;
        if (that.data.gradeList.length == 0) {
            wx.showToast({
                title: '暂无年级',
                icon: 'none',
                duration: 1000
            });
        } else {
            var a = e.detail.value;
            gradeId = that.data.gradeList[a].id;
            that.setData({
                gradeIndex: a
            });
        }
    },
    bindPickerSubject: function (e) {
        var that = this;
        if (that.data.subjectList.length == 0) {
            wx.showToast({
                title: '暂无科目',
                icon: 'none',
                duration: 1000
            });
        } else {
            var a = e.detail.value;
            subjectId = that.data.subjectList[a].id;
            that.setData({
                subjectIndex: a
            });
        }
    },
    saveContent: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');

        this.setData({
            content: a
        });
    },
    submit: function () {
        var that = this;
     
        if (that.valid()) {
            var list = that.data.imgList;
            var content = that.data.content;
            var point = that.data.point;
          console.log(list, content,point)
         
          
          wx.request({
            url: 'https://api.weixin.qq.com/wxa/img_sec_check?access_token='+access_token,
            data:{
              media: list
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/octet-stream'
            },
            success:function(res){
              console.log(res)
              if (res.data.errcode == 0) {
                if (that.data.imgList.length == 0) {
                  that.submitFn(content, point);
                } else {
                  app.showLoading();
                  that.uploadImgs(list, content, point);
                }
              }
            }
          })
           
        }
    },
  gettoken: function () {
    var userInfo = wx.getStorageSync('userInfo')
    var userid = userInfo.id
    console.log(userid)
    wx.request({
      url: app.requestUrl + 'v14/public/get-new-token ',
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
    uploadImgs: function (list, content, point) {
        var that = this;
        network.upload('v14/question/add', list, {
            'mobile': app.userInfo.mobile,
            'token': app.userInfo.token,
            'gradeid': gradeId,
            'subjectid': subjectId,
            'name': content,
            'point': point
        }, function (res) {
            wx.showToast({
                title: '提交成功',
                success: function () {
                    wx.navigateTo({
                        url: '/pages/home/pages/homework/homework'
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
                                url: '/pages/home/pages/homework/homework'
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
    valid: function () {
        var that = this;
        var flag = true;
        if (!gradeId) {
            wx.showToast({
                title: '请选择年级',
                icon: 'none',
                duration: 1000
            });
            flag = false;
        } else if (!subjectId) {
            wx.showToast({
                title: '请选择科目',
                icon: 'none',
                duration: 1000
            });
            flag = false;
        } else if (!that.data.content) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 1000
            });
            flag = false;
        }
        else { }
        return flag;
    }
})