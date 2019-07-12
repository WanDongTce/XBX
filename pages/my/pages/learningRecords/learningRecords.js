// pages/my/learningRecords/learningRecords.js
const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
var flag = false;

var today = new Date(new Date().setHours(0, 0, 0, 0));
var todaystamp = ((Date.parse(new Date(today))) / 1000).toString()  //今天凌晨的时间戳

var yesterday = new Date((new Date().getTime() - 86400000)).setHours(0, 0, 0, 0)
var yesterdaystamp = ((Date.parse(new Date(yesterday))) / 1000).toString()   //昨天凌晨的时间戳


Page({

  
  data: {
    IMGURL: app.imgUrl,
    showEmpty: false,
    tabs: [{ index: 1, title: '预习乐', width: '30%' }, { index: 2, title: '冥想思', width: '30%' }, { index: 5, title: '视频课程', width: '30%' }],
    tabindex: 1, 
    list: [], 
    list_today: [],
    list_yesterday: [],
    list_earlier: [],
  },
  onLoad: function (options) {
    var that=this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
    that.setData({
      tabindex: 1
    })
    that.getList(1, page, flag);
  },
  swiTab: function (e) {
    var that = this;
    var a = e.currentTarget.dataset.index;
    page = 1;
    hasmore = '';
    flag = false;
    that.setData({
      tabindex: a,
      list: [],
      list_today: [],
      list_yesterday: [],
      list_earlier: [],
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    that.getList(a, page,false);  
  }, 
  onShow: function () {
  
  },
  getList: function (typenum, page, flag) {
    var that = this;
    network.POST({
      url: 'v14/study/study-record-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": typenum,        
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (flag) {
            a = that.data.list.concat(a);
          }
          that.setData({
            list:a,
            showEmpty: a.length == 0 ? true : false
          })           
          hasmore = res.data.data[0].hasmore;         
          var list_today=[];
          var list_yesterday = [];
          var list_earlier = [];  

          for(var i=0;i<that.data.list.length;i++){
            if (that.data.list[i].create_unix >= todaystamp){
              // console.log('111')
              list_today.push(that.data.list[i])
            }
            else if ((yesterdaystamp < that.data.list[i].create_unix) || (yesterdaystamp == that.data.list[i].create_unix) ){
              // console.log('22')
              list_yesterday.push(that.data.list[i])
            }
            else{
              list_earlier.push(that.data.list[i])
            }
          }
          that.setData({
            list_today: list_today,
            list_yesterday: list_yesterday,
            list_earlier: list_earlier,
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
  onReachBottom: function () {
    var that = this;
    if (that.data.list.length > 0) {
      if (hasmore) {
        page++;
        that.getList(that.data.tabindex, page, true);        
      } else {
        wx.showToast({
          title: '没有更多了',
            icon: 'none',
          duration: 1000
        });
      }
    }
  },
  onUnload: function () {
    page = 1;
    hasmore = '';
  }
})