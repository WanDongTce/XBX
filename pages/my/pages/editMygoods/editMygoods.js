const network = require("../../../../utils/main.js");
const app = getApp();
// console.log(app);
var i = 0;
var selectClssId = '';
var districtId = '';

var id = '';
var delImgs = [];
var delImgsObj = {};



Page({
    data: {
        newImgs: [],
        oldImgs: [],
        tit: '',
        msg: '',
        selectClssName: '',
        loca: '',
        releasestatus: ''
    },
    onLoad: function (options) {
        var that = this;  
        id = options.id; 
        this.compontNavbar = this.selectComponent("#compontNavbar");
        that.getDetail();
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v14/easy-goods/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    // console.log(a);
                    that.setData({
                        tit: a.name,
                        oldImgs: a.images,
                        msg: a.content,
                        releasestatus: a.releasestatus,
                        selectClssName: a.type_name
                    });
                    selectClssId = a.type_id;
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
    onShow: function () {       
        var a = wx.getStorageSync('selectedBarClss');
        if (a) {
            selectClssId = a.id;
            this.setData({
                selectClssName: a.name
            });
        }
    },
    saveTitle: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            tit: a
        });
    },
    saveMsg: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            msg: a
        });
    },
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var a = that.data.newImgs.concat(res.tempFilePaths);
  
                that.setData({
                    newImgs: a
                });
            }
        });
    },
    delImg: function (e) {
        var b = e.currentTarget.dataset;
        var that = this;
        var flag = b.flag;
        var idx = b.idx;  
        var newImgs = that.data.newImgs;
        var oldImgs = that.data.oldImgs;

        if(flag == 1){
            delImgs.push(b.id);
            // console.log(delImgs);
            var a = oldImgs.slice(0, idx).concat(oldImgs.slice(idx + 1));
            that.setData({
                oldImgs: a
            });
            // console.log(that.data.oldImgs);
        }else{
            var c = newImgs.slice(0, idx).concat(newImgs.slice(idx + 1));
            that.setData({
                newImgs: c
            });
        }
    },
    checkReleaseStatus: function () {
        var a = this.data.releasestatus;
        if (a == 2) {
            this.setData({
                releasestatus: 1
            });
        } else {
            this.setData({
                releasestatus: 2
            });
        }
    },
    getDelImgs: function(){
        // console.log(delImgs);
        var a = network.arrToObj(delImgs);
        delImgsObj = JSON.stringify(a);
        // console.log(delImgsObj);
    },
    submit: function () {
        var that = this;
        var newImgs = that.data.newImgs;
        // console.log(newImgs);
        var content = that.data.msg;
        var tit = that.data.tit;
        var status = that.data.releasestatus;

        that.getDelImgs();

        if (!tit) {            
            wx.showToast({
              title: '请输入标题',
                icon: 'none',
              duration: 1000
            });
        }
        else if (!content) {            
            wx.showToast({
              title: '请输入内容',
                icon: 'none',
              duration: 1000
            });
        }
        else if (!selectClssId) {
            wx.showToast({
              title: '请选择分类',
                icon: 'none',
              duration: 1000
            });
            
        }
        else {
            if (newImgs.length == 0){
                that.submitFn(content, tit, status);
            }else{
                app.showLoading();
                that.uploadImgs(newImgs, content, tit, status);
            }
           
        }
    },
    submitFn: function (content, tit, status){
        var that = this;
        network.POST({
            url: 'v14/easy-goods/update',
            params: {
                'mobile': app.userInfo.mobile,
                'token': app.userInfo.token,
                'id': id,
                'name': tit,
                'type_id': selectClssId,
                'content': content,
                'district_id': districtId,
                'releasestatus': status,
                'del_img_ids': delImgsObj
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateBack({
                        delta: 1
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
    uploadImgs: function (list, content, tit, status) {
        // console.log(list);
        var that = this;
        network.upload('v14/easy-goods/update', list, {
            'mobile': app.userInfo.mobile,
            'token': app.userInfo.token,
            'id': id,
            'name': tit,
            'type_id': selectClssId,
            'content': content,
            'district_id': districtId,
            'releasestatus': status,
            'del_img_ids': delImgsObj
        }, function (res) {
            wx.navigateBack({
                delta: 1
            });
        });
    },
    toClassList: function () {
        wx.navigateTo({
            url: '/pages/home/pages/barter/classBarterList/classBarterList'
        })
    }
})