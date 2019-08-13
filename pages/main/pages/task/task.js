var network = require("../../../../utils/main.js");
var app = getApp();

var dates = null;
var count = null;

Page({
    data: {
        base: '../../../../',
        list: [],
        info: '',

       
        arr: [],
        sysW: null,
        lastDay: null,
        firstDay: null,
        weekArr: ['一', '二', '三', '四', '五', '六', '日'],
        year: null,

        taskList: [],
        showCalendar:true,
        showcalendarText:'收起日历',
        margintopHeight:'',
        showEmptyNew: false, 

        taskid: '',
        prowidth: '',
        tasktype:1,

        taskParentList: [],
        taskparentid: '',
        showEmpty: false, 

        newTextSignStatus:0,
    },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })

  },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");

        this.dataTime();
        // this.initDate();
        // this.initDateScroPos();
        
        this.setData({
            everyday_h2_w: app.systemInfo.windowWidth - app.systemInfo.windowWidth / 750 * (24+24+35+35+40*7),
            prowidth: app.systemInfo.windowWidth / 750 * 250
            
        })
        // console.log(this.data.everyday_h2_w)
        var that=this;
        // calendar1
        
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#calendar1').boundingClientRect()
        query.exec(function (res) {                             
            that.setData({                   
                calendar1Height: res[0].bottom + app.systemInfo.windowWidth / 750 * (82 - 160),
                margintopHeight: res[0].bottom + app.systemInfo.windowWidth / 750 * (82 - 160),
            })
            // console.log('取高度', that.data.calendar1Height);
        })            
        
        
    },
    onShow:function(){
      this.getList();
      this.getTaskList();//任务中心
      this.getParentList();//家长任务 
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
    //日历切换
    show_calendar: function () {
        var that=this;
        if (that.data.showCalendar){
            that.setData({
                showcalendarText: '展开日历',
                showCalendar: false,
                margintopHeight: app.systemInfo.windowWidth / 750 * 170
            })
        }
        else{
            that.setData({
                showcalendarText: '收起日历',
                showCalendar: true,
                margintopHeight: that.data.calendar1Height
            })
        }
        
    },
    //文字展开折叠
    click_zhankai: function (e) {
        
        var that = this;
        var taskid='';
        var taskid = that.data.taskid === e.currentTarget.dataset.taskid ? '' : e.currentTarget.dataset.taskid;      
        that.setData({
            taskid: taskid
        })
    },
    click_zhankai2: function (e) {
        // console.log(e.currentTarget.dataset.taskparentid)
        var that = this;
        var taskparentid = '';
        var taskparentid = that.data.taskparentid === e.currentTarget.dataset.taskparentid ? '' : e.currentTarget.dataset.taskparentid;
        
        that.setData({
            taskparentid: taskparentid
        })
        
    },
    //任务类型切换
    tasktype: function (e) {
        var that = this;
        that.setData({
            tasktype: e.currentTarget.dataset.tasktype
        })
        // console.log(that.data.tasktype)
    },
    //获取日历相关参数
    dataTime: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var months = date.getMonth() + 1;

        this.data.year = year;//获取现今年份        
        this.data.month = months;//获取现今月份       
        this.data.getDate = date.getDate();//获取今日日期       
        var d = new Date(year, months, 0);//最后一天是几号
        this.data.lastDay = d.getDate();
        let firstDay = new Date(year, month, 1); //第一天星期几
        this.data.firstDay = firstDay.getDay();

        this.canlendarList();

        this.setData({
            startDate: year - 2 + '-' + months,
            endDate: year + 5 + '-' + months,
        })

    },
    canlendarList: function () {
        //根据得到今月的最后一天日期遍历 得到所有日期
        for (var i = 1; i < this.data.lastDay + 1; i++) {
            this.data.arr.push(i);
        }
        this.setData({
            sysW: app.systemInfo.windowHeight / 13,
           
            marLet: this.data.firstDay-1,
            arr: this.data.arr,
            year: this.data.year,
            getDate: this.data.getDate,
            month: this.data.month
        });
        
        

    },
    
    
    getList() {
        var that = this;
        network.POST({
            url: 'v14/singin/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        item1:a.item,
                        list1: a.list1,
                        list2: a.list2,
                    });
                    var today='';
                    for(var i=0;i<that.data.list2.length;i++){
                        that.data.list2[i].big=0;
                        if (that.data.list2[i].theday==1){
                            // console.log(that.data.list2[i]) 
                            that.setData({
                                today: that.data.list2[i].day
                            })                           
                            var today=that.data.list2[i].day;                            
                            if (Number(that.data.list2[i].day) > today){
                                that.data.list2[i].big = 1;
                            }                           
                        } 

                                              
                    }
                    for (var i = 0; i < that.data.list2.length; i++) {                                                                   
                            if (Number(that.data.list2[i].day) > today) {
                                that.data.list2[i].big = 1;
                            }                     
                    }
                    for (var i = 0; i < that.data.list1.length; i++) {
                        if (that.data.list1[i].theday == 1&&that.data.list1[i].status == 1) {
                            
                            that.setData({
                                newTextSignStatus:1
                            })
                        }
                    }
                    that.setData({
                        list2:that.data.list2
                    })
                    // console.log(that.data.list2)
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
    //点击签到
    click_sign:function(e){
        var that = this;

        var theday = e.currentTarget.dataset.theday;
        var status = e.currentTarget.dataset.status;
        if (theday == 1 && status==0){
            network.POST({
                url: 'v14/singin/today',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        that.getList();

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
        if (theday == 1 && status == 1) {
            wx.showToast({
                title: '今日已签到',
                icon: 'none',
                duration: 1000
            })
        }
        
    },
    click_sign2: function (e) {
        var that = this;
        
        if (that.data.newTextSignStatus == 0) {
            network.POST({
                url: 'v14/singin/today',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        that.getList();

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
        if (that.data.newTextSignStatus == 1) {
            wx.showToast({
                title: '今日已签到',
                icon: 'none',
                duration: 1000
            })
        }

    },
    //点击连续签到
    click_getpoints:function(e){
        var that = this;
        // console.log(e.currentTarget.dataset.getpoints)
        network.POST({
            url: 'v14/singin/get-points',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "num": e.currentTarget.dataset.getpoints,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getList();

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
    getTaskList:function(e){
        var that = this;
        // console.log(e.currentTarget.dataset.getpoints)
        network.POST({
            url: 'v14/task/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token               
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        taskList: a, 
                        showEmptyNew: a.length == 0 ? true : false                      
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
    getParentList: function (e) {
        var that = this;
        // console.log(e.currentTarget.dataset.getpoints)
        network.POST({
            url: 'v14/task-public/patriarch-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        taskParentList: a,
                        showEmpty: a.length == 0 ? true : false
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
    tz_taskcalendar:function(){
        wx.navigateTo({
            url: '/pages/task/pages/calendar/calendar'
        })
    },
    gocomplate: function (e) {
      var a = e.currentTarget.dataset.gocomplateid;
      network.gocomplate(a);
      
    },
  golingqu:function(e){
    var that = this;
    network.POST({
      url: 'v14/task/get-task',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "type": 1,
        "taskid": e.currentTarget.dataset.gocomplateid,
        
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '领取成功',
            duration: 1000,
            success: function () {
              that.getTaskList();
              that.getParentList();
            }
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
  },
  receiveReward(e) {
    var that = this;
    network.POST({
      url: 'v14/task/receive-reward',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "taskreceiveid": e.currentTarget.dataset.gocomplateid,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '领取成功',
            success: function () {
              
            },
            icon: 'none'
          })
            that.getTaskList();
            that.getParentList();
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
})