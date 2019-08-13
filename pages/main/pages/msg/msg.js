const app = getApp();
const network = require("../../../../utils/main.js");
// const moment = require('../../../../utils/moment.js');
const webim = require('../../../../utils/webim_wx.min.js');
const login = require('../../../../utils/IM_Login.js');
const logout = require('../../../../utils/IM_Logout.js');
// const recentContactListManager = require("../../../../utils/recent_contact_list_manager.js");
const friendManager = require('../../../../utils/friend_manager.js');
const groupManager = require('../../../../utils/group_manager.js');
const convertMsg = require("../../../../utils/convert_msg.js");

var reqRecentSessCount = 50; //要拉取的最近会话条数


Page({
    data: {
        base: '../../../../',
        recentContactList: []
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        // moment.locale('zh-cn');
        // this.setLocalDate();
    },
    onShow: function() {
        app.showLoading();
        this.independentModeLogin();
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
    //独立模式登录
    independentModeLogin() {
        var that = this;
        //监听事件
        var listeners = {
            //监听连接状态回调变化事件,必填
            "onConnNotify": login.onConnNotify,
            //IE9(含)以下浏览器用到的jsonp回调函数
            "jsonpCallback": login.jsonpCallback,
            //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
            "onMsgNotify": that.onMsgNotify,
            //监听新消息(直播聊天室)事件，直播场景下必填
            "onBigGroupMsgNotify": that.onBigGroupMsgNotify,
            //监听（多终端同步）群系统消息事件，如果不需要监听，可不填
            "onGroupSystemNotifys": login.onGroupSystemNotifys,
            //监听群资料变化事件，选填
            // "onGroupInfoChangeNotify": receiveGroupSystemMsg.onGroupInfoChangeNotify,
            //监听好友系统通知事件，选填
            "onFriendSystemNotifys": login.onFriendSystemNotifys,
            //监听资料系统（自己或好友）通知事件，选填
            "onProfileSystemNotifys": login.onProfileSystemNotifys,
            //被其他登录实例踢下线
            "onKickedEventCall": logout.onKickedEventCall,
            //监听C2C系统消息通道
            "onC2cEventNotifys": login.onC2cEventNotifys,
            //申请文件/音频下载地址的回调
            "onAppliedDownloadUrl": login.onAppliedDownloadUrl
        };
        login.webimLogin(listeners, that.init);
    },
    //初始化
    init() {
        var that = this;
        //初始化我的加群申请表格
        // groupPendencyManager.initGetApplyJoinGroupPendency([]);
        // //初始化我的群组系统消息表格
        // receiveGroupSystemMsg.initGetMyGroupSystemMsgs([]);
        // //初始化我的好友系统消息表格
        // receiveFriendSystemMsg.initGetMyFriendSystemMsgs([]);
        // //初始化我的资料系统消息表格
        // receiveProfileSystemMsg.initGetMyProfileSystemMsgs([]);

        //初始化好友和群信息
        // that.initInfoMap(that.getRecentContactList);

        //初始化我的最近会话列表
        that.getRecentContactList();

    },
    // initInfoMap(cbOk) {
    //     //读取我的好友列表
    //     friendManager.initInfoMapByMyFriends(
    //         //读取我的群组列表
    //         groupManager.initInfoMapByMyGroups(
    //             cbOk
    //         )
    //     );
    // },
    getRecentContactList() {
        var that = this;
        webim.getRecentContactList({
            'Count': reqRecentSessCount
        }, function (resp) {
            var a = resp.SessionItem;
            // console.log(a);
            if(a && a.length > 0){
                for (var i = 0; i < a.length; i++) {
                    if (a[i].MsgTimeStamp){
                        a[i].MsgTimeStampStr = webim.Tool.formatTimeStamp(a[i].MsgTimeStamp);
                    }
                }
                that.setData({
                    recentContactList: a
                });

                that.initUnreadMsgCount();
                // console.log(that.data.recentContactList);
            }else{
                wx.hideLoading();
                wx.showToast({
                    title: '暂无最近会话',
                    icon: 'none'
                });
            }

        }, function (err) {
            console.log(err);
        });
    },
    //获取未读条数
    initUnreadMsgCount() {
        var that = this;
        var a = that.data.recentContactList;
        webim.syncMsgs(function(res) {
            // console.log(res);
            if (res.length > 0) {
                var sess;
                var sessMap = webim.MsgStore.sessMap();
                for (var i = 0; i < a.length; i++) {
                    if (a[i].Type == 1 && sessMap["C2C" + a[i].To_Account]) {
                        a[i].UnreadMsgCount = sessMap["C2C" + a[i].To_Account].unread();
                    }
                }
                that.setData({
                    recentContactList: a
                });
                // console.log(that.data.recentContactList);                
            }
            // console.log(res);
            wx.hideLoading();
        });

    },
    //监听新消息
    onMsgNotify() {
        this.getRecentContactList();
    },
    enterLive(e) {
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        app.selType = a.Type == 1 ? 'C2C' : 'GROUP';
        if (a.Type == 1) {
            app.GROUP_Info = null;
            app.C2C_Info = {
                selToID: a.To_Account,
                type: 'C2C',
                C2cNick: a.C2cNick,
                C2cImage: a.C2cImage
            }
        } else {
            app.C2C_Info = null;
            app.GROUP_Info = {
                selToID: a.ToAccount,
                type: 'GROUP',
                GroupNick: a.GroupNick,
                GroupImage: a.GroupImage
            }
        }
        wx.navigateTo({
            url: '/pages/msg/pages/liveRoom/liveRoom'
        })
    },
    del(e) {
        var that = this;
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        wx.showModal({
            title: '提示',
            content: '确认删除吗？',
            success: function (res) {
                if (res.confirm) {
                    webim.deleteChat({
                        'To_Account': a.Type == 2 ? a.ToAccount : a.To_Account,
                        'chatType': a.Type
                    }, function (resp) {
                        that.getRecentContactList();
                    });
                }
            }
        });
        
    },
    toCreate(){
        wx.navigateTo({
            url: '/pages/msg/pages/createGroup/createGroup'
        })
    },
    toFrdList() {
        wx.navigateTo({
            url: '/pages/msg/pages/frdList/frdList'
        })
    },
    onUnload(){
        webim.logout();
    },
    // setLocalDate() {
    //     moment.defineLocale('zh-cn', {
    //         months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    //         monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    //         weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    //         weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    //         weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    //         longDateFormat: {
    //             LT: 'Ah点mm分',
    //             LTS: 'Ah点m分s秒',
    //             L: 'YYYY-MM-DD',
    //             LL: 'YYYY年MMMD日',
    //             LLL: 'YYYY年MMMD日Ah点mm分',
    //             LLLL: 'YYYY年MMMD日ddddAh点mm分',
    //             l: 'YYYY-MM-DD',
    //             ll: 'YYYY年MMMD日',
    //             lll: 'YYYY年MMMD日Ah点mm分',
    //             llll: 'YYYY年MMMD日ddddAh点mm分'
    //         },
    //         meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    //         meridiemHour: function (hour, meridiem) {
    //             if (hour === 12) {
    //                 hour = 0;
    //             }
    //             if (meridiem === '凌晨' || meridiem === '早上' ||
    //                 meridiem === '上午') {
    //                 return hour;
    //             } else if (meridiem === '下午' || meridiem === '晚上') {
    //                 return hour + 12;
    //             } else {
    //                 // '中午'
    //                 return hour >= 11 ? hour : hour + 12;
    //             }
    //         },
    //         meridiem: function (hour, minute, isLower) {
    //             var hm = hour * 100 + minute;
    //             if (hm < 600) {
    //                 return '凌晨';
    //             } else if (hm < 900) {
    //                 return '早上';
    //             } else if (hm < 1130) {
    //                 return '上午';
    //             } else if (hm < 1230) {
    //                 return '中午';
    //             } else if (hm < 1800) {
    //                 return '下午';
    //             } else {
    //                 return '晚上';
    //             }
    //         },
    //         calendar: {
    //             sameDay: function () {
    //                 return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
    //             },
    //             nextDay: function () {
    //                 return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
    //             },
    //             lastDay: function () {
    //                 return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
    //             },
    //             nextWeek: function () {
    //                 var startOfWeek, prefix;
    //                 startOfWeek = moment().startOf('week');
    //                 prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
    //                 return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
    //             },
    //             lastWeek: function () {
    //                 var startOfWeek, prefix;
    //                 startOfWeek = moment().startOf('week');
    //                 prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
    //                 return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
    //             },
    //             sameElse: 'LL'
    //         },
    //         ordinalParse: /\d{1,2}(日|月|周)/,
    //         ordinal: function (number, period) {
    //             switch (period) {
    //                 case 'd':
    //                 case 'D':
    //                 case 'DDD':
    //                     return number + '日';
    //                 case 'M':
    //                     return number + '月';
    //                 case 'w':
    //                 case 'W':
    //                     return number + '周';
    //                 default:
    //                     return number;
    //             }
    //         },
    //         relativeTime: {
    //             future: '%s内',
    //             past: '%s前',
    //             s: '几秒',
    //             m: '1 分钟',
    //             mm: '%d 分钟',
    //             h: '1 小时',
    //             hh: '%d 小时',
    //             d: '1 天',
    //             dd: '%d 天',
    //             M: '1 个月',
    //             MM: '%d 个月',
    //             y: '1 年',
    //             yy: '%d 年'
    //         },
    //         week: {
    //             // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    //             dow: 1, // Monday is the first day of the week.
    //             doy: 4  // The week that contains Jan 4th is the first week of the year.
    //         }
    //     });
    // }
})