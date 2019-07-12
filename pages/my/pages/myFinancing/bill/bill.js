const network = require("../../../../../utils/main.js");
const app = getApp();

var date = new Date();
var curtYear = date.getFullYear();
var curtMonth = date.getMonth();
var curtMonthStr = curtMonth < 9 ? '0' + (curtMonth + 1) : curtMonth + 1;
var ctx = null;
var tempAngle = -90;
var currentAngle = null;
var sAngle = null;
var eAngle = null;
var x, y, r;
var total = '';
var imgW = null, imgH = null;
var percentTotal = 800;
Page({
    data: {
        tabIndex: 1,
        listData: [],
        startDate: curtYear - 2 + '-' + curtMonthStr,
        endDate: curtYear + 5 + '-' + curtMonthStr,
        dateStr: curtYear + '-' + curtMonthStr,
        bill_shouru_p: 0,
        bill_zhichu_p: 0,
        width: app.systemInfo.windowWidth,
        height: app.systemInfo.windowHeight * .5,
        chartData: [],
        curtYear: curtYear,
        curtMonth: curtMonth + 1
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        ctx = wx.createCanvasContext('canvas');
        x = this.data.width / 2;
        y = this.data.height / 2;
        r = this.data.width / 8;
        imgW = r;
        imgH = r * 1.5;
    },
    onShow: function () {
        var that = this;
        that.getList();
    },
    tabFn(e) {
        var that = this;
        var a = e.currentTarget.dataset.index;
        if(a != that.data.tabIndex){
            that.setData({
                tabIndex: a
            });
            if (a == 1) {
                that.getList();
            } else if (a == 2) {
                that.getChartData();
            } else { }
        }
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/finance/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": that.data.dateStr
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        listData: res.data.data[0]
                    });
                    that.progressFn();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
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
    pickerChange: function (e) {
        var a = e.detail.value;
        curtYear = a.split('-')[0];
        curtMonth = parseInt(a.split('-')[1]) - 1;
        curtMonthStr = a.split('-')[1];

        this.setData({
            dateStr: a
        });
        this.getList();
    },
    progressFn: function () {
        var that = this;
        var a = that.data.listData.m_shouru;
        var b = that.data.listData.m_hichu;
        if ((a < percentTotal) && (b < percentTotal)) {
            that.setData({
                bill_shouru_p: parseFloat(a / percentTotal * 100),
                bill_zhichu_p: parseFloat(b / percentTotal * 100)
            })
        }
        else if ((a > percentTotal) && (b > percentTotal)) {
            if (a >= b) {
                that.setData({
                    bill_shouru_p: 100,
                    bill_zhichu_p: parseFloat(b / a) * 100
                })
            } else {
                that.setData({
                    bill_shouru_p: parseFloat(a / b) * 100,
                    bill_zhichu_p: 100
                })
            }
        }
        else {
            if (a >= percentTotal) {
                that.setData({
                    bill_shouru_p: 100,
                    bill_zhichu_p: parseFloat(b / percentTotal) * 100
                })
            }
            else {
                that.setData({
                    bill_shouru_p: parseFloat(a / percentTotal * 100),
                    bill_zhichu_p: 100
                })
            }
        }
    },
    getChartData: function () {
        var that = this;
        var datestr = that.data.curtYear + '-' + that.data.curtMonth;
        network.POST({
            url: 'v14/finance/report',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": datestr
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var b = res.data.data[0];
                    that.setData({
                        chartData: b
                    });

                    total = parseFloat(b.price_all);
                    var a = b.list;

                    for (var i = 0; i < a.length; i++) {
                        if (i > 0) {
                            tempAngle += currentAngle;
                        }
                        var p = (parseFloat(a[i].price) / total * 100).toFixed(2) + '%';
                        currentAngle = parseFloat(a[i].price) / total * 360;
                        sAngle = tempAngle * Math.PI / 180;
                        eAngle = currentAngle * Math.PI / 180 + sAngle;

                        that.drawChart(a[i].color, p);
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
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
    drawChart: function (c, p) {
        ctx.beginPath();
        ctx.setLineWidth(r * 2);
        ctx.arc(x, y, r, sAngle, eAngle);
        ctx.setStrokeStyle('rgb(' + c.R + ',' + c.G + ',' + c.B + ')');
        ctx.stroke();
        ctx.draw(true);

        ctx.beginPath();
        ctx.setFontSize(10);
        ctx.setFillStyle('rgb(' + c.R + ',' + c.G + ',' + c.B + ')');
        ctx.setTextAlign('center');
        var textAngle = currentAngle / 2 + tempAngle;
        var tx = x + Math.cos(textAngle * Math.PI / 180) * (r * 2 + 20);
        var ty = y + Math.sin(textAngle * Math.PI / 180) * (r * 2 + 20);
        ctx.fillText(p, tx, ty);
        ctx.fill();
        ctx.draw(true);
    },
    modDate(e) {
        var that = this;
        var flag = e.currentTarget.dataset.flag;
        var a = that.data.curtYear;
        var b = that.data.curtMonth;
        // console.log(a,b);
        if (flag == 1) {
            if (b == 1) {
                that.setData({
                    curtYear: a - 1,
                    curtMonth: 12
                });
            } else {
                that.setData({
                    curtMonth: b - 1
                });
            }
        } else if (flag == 2) {
            if (b == 12) {
                that.setData({
                    curtYear: a + 1,
                    curtMonth: 1
                });
            } else {
                that.setData({
                    curtMonth: b + 1
                });
            }
        }
        that.clearCanvas();
        that.getChartData();
    },
    clearCanvas() {
        var that = this;
        tempAngle = -90;
        currentAngle = null;
        sAngle = null;
        eAngle = null;
        ctx.draw(false);
    },
    del(e){
        var that = this;
        network.deleteFinance(e.currentTarget.dataset.id, function(res){
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                that.getList();
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                });
            }
        });
    },
    onUnload() {
        tempAngle = -90;
        currentAngle = null;
        ctx = null;
        sAngle = null;
        eAngle = null;
        total = '';
    }
})