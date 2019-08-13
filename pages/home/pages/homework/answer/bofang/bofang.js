// pages/bofang/bofang.js
const network = require("../../../../../../utils/main.js");
var app = getApp();
// console.log(app);

var allStroker = [];
var path = '';
var temptime;
var startplay;
var lineIndex;
var ctx;
var currentPage;
var pointIndex;
var tempFilePath, innerAudioContext;
var bofangState;
var timer, coverImg;

var jsonall;
var id;
Page({
    data: {
        isClick: true,
        btnFlag: '',
        bgImg: ''
    },
    onLoad: function (options) {
        // console.log(options)
        // console.log('onload');
        id = options.id;
        // console.log(id)
        var self = this;

        if (!options.allStroker) {
            wx.showToast({
                title: '数据为空',
            })
            return;
        }
        path = options.allStroker;
        allStroker = JSON.parse(options.allStroker);






        temptime = options.temptime;

        if (options.coverImg) coverImg = options.coverImg;
        // console.log(coverImg)
        self.setData({
            btnFlag: options.flag,
            bgImg: options.bgImg,

        });

        if (options.mp3) tempFilePath = options.mp3;

        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                self.setData({
                    windowHeight1: res.windowHeight * 0.7,
                    windowWidth1: res.windowWidth,


                });
            }
        });

    },
    bofang: function () {
        var self = this;
        if (self.data.isClick) {
            wx.drawCanvas({
                canvasId: 'myCanvas',
                actions: []
            });
            self.setData({
                isClick: false
            });
        }

        var p = allStroker;

        var p2;


        if (!bofangState) {
            if (tempFilePath && wx.createInnerAudioContext) {
                innerAudioContext = wx.createInnerAudioContext();
                innerAudioContext.autoplay = true;
                innerAudioContext.src = tempFilePath;

                bofangState = 1;
            }
        };

        if (!startplay) startplay = (new Date()).getTime();

        if (!lineIndex) lineIndex = 0;

        if (!currentPage) currentPage = 1;

        if (!pointIndex) pointIndex = 0;


        if (!ctx) {
            ctx = wx.createCanvasContext('myCanvas');
            ctx.beginPath();
        };

        timer = setInterval(function () {
            var t = (new Date()).getTime() - startplay;

            if (t >= temptime) {
                clearInterval(timer);

                if (currentPage == p.length) {
                    lineIndex = pointIndex = currentPage = startplay = '';
                    self.setData({
                        isClick: true
                    });
                    bofangState = null;
                }
                return;
            } else {
                p2 = p[currentPage - 1];
                var p2Path = p2.curStrokerPath;

                if (lineIndex < p2Path.length) {
                    var curLine = p2Path[lineIndex].lineWidth,
                        curColor = p2Path[lineIndex].color,
                        p3 = p2Path[lineIndex].path[pointIndex];


                    if (p2Path[lineIndex].newpage == 0) {
                        if (p2Path[lineIndex].state == 1) {
                            if (!p3) {
                                if (lineIndex < p2Path.length - 1) {
                                    lineIndex++;
                                    if (currentPage != p.length && pointIndex != p2Path.length - 1) {
                                        clearInterval(timer);

                                        self.bofang();
                                    }
                                    pointIndex = 0;

                                    return;
                                }
                            } else {
                                if (t >= p3.timer) {
                                    if (pointIndex == 0) {
                                        ctx.moveTo(p3.x, p3.y);
                                    }
                                    ctx.lineTo(p3.x, p3.y);
                                    ctx.setStrokeStyle(curColor);
                                    ctx.setLineWidth(curLine);
                                    ctx.setLineCap('round');
                                    ctx.stroke();
                                    ctx.draw(true);
                                    pointIndex = pointIndex + 1;
                                    ctx.beginPath();
                                    ctx.moveTo(p3.x, p3.y);
                                }
                            }
                        } else {
                            // 撤销
                            var a = p2Path;
                            var t = (new Date()).getTime() - startplay;
                            if (t >= a[lineIndex].timer && p2Path[lineIndex].show == 0) {

                                clearInterval(timer);

                                wx.drawCanvas({
                                    canvasId: 'myCanvas',
                                    actions: []
                                });

                                for (var i = 0; i <= lineIndex; i++) {
                                    var temp = a[i];
                                    if (a[lineIndex].lineId == temp.lineId) {
                                        temp.clear = 1;
                                    }
                                    if (a[lineIndex].lineId > temp.lineId && temp.state == 1 && temp.clear == 0) {
                                        for (var j = 0; j < temp.path.length; j++) {
                                            ctx.beginPath();
                                            var obj1 = temp.path[j];
                                            var obj2;
                                            if (j == temp.path.length - 1) {
                                                obj2 = temp.path[j];
                                            } else {
                                                obj2 = temp.path[j + 1];
                                            }
                                            ctx.moveTo(obj1.x, obj1.y);
                                            ctx.lineTo(obj2.x, obj2.y);
                                            ctx.setLineWidth(temp.lineWidth)
                                            ctx.setStrokeStyle(temp.color);
                                            ctx.setLineCap('round');
                                            ctx.stroke();
                                            ctx.draw(true);
                                        }
                                    }
                                }
                                a[lineIndex].clear = 1;
                                pointIndex = 0;
                                if (lineIndex < a.length) {
                                    lineIndex++;
                                }

                                self.bofang();
                                return;
                            }
                        };
                    } else {
                        // 下一页
                        if (t >= p2Path[lineIndex].timer) {
                            clearInterval(timer);

                            wx.drawCanvas({
                                canvasId: 'myCanvas',
                                actions: []
                            });
                            currentPage++;
                            lineIndex = pointIndex = 0;
                            self.bofang();
                            return;
                        }
                    }
                }
            }


        }, 10);
    },
    next: function () {
        wx.showLoading({
            title: '加载中...'
        });

        var self = this;

        var a = [];
        // a = a.push(coverImg)
        a.push(coverImg)

        // console.log(a)
        network.publicUpload(a, function (res) {
            // console.log(res);
            var img = res.data[0].list[0].file_url;
            // console.log(img);
            if (img) {
                bofangState && innerAudioContext.stop();

                wx.hideLoading();

                self.sendAnswer(path, img, 1, tempFilePath, temptime, self.data.bgImg)

                // wx.navigateTo({
                //     url: '/pages/my/pages/teacherDraw/answer/sendAnswer/sendAnswer?img=' + img + '&mp3=' + tempFilePath + '&path=' + path + '&img2=' + coverImg + '&temptime=' + temptime + '&flag=1&bgImg=' + '' + '&allStroker=' + path + "&id=" + id
                // })

            } else {
                wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                })
            }
        });




    },
    onUnload: function () {
        // console.log('unload');
        bofangState && innerAudioContext.stop();

        allStroker = [];
        temptime = coverImg = tempFilePath = startplay = lineIndex = ctx = currentPage = pointIndex = bofangState = innerAudioContext = bofangState = '';
    },
    onShow: function () {
        var self = this;
        self.setData({
            isClick: true
        });
        bofangState = null;
        // cnosole.log(bgImg)
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
    sendAnswer: function (allStroker, img, flag, mp3, temptime, bgImg) {
        console.log((allStroker));

        var jsonall = {};
        jsonall.path = allStroker;
        jsonall.coverImg = img;
        jsonall.flag = flag;
        jsonall.mp3 = mp3;
        jsonall.temptime = temptime;
        jsonall.bgImg = bgImg;


        var that = this;

        jsonall.showHeight = that.data.windowHeight1;
        jsonall.showWidth = that.data.windowWidth1;

        console.log(jsonall)
        console.log(JSON.stringify(jsonall))
        network.POST({
            url: 'v14/question/answer-add',
            params: {
                'mobile': app.userInfo.mobile,
                'token': app.userInfo.token,
                'questionid': id,
                'content': '',
                'an_type': 2,
                'wx_json': JSON.stringify(jsonall)
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '提交成功',
                        duration: 1000,
                        icon: 'none'
                    });
                    var a = wx.getStorageSync('homeworkurl');
                    var href = a.href.slice(0, a.href.indexOf('?'));
                    var p = a.href.slice(a.href.indexOf('?') + 1);
                    wx.navigateTo({
                        url: "/pages/common/webView/webView?src=" + href + '&' + p + '&miniPro=1'
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
    goback: function () {
        // if (pages.length > 1) {
        //     var prePage = pages[pages.length - 2];
        //     prePage.getUserGoods();
        // }

        wx.navigateBack({
        })
    },

})