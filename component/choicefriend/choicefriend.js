var network = require("../../utils/main.js");
var app = getApp();

Component({
    properties: {
        list: Array,
        taskreceiveid: Number
    },
    data: {
        checkedList: []
    },
    attached: function () {
        // console.log(this.data.list);
    },
    methods: {
        saveSearch(e) {
            // console.log(e);
            var a = e.detail.value.replace(/^\s*|\s*$/, '');
            this.triggerEvent('searchFn', a);
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
            if (arr.length == 0) {
                wx.showToast({
                    title: '请选择好友',
                    icon: 'none',
                    duration: 1000
                });
            } else {
                var obj = JSON.stringify(network.arrToObj(arr));
                if (that.data.taskreceiveid) {
                    network.POST({
                        url: 'v14/task/get-task-join',
                        params: {
                            "mobile": app.userInfo.mobile,
                            "token": app.userInfo.token,
                            "taskreceiveid": that.data.taskreceiveid,
                            "uids": obj
                        },
                        success: function (res) {
                            // console.log(res);
                            wx.hideLoading();
                            if (res.data.code == 200) {
                                that.triggerEvent('getFriend', {"obj": obj, "count": 2});
                            }else{
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
                }else{
                    that.triggerEvent('getFriend', { "obj": obj, "arr": arr, "count": 1});
                }
            }
        }
    }
})