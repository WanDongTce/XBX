const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
var flg = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    percent: "",
    text: [],
    duration: 0,
    currentTime: 0,
    currentText: '',
    currentIndex: 0,
    toView: '',
    scrollTop: 100,
    lastTime: 0,
    percentTime: '',
    onPlay: true,
    thumbnail: '',
    tabTitle: '',
    currentTextLength: 0,
    tiem_wei:"",
    tiem_wei02: "00:00"
  },
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
  goTo: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `/pages/dayuwen/pages/recorder/recorder?id=${id}&name=${that.data.name}&author=${that.data.author}`
    })
  },
  timeFormat: function (time) {
    let m = parseInt(time / 60) < 10 ? ("0" + parseInt(time / 60)) : parseInt(time / 60);
    let s = time % 60 < 10 ? ("0" + time % 60) : time % 60;
    return m + ":" + s;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
    var name = wx.getStorageSync("rname")
    console.log(name)
    this.setData({
      tabTitle: name
    });
    //
    let that = this;
    let id = options.id;
    console.log(app.userInfo);
    this.setData({
      id: id
    });
    //
    let title = options.title;
    console.log(id)
    //测试接口数据
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
        "read_id": id
      },
      success(res) {
        console.log(res);
        let data = res.data.data[0].item;
        let audioUrl = data.audioUrl;
        let lrcUrl = data.lrcUrl;
        that.setData({
          thumbnail: data.imgUrl,
          name: data.rname,
          author: data.readname
        })
        //
        //下载歌词  
        // 判断歌词文件格式
        let isLrc = /.lrc/.test(lrcUrl);
        console.log(isLrc);
        if (isLrc) {
          wx.request({
            url: lrcUrl, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res);
              let text = that.parseLyric(res.data)
              console.log(text)
              that.setData({
                text: text
              });
              //
              that.startMusic(audioUrl);
            }
          });
        }
      }
    });
   
    //
  },
  startMusic: function (audioUrl) {
    let that = this;
    //绑定音频播放地址
  
    innerAudioContext.src = audioUrl;
    console.log(innerAudioContext.duration)
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        duration: innerAudioContext.currentTime
      })
    })
    innerAudioContext.autoplay = false
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onTimeUpdate(function () {
      let srcText = that.data.text;
     
      setTimeout(function () {
        let srcCurrentText = [];
        if (srcText.length) {
          srcCurrentText = srcText.filter(function (item) {
            //之间
            return item[0] < innerAudioContext.currentTime;
          });
          console.log(srcCurrentText)
          //
        }
        let currentId = 'id' + (srcCurrentText.length - 1);
        let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
        // let percent = that.data.percentS / parseInt(innerAudioContext.duration);
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        let percentTime = that.timeFormat(parseInt(innerAudioContext.currentTime)) + '/' + that.timeFormat(parseInt(innerAudioContext.duration));
        //
        console.log('currentId: ',currentId);
        console.log('that.data.toView: ',that.data.toView);
        //
        that.setData({
          percent: percent,
          percentTime
        });
        if (that.data.toView == currentId) {
          
          that.setData({
            duration: innerAudioContext.duration,
            currentTime: innerAudioContext.currentTime,
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            currentTextLength: srcCurrentText.length,
            lastTime: lastTime
          })
        } else if(that.data.currentTextLength!=srcCurrentText.length){  //加过渡动画
          that.setData({
            duration: innerAudioContext.duration,
            currentTime: innerAudioContext.currentTime,
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            currentTextLength: srcCurrentText.length,
            toView: 'id' + (srcCurrentText.length - 3), //留有一行
            lastTime
          })
        }
      }, 1000)
    });
  },
  //
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
      console.log(time)
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
    innerAudioContext.pause();
    flg = false
    if (!this.data.onPlay) {
      innerAudioContext.play();
      this.setData({
        onPlay: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    innerAudioContext.pause();
    this.setData({
      onPlay: false
    })
    // innerAudioContext.destroy();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.stop();
    // innerAudioContext.destroy();
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