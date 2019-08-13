// pages/confirmend/confirmend.js
let innerAudioContext = null;
const app = getApp();
let timerOut = null;
var flg = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    duration: 0,
    currentTime: 0,
    lastTime: 0,
    percent: 0,
    tabTitle: '',
    text: [],
    flg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  suspend: function () {
    if (flg == true) {
      innerAudioContext.pause()
      flg = false
      this.setData({
        flg: false
      })
    } else {

      innerAudioContext.play()
      flg = true
      this.setData({
        flg: true
      })
    }

  },
  onLoad: function (options) {
    innerAudioContext = wx.createInnerAudioContext();
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
    var name = wx.getStorageSync("rname")
        this.setData({
          tabTitle: name
        });
    console.log(options);
    let id = options.id;
    let text = options.text;
    let textTranslate = [];

    console.log("歌词文件类型：",typeof text);
    console.log("歌词文件：",text);
    text = text.split(',');
    text.map(function(item,index){
      if(index%2){
        textTranslate.push(item);
      }
    });
    console.log(textTranslate);
    console.log(text);

    this.setData({
      id,
      text: textTranslate
    });
    //
    let filePath = wx.getStorageSync('filePath');
    this.startMusic(filePath);
  },
  reset: function () {
    wx.showModal({
      title: '',
      content: '确认放弃当前？',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }  
    }) 
   
  },
  onUpload: function () {
    let filePath = wx.getStorageSync('filePath');
    //上传文件
    this.uploadFile(filePath, this.data.id);
    wx.showToast({
      title: '录制成功',
      icon: 'success',
      duration: 2000
    });
    //根据路径不同，返回层级不同
    let r = getCurrentPages().length;
    console.log(r)
    if (r == 6) {
      setTimeout(function () {
        wx.navigateBack({
          delta: 2
        });
      }, 2000);
    } else {
      setTimeout(function () {
        wx.navigateBack({
          delta: 3
        });
      }, 2000);
    }
    
  },
  uploadFile: function (filePath, id) {
    wx.uploadFile({
      url: app.requestUrl + 'v14/public/upload', //仅为示例，非真实的接口地址
      filePath: filePath, // 小程序临时文件路径,
      name: '$_FILES',
      success(res) {
        let data = res.data;
        //do something
        data = JSON.parse(data);
        let filelUrl = data.data[0].list[0].file_url;
        console.log(filelUrl);
        console.log(data);
        //记录录音
        wx.request({
          url: app.requestUrl + 'v14/chinese/audio-add', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          data: {
            "token": app.userInfo.token,
            "mobile": app.userInfo.mobile,
            "app_source_type": app.app_source_type,
            audio_id: id,
            audioUrl: filelUrl
          },
          success(res) {
            console.log(res.data);
          }
        });
        //
      }
    });
  },
  // 258秒 改成2:35格式
  timeFormat: function (time) {
    let m = parseInt(time / 60) < 10 ? ("0" + parseInt(time / 60)) : parseInt(time / 60);
    let s = time % 60 < 10 ? ("0" + time % 60) : time % 60;
    return m + ":" + s;
  },
  startMusic: function (audioUrl) {
    let that = this;
    //绑定音频播放地址
    
    innerAudioContext.autoplay = true
    innerAudioContext.src = audioUrl
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        duration: that.timeFormat(parseInt(innerAudioContext.duration))
      });
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onTimeUpdate(function () {
      timerOut = setTimeout(function () {
        let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        //
        that.setData({
          duration: that.timeFormat(parseInt(innerAudioContext.duration)),
          currentTime: that.timeFormat(parseInt(innerAudioContext.currentTime)),
          percent,
          lastTime
        });
      }, 1000);
    });
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
    //播放录音
    // let filePath = wx.getStorageSync('filePath');
    // this.startMusic(filePath);
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.customMethod()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timerOut);
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timerOut);
    innerAudioContext.destroy();
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

  }
})