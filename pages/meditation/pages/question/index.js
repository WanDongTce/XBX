// pages/Preview//pages/no-question/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: {
      middle: false
    },
    zjmc: "",
    currentQusetion: {}, //当前问题
    progress: 0,
    count: 0,
    addStyle: '', //对错样式
    currentIndex: -1, //显示对错item
    // disabled: false
    scores: 0,
    urlsun: ""
  },
  onTransitionEnd() {
    // console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },
  togglePopup() {
    this.toggle('middle');
  },
  getQuesList: function (id) {
    let that = this;
    wx.request({
      url: app.questionUrl + 'index/Problem/Tlist',
      method: 'POST',
      data: {
        "read_id": app.questionOptions.id||id
      },
      success: function (res) {
        let questions = res.data.data;
        app.questionOptions.list = questions;
        app.questionOptions.count = questions.length;
        app.questionOptions.progress = 1;
        app.questionOptions.currentId = questions[0].id;

        that.setData({
          progress: 1,
          count: questions.length,
          currentQusetion: questions[0]
        });
      }
    });
  },
  isChoices: function () {
    //或者之前问题 回退浏览之前问题用
    let choicesed = app.questionOptions.results;
    return choicesed.some(function (item) {
      //[1, 2]
      return item[0] == app.questionOptions.currentId;
    });
  },
  //点击选项显示对错
  choices: function (e) {
    //判断是否选过
    if (this.isChoices()) {
      wx.showToast({
        icon: 'none',
        title: '该问题以回答过',
        duration: 1000
      });
      return;
    }
    //
    let choicesItem = e.currentTarget.dataset.answer; //答案对错 1 2
    let currentIndex = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id; //选项
    let currentQusetion = app.questionOptions.list[app.questionOptions.progress - 1]; // 当前问题
    let addStyle = '';
    if (choicesItem == 1) {
      addStyle = 'item-right';
      app.questionOptions.rightTimes = app.questionOptions.rightTimes + 1;
    } else {
      addStyle = 'item-wrong';
      //正确答案也显示

      currentQusetion.options = currentQusetion.options.map(function (item) {
        if (item.answer == 1) {
          item.addStyle = 'item-right';
        }
        return item;
      })
    }
    //记录答题结果
    console.log('当前问题id: ', app.questionOptions.currentId);
    app.questionOptions.results.push([app.questionOptions.currentId, id]);
    console.log(app.questionOptions);
    //添加回答过样式和是否
    currentQusetion.options[currentIndex].addStyle = addStyle;
    currentQusetion.disabled = true;
    //更新当前页面数据
    this.setData({
      addStyle,
      currentIndex,
      // disabled: true,
      currentQusetion: currentQusetion
    });
  },
  //最后一题
  isLast: function () {
    if (app.questionOptions.progress == app.questionOptions.count) {
      //计算分数
      let {
        count,
        rightTimes
      } = app.questionOptions;
      let scores = 100 * (rightTimes / count);
      //scores.toFixed(2);
      scores = Math.ceil(scores);
      this.setData({
        scores
      });
      this.togglePopup();
      return true;
    }
  },
  submit: function () {
    let that = this;
    //上传数据
    this.sendResults(this.data.scores);
    this.togglePopup();
    //跳转到课文
    wx.navigateBack({
      delta: that.goback()
    });
  },
  cancel: function () {
    var that=this
    //上传数据
    this.sendResults(this.data.scores);
    this.togglePopup();
    //清空数据
    app.questionOptions = {
      list: [],
      currentId: 0,
      results: [],
      progress: 0,
      count: 0,
      rightTimes: 0 //分数
    }
    //跳转到课文
    wx.navigateBack({
      delta: that.goback()
    });
  },
  sendResults: function (scores) {
    let options = {};
    app.questionOptions.results.map(function (item) {
      options[item[0]] = item[1];
    });
    options = JSON.stringify(options);

    wx.request({
      url: app.questionUrl + 'index/Problem/writeAnswer',
      method: 'POST',
      data: {
        "read_id": app.questionOptions.id,
        "user_id": app.userInfo.id,
        "score": scores,
        "options": options
      },
      success: function (res) {
        console.log(res);
      }
    });
  },
  //write
  goComment: function () {
    wx.navigateTo({
      url: '/pages/meditation/pages/comment/index?id=1' //课文id
    });
  },
  // 下一题
  next: function () {
    //没有回答问题
    if (app.questionOptions.list[app.questionOptions.progress - 1].disabled == undefined) {
      wx.showToast({
        icon: 'none',
        title: '还没有答题呢',
        duration: 1000
      });
      return
    }
    //最后一题
    if (this.isLast()) return;

    app.questionOptions.currentId = app.questionOptions.list[app.questionOptions.progress].id;
    if (app.questionOptions.progress < app.questionOptions.count) app.questionOptions.progress++;
    wx.navigateTo({
      url: '/pages/meditation/pages/question/index?pageId=' + app.questionOptions.currentId
    });
  },
  //返回路由位置
  goback: function () {
    let routers = getCurrentPages();
    let index = 0;
    let length = getCurrentPages().length;
    routers.map(function (item, i) {
      if (item.route == "pages/meditation/pages/review/review") {
        index = i;
      }
    });
    return length - index - 1;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //答题过程中返回出当前模块小程序
    var zjmc = wx.getStorageSync("zjmc")
    this.setData({
      zjmc: zjmc
    })
    app.questionOptions.progress ? app.questionOptions.progress : app.questionOptions.progress = 1;
    //首次
    if (app.questionOptions.id == 0) {
      app.questionOptions.id = options.id || 0;
    }
    if (app.questionOptions.list.length == 0) { //首次
      this.getQuesList(options.id);
    } else {
      this.setData({
        progress: app.questionOptions.progress || 1,
        count: app.questionOptions.count,
        currentQusetion: app.questionOptions.list[app.questionOptions.progress - 1] || app.questionOptions.list[0]
      });
    }
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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