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

var id = '';
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
        btnHtml: 0
    },
    onLoad: function (options) {
        // console.log(options);
        id = options.id;
        console.log(id)
        var self = this;
        wx.getStorage({
            key: 'ques',
            success: function (res) {
                // console.log(res);
                self.setData({
                    bgImg: res.data.img
                });
            }
        });
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
                    }else{
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
            if(count * 1000 >= t){
                wx.showLoading({
                    title: '已超时，处理中'
                });
            }else{
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

            self.getCoverImg(function(){
                if (recorderManager) {
                    recorderManager.stop();
                    recorderManager.onStop((res) => {

                        // console.log('img2:', self.data.coverImg);
                        mp3 = res.tempFilePath;
                        wx.navigateTo({
                            url: '/pages/home/my_study/answer/bofang/bofang?allStroker=' + model + "&temptime=" + temptime + "&mp3=" + res.tempFilePath + '&coverImg=' + self.data.coverImg + '&flag=1&bgImg=' + self.data.bgImg +"&id=" + id
                        });
                    })
                } else {

                    wx.navigateTo({
                        url: '/pages/home/my_study/answer/bofang/bofang?allStroker=' + model + "&temptime=" + temptime + '&coverImg=' + self.data.coverImg + '&flag=1&bgImg=' + self.data.bgImg + "&id=" + id
                    });
                };
            });
        }
    },
    isOvertime: function(time){
        var that = this;
        if(time > t){
            clearInterval(interval); 
            that.startluzhi();
            
        }
    },
    countDown: function(){
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
    onShow:function(){
        
        wx.drawCanvas({
            canvasId: 'myCanvas',
            actions: []
        });
    },
    getCoverImg: function(callback){
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function(res){
                // console.log('img:', res.tempFilePath);
                that.setData({
                    coverImg: res.tempFilePath
                });
                callback();
            }
        });
    },
    // wenImg: function () {
    //     // console.log(this.data.bgImg);
    //     var a = !this.data.showBgImg;
    //     this.setData({
    //         showBgImg: a
    //     });  
    // },
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
    }
})