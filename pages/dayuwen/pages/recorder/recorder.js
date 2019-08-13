const innerAudioContext = wx.createInnerAudioContext()
const rm = wx.getRecorderManager()
let recoderCurrentTimes = 0;
let timer = null, asnycTextTimer = null, timerOut = null;
const app = getApp();
var luyin=false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: null,
    percent: 0,
    text: [],
    duration: 0,
    durationM: 0,
    currentTime: 0,
    currentText: '',
    currentIndex: 0,
    toView: '',
    scrollTop: 10,
    lastTime: 0,
    onPlay: false,
    recoderCurrentTime: 0,
    changeText: '录音',
    pageId: 0,
    name: '',
    author: '',
    isRecoder: 1,
    images:""
  },
  // 258秒 改成2:35格式
  timeFormat: function (time) {
    let m = parseInt(time / 60) < 10 ? ("0" + parseInt(time / 60)) : parseInt(time / 60);
    let s = time % 60 < 10 ? ("0" + time % 60) : time % 60;
    return m + ":" + s;
  },
  //原声
  music: function () {
    innerAudioContext.play();
    this.pauseRecorder();
  },
  //结束录音 上传文件
  uploadFile: function () {
    //
    luyin=false
    rm.stop();
    let that = this;
    console.log(111)
    rm.onStop(function (res) {
      console.log(222)
      clearInterval(timer);
      clearInterval(asnycTextTimer);
      that.setData({
        recoderCurrentTime: 0
      });
     
    wx.removeStorageSync('filePath');
    wx.setStorageSync('filePath', res.tempFilePath);
    console.log(11111)
    wx.navigateTo({
      url: '/pages/dayuwen/pages/confirmend/confirmend?id=' + that.data.pageId,
      url: `/pages/dayuwen/pages/confirmend/confirmend?id=${that.data.pageId}&text=${that.data.text}`
    });
   
      //上传文件
      // wx.uploadFile({
      //   url: 'https://social.ajihua888.com/v14/public/upload', //仅为示例，非真实的接口地址
      //   filePath: res.tempFilePath, // 小程序临时文件路径,
      //   name: '$_FILES',
      //   success (res){
      //     let data = res.data;
      //     //do something
      //     data = JSON.parse(data);
      //     let filelUrl = data.data[0].list[0].file_url;
      //     console.log(filelUrl);
      //     console.log(data);
      //     //记录录音
      //     wx.request({
      //       url: 'https://social.ajihua888.com/v14/chinese/audio-add', //仅为示例，并非真实的接口地址
      //       header: {
      //         'content-type': 'application/x-www-form-urlencoded' // 默认值
      //       },
      //       method: 'POST',
      //       data: {
      //         "token": "e6b5bf2e8d749f32370e76091bc80ae9",
      //         "mobile": 18640341140,
      //         "app_source_type": 1,
      //         audio_id: 2,
      //         audioUrl: filelUrl
      //       },
      //       success(res) {
      //         console.log(res.data);
      //       }
      //     });
      //     //

      //   }
      // });
    });
  },
  //录音持续时间
  recoderLastTime: function () {
    let that = this;
    clearInterval(timer);
    timer = setInterval(function () {
      that.setData({
        recoderCurrentTime: that.data.recoderCurrentTime + 1
      });
      console.log('that.data.recoderCurrentTime: ', that.data.recoderCurrentTime)
    }, 1000);
  },
  //录音
  //start
  startRecorder: function () {
    let that = this;
    luyin=true
    innerAudioContext.stop();
    //录音同步歌词时间
    that.recoderLastTime();
    //同步文字
    that.asnycText();
    //
    rm.start({
      duration: 1000*60*10, //最长十分钟
      format: 'mp3'
    });
    rm.onStart((res) => {
      console.log('录音开始', res);
    });
    // this.uploadFile();
  },
  changeClick: function(e){
    let id = e.currentTarget.dataset.id;
    if(id==1){
      //录音
      this.startRecorder();
      this.setData({
        isRecoder: 2,
        changeText: '暂停'
      });
    } else if(id==2){
      //暂停
      this.pauseRecorder();
      this.setData({
        isRecoder: 1,
        changeText: '录音'
      });
    }
  },
  //暂停
  pauseRecorder: function () {
    rm.pause();
    clearInterval(timer);
    clearInterval(asnycTextTimer);
  },
  resumeRecorder: function () {
    let that = this;
    rm.resume();
    //录音同步歌词时间
    that.recoderLastTime();
    //同步文字
    that.asnycText();
  },
  //重录
  recorder: function () {
    let that = this;
    luyin = true
    rm.pause();
    
    clearInterval(timer);
    clearInterval(asnycTextTimer);
    wx.showModal({
      title: '提示',
      content: '你要重录吗？',
      success(res) {
        if (res.confirm) {
          rm.start({
            duration: 1000*60*10,
            format: 'mp3'
          });
          that.setData({
            recoderCurrentTime: 0
          });
          //录音同步歌词时间
          that.recoderLastTime();
          //同步文字
          that.asnycText();
        } else if (res.cancel) {
          //继续录制
          that.resumeRecorder();
        }
      }
    });
    // this.uploadFile();
  },
  //结束
  stopRecorder: function () {
    let that = this;
    clearInterval(timer);
    clearInterval(asnycTextTimer);
    rm.pause();
    wx.showModal({
      title: '提示',
      content: '确认完成录制？',
      
      success(res) {
        if (res.confirm) {
          // rm.stop();
          if(luyin==false){
            wx.showModal({
              title: '提示',
              content: '请录制音频',
              showCancel: false,
            })
          }else{
            that.uploadFile();
          }
        
         
        } else if (res.cancel) {
          rm.resume();
          //录音同步歌词时间
          that.recoderLastTime();
          //同步文字
          that.asnycText();
        }
      }
    });
    // this.uploadFile();
  },
  //
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
    var vname = wx.getStorageSync("rname")
        this.setData({
          tabTitle: vname
        });
    let that = this;
    let { id,name,author } = options;
    
    console.log(id);
    that.setData({
      pageId: id,
      name,
      author,
     

    });
    that.playMusic(options);

  },
  playMusic: function (options){
    let that = this;
    //测试接口数据
    console.log(options)
    wx.request({
      url: app.requestUrl + 'v14/chinese/poetryinfo', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      data: {
        "token": app.userInfo.token,
        "mobile": app.userInfo.mobile,
        "app_source_type": app.app_source_type,
        read_id: options.id
      },
      success(res) {
        console.log(res)
        let data = res.data.data[0].item;
        let audioUrl = data.audioUrl;
        let lrcUrl = data.lrcUrl;
        let img=data.imgUrl
        //
        let isLrc = /.lrc/.test(lrcUrl);
        console.log('isLrc: ',isLrc);
        //下载歌词
        if(isLrc){
          wx.request({
            url: lrcUrl, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              let text = that.parseLyric(res.data)
              console.log(text)
              that.setData({
                text: text,
                duration: that.timeFormat(parseInt(text[text.length-1][0])),
                images:img
              });
              //
              that.startMusic(audioUrl);
            }
          });
        } else {
          console.log('歌词字幕不是lrc格式');
        }

      }
    });
  },
  startMusic: function(audioUrl){
    let that = this;
    //绑定音频播放地址
    innerAudioContext.autoplay = false
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
      let srcText = that.data.text;
      timerOut = setTimeout(function () {
        let srcCurrentText = [];
        if (srcText.length) {
          srcCurrentText = srcText.filter(function (item) {
            //之间
            return item[0] < innerAudioContext.currentTime;
          });

          //
        }
        let currentId = 'id' + (srcCurrentText.length - 1);
        let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        //
        that.setData({
          percent: percent,
          currentTime: that.timeFormat(parseInt(innerAudioContext.currentTime))
        });
        console.log(percent)
        if (that.data.toView == currentId) {
          that.setData({
            duration: that.timeFormat(parseInt(innerAudioContext.duration)),
            durationM: parseInt(innerAudioContext.duration),
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            lastTime: lastTime
          })
        } else {
          that.setData({
            duration: that.timeFormat(parseInt(innerAudioContext.duration)),
            durationM: parseInt(innerAudioContext.duration),
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            toView: 'id' + (srcCurrentText.length - 3),
            lastTime
          })
        }

      }, 1000);
    });
  },
  asnycText: function () {
    let that = this;
    let srcText = that.data.text;
    clearInterval(asnycTextTimer);
    asnycTextTimer = setInterval(function () {
      let srcCurrentText = [];
      if (srcText.length) {
        srcCurrentText = srcText.filter(function (item) {
          //之间
          return item[0] < that.data.recoderCurrentTime;
        });

        //
      }
      let currentId = 'id' + (srcCurrentText.length - 1);
      let percent = parseInt(that.data.recoderCurrentTime) / parseInt(that.data.durationM);
      console.log('that.data.recoderCurrentTime: ', that.data.recoderCurrentTime);
      console.log('that.data.duration: ', that.data.durationM);
      percent = parseInt(100 * percent);

      //录音进度条调整
      // let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
      //   percent = parseInt(100 * percent);
        // let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        // lastTime = that.timeFormat(lastTime);
        //
        that.setData({
          percent: percent,
          currentTime: that.timeFormat(that.data.recoderCurrentTime)
        });
      //
      console.log('percent: ', percent)
      if (that.data.toView == currentId) {
        that.setData({
          // currentTime: that.timeFormat(that.data.recoderCurrentTime),
          currentText: srcCurrentText[srcCurrentText.length - 1][1],
          currentIndex: srcCurrentText.length - 1,
          // percent
          // lastTime: lastTime
        })
      } else {
        that.setData({
          // currentTime: that.timeFormat(that.data.recoderCurrentTime),
          currentText: srcCurrentText[srcCurrentText.length - 1][1],
          currentIndex: srcCurrentText.length - 1,
          toView: 'id' + (srcCurrentText.length - 2),
          // percent
          // lastTime
        })
      }

    }, 1000)
  },
  parseLyric: function (text) {

    //将文本分隔成一行一行，存入数组

    var lines = text.split('\n'),

      //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]

      pattern = /\[\d{2}:\d{2}.\d{2}\]/g,

      //保存最终结果的数组

      result = [];

    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };

    lines[lines.length - 1].length === 0 && lines.pop();

    //处理没有时间的无用字段
    lines = lines.filter(function(item){
      if(item.indexOf('[')!=-1){
        return item;
      }   
    });
    //

    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {

      var time = v.match(pattern),
        value = v.replace(pattern, '');
      time.forEach(function (v1, i1, a1) {
        var t = v1.slice(1, -1).split(':');
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer);
    clearInterval(asnycTextTimer);
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
    clearInterval(timer);
    clearInterval(asnycTextTimer);
    clearTimeout(timerOut);
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