var ss = ""
var list = []
var flg=true
var flgging = true
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    "data": {
        flg:true,
        flgging: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


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

    },

    /**
     *生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     *页面相关事件处理函数--监听用户下拉动作
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

Component({
    properties: {
        // ?????innerText????????????????

    },
    data: {
        // ???????????
        someData: {}
    },
    methods: {
        
        customMethod: function () {
            var that = this
            console.log(app.userInfo.id)
            wx.connectSocket({
                // url: 'ws://121.40.165.18:8800',
                // url: 'ws://192.168.0.129:8282',
                success: function () {
                    console.log("连接成功")
                },
                fail: function () {
                    console.log("连接失败")
                }

            })
            wx.onSocketOpen(function () {
                console.log("打开连接")
                wx.sendSocketMessage({
                    data: app.userInfo.id,
                    success:function(res){
                        console.log(res)
                    }

                })
            })

            wx.onSocketMessage(function (data) {
                console.log(1)

                ss = data.data
                list.push(data.data)

                var animation = wx.createAnimation({
                   
                    duration: 500,
                   
                    timingFunction: 'linear'
                })
                that.animation = animation
                animation.translateY(550).step()

                that.setData({
                  
                    animationData: animation.export(),
                    
                    modelFlag: true
                })
               
                setTimeout(function () {
                    animation.translateY(0).step()
                    that.setData({
                        animationData: animation.export()
                    })
                }, 200)



                that.setData({
                    list_sun: list,
                    flg:true,
                    flgging: true
                })
                list = []

            })
        },
        noShow: function () {
            var that = this;
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'linear'
            })
            that.animation = animation
            animation.translateY(550).step()
            that.setData({
                animationData: animation.export()

            })
            setTimeout(function () {
                animation.translateY(0).step()
                that.setData({
                    animationData: animation.export(),
                    modelFlag: false
                })
            }, 200)
        },
        close: function () {
            var that = this
            console.log(111)
            if (flg == true) {
                flg = false;
                that.setData({
                    flg: false
                })


            } else {
                flg = true;
                that.setData({
                    flg: true
                })
            }
        },
        type02: function () {
            var that = this
            console.log(111)
            if (flgging == true) {
                flgging = false;
                that.setData({
                    flgging: false
                })
            } else {
                flgging = true;
                that.setData({
                    flgging: true
                })
            }
        },
        nohide:function(){
            flgging = true;
            flg = true;
            this.setData({
                flgging: false,
                flg: false
            })
        }
    }
})



