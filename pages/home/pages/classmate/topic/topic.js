const network = require("../../../../../utils/main.js");
var app = getApp();
Page({
  data: {
    
    list:'',
    rightlist:'', 
    currentleft:false,
    currentid:'',
    plateid:'',
      base: '../../../../../'
  },
 
  onLoad: function (options) {
    var that=this;
    that.getList();
    
        
      
  },
  onShow: function () {
    
  },
  getList: function () {
    var that = this;
    network.POST({
      url: 'v10/post-topic/topic',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            list:res.data.data,
            rightlist: res.data.data[0].categorytopic,
            currentid: res.data.data[0].id,
            
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
  //点击左侧
  left_choice:function(e){
    var that=this;
    that.setData({
      currentid: e.currentTarget.dataset.leftid
    })
    for(var i=0;i<that.data.list.length;i++){
      if (e.currentTarget.dataset.leftid==that.data.list[i].id){
        that.setData({
          plateid: that.data.list[i].id,
          rightlist: that.data.list[i].categorytopic,
        })
      }
    }
  },
  //选择话题
  choicetopic:function(e){
    var that=this;    
    wx.navigateTo({
      url: '/pages/home/pages/classmate/classmateWrite/classmateWrite?plateid=' + that.data.currentid + '&topicid=' + e.currentTarget.dataset.topicid + '&ifchoicetopic=' + e.currentTarget.dataset.ifchoicetopic,
    })
  }
})