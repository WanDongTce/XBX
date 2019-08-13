const network = require("../../../../../utils/main.js");
const app = getApp();
// console.log(app);

var selectClssId = '';
var districtId = '';



Page({
    data: {
        imgList: [],
        tit: '',
        msg: '',
        selectClssName: '',
        loca: '',
        releasestatus: 2,
        base: '../../../../../'
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function(){
        var a = wx.getStorageSync('selectedBarClss');
        if (a) {
            selectClssId = a.id;
            this.setData({
                selectClssName: a.name
            });
        }
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
                var a = that.data.imgList.concat(res.tempFilePaths);
                that.setData({
                    imgList: a
                });
            }
        });
    },
    delImg: function (e) {
        // console.log(e);
        var that = this;
        var idx = e.currentTarget.dataset.idx;
        var list = that.data.imgList;
        var a = list.slice(0, idx).concat(list.slice(idx + 1));
        that.setData({
            imgList: a
        });
    },
    checkReleaseStatus: function(){
        var a = this.data.releasestatus;
        if(a == 2){
            this.setData({
                releasestatus: 1
            });
        }else{
            this.setData({
                releasestatus: 2
            });
        }
    },
    submit: function () {
        var that = this;
        var list = that.data.imgList;
        // console.log(list);
        var content = that.data.msg;
        var tit = that.data.tit;
        var status = that.data.releasestatus;

        if (!tit) {
            wx.showToast({
                title: '请输入标题',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!content) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 1000
            })
        }
        else if (list.length == 0){
            wx.showToast({
                title: '请添加图片',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!selectClssId){
            wx.showToast({
                title: '请选择分类',
                icon: 'none',
                duration: 1000
            })
        } 
        else {
            app.showLoading();
            that.uploadImgs(list, content, tit, status);
        }
    },
    uploadImgs: function (list, content, tit, status) {
        var that = this;
        network.upload('v14/easy-goods/create', list, {
            'mobile': app.userInfo.mobile,
            'token': app.userInfo.token,
            'name': tit,
            'type_id': selectClssId,
            'content': content,
            'district_id': districtId,
            'releasestatus': status
        }, function (res) {
            wx.showToast({
                title: '发布成功',
                icon: 'none',
                success: function () {
                    wx.navigateTo({
                        url: '/pages/home/pages/barter/barter'
                    });
                }
            });
        });
    },
    toClassList: function(){
        wx.navigateTo({
            url: '/pages/home/pages/barter/classBarterList/classBarterList'
        })
    }
})