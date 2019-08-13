const network = require("../../../../utils/main.js");
const app = getApp();
var search = '';


Page({
    data: {
        base: '../../../../',
        title: '选择好友',
        list: [],
        checkedList: [],
        showEmpty: false,        
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function() {
        this.getList();
      var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
    },
    getList() {
        var that = this;
        network.getMsgFrdList(function (res) {
            // console.log(res);
            var a = res.data.data;
            that.setData({
                list: a,
                showEmpty: a.length == 0 ? true : false
            });
        });
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    saveSearch(e) {
        // console.log(e);
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // this.getList();
    },
    choice: function (e) {
        // console.log(e);
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        var clist = this.data.checkedList;

        if (!(list[index].checked)) {
            list[index].checked = true;
            clist.push(list[index].fid);
        } else {
            list[index].checked = false;
            for (var i = 0; i < clist.length; i++) {
                if (clist[i] == list[index].fid) {
                    break;
                }
            }
            clist = clist.slice(0, i).concat(clist.slice(i + 1));
        };
        // console.log(clist);
        this.setData({
            list: list,
            checkedList: clist
        });
    },
    submit: function (e) {
        var that = this;
        var arr = that.data.checkedList;
        // console.log(arr);
        if (arr.length == 0) {
            wx.showToast({
                title: '请选择好友',
                icon: 'none',
                duration: 1000
            });
        } else {
            network.POST({
                url: 'v11/group/create-discuss',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "user_uids": JSON.stringify(arr)
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        app.selType = 'GROUP';
                        app.C2C_Info = null;
                        app.GROUP_Info = {
                            selToID: res.data.data.group_id,
                            type: 'GROUP',
                            GroupNick: '未命名',
                            GroupImage: app.defaultHeadUrl
                        }
                        wx.navigateTo({
                            url: '/pages/msg/pages/liveRoom/liveRoom'
                        })
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
                    });
                }
            });
        }
    },
    onUnload: function() {
        search = '';
        this.setData({
            list: [],
            checkedList: []
        });
    }
})