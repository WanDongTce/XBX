const network = require("../../../../../utils/main.js");
const app = getApp();
// console.log(app);
var page = 1;
var hasmore = null;
var search = '';
var nianji = 0;
var kemu = 0;
var version = 0;

var learntype=''
Page({
    data: {
        title:'',
        IMGURL: app.imgUrl,
      species:'',
        isShowOption: false,
        sctdOptIdx: null,
        animationData: null,
        list: [],
        options: [],
        nianji: 0,
        kemu: 0,
        version: 0,
        
        time:[
            {
                id: 0,
                title: '全部'
            },
          {
            id:1,
            title: '当天'
          },
          {
            id: 2,
            title: '三天内'
          },
          {
            id: 3,
            title: '本周'
          },
          {
            id: 4,
            title: '本月'
          },
        ]
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        // console.log(options)
        learntype=options.learntype;
        var that=this;
        if (learntype==1){
         
          that.setData({
            species: '科目',
            title: '预习乐'
          })
        }
        else if (learntype == 2) {
          // wx.setNavigationBarTitle({ title: '冥想思' })
          that.setData({
            species: '科目',
            title: '冥想思'
          })
        }
        else if (learntype == 4) {
          // wx.setNavigationBarTitle({ title: '同步课堂' })
          that.setData({
            species: '科目',
            title: '同步课堂'
          })
        }
        else if (learntype == 3) {
          // wx.setNavigationBarTitle({ title: '教学游戏' })
          that.setData({
            species: '分类',
            title: '教学游戏'
          })
        }
        that.setData({
          learntype: options.learntype
        })
        // console.log(that.data.species)
    },
    onShow: function () {
        var that = this;
        that.getContList(false);
    },
    getContList: function (contaFlag) {
        var that = this;
        that.hideOption();

        network.POST({
            url: 'v14/study/study-record-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": learntype,
                "search": search,
                "species": kemu,
                "time": version,
                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    if (contaFlag) {
                        var a = that.data.list.concat(res.data.data[0].list);
                        that.setData({
                            list: a
                        });
                    } else {
                        that.setData({
                            list: res.data.data[0].list
                        });
                    }
                    hasmore = res.data.data[0].hasmore;
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
    onReachBottom: function () {
        if (!this.data.isShowOption) {
            if (hasmore) {
                page++;
                this.getContList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    
    inputFn: function(e){
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getContList(false);
    },
    
    onUnload: function () {
        page = 1;
        hasmore = null;
        search = '';
       
        kemu = 0;
        version = 0;
        
        this.setData({
            
            kemu: 0,
            version: 0,
            
        });
    },
    seltClkFn: function (e) {
        var that = this;
        var a = e.target.dataset.idx;
        if (that.data.isShowOption && that.data.sctdOptIdx == a) {
            that.hideOption();
            that.setData({
                sctdOptIdx: null
            });
        } else {
            that.getOptions(a);
        }
    },
    getOptions: function (idx) {
        var that = this;
        var a = null;   
    
        if ((idx == 2) &&(learntype!=3)) {          
            a = app.studyOptions.kemu;
           
        }
        else if ((idx == 2) && (learntype == 3)) {
          a = app.studyOptions.game;          
        }
        else { }
        that.setData({
            options: a
        });
        // console.log(that.data.options);
        that.showOption(idx);
    },
    selOptFn: function (e) {
        var that = this;
        var idx = that.data.sctdOptIdx;
        var a = e.target.dataset.id;
        // console.log(a);
        if (idx == 2) {
            that.setData({
                kemu: a
            });
        } else if (idx == 3) {
            that.setData({
                version: a
            });
        }

    },
    optCofmFn: function () {
        var that = this;
        var idx = that.data.sctdOptIdx;
        if (idx == 2) {
            kemu = that.data.kemu;
            // that.setData({
                
            //     version: version,
                
            // });
        } else if (idx == 3) {
            version = that.data.version;
            // that.setData({
               
            //     kemu: kemu,
                
            // });
        } 
        else { };
       
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        that.getContList(false);
    },
    showOption: function (idx) {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-200).step();
        this.setData({
            animationData: animation.export(),
            isShowOption: true,
            sctdOptIdx: idx
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    hideOption: function () {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-out",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-10).step();
        this.setData({
            animationData: animation.export()
        });
        setTimeout(function () {
            animation.translateY(-300).step();
            this.setData({
                animationData: animation.export(),
                isShowOption: false,
                sctdOptIdx: 0
            });
        }.bind(this), 200);
    },
    tz_my:function(){
      wx.switchTab({
          url: '/pages/main/pages/my/my',
      })
    }
})