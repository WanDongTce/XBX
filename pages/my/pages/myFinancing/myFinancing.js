const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        list: '',
        budget: '',
        mysurplus: ''
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    //点击设置预算
    tz_setBudget: function (options) {
        var that = this;
        wx.navigateTo({
            url: '/pages/my/pages/myFinancing/setBudget/setBudget?prev_zhichu=' + that.data.list.item.prev_zhichu,
        })
    },
    onShow: function (options) {
        this.getList();
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/finance/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        list: res.data.data[0],
                        budget: res.data.data[0].item.budget
                    });
                    if ((res.data.data[0].budget) !== '') {
                        var mysurplus = res.data.data[0].item.budget - res.data.data[0].item.zhichu;
                        that.setData({
                            mysurplus: mysurplus
                        });
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
    tz_budgetCircle: function (e) {
        // console.log(e.currentTarget.dataset.mynum)
        wx.navigateTo({
            url: '/pages/my/pages/myFinancing/setBudgetCircle/setBudgetCircle?mynum=' + e.currentTarget.dataset.mynum + '&mysurplus=' + this.data.mysurplus + '&mybudget=' + this.data.budget + '&prev_zhichu=' + this.data.list.item.prev_zhichu,
        })
    },
    tz_accoountdetail: function (e) {    
        wx.navigateTo({
            url: '/pages/my/pages/myFinancing/myFinancingDetail/myFinancingDetail?myid=' + e.currentTarget.dataset.myid,
        })   
        // wx.navigateTo({
        //     url: '/pages/my/pages/myFinancingDetail/myFinancingDetail?myid=' + e.currentTarget.dataset.myid,
        // })
    }
})