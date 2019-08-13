// pages/home/my_study/answer/answer_quiz/answer_quiz.js
const network = require("../../../../../../utils/main.js");

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    fenleilist: null,
    feileiid: null,
    array: null,
    index: 0,
    fenleilistR: null,
    feileiidR: null,
    arrayR: null,
    indexR: 0,

    fenleilistF: null,
    feileiidF: null,
    arrayF: null,
    indexF: 0,

    imagsList: [],
    imagsAddress: "",
  },
  //picker
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    for (var i = 0; i < this.data.fenleilist.length; i++) {
      if (this.data.array[this.data.index] == this.data.fenleilist[i].title) {
        this.setData({
          feileiid: this.data.fenleilist[i].id
        })
      }
    }
  },
  bindPickerChangeR: function (e) {
    this.setData({
      indexR: e.detail.value
    })
    for (var i = 0; i < this.data.fenleilistR.length; i++) {
      if (this.data.arrayR[this.data.indexR] == this.data.fenleilistR[i].title) {
        this.setData({
          feileiidR: this.data.fenleilistR[i].id
        })
      }
    }
  },
  bindPickerChangeF: function (e) {
    this.setData({
      indexF: e.detail.value
    })
    for (var i = 0; i < this.data.fenleilistF.length; i++) {
      if (this.data.arrayF[this.data.indexF] == this.data.fenleilistF[i]) {
        this.setData({
          feileiidF: this.data.fenleilistF[i]
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      hidden: false,
    });
    //加载年级
    network.POST({
      url: "school/allgrade",
      params: {       
      },
      success: function (res) {
        that.setData({
          hidden: true,
        });
        if (res.data.status == "S000") {          
            var array = ['请选择年级']
            //console.log(res)
            for (var i = 0; i < res.data.result.length; i++) {
              array.push(res.data.result[i].title)
            }
            that.setData({
              fenleilist: res.data.result,
              array: array,
            })         
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
        }
      },
      fail: function () {
        that.setData({
          hidden: true,
        });
        wx.showToast({
          title: '服务器异常',
          image: '../../../../../images/home/error.png',
          duration: 1000
        })
      }
    })
    that.setData({
      hidden: false,
    });
    //加载科目
    network.POST({
      url: "school/allsubject",
      params: {
      },
      success: function (res) {
        that.setData({
          hidden: true,
        });
        if (res.data.status == "S000") {
          var arrayR = ['请选择科目']
          //console.log(res)
          for (var i = 0; i < res.data.result.length; i++) {
            arrayR.push(res.data.result[i].title)
          }
          that.setData({
            fenleilistR: res.data.result,
            arrayR: arrayR,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
        }
      },
      fail: function () {
        that.setData({
          hidden: true,
        });
        wx.showToast({
          title: '服务器异常',
          image: '../../../../../images/home/error.png',
          duration: 1000
        })
      }
    })
    that.setData({
      hidden: false,
    });
    //加载积分
    network.POST({
      url: "school/tiwenjifen",
      params: {
      },
      success: function (res) {
        that.setData({
          hidden: true,
        });
        if (res.data.status == "S000") {
          var arrayF = ['请选择积分']
          for (var i = 0; i < res.data.result.length; i++) {
            arrayF.push(res.data.result[i])
          }
          that.setData({
            fenleilistF: res.data.result,
            arrayF: arrayF,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
        }
      },
      fail: function () {
        that.setData({
          hidden: true,
        });
        wx.showToast({
          title: '服务器异常',
          image: '../../../../../images/home/error.png',
          duration: 1000
        })
      }
    })
  },
  //获取手机里的图片
  chooseImage: function () {
    //console.log("选择图片");
    var that = this
    wx.chooseImage({
      count: 1,//最多可选择的图片张数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有，这里是压缩
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function (res) {
        //console.log(res, "ok")
        that.setData({
          imagsList: that.data.imagsList.concat(res.tempFilePaths)
        })
        wx.showToast({
          title: '选择照片成功',
          duration: 1000
        })       
      },
      
    })
  },
  bindTouchStart: function (e) {
    this.setData({
      startTime: e.timeStamp
    })
  },
  bindTouchEnd: function (e) {
    this.setData({
      endTime: e.timeStamp
    })
  },
  //图片预览
  bindTap: function (e) {
    if (this.data.endTime - this.data.startTime < 350) {
      wx.previewImage({
        current: e.currentTarget.dataset.src,
        urls: this.data.imagsList,
        success: function (res) {

        }
      })
    }
  },
  // 长按删除
  bingLongTap: function (e) {
    var list = this.data.imagsList
    list.splice(e.currentTarget.id, 1);
    this.setData({
      imagsList: list
    })
    // console.log(this.data.imagsList)
  },
  //提交表单
  bindFormSubmit: function (e) {
    var that=this;
    var pics = this.data.imagsList;
    if (that.data.index == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择年级',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          
        }
      })
      return false
    }
    else if (that.data.indexR == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择科目',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
        }
      })
      return false
    }
    else if (that.data.indexF == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择悬赏积分',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
        }
      })
      return false
    }
    else if (e.detail.value.barter_textarea.length == 0) {
      wx.showModal({
        title: '提示',
        content: '提问内容不能为空',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {          
        }
      })
      return false
    }
    else if (pics.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传图片',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {          
        }
      })
      return false
    }
    else if (pics.length >1) {
      wx.showModal({
        title: '提示',
        content: '图片至多为1张',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
        }
      })
      return false
    }
    else {
      this.setData({      
        hidden: false
      })      
      //成功
      //console.log(that.data.imagsList.toString())
      wx.uploadFile({
        url: app.userData.uploadURL + 'tiwen/add',
        filePath: that.data.imagsList.toString(),
        name: 'file',
        header: {
          "schoolId": app.userData.userinfo.school,
          "userId": app.userData.userinfo.id,
          "token": app.userData.userinfo.logintoken
        },
        formData: {
          "nianji": that.data.feileiid,
          "kemu": that.data.feileiidR,
          "zhaiyao": e.detail.value.barter_textarea,
          "jifen": that.data.feileiidF,
        },
        success: function (res) {
          //console.log(res)
          wx.hideToast()
          that.setData({
            hidden: true,
          });
          if (res.data.indexOf("S000") >= 0){
            var pages = getCurrentPages();
            if (pages.length > 1) {
              var prePage = pages[pages.length - 2];
              prePage.getlistFunction();
              prePage.mylistFunction();
              
            }
            wx.navigateBack({
            })
            
          }
          else{
            wx.showToast({
              title: '上传问题失败',
              image: '../../../../../images/home/error.png',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.hideToast()
          that.setData({
            hidden: true,
          });
          wx.showToast({
            title: '服务器异常',
            image: '../../../../../images/home/error.png',
            duration: 1000
          })
        }
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  tip_jifen: function () {
    wx.showModal({
      title: '悬赏规则',
      content: '1.当回答者的答案被提问者采纳后，回答者将获得此悬赏积分\r\n2.悬赏积分将由系统送出，不会从提问者的账号中扣除',
      showCancel:false,
      success: function (res) {
      }
    })
  },
})