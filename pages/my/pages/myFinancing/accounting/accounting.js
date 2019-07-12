// pages/myFinancing/accounting/accounting.js
const network = require("../../../../../utils/main.js");
const app = getApp();
Page({
  data: {
      imagsAddress: "",
    selectPayListId: '',//支出分类id
    pay_money:'',//支出的钱
    date1: '请选择日期',
    time1: '请选择时间',
    textarea1:'',

    selectShouruListId: '',//支出分类id
    shouru_money: '',//支出的钱
    date2: '请选择日期',
    time2: '请选择时间',
    textarea2: '',

    model: null,

      isShowOption: false,
      sctdidx: 1,
      animationData: null,
      navigationtext:'支出',
      base:'../../../../../',
      imgList: [],
  },
  //点击支出选择的项目
  selectPayList: function (e) {
    var that=this;
    that.setData({
      selectPayListId: e.currentTarget.dataset.paylistid
    })
  },
  selectShouruList: function (e) {
    var that = this;
    that.setData({
      selectShouruListId: e.currentTarget.dataset.shourulistid
    })
  },
  //选择日期
  bindDateChange1: function (e) {
    var that = this;
    that.setData({
      date1: e.detail.value
    })
  },
  //选择时间
  bindTimeChange1: function (e) {
    var that = this;
    that.setData({
      time1: e.detail.value
    })
  },
  //选择日期
  bindDateChange2: function (e) {
    var that = this;
    that.setData({
      date2: e.detail.value
    })
  },
  //选择时间
  bindTimeChange2: function (e) {
    var that = this;
    that.setData({
      time2: e.detail.value
    })
  },
  onLoad: function (options) {
    var that=this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
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
    // console.log(that.data.model)
    that.getTypeList(1);
    that.getTypeList(2);
  },
  onShow: function () {
    
  
  },
  //理财分类列表
  getTypeList: function (mytype) {
    var that = this;
    network.POST({
      url: 'v14/finance-type/type-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "type":mytype
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          // that.setData({
          //   list: res.data.data[0]
          // });
          // console.log(mytype)
          if(mytype==1){
            that.setData({
              typeList_zhichu: res.data.data[0].list
            });
          }else{
            that.setData({
              typeList_shouru: res.data.data[0].list
            });
          }
        } else {
          wx.showToast({
            title: res.data.message,
              icon: 'none',
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
  payInputEvent: function (e) {
    this.setData({
      pay_money: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  textareaInput1: function (e) {
    this.setData({
      textarea1: e.detail.value
    })
  },
  shouruInputEvent: function (e) {
    this.setData({
      shouru_money: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  textareaInput2: function (e) {
    this.setData({
      textarea2: e.detail.value
    })
  },
  //点击支出的保存
  pay_sure_btn:function(){
    
    var that=this;
    var regtxje = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
    if (that.data.pay_money == '') {
      wx.showModal({
        title: '提示',
        content: '请输入账单金额',
      })
    }
    else if (!regtxje.test(that.data.pay_money)) {
      wx.showModal({
        title: '提示',
        content: '账单金额不合法',
      })
    }
    else if (that.data.selectPayListId== '') {
      wx.showToast({
        title: '请选择支出项目',
          icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.date1 =='请选择日期'){
      wx.showToast({
        title: '请选择日期',
          icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.time1 == '请选择时间') {
      wx.showToast({
        title: '请选择时间',
          icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.textarea1.length == 0) {
      wx.showToast({
        title: '请输入备注',
          icon: 'none',
        duration: 1000
      })
    }
    else{
      //提交     
      var submitdata1 = that.data.date1 + " " + that.data.time1; 
      var submitdata111 = ((Date.parse(new Date(submitdata1))) / 1000).toString();
        if (that.data.imgList.length == 0) {
            that.getSubmit(1, that.data.pay_money, that.data.selectPayListId, that.data.textarea1, submitdata111);     
        } else {
            app.showLoading();
            console.log(that.data.imgList)
            that.uploadImgs(that.data.imgList,1, that.data.pay_money, that.data.selectPayListId, that.data.textarea1, submitdata111);
        }
      
    }
  },
  pay_qx_btn:function(){
    var that=this;
    that.setData({
      pay_money: '',//支出的钱
      date1: '请选择日期',
      time1: '请选择时间',
      textarea1: '',
    })
  },
  //点击收入的保存
  shouru_sure_btn: function () {

    var that = this;
    var regtxje = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
    if (that.data.shouru_money == '') {
      wx.showModal({
        title: '提示',
        content: '请输入账单金额',
      })
    }
    else if (!regtxje.test(that.data.shouru_money)) {
      wx.showModal({
        title: '提示',
        content: '账单金额不合法',
      })
    }
    else if (that.data.selectShouruListId == '') {
      wx.showToast({
        title: '请选择收入项目',
          icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.date2 == '请选择日期') {
      wx.showToast({
        title: '请选择日期',
          icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.time2 == '请选择时间') {
      wx.showToast({
        title: '请选择时间',
          icon: 'none',
        duration: 1000
      })
    }
    else if (that.data.textarea2.length == 0) {
      wx.showToast({
        title: '请输入备注',
          icon: 'none',
        duration: 1000
      })
    }
    else {
      //提交     
      var submitdata2 = that.data.date2 + " " + that.data.time2;
      var submitdata222 = ((Date.parse(new Date(submitdata2))) / 1000).toString();

        if (that.data.imgList.length == 0) {
            that.getSubmit(2, that.data.shouru_money, that.data.selectShouruListId, that.data.textarea2, submitdata222);
        } else {
            app.showLoading();
            that.uploadImgs(that.data.imgList, 2, that.data.shouru_money, that.data.selectShouruListId, that.data.textarea2, submitdata222);
        }
    }
  },
  shouru_qx_btn: function () {
    var that = this;
    that.setData({
      shouru_money: '',//支出的钱
      date2: '请选择日期',
      time2: '请选择时间',
      textarea2: '',
    })
  },  
    uploadImgs: function (list, newtype, newprice, financetypeid, remark, financedate) {
        var that = this; 
        var params = { "app_source_type": app.app_source_type, "app_source_school_id": app.app_source_school_id };
        wx.uploadFile({
            url: app.requestUrl + 'v14/public/upload',
            filePath: list[0],
            name: 'file',
            formData: params,
            success: (res) => {
                var a = JSON.parse(res.data);
                wx.hideLoading();
                if (a.code == "508" || a.code == "403") {
                    wx.showToast({
                        title: res.data.message,
                        success: function () {
                            app.toLogin();
                        },
                        icon: 'none'
                    });
                } else if (a.code == 200) {
                    console.log(a)
                    console.log(a.data[0].list[0].file_url)
                    var obj = {};
                    var key = '';
                    var arr = a.data[0].list[0].file_url;
                    obj[1] = a.data[0].list[0].file_url;
                    // console.log(JSON.stringify(obj))
                    network.POST({
                        url: 'v14/finance/create',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "type": newtype,
                            "price": newprice,
                            "financetypeid": financetypeid,
                            "remark": remark,
                            "financedate": financedate,
                            "picture": JSON.stringify(obj)

                        },
                        success: function (res) {
                            // console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '操作成功',
                                    icon: 'success',
                                    duration: 1000
                                });
                                wx.navigateBack({
                                })
                            } else {
                                console.log(res)
                                wx.showToast({
                                    title: res.data.message,
                                    icon: 'none',
                                });
                            }
                        },
                        fail: function (e) {
                            wx.hideLoading();
                            wx.showToast({
                                title: '服务器异常',
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    });
                     
                } else {
                    wx.showToast({
                        title: a.message,
                        icon: 'none'
                    });
                }
            },
            fail: (res) => {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            },
        });
               
    },
  //提交方法
  getSubmit: function (newtype, newprice, financetypeid, remark, financedate) {
    network.POST({
      url: 'v14/finance/create',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "type": newtype,
        "price": newprice,
        "financetypeid": financetypeid,
        "remark": remark,
        "financedate": financedate
        
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000
          });
          wx.navigateBack({
          })
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.message,
              icon: 'none',
          });
        }
      },
      fail: function (e) {       
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
            icon: 'none',
          duration: 1000
        })
      }
    });
  },
    bindtap_nav: function (e) {
        var that = this;
        if (that.data.isShowOption) {
            that.hideOption();
        } else {
            that.showOption();
        }
    },
    selOptFn: function (e) {
        var that = this;
        that.setData({
            sctdidx: e.currentTarget.dataset.sctdidx
        })
        that.hideOption();
        if (that.data.sctdidx == 1) {
            that.setData({
                navigationtext: '支出'
            })
        }
        else {
            that.setData({
                navigationtext: '收入'
            })
        }
    },
    // optCofmFn: function () {
    //     var that=this;
    //     that.hideOption();
    //     if (that.data.sctdidx==1){
    //         that.setData({
    //             navigationtext: '支出'
    //         })
    //     }
    //     else{
    //         that.setData({
    //             navigationtext: '收入'
    //         })
    //     }
    // },
    showOption: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-200).step();
        this.setData({
            animationData: animation.export(),
            isShowOption: true,

        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    hideOption: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-10).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.translateY(-300).step();
            this.setData({
                animationData: animation.export(),
                isShowOption: false,

            });
        }.bind(this), 200);
    },
    goBack(e) {
        wx.navigateBack({
            delta: 1
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