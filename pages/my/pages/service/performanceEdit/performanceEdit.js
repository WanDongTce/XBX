// pages/service/performanceEdit/performanceEdit.js
const network = require("../../../../../utils/main.js");
const app = getApp();
Page({

  data: {
    data1: "",
    currentdate: null,

    myid: null,

    xfmc: null,
    date1: null,
    bzzy: null,

    
    textarea: false,

    shuxue: null,
    yuwen: null,
    yingyu: null,
    wuli: null,
    huaxue: null,
    dili: null,
    lishi: null,
    shengwu: null,
    zhengzhi: null,
    kexue: null,
    lizong: null,
    wenzong: null,
  },
  onLoad: function (options) {
    // console.log(options)
    // 25

    //当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    this.setData({
      currentdate: currentdate,
      
    });
    //select
    this.setData({
      myid: options.myid,
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model
        });
      }
    });
    if (that.data.model.indexOf('iPhone') >= 0) {
      that.setData({
        model: 1
      });
    } else {
      that.setData({
        model: 2
      });
    }
    //详情
    that.getDetail();
  },
  onShow: function () {
  
  },
  getDetail:function () {
    var that=this;
    network.POST({
      url: "v14/user-exam/view",
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,      
        "id": that.data.myid,        
      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;
          that.setData({
            list: a
          });
          
          that.setData({
            xfmc: a.title,
            date1: a.exam_time,
            bzzy: a.remark,

            // shuxue: a.subject[0].scores,
            // yuwen: a.subject[1].scores,
            // yingyu: a.subject[2].scores,
            // wuli: a.subject[3].scores,
            // huaxue: a.subject[4].scores,
            // dili: a.subject[5].scores,
            // lishi: a.subject[6].scores,
            // shengwu: a.subject[7].scores,
            // zhengzhi: a.subject[8].scores,
            // kexue: a.subject[9].scores,
            // lizong: a.subject[10].scores,
            // wenzong: a.subject[11].scores,
          })
          if (a.subject[0] == null) {
            that.setData({
              shuxue: '',
            })            
          }
          else{
            that.setData({
              shuxue: a.subject[0].scores
            }) 
          }
          if (a.subject[1] == null) {
            that.setData({
              yuwen: '',
            })
          }
          else {
            that.setData({
              yuwen: a.subject[1].scores
            })
          }
          if (a.subject[2] == null) {
            that.setData({
              yingyu: '',
            })
          }
          else {
            that.setData({
              yingyu: a.subject[2].scores
            })
          }
          if (a.subject[3] == null) {
            that.setData({
              wuli: '',
            })
          }
          else {
            that.setData({
              wuli: a.subject[3].scores
            })
          }
          if (a.subject[4] == null) {
            that.setData({
              huaxue: '',
            })
          }
          else {
            that.setData({
              huaxue: a.subject[4].scores
            })
          }
          if (a.subject[5] == null) {
            that.setData({
              dili: '',
            })
          }
          else {
            that.setData({
              dili: a.subject[5].scores
            })
          }
          if (a.subject[6] == null) {
            that.setData({
              lishi: '',
            })
          }
          else {
            that.setData({
              lishi: a.subject[6].scores
            })
          }
          if (a.subject[7] == null) {
            that.setData({
              shengwu: '',
            })
          }
          else {
            that.setData({
              shengwu: a.subject[7].scores
            })
          }
          if (a.subject[8] == null) {
            that.setData({
              zhengzhi: '',
            })
          }
          else {
            that.setData({
              zhengzhi: a.subject[8].scores
            })
          }
          if (a.subject[9] == null) {
            that.setData({
              kexue: '',
            })
          }
          else {
            that.setData({
              kexue: a.subject[9].scores
            })
          }
          if (a.subject[10] == null) {
            that.setData({
              lizong: '',
            })
          }
          else {
            that.setData({
              lizong: a.subject[10].scores
            })
          }
          if (a.subject[11] == null) {
            that.setData({
              wenzong: '',
            })
          }
          else {
            that.setData({
              wenzong: a.subject[11].scores
            })
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
    })
  },
  //时间1
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date1: e.detail.value
    })
  },
  //点击添加提交表单
  bindFormSubmit: function (e) {
    var that = this

    var myReg = /^$|^0{1}([.]\d{1})?$|^[1-9]\d*([.]{1}[0-9]{1})?$/

    if (e.detail.value.xfmc.length == 0) {

      wx.showModal({
        title: '提示',
        content: '请输入考试名称',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (e.detail.value.xfmc.length > 25) {
      wx.showModal({
        title: '提示',
        content: '考试名称需小于25个字',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (that.data.date1 == null) {
      wx.showModal({
        title: '提示',
        content: '请输入考试时间',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (e.detail.value.bzzy.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入备注摘要',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if ((e.detail.value.shuxue.length > 6) || (e.detail.value.yuwen.length > 6) || (e.detail.value.yingyu.length > 6) || (e.detail.value.wuli.length > 6) || (e.detail.value.huaxue.length > 6) || (e.detail.value.dili.length > 6) || (e.detail.value.lishi.length > 6) || (e.detail.value.shengwu.length > 6) || (e.detail.value.zhengzhi.length > 6) || (e.detail.value.kexue.length > 6) || (e.detail.value.lizong.length > 6) || (e.detail.value.wenzong.length > 6)) {
      wx.showModal({
        title: '提示',
        content: '输入成绩不合法',
        showCancel: false,
        confirmText: '确定',
      })
    }
    
    else if ((!myReg.test(e.detail.value.shuxue)) || (!myReg.test(e.detail.value.yuwen)) || (!myReg.test(e.detail.value.yingyu)) || (!myReg.test(e.detail.value.wuli)) || (!myReg.test(e.detail.value.huaxue)) || (!myReg.test(e.detail.value.dili)) || (!myReg.test(e.detail.value.lishi)) || (!myReg.test(e.detail.value.shengwu)) || (!myReg.test(e.detail.value.zhengzhi)) || (!myReg.test(e.detail.value.kexue)) || (!myReg.test(e.detail.value.lizong)) || (!myReg.test(e.detail.value.wenzong))) {
      wx.showModal({
        title: '提示',
        content: '输入成绩不合法',
        showCancel: false,
        confirmText: '确定',
      })
    }
    
    else {
      var newarr = [];
      newarr = [
        e.detail.value.shuxue,
        e.detail.value.yuwen,
        e.detail.value.yingyu,
        e.detail.value.wuli,
        e.detail.value.huaxue,
        e.detail.value.dili,
        e.detail.value.lishi,
        e.detail.value.shengwu,
        e.detail.value.zhengzhi,
        e.detail.value.kexue,
        e.detail.value.lizong,
        e.detail.value.wenzong,
      ]
      // console.log(newarr)
      var obj = {};
      var key = '';
      for (var i = 0; i < newarr.length; i++) {
        key = i + 1;
        obj[key] = newarr[i];
      }
      //提交
      network.POST({
        url: "v14/user-exam/update",
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "id": that.data.myid,
          "title": e.detail.value.xfmc,
          "title": e.detail.value.xfmc,
          "exam_time": that.data.date1,
          "subjectgrade": JSON.stringify(obj),
          "remark": e.detail.value.bzzy,
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: '修改成功',
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
      })

    }

  },
})