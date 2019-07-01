var network = require("../../../../utils/main.js");
var moment = require("../../../../utils/moment.js");
var app = getApp();
var year = moment().year();
var week = moment().week() - 1;
var currentWeek = moment().week();
var enddate = moment().startOf('week').format('YYYY-MM-DD');
var startdate = moment(enddate).subtract(6, 'days').format('YYYY-MM-DD');

Page({
    data: {
        base: '../../../../',
        year: year,
        week: week,
        list: [],
        disabledBtn: false,
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function () {
        var that = this;
        that.getList();
    },
    getList() {
        var that = this;
        network.POST({
            url: 'v14/task/history-task',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "startdate": startdate,
                "enddate": enddate
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0? true: false
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
    modWeek(e){
        var that = this;
        var flag = e.currentTarget.dataset.flag;
        if(flag == 1){
            enddate = moment(startdate).subtract(1, 'days').format('YYYY-MM-DD');;
            startdate = moment(startdate).startOf('week').subtract(6, 'days').format('YYYY-MM-DD');
            week = moment(startdate).week();
            year = moment(startdate).year();  

            that.setData({
                year: year,
                week: week,
                disabledBtn: false
            });

            that.getList();       
        }else{
            if(week < currentWeek){
                startdate = moment(enddate).add(1, 'days').format('YYYY-MM-DD');
                enddate = moment(startdate).add(6, 'days').format('YYYY-MM-DD');;
                week = moment(startdate).week();
                year = moment(startdate).year(); 
                // console.log(startdate, enddate, week, year);

                if(week == currentWeek){
                    that.setData({
                        disabledBtn: true
                    })
                }

                that.setData({
                    year: year,
                    week: week
                });

                that.getList();
            }
        }
    }
})