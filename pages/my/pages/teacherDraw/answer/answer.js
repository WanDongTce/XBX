const network = require("../../../../../utils/main.js");
const app = getApp();
var id = '';
var flag = false;


const options = {
    duration: 100000,//指定录音的时长，单位 ms
    sampleRate: 16000,//采样率
    numberOfChannels: 1,//录音通道数
    encodeBitRate: 96000,//编码码率
    format: 'mp3',//音频格式，有效值 aac/mp3
    frameSize: 50,//指定帧大小，单位 KB
};
var recorderManager = null;
var starttime;
var stoptime;
var temptime;
var startplay;
var lineIndex;
var ctx = null;
var timer;
var mp3;
var allStroker = [];
var historyStroker = {
    page: null,
    curStrokerPath: []
};
var lineId = 0;
var interval, count = 0;
var state = 0;
var t = 5 * 60 * 1000;

var width = null;
var height = null;

var bgImg = null;
Page({
    curStrokerTemp: {
        state: null,
        color: null,
        lineWidth: null,
        path: [],
        show: null,
        timer: null
    },
    startX: 0,
    startY: 0,
    data: {
        currentPage: null,
        startText: '录制',
        penWdith: 5,
        penText: '细',
        color: '#333333',
        bgImg: '',
        showBgImg: false,
        coverImg: '',
        btnHtml: 0,

        wentiBtn: true,
        hidewentiBtn: false,
    },
    onLoad: function (options) {
        // console.log(options);
       
        id = options.id;
        // console.log(id)

        var that = this;
               
        if (options.quespic== "undefined") {
            that.setData({
                bgImg: '',
                hidewentiBtn:true,
            })
        }
        else if(options.quespic) {
            that.setData({
                bgImg: options.quespic,
                showBgImg: false,
                hidewentiBtn: false,
            })
        }
        // console.log('onload')
        // console.log(that.data.bgImg)
        wx.setStorage({
            key: 'pigai_bgImg',
            data: that.data.bgImg,
        })
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                that.setData({
                    windowHeight1: res.windowHeight * 0.7,
                    windowWidth1: res.windowWidth,


                });
            }
        });
        wx.getImageInfo({
            src: this.data.bgImg,
            success(res) {
                console.log(res)
                width = res.width;
                height = res.height;
            }
        })
    },
    touchStart: function (e) {
        var data = this.data;
        if (!state) {
            if (count) return;
            wx.showModal({
                title: '请点击开始并同意授权',
                image: '../../../../../images/home/error.png',
                duration: 1000
            });
        }
        else {
            var temptimer = (new Date()).getTime() - starttime;

            this.startX = e.changedTouches[0].x;
            this.startY = e.changedTouches[0].y;

            ctx = wx.createCanvasContext('myCanvas');

            var curStroker = {
                state: 1,
                color: data.color,
                lineWidth: data.penWdith,
                path: [],
                show: 1,
                timer: null
            };
            curStroker.path.push({ x: this.startX, y: this.startY, timer: temptimer });

            this.curStrokerTemp = curStroker;

            ctx.setStrokeStyle(data.color);
            ctx.setLineWidth(data.penWdith);
            ctx.setLineCap('round');
            ctx.beginPath();
        }
    },
    touchMove: function (e) {
        if (state && count) {
            var temptimer = (new Date()).getTime() - starttime;

            var x = e.changedTouches[0].x;
            var y = e.changedTouches[0].y;

            this.curStrokerTemp.path.push({ x: x, y: y, timer: temptimer });

            ctx.moveTo(this.startX, this.startY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.setLineCap('round');

            this.startX = x;
            this.startY = y;
            wx.drawCanvas({
                canvasId: 'myCanvas',
                reserve: true,
                actions: ctx.getActions()
            });
        }
    },
    touchEnd: function () {
        var temptimer = (new Date()).getTime() - starttime;

        var curTemp = this.curStrokerTemp;
        var temp = {
            lineId: lineId,
            state: 1,
            show: 1,
            clear: 0,
            color: curTemp.color,
            lineWidth: curTemp.lineWidth,
            path: curTemp.path,
            timer: temptimer,
            newpage: 0,
        };
        historyStroker.curStrokerPath.push(temp);
        lineId++;
    },
    chexiao: function () {
        var temptimer = (new Date()).getTime() - starttime;
        this.isOvertime(temptimer);

        if (!state) {
            wx.showModal({
                title: '提示',
                content: '请开始录制，再进行撤销',
            });
        } else {
            wx.drawCanvas({
                canvasId: 'myCanvas',
                actions: ctx.getActions()
            });
            var tempArr = historyStroker.curStrokerPath;
            var length = tempArr.length;
            var temp;
            for (var i = 0; i < length; i++) {
                if (tempArr[i].state == 1 && tempArr[i].show == 1) {
                    temp = tempArr[i];
                }
                if (i == length - 1 && temp == null) {
                    return;
                }
            }
            if (length > 0) {
                temp.show = 0;
                var color = temp.color;
                var lineWidth = temp.lineWidth;
                var arr = temp.path;
                var lineId = temp.lineId;
                var temp = {
                    lineId: lineId,
                    state: 0,
                    show: 0,
                    clear: 0,
                    color: color,
                    lineWidth: lineWidth,
                    path: arr,
                    timer: temptimer,
                    newpage: 0,
                };
                tempArr.push(temp);
            }


            for (var i = 0; i < tempArr.length; i++) {
                var temp = tempArr[i];
                if (temp.show == 1) {
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
                        ctx.setLineWidth(temp.lineWidth);
                        ctx.setStrokeStyle(temp.color);
                        ctx.setLineCap('round');
                        ctx.stroke();
                        ctx.draw(true);
                    }
                }
            };
        }
    },
    nextPage: function () {
        lineId = 0;
        if (!state) {
            wx.showModal({
                title: '提示',
                content: '请开始录制，再换下一页',
            })
        } else {
            var temptimer = (new Date()).getTime() - starttime;
            this.isOvertime(temptimer);

            var temp = {
                lineId: 0,
                state: 1,
                show: 1,
                clear: 0,
                color: null,
                lineWidth: null,
                path: [],
                timer: temptimer,
                newpage: 1
            };
            historyStroker.curStrokerPath.push(temp);
            this.data.next += 1;
            var page = historyStroker.page;
            var arr = historyStroker.curStrokerPath;
            var temp = {
                page: page,
                curStrokerPath: arr
            };
            allStroker.push(temp);
            historyStroker.page = this.data.currentPage;
            historyStroker = {
                page: null,
                curStrokerPath: []
            };
            historyStroker.page = this.data.currentPage;
            this.curStrokerTemp = {
                state: null,
                color: null,
                lineWidth: null,
                path: [],
                show: null
            };
            wx.drawCanvas({
                canvasId: 'myCanvas',
                actions: ctx.getActions(),
            });
            // console.log(allStroker);
        }
    },
    startluzhi: function () {
        var self = this;
        self.setData({
            wentiBtn: false
        })
        if (!state) {
            wx.getSetting({
                success: (response) => {
                    // console.log(!response.authSetting['scope.record']);
                    if (!response.authSetting['scope.record']) {
                        wx.authorize({
                            scope: 'scope.record',
                            success: () => {
                                if (wx.getRecorderManager) {
                                    recorderManager = wx.getRecorderManager();
                                    recorderManager.start(options);
                                    recorderManager.onStart(() => {

                                        self.countDown();

                                        starttime = (new Date()).getTime();
                                        historyStroker.page = self.data.currentPage = 1;
                                    });
                                };
                            },
                            fail: () => {
                                wx.showModal({
                                    title: '授权失败，无法使用录制,请清除缓存重试',
                                    image: '../../../../../images/home/error.png',
                                    duration: 1000
                                })
                            }
                        })
                    } else {
                        if (wx.getRecorderManager) {
                            recorderManager = wx.getRecorderManager();
                            recorderManager.start(options);
                            recorderManager.onStart(() => {
                                self.countDown();
                                starttime = (new Date()).getTime();
                                historyStroker.page = self.data.currentPage = 1;
                            });
                        };
                    }
                }
            })
        }
        else if (state == 1) {
            if (count * 1000 >= t) {
                wx.showLoading({
                    title: '已超时，处理中'
                });
            } else {
                wx.showLoading({
                    title: '处理中'
                });
            }

            stoptime = (new Date()).getTime();
            temptime = stoptime - starttime;
            var temp = {
                page: historyStroker.page,
                curStrokerPath: historyStroker.curStrokerPath
            };
            allStroker.push(temp);
            //   console.log(allStroker);
            var model = JSON.stringify(allStroker);

            self.getCoverImg(function () {
                if (recorderManager) {
                    recorderManager.stop();
                    recorderManager.onStop((res) => {

                        // console.log('img2:', self.data.coverImg);
                        mp3 = res.tempFilePath;
                        
                        if (self.data.showBgImg) {
                            self.setData({
                                bgImg: self.data.bgImg
                            })
                        }
                        else {
                            self.setData({
                                bgImg: ''
                            })
                        }
                        wx.navigateTo({
                            url: '/pages/my/pages/teacherDraw/answer/bofang/bofang?allStroker=' + model + "&temptime=" + temptime + "&mp3=" + res.tempFilePath + '&coverImg=' + self.data.coverImg + '&flag=1&bgImg=' + self.data.bgImg + "&id=" + id
                        });

                        //new直接跳转
                        // var a = []
                        // a.push(self.data.coverImg)
                        // network.publicUpload(a, function (resnew) {
                        //     // console.log(res);
                        //     var img = resnew.data[0].list[0].file_url;
                        //     // console.log(img);
                        //     if (img) {
                               
                        //         self.sendAnswer(model, img, 1, res.tempFilePath, temptime, self.data.bgImg)
                                
                        //     } else {
                        //         wx.showToast({
                        //             title: '上传失败',
                        //             icon: 'none'
                        //         })
                        //     }
                        // });

                    })
                } else {

                    wx.navigateTo({
                        url: '/pages/my/pages/teacherDraw/answer/bofang/bofang?allStroker=' + model + "&temptime=" + temptime + '&coverImg=' + self.data.coverImg + '&flag=1&bgImg=' + self.data.bgImg + "&id=" + id
                    });

                    //new直接跳转
                    // var a = []
                    // a.push(self.data.coverImg)
                    // network.publicUpload(a, function (resnew) {
                    //     // console.log(res);
                    //     var img = resnew.data[0].list[0].file_url;
                    //     // console.log(img);
                    //     if (img) {
                           
                    //         self.sendAnswer(model, img, 1, ' ', temptime, self.data.bgImg)
                            
                    //     } else {
                    //         wx.showToast({
                    //             title: '上传失败',
                    //             icon: 'none'
                    //         })
                    //     }
                    // });
                };
            });
        }
    },
    
    isOvertime: function (time) {
        var that = this;
        if (time > t) {
            clearInterval(interval);
            that.startluzhi();

        }
    },
    countDown: function () {
        var self = this;
        self.setData({
            startText: '00:00',
            btnHtml: 1
        });
        state = 1;
        interval = setInterval(function () {
            self.setData({
                startText: self.formatTime(count)
            });
            self.isOvertime(count * 1000);
            count++;
        }, 1000);
    },
    onHide: function () {
        clearInterval(interval);
        wx.hideLoading();
        starttime = stoptime = temptime = startplay = lineIndex = timer = mp3 = '';
        allStroker = [];
        historyStroker = {
            page: null,
            curStrokerPath: []
        };
        lineId = count = state = 0;
        this.curStrokerTemp = {
            state: null,
            color: null,
            lineWidth: null,
            path: [],
            show: null,
            timer: null
        };
        ctx = null;
        recorderManager = null;
        interval = null;
        this.startX = 0;
        this.startY = 0;
        this.setData({
            currentPage: null,
            startText: '录制',
            penWdith: 5,
            penText: '细',
            color: '#333333',
            showBgImg: false,
            coverImg: '',
            btnHtml: 0
        });
    },
    onShow: function (options) {
        // console.log('onshow111111')
        var a = wx.getStorageSync('pigai_bgImg');
        var that=this;
        
        console.log(a)
        // if (a == "undefined") {
        //     that.setData({
        //         bgImg: '',
        //         hidewentiBtn: true,
        //     })
        // }
        if (a) {
            that.setData({
                bgImg: a,
                showBgImg: false,
                hidewentiBtn: false,
                wentiBtn: true,
            })
        }
        else{
            that.setData({
                bgImg: '',
                hidewentiBtn: true,
                wentiBtn: true,
            })
        }

        wx.drawCanvas({
            canvasId: 'myCanvas',
            actions: []
        });
    },
    getCoverImg: function (callback) {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function (res) {
                // console.log('img:', res.tempFilePath);
                that.setData({
                    coverImg: res.tempFilePath
                });
                callback();
            }
        });
    },
    wenImg: function () {
        // console.log(this.data.bgImg);
        // var a = !this.data.showBgImg;
        // console.log(a)
        // this.setData({
        //     showBgImg: a
        // });
        ctx = wx.createCanvasContext('myCanvas')
        var a = this.data.showBgImg;
        if (this.data.showBgImg) {
            this.setData({
                showBgImg: false
            });
            ctx.clearRect(0, 0, this.data.windowWidth1, this.data.windowHeight1);
            ctx.draw()
        }
        else {
            this.setData({
                showBgImg: true
            });
            ctx.drawImage(this.data.bgImg, 0, 0, width, height, 0, 0, this.data.windowWidth1, this.data.windowHeight1)
            ctx.draw();
        }   
    },
    penSelect: function () {
        var penText = this.data.penText;
        if (penText == '细') {
            this.setData({
                penText: '粗',
                penWdith: 15
            })
        } else {
            this.setData({
                penText: '细',
                penWdith: 5
            })
        }
    },
    colorSelect: function (e) {
        this.setData({ color: e.currentTarget.dataset.param });
    },
    formatTime: function (s) {
        var that = this;
        var a = [
            parseInt(s / 60 % 60) < 10 ? '0' + parseInt(s / 60 % 60) : parseInt(s / 60 % 60), // 分
            parseInt(s % 60) < 10 ? '0' + parseInt(s % 60) : parseInt(s % 60)    // 秒
        ].join(":");

        return a;
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
                    // wx.navigateTo({
                    //     url: '/pages/home/pages/homework/homework'
                    // });


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
    }
})