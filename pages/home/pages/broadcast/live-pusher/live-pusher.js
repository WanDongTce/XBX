const network = require("../../../../../utils/main.js");
const webim = require('../../../../../utils/webim_wx.min.js');
const webimhandler = require('../../../../../utils/webim_handler.js');
const app = getApp();
var groupId = '';


Page({
    data: {
        data: null,
        pushUrl: '',
        msgContent: '',
        msgs: [],
        showDialog: false,
        showInput: false,
        memberCount: 0,
        frontCamera: true,
        base: '../../../../../'
    },
    ctx: null,
    onLoad: function(options) {
        this.ctx = wx.createLivePusherContext('pusher');
    },
    onShow: function() {
        var that = this;
        var a = wx.getStorageSync('liveInfo');
        // console.log(a);
        that.setData({
            data: a
        });
        that.sdkLogin();
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    },
    bindConfirm: function(e) {
        // console.log(e);
        var that = this;
        var content = e.detail.value.replace(/^\s*|\s*$/g, '');
        // console.log(content);
        if (content) {
            webimhandler.onSendMsg(content, function(res) {});
            that.clearInput();
        };
        that.setData({
            showInput: false
        });
    },
    receiveMsgs: function(data) {
        // console.log(data);
        if (data.fromAccountNick == '@TIM#SYSTEM') {
            var a = webimhandler.getMemberCount();
            // console.log('观看人数： ', a);
            this.setData({
                memberCount: a
            });
        } else if (data.content == "[群点赞消息]love_msg") {
            this.setAnimation();
        }

        var msgs = this.data.msgs;
        msgs.push(data);
        this.setData({
            msgs: msgs
        })
    },
    setAnimation() {
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-in-out",
            delay: 0
        });
        this.animation = animation;
        animation.rotate(3600).scale(.5).step();
        this.setData({
            animationData: animation.export()
        });

        setTimeout(function () {
            animation.rotate(0).scale(1).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 300);
    },
    switchCamera: function() {
        var a = !this.data.frontCamera;
        // console.log(a);
        this.setData({
            frontCamera: a
        })
        this.ctx.switchCamera();
    },
    sdkLogin: function() {
        var that = this;
        var loginInfo = {
            'sdkAppID': app.sdkappid,
            'appIDAt3rd': app.sdkappid,
            'accountType': app.accountType,
            'identifier': app.userInfo.id,
            'identifierNick': app.userInfo.nickname,
            'userSig': app.userInfo.user_sig
        };

        var onGroupSystemNotifys = {
            "5": webimhandler.onDestoryGroupNotify,
            "11": webimhandler.onRevokeGroupNotify,
            "255": webimhandler.onCustomGroupNotify
        };
        var listeners = {
            "onBigGroupMsgNotify": function(msg) {
                webimhandler.onBigGroupMsgNotify(msg, function(msgs) {
                    that.receiveMsgs(msgs);
                })
            },
            "onMsgNotify": webimhandler.onMsgNotify,
            "onGroupSystemNotifys": onGroupSystemNotifys,
            "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify
        };
        var options = {
            'isAccessFormalEnv': true,
            'isLogOn': false
        };

        webimhandler.sdkLogin(loginInfo, listeners, options, '', function() {
            that.createGroup(loginInfo);
        });

    },
    createGroup: function(loginInfo) {
        // console.log(loginInfo);
        var that = this;
        var options = {
            'GroupId': '',
            'Owner_Account': loginInfo.identifier,
            'Type': 'AVChatRoom',
            'Name': 'A计划直播',
            'FaceUrl': '',
            'Notification': '',
            'Introduction': '',
            'MemberList': []
        };

        webim.createGroup(
            options,
            function(resp) {
                // console.log(resp);
                groupId = resp.GroupId;
                that.getPushUrl();
            },
            function(err) {
                console.log(err.ErrorInfo);
            }
        );
    },
    getPushUrl() {
        var that = this;
        network.POST({
            url: 'v11/live-user/set-live-user',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": that.data.data.id,
                "groupid": groupId
            },
            success: function(res) {
                wx.hideLoading();
                //   console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    // console.log(a.push_url);
                    that.setData({
                        pushUrl: a.push_url
                    });
                    that.startPush();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    startPush() {
        var that = this;
        that.authRecord();
    },
    authRecord() {
        var that = this;
        wx.authorize({
            scope: 'scope.record',
            success() {
                that.authCamera();
            },
            fail() {
                wx.showToast({
                    title: '录音授权失败',
                })
            },
            complete(e) {
                // console.log(e);
            }
        })
    },
    authCamera() {
        var that = this;
        wx.authorize({
            scope: 'scope.camera',
            success() {
                that.initIM();
                that.ctx.start({
                    success: function(ret) {
                        // console.log('start push success!', ret)
                        webimhandler.applyJoinBigGroup(groupId);
                    },
                    fail: function() {
                        // console.log('start push failed!')
                    },
                    complete: function() {
                        // console.log('start push complete!')
                    }
                });
            },
            fail() {
                wx.showToast({
                    title: '摄像头授权失败',
                })
            },
            complete(e) {
                // console.log(e);
            }
        })
    },
    initIM() {
        webimhandler.init({
            accountMode: app.accountMode,
            accountType: app.accountType,
            sdkAppID: app.sdkappid,
            avChatRoomId: groupId,
            selType: webim.SESSION_TYPE.GROUP,
            selToID: groupId,
            selSess: null
        });
    },
    showInputFn() {
        this.setData({
            showInput: true
        });
    },
    hideInputFn() {
        if (this.data.showInput) {
            this.setData({
                showInput: false
            });
        }
    },
    showDialogFn() {
        this.setData({
            showDialog: true
        });
    },
    hideDialog() {
        this.setData({
            showDialog: false
        });
    },
    onInput(e) {
        var content = e.detail.value.replace(/^\s*|\s*$/g, '');
        this.setData({
            msgContent: content
        });
    },
    sendMsg: function() {
        // console.log(e);
        var that = this;
        var content = that.data.msgContent;
        // console.log(content);
        if (content) {
            webimhandler.onSendMsg(content, function(res) {});
            that.clearInput();
        };
        that.setData({
            showInput: false
        });
    },
    clearInput: function() {
        this.setData({
            msgContent: ''
        })
    },
    close: function() {
        // console.log(this.ctx);
        this.ctx.stop();
        webimhandler.destroyGroup(groupId);
        webimhandler.logout();
        wx.removeStorage({
            key: 'liveInfo',
            success: function(res) {},
        })
        wx.setKeepScreenOn({
            keepScreenOn: false
        });
        wx.navigateBack({
            delta: 1
        });
    },
    onUnload: function() {
        this.ctx.stop();
        webimhandler.destroyGroup(groupId);
        webimhandler.logout();
        wx.removeStorage({
            key: 'liveInfo',
            success: function(res) {},
        })
        wx.setKeepScreenOn({
            keepScreenOn: false
        });
        this.setData({
            memberCount: 0
        });
    },
    statechange(e) {
        console.log(e.detail);
        var that = this;
        if (e.detail.code == -1307) {
            that.close();
            wx.showToast({
                title: '推流多次失败',
            })
        }
    },
    error(e) {
        console.log('error:', e.detail);
    },
    goBack: function () {
        console.log('11111')
        wx.navigateBack({
            delta: 1,
        })
    }
})