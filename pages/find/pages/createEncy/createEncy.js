const network = require("../../../../utils/main.js");
const app = getApp();

var encyName = '';
var tel = '';
var address = '';
var content = '';



Page({
    data: {
        base: '../../../../',
        img: '',
        isShowMore: false,
        encyClass: {id: '', name: ''}
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        // console.log(options);
        this.setData({
            encyClass: options
        })
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onShow() {
        var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
        var a = wx.getStorageSync('createEncyClass');
        // console.log(a);
        if(a){
            that.setData({
                encyClass: a
            });
        }
    },
    saveName(e){
        encyName = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    saveTel(e){
        tel = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    saveAddress (e) {
        address = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    saveContent (e) {
        content = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    img: res.tempFilePaths
                });
                // console.log(res.tempFilePaths);
            }
        });
    },
    showMore(){
        var that = this;
        that.setData({
            isShowMore: !that.data.isShowMore
        });
    },
    submitFn(){
        var that = this;
        var flag = that.valid();
        if(flag){
            that.submit();
        }
    },
    submit: function () {
        var that = this;
        network.upload('v11/baike/about-add', that.data.img,{
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "sort_id": that.data.encyClass.id,
            "name": encyName,
            "tel": tel,
            "address": address,
            "content": content
        },function (res) {
            wx.hideLoading();
            wx.navigateTo({
                url: '/pages/find/pages/encyclopedias/encyclopedias',
                complete(err) {
                    // console.log(err);
                    if (err.errMsg == 'navigateTo:fail webview count limit exceed') {
                        app.webViewLimitate();
                    }
                }
            })
        });  
    },
    valid: function () {
        var that = this;
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        var flag = true;
        if (!that.data.encyClass.name){
            wx.showToast({
                title: '请选择分类',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        }else if (!encyName) {
            wx.showToast({
                title: '请输入名称',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else if (tel && !reg.test(tel)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else if (!that.data.img) {
            wx.showToast({
                title: '请添加图片',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        } else if(!content){
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 1000
            })
            flag = false;
        }else { }
        return flag;
    }
})