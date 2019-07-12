// pages/my/commentDetail/commentDetail.js
const network = require("../../../../utils/main.js");
const app = getApp();
Page({

  data: {
    id:'',
    list:'',
    resourcetypeid: '',
    tabindex: '',
    resourceid: '',
  },
  onLoad: function (options) {
    var that=this;
    this.compontNavbar = this.selectComponent("#compontNavbar");
    that.setData({
      id:options.myid,
      resourcetypeid: options.myid,
      tabindex: options.tabindex,
      resourceid: options.resourceid,
    })
    that.getList();
  },
  tz_into:function(){
    var that=this;
    // 4 视频课程
    if(that.data.tabindex==4){
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + that.data.resourceid + '&videopic=' + '',
      })     
    }
    // 1 教育动态
    else if (that.data.tabindex == 1) {
      wx.navigateTo({
          url: '/pages/find/pages/news/newsDetail/newsDetail?id='+that.data.resourceid,
      })
    }
    // 11易货物品    
    else if (that.data.tabindex == 11) {
      wx.navigateTo({   
          url: '/pages/home/pages/barter/barterDetail/barterDetail?id=' + that.data.resourceid,
      })
    }
    // 6积分物品
    else if (that.data.tabindex == 6) {
      wx.navigateTo({
          url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + that.data.resourceid,
      })
    }
  },
  getList: function () {
    var that = this;
    network.POST({
      url: 'v14/news/comments-detail',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "id": that.data.id,       
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;         
          that.setData({
            list: a,           
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
  onShow: function () {
  
  },

})