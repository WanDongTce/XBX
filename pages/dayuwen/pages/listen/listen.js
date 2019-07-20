const innerAudioContext = wx.createInnerAudioContext()
console.log(innerAudioContext)
const app = getApp()
var flg=false, 
timer = null;
var scidsun;
var lun_sun
var goodnum;
var  rname;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    percent: 0,
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
    pic_sun:"",

    good:"",
    already:"",
    currentTextLength: 0
  },
  goBack: function () {
    console.log(111)
  },
  suspend:function(){
    if (flg==true){
      innerAudioContext.pause()
      flg=false
      this.setData({
        flg: false
      })
    }else{
    
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
    //分享调整
    let r = getCurrentPages();
    r = r[r.length - 1];
    console.log(r.route, ":", r.options);
    if (app.userInfo.token == undefined) {
      // let r = getCurrentPages();
      // console.log(r); r.options id=35&good=3&scid=3
      wx.setStorageSync('share', 'true');
      wx.navigateTo({
        url: `/pages/common/login/login?next=${r.route}&id=${r.options.id}&good=${r.options.good}&scid=${r.options.scid}`
      });
    }
    //
    var pic_sun=wx.getStorageSync("pic")

    console.log('options:',options);
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
    var name = wx.getStorageSync("rname")
    console.log(name)
        this.setData({
          tabTitle: name,
          pic_sun: pic_sun
        });
    //
    let id = options.id;
    console.log(options.good)
    wx.setStorageSync("goodID", id)
    goodnum=options.good
    console.log(app.userInfo);
    scidsun = options.scid
    console.log("scidsun=" + options.scid)
    this.setData({
      id: id,
      good: options.good
    });
    //
    let title = options.title;
    console.log(id)
    //测试接口数据
    this.loadInit(id);
    //
  },
  loadInit: function(id){
    let that = this;
    lun_sun = id
    wx.request({
      url: app.requestUrl + 'v14/chinese/myread-info', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      data: {
        "token": app.userInfo.token,
        "mobile": app.userInfo.mobile,
        "app_source_type": app.app_source_type,
        "luyin_id": id,
        "audio_id": scidsun,
       
      },
      success(res) {
        console.log('res: ',res);
        console.log('rweixes: ', res);
        let data = res.data.data[0].item;
        let audioUrl = data.audioUrl;
        let lrcUrl = data.lrcUrl;
        goodnum = data.praisenum
        console.log(data.isagree)
        that.setData({
          thumbnail: data.imgUrl,
          name: data.rname,
          author: data.readname,
          good: data.praisenum,
          already: data.isagree
        })
        //
        //下载歌词  
        // 判断歌词文件格式 避免导致运行效率
        let isLrc = /.lrc/.test(lrcUrl);
        console.log('isLrc: ',isLrc);
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
                text: text
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
  startMusic: function (audioUrl) {
    let that = this;
    //绑定音频播放地址

    innerAudioContext.src = audioUrl;
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
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        let percentTime = that.timeFormat(parseInt(innerAudioContext.currentTime)) + '/' + that.timeFormat(parseInt(innerAudioContext.duration));
        //
        console.log('currentId: ', currentId);
        console.log('that.data.toView: ', that.data.toView);
        that.setData({
          percent: percent,
          percentTime
        });
        //
        if (that.data.toView == currentId) {

          that.setData({
            duration: innerAudioContext.duration,
            currentTime: innerAudioContext.currentTime,
            currentText: srcCurrentText[srcCurrentText.length - 1][1],
            currentIndex: srcCurrentText.length - 1,
            currentTextLength: srcCurrentText.length,
            lastTime: lastTime
          })
        } else if (that.data.currentTextLength != srcCurrentText.length) {  //加过渡动画
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
    //
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
  good:function(){
    let that = this;
      wx.request({
        url: app.requestUrl + 'v14/news/agree-add',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
          
        },
        data: {
          "token": app.userInfo.token,
          "mobile": app.userInfo.mobile,
          "app_source_type": app.app_source_type,
          "resourcetypeid": 24,
          "resourceid": lun_sun
        },
        method: 'POST',
        success(res){
          if (res){

            if (res.data.code == 200){
              goodnum = parseInt(goodnum) + 1
              that.setData({
                good: goodnum,
                already: 1
              })
            }
          }
         
        }
      })
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    innerAudioContext.pause()
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
    innerAudioContext.stop();
    // innerAudioContext.pause();
    // innerAudioContext.destroy();
    this.setData({
      onPlay: false
    });
    console.log('listen onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.stop();
    // innerAudioContext.destroy();
    console.log('listen onUnload');
   
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