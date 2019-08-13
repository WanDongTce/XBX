const network = require("../../../../../utils/main.js");
const webim = require('../../../../../utils/webim_wx.min.js');
const webimhandler = require('../../../../../utils/webim_handler.js');
const app = getApp();



Page({
    data: {
        data: null,
        msgContent: '',
        msgs: [],
        showDialog: false,
        showInput: false,
        isLike: false,
        memberCount: 0,
        animationData: null,
        aniCount: 0,
        base: '../../../../../'
    },
    ctx: null,
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

        setTimeout(function() {
            animation.rotate(0).scale(1).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 300);
    },
    onLoad: function(options) {
        this.ctx = wx.createLivePlayerContext('player');
    },
  onHide: function () {
    var that = this;
    that.component = that.selectComponent("#component")
    that.component.noShow()
    that.component.nohide()
  },
    onShow: function() {
        var that = this;
      that.component = that.selectComponent("#component")
      that.component.customMethod()
        var a = wx.getStorageSync('liveInfo');
        // console.log(a);
        that.setData({
            data: a
        }, function() {
            that.initIM();
        });
        wx.setKeepScreenOn({
            keepScreenOn: true
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
    addLike: function() {
        var a = this.data.isLike;
        if (!a) {
            this.setData({
                isLike: true
            });
            webimhandler.sendGroupLoveMsg();
        }
    },
    receiveMsgs: function(data) {
        console.log(data);
        var msgs = this.data.msgs;
        if (data.fromAccountNick == '@TIM#SYSTEM') {
            var a = webimhandler.getMemberCount();
            // console.log('观看人数： ', a);
            this.setData({
                memberCount: a
            });
        }
        else if (data.content == "[群点赞消息]love_msg") {
            this.setAnimation();
        }

        msgs.push(data);
        this.setData({
            msgs: msgs
        })
    },
    initIM: function() {
        var that = this;
        var avChatRoomId = that.data.data.groupid;
        webimhandler.init({
            accountMode: app.accountMode,
            accountType: app.accountType,
            sdkAppID: app.sdkappid,
            avChatRoomId: avChatRoomId, //房间id
            selType: webim.SESSION_TYPE.GROUP,
            selToID: avChatRoomId,
            selSess: null
        });
        var userInfo = {
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
        var onConnNotify = function(resp) {
            switch (resp.ErrorCode) {
                case webim.CONNECTION_STATUS.ON:
                    //webim.Log.warn('连接状态正常...');
                    break;
                case webim.CONNECTION_STATUS.OFF:
                    webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
                    wx
                    break;
                default:
                    webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
                    break;
            }
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

        webimhandler.sdkLogin(userInfo, listeners, options, avChatRoomId);

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

    clearInput: function() {
        this.setData({
            msgContent: ''
        })
    },
    close: function() {
        // console.log(this.ctx);
        this.ctx.stop();
        webimhandler.quitBigGroup();
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
        webimhandler.quitBigGroup();
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
        var that = this;
        // console.log('live-player :', e.detail.code)
        if (e.detail.code == 2006) {
            console.log('===2006');
            that.close();
        }
    },
    error(e) {
        // console.log('error:', e.detail);
    },
    goBack: function () {
        console.log('111')
        wx.navigateBack({
            delta: 1,
        })
    }
})