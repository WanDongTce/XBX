// pages/edutlList/operation/operation.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var intervalId=''
Page({
  data: {
    IMGURL: app.imgUrl,
    subjectid: '', 
    subjectname:'',    
    currentdate:'',
    time:'00:00',
    isstart:1,
    starttime: '',
    endtime: '',
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      subjectid: options.subjectid,
      subjectname: options.subjectname
      
    })
  },
  //点击开始
  start_btn:function(){
    var that=this;
    that.setData({
      isstart: 2
    })
    
    var starttime=Date.parse(new Date())/1000;
    that.setData({
      starttime: starttime
    })
    // console.log(starttime)

    intervalId=setInterval(function () {
      var sec = Date.parse(new Date()) / 1000 - starttime;
      // console.log(sec)
       var second = sec;
      
        var day = Math.floor(second / (3600 * 24));
        var second = second % (3600 * 24);//除去整天之后剩余的时间
        var hour = Math.floor(second / 3600);
        var second = second % 3600;//除去整小时之后剩余的时间 
        var minute = Math.floor(second / 60);
        var second = second % 60;//除去整分钟之后剩余的时间 
        if (day <= 0) {          
          day = ''
        }
        else {
          day = day + ':'
        }
        if(hour<=0){
          hour = '' 
        }
        else if(hour<10){
          hour = '0' + hour + ':'
        }        
        minute = minute < 10 ? '0' + minute : minute
        second=second < 10 ? '0' + second : second
        var time = day  + hour + minute  + ':' + second;       
        // console.log(time)
        that.setData({
          time:time
        })
    }, 1000);
  },
  // onUnload: function () {
    
  //   this.setData({
  //     time: '00:00',
  //   });
  // },
  //点击结束
  start_end:function(){
    var that=this;
    var endtime = Date.parse(new Date()) / 1000;
    that.setData({
      endtime: endtime
    })
    clearInterval(intervalId);
    wx.navigateTo({
      url: '/pages/my/pages/service/homeworksubmit/homeworksubmit?starttime=' + that.data.starttime + '&endtime=' + that.data.endtime + '&subjectid=' + that.data.subjectid + '&subjectname=' + that.data.subjectname,
    })
  },
  tz_see:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '/pages/my/pages/service/homeworklist/homeworklist?subjectid=' + this.data.subjectid + '&subjectname=' + this.data.subjectname,
    })
  }
})