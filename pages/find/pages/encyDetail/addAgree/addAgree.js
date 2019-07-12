const network = require("../../../../../utils/main.js");
const app = getApp();

Component({
    properties: {
        itemid: Number,
        thumbs_is: Number,
        agreenum: {
            type: Number,
            observer: function (newVal, oldVal) {
                if (newVal > oldVal) {
                    this.setData({ count: 1 });
                } else {
                    this.setData({ count: 0 });
                }
            }
        }
    },
    data: {
        count: 0,
        base: '../../../../../'
    },
    methods: {
        onTap: function (e) {
            // var id = e.currentTarget.dataset.id;
            if (this.data.count == 0) {
                var a = this.data.agreenum;
                a++;
                this.setData({
                    agreenum: a
                });
                this.addAgree();
            } else {
                wx.showToast({
                    title: '您已点赞',
                    icon: 'none',
                    duration: 1000
                })
            }
        },
        addAgree: function () {
            var that = this;
            // console.log(that.data.itemid);
            network.POST({
                url: 'v11/baike/about-thumbs',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "id": that.data.itemid
                },
                success: function (res) {
                    // console.log(res);
                    if(res.data.code == 200){
                        that.setData({
                            thumbs_is: 1
                        })
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
            }, true);
        }
    },
    detached: function () {
        this.setData({
            count: 0
        });
    },
    attached: function () {
        this.setData({
            count: 0
        });
    }
})
