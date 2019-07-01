App({
    requestUrl: 'https://social.ajihua888.com/',
    imgUrl: 'https://m.ajihua888.com/wx_img/',
    ansHref: 'https://m.ajihua888.com/question/my-answer-list',
    quesHref: 'https://m.ajihua888.com/question/detail',
    
    
    // requestUrl: 'http://social.test.ajihua888.com/',
    // imgUrl: 'http://m.test.ajihua888.com/wx_img/',
    // ansHref: 'http://m.test.ajihua888.com/question/my-answer-list',
    // quesHref: 'http://m.test.ajihua888.com/question/detail',
    
    uinfo: {
        encryptedData: '',
        iv: ''
    },
    code: '',
    openId: '',

    parAppId: 'wxee68233581f4965a',//A计划家长端

    gaodekey: 'a8a3fc2292b2b66c0d676675d6bf9cc2',
    appId: 'wx789c5e9626eee513',  // A计划教育平台
    app_source_type: 1,
    swiperImgType: 'aplan',
    contactTel: '024-66909606',
    sdkappid: 1400027766,
    accountType: 11731,
    accountMode: 0,
    tulingUrl: 'https://openapi.tuling123.com/openapi/api/v2',
    tulingKey: '8a64a86efb1343359e5d28259fdbbeb2',
    userInfo: null, //用户信息
    systemInfo: null, //系统信息
    studyOptions: null,//学习分类
    longitude: null, //地理位置
    latitude: null, //地理位置
    teacherLevel: null,//教师级别
    classBarter: null,//易货物品类型
    goodsType: null,//积分商城物品类型
    allAddress: null,//地址
    barterSearchHis: [],//易货搜索历史
    peripherySearchHis: [],//周边生活搜索历史
    mallSearchHis: [],//积分商城搜索历史
    encyClass: [],//百科分类
    userLabel: [],//用户标签
    account: {},//用户账户
    bankCardList: [],//银行卡
    msgFrdList: [], //消息好友列表,
    loginInfo: {}, // 聊天、直播通用
    infoMap: {}, // 聊天初始化时,拉取我的好友和我的群组信息
    recentSessMap: {}, //保存最近会话列表
    defaultHeadUrl: '/images/default-user-2.png', //默认头像路径
    selType: '', //当前聊天类型
    C2C_Info: {},
    GROUP_Info: {},
    getPrePageGroupHistroyMsgInfoMap: {},//群聊历史
    getPrePageC2CHistroyMsgInfoMap: {},//私聊历史
    toLogin: function () {
        wx.reLaunch({
            url: '/pages/common/login/login'
        });
    },
    showLoading: function(){
        wx.showLoading({
            title: '加载中...'
        })
    },
    webViewLimitate(){
        wx.showToast({
            title: 'WebVIEW超过极限, 请关闭页面重试',
            icon: 'none'
        });
    },
    onLaunch: function () {
        // console.log('launch');
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                // console.log(res);
                that.systemInfo = res;
            }
        });
    },
    onShow: function () {
        var that = this;
        that.userInfo = wx.getStorageSync('userInfo');
        // console.log(that.userInfo);
    }
})