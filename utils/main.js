const app = getApp();
const request_url = app.requestUrl;
var requestHandler = {
    url: null,
    params: {},
    success: function () {
        // success
    },
    fail: function () {
        // fail
    }
};
function requesttools(method, requestHandler, flag) {
    // console.log(flag);
    !flag && app.showLoading();
    var params = requestHandler.params;
    var url = requestHandler.url;
    params.app_source_type = app.app_source_type;
    params.app_source_school_id = app.app_source_school_id;
    // console.log('========');
    // console.log(url);
    // console.log(params);
    // console.log('==========');

    wx.request({
        url: request_url + url,
        data: params,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: method,
        success: function (res) {
            // console.log(res);
            if (res.data.code == "508" || res.data.code == "403") {
                wx.showToast({
                    title: res.data.message,
                    success: function () {
                        app.toLogin();
                    },
                    icon: 'none'
                });
            } else {
                requestHandler.success(res);
            }
        },
        fail: function () {
            requestHandler.fail();
        },
        complete: function (res) {
            // console.log(res);
        }
    });
}
function GET(requestHandler) {
    var a = arguments[1];
    requesttools('GET', requestHandler, a);
}
function POST(requestHandler) {
    var a = arguments[1];
    requesttools('POST', requestHandler, a)
}
//获取新闻
function getNews(page, callback, errCallback) {
    POST({
        url: 'v14/news/list',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "page": page
        },
        success: function (res) {
            callback(res);
        },
        fail: function () {
            errCallback();
        }
    });
}
//在线名师
function getTeacher(page, position,callback, errCallback) {
    POST({
        url: 'v13/nteacher/teacher-hot',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "page": page,
            "position": position
        },
        success: function (res) {
            callback(res);
        },
        fail: function () {
            errCallback();
        }
    });
}
//添加学习历程add-study-record
function getAddStudyRecord(type, typeid, start_time, end_time, callback, errCallback) {
    POST({
        url: 'v14/study/add-study-record',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "type": type,
            "typeid": typeid,
            "start_time": start_time,
            "end_time": end_time,
        },
        success: function (res) {
            callback(res);
        },
        fail: function () {
            errCallback();
        }
    });
}
//获取地址
function getAllAdress() {
    if (!app.allAddress) {
        POST({
            url: 'v9/address/index',
            params: {},
            success: function (res) {
                //   console.log(res);
                if (res.data.code == 200) {
                    app.allAddress = res.data.data;
                }
                // else {
                    // wx.showToast({
                    //     title: res.data.message,
                    //     icon: 'none',
                    //     duration: 1000
                    // });
                // }
            },
            fail: function () {
                wx.showToast({
                    title: '获取地址失败',
                    icon: 'none',
                    duration: 1000
                });
            }
        }, true);
    }
}
//整理选中地址信息
function getSelectedAdressInfo(arr) {
    var province = app.allAddress;
    var city = province[arr[0]].city;
    var district = city[arr[1]].district;

    return ([
        { id: province[arr[0]].id, name: province[arr[0]].province_name },
        { id: city[arr[1]].id, name: city[arr[1]].city_name },
        { id: district[arr[2]].id, name: district[arr[2]].district_name }
    ]);
}
//修改用户部分信息
function modifyPartInfo(obj, callback) {
    var params = obj;
    params.mobile = app.userInfo.mobile;
    params.token = app.userInfo.token;
    POST({
        url: 'v14/user-info/update-one',
        params: params,
        success: function (res) {
            wx.hideLoading();
            callback(res);
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
//获取用户积分
function getMyPoint(callback) {
    POST({
        url: 'v14/shop-point/my-score',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            wx.hideLoading();
            callback(res);
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
}
//上传多张图片
// function uploadimg(data, callback) {
//     var params = { "app_source_type": app.app_source_type };
//     var that = this,
//         i = data.i ? data.i : 0,//当前上传的哪张图片
//         success = data.success ? data.success : 0,//上传成功的个数
//         fail = data.fail ? data.fail : 0;//上传失败的个数
//     wx.uploadFile({
//         url: app.requestUrl + 'v14/public/upload',
//         filePath: data.path[i],
//         name: 'file',
//         formData: params,
//         success: (resp) => {
//             success++;//图片上传成功，图片上传成功的变量+1
//             console.log(resp)
//             console.log(i);
//             var a = JSON.parse(resp.data).data[0].list;
//             console.log(a)
//             //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
//         },
//         fail: (res) => {
//             fail++;//图片上传失败，图片上传失败的变量+1
//             console.log('fail:' + i + "fail:" + fail);
//         },
//         complete: () => {
//             console.log(i);
//             i++;//这个图片执行完上传后，开始上传下一张
//             if (i == data.path.length) {   //当图片传完时，停止调用          
//                 console.log('执行完毕');
//                 console.log('成功：' + success + " 失败：" + fail);
//             } else {//若图片还没有传完，则继续调用函数
//                 console.log(i);
//                 data.i = i;
//                 data.success = success;
//                 data.fail = fail;
//                 that.uploadimg(data);
//             }

//         }
//     });
// }
//公共上传图片
function publicUpload(arr, callback) {
    var params = { "app_source_type": app.app_source_type, "app_source_school_id": app.app_source_school_id};
    wx.uploadFile({
        url: app.requestUrl + 'v14/public/upload',
        filePath: arr[0],
        name: 'file',
        formData: params,
        success: (res) => {
            var a = JSON.parse(res.data);
            wx.hideLoading();
            if (a.code == "508" || a.code == "403") {
                wx.showToast({
                    title: res.data.message,
                    success: function () {
                        app.toLogin();
                    },
                    icon: 'none'
                });
            } else if (a.code == 200) {
                callback(a);
            } else {
                wx.showToast({
                    title: a.message,
                    icon: 'none'
                });
            }
        },
        fail: (res) => {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        },
        complete: () => { }
    });
}
//上传图片
function upload(url, arr, params, callback) {
    params.app_source_type = app.app_source_type;
    params.app_source_school_id = app.app_source_school_id;
    wx.uploadFile({
        url: app.requestUrl + url,
        filePath: arr[0],
        name: 'file',
        formData: params,
        success: (res) => {
            console.log(res)
            var a = JSON.parse(res.data);
            wx.hideLoading();
            if (a.code == "508" || a.code == "403") {
                wx.showToast({
                    title: res.data.message,
                    success: function () {
                        app.toLogin();
                    },
                    icon: 'none'
                });
            } else if (a.code == 200) {
                callback(a);
            } else {
                wx.showToast({
                    title: a.message,
                    icon: 'none'
                });
            }
        },
        fail: (res) => {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        },
        complete: () => { }
    });
}
//获取积分
function getPoint(typeid, id, callback) {
    POST({
        url: 'v14/shop-point/add-score',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "typeid": typeid,
            "typeid_one": id
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        }
    }, true);
}

//数组转对象
function arrToObj(arr) {
    var obj = {};
    var key = '';
    for (var i = 0; i < arr.length; i++) {
        key = i;
        obj[key] = arr[i];
    }
    return obj;
}

//获取用户标签
function getUserLabel(callback) {
    POST({
        url: 'v9/label/user-label',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "user_mobile": app.userInfo.mobile
        },
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                callback && callback(res);
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
}
//获取用户银行卡列表
function getUserBankCard(callback) {
    POST({
        url: 'v12/my-should/bankcard-list',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].list;
                app.bankCardList = a;
                // console.log(app.bankCardList);
                callback && callback();
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
}
//分享
function share(resourcetypeid, resourceid, callback) {
    POST({
        url: 'v14/news/share-add',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": resourcetypeid,
            "resourceid": resourceid
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        }
    }, true);
}
// 收藏
function collect(resourcetypeid, resourceid, callback) {
    POST({
        url: 'v14/news/collect-add',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": resourcetypeid,
            "resourceid": resourceid
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        }
    }, true);
}
//点赞
function addAgree(resourcetypeid, id, callback) {
    POST({
        url: 'v14/news/agree-add',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": resourcetypeid,
            "resourceid": id
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
        }
    }, true);
}

//轮播图
function getSwiperImgs(pos, callback) {
    POST({
        url: 'v14/adv/fudao',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "type": app.swiperImgType,
            "position": pos
        },
        success: function (res) {
            // console.log(res);
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        }
    }, true);
}
//用户信息
function getUserInfo(callback) {
    var p = {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
    };
    if (arguments[1]) {
        p = {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "user_id": arguments[1],
            "user_mobile": arguments[2]
        };
    };
    POST({
        url: 'v14/user-info/index',
        params: p,
        success: function (res) {
            callback && callback(res);
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
}
//任务跳转
function gocomplate(a){
  //预习
  if (a == 1) {
    wx.navigateTo({
      url: '/pages/home/pages/preview/preview',
    })
  }
  //2冥想
  if (a == 2) {
    wx.navigateTo({
      url: '/pages/home/pages/think/think',
    })
  }
  //3作业
  if (a == 3) {
    wx.navigateTo({
      url: '/pages/my/pages/service/homework/homework?index=0',
    })
  }
  //4作息
  if (a == 4) {
    wx.navigateTo({
      url: '/pages/my/pages/service/rest/rest',
    })
  }
  //5游戏
  if (a == 5) {
    wx.navigateTo({
      url: '/pages/home/pages/game/game',
    })
  }
  //6互助
  if (a == 6) {
    wx.navigateTo({
      url: '/pages/home/pages/homework/homework?index=0',
    })
  }
  //7易货
  if (a == 7) {
    wx.navigateTo({
      url: '/pages/home/pages/barter/barter',
    })
  }
  //8分享
  if (a == 8) {
    wx.navigateTo({
      url: '/pages/home/pages/course/course?mytopid='+ 0,
    })
  }
  //9理财
  if (a == 9) {
    wx.navigateTo({
      url: '/pages/my/pages/myFinancing/myFinancing',
    })
  }
  //10运动任务  
  if (a == 10) {
    wx.showToast({
      title: '暂未开通',
      image: '../../../../images/error.png',
      duration: 1000

    })
  }
  //11综合素质任务
  if (a == 11) {
    wx.navigateTo({
      url: '/pages/my/pages/service/archives/archives',
    })
  }
  //12定位任务
  if (a == 12) {
    wx.navigateTo({
      url: '/pages/my/pages/service/positioning/positioning',
    })
  }
  //13名师任务
  if (a == 13) {
    wx.navigateTo({
      url: '/pages/home/pages/teacher/teacher',
    })
  }
  //14外教任务
  if (a == 14) {
    wx.navigateTo({
      url: '/pages/home/pages/broadcast/broadcast',
    })
  }
}
//删除记账
function deleteFinance(id, callback) {
    POST({
        url: 'v14/finance/delete',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "id": id
        },
        success: function (res) {
            callback && callback(res);
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
}
//教师级别
function teacherLevel() {
    POST({
        url: 'v13/nteacher/job-title-list',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                app.teacherLevel = res.data.data[0].list;
            } else {
                console.log(res);
            }
        },
        fail: function (err) {
            console.log(err);
        }
    }, true);
}

//获取推荐活动
function getActy(callback) {
    POST({
        url: 'v13/ngift/act-info',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                callback && callback(res);
            } else {
                // console.log(res);
            }
        },
        fail: function (err) {
            console.log(err);
        }
    }, true);
}
//记录推荐活动
function setActyCount(ty, id, callback) {
    POST({
        url: 'v13/ngift/act-foot',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "type": ty,
            "typeid": id
        },
        success: function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                callback && callback(res);
            } else {
                console.log(res);
            }
        },
        fail: function (err) {
            console.log(err);
        }
    }, true);
}
//图片点击放大
function previewImg(img, imgs) {
    // console.log(img , imgs);
    wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: imgs, // 需要预览的图片http链接列表
        success(res) {
            // console.log(res);
        }
    })
}
//消息好友列表
function getMsgFrdList(callback) {
    POST({
        url: 'v8/friend/friend-list',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                app.msgFrdList = res.data.data;
                callback && callback(res);
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
                title: 'v8/friend/friend-list失败',
                icon: 'none',
                duration: 1000
            })
        }
    });
}
//用户设置备注
function setRemark(remark, id, callback) {
    POST({
        url: 'v9/user/set-remark',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "remark": remark,
            "user_id": id
        },
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                callback && callback(res);
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
}
//微信支付
function wxPay(info, callback, callbackfail) {
    wx.requestPayment({
        'timeStamp': info.info.timeStamp + '',
        'nonceStr': info.info.nonceStr + '',
        'package': info.info.package + '',
        'signType': 'MD5',
        'paySign': info.info.paySign + '',
        'success': callback,
        'fail': callbackfail,
        'complete': function (res) {
            console.log(res);
        }
    })
}
//轮播图跳转
function swipLink(a){
    // console.log(a);
    var tpy = Number(a.type);
    var url = a.url;
    var u, p;

    switch (tpy) {
        case 1: //新闻详情
            u = url.slice(0, url.indexOf('?'));
            p = url.slice(url.indexOf('?') + 1);
            wx.navigateTo({
                url: '/pages/common/webView/webView?src=' + u + '&' + p
            });
            break;
        case 8: //作业详情
            u = url.slice(0, url.indexOf('?'));
            p = url.slice(url.indexOf('?') + 1);
            // console.log(p);
            wx.navigateTo({
                url: '/pages/common/webView/webView?src=' + u + '&' + p + '&miniPro=1'
            });
            break;
        case 2: //教师作业
            break;
        case 4: //特色课程详情
            wx.navigateTo({
                url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + a.toid
            });
            break;
        case 6: //积分物品
            wx.navigateTo({
                url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + a.toid
            });
            break;
        case 11: //易货物品
            wx.navigateTo({
                url: '/pages/home/pages/barter/barterDetail/barterDetail?id=' + a.toid
            });
            break;
        case 14: //教学游戏
            wx.navigateTo({
                url: '/pages/home/pages/game/gameList/gameList'
            });
            break;
        case 15: //逗逗超市
            wx.navigateTo({
                url: '/pages/home/pages/ecology/goodsDetailNew/goodsDetailNew?id=' + a.toid
            });
            break;
    }
}

//会员到期
function memberExpires(callback, cb){
    POST({
        url: 'v14/renewal/check',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                if (res.data.data[0].item.to_end == 1){
                    callback && callback(res);
                } else {
                  console.log('会员没到期')
                  cb && cb(res);
                }
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        }
    }, true);
}
//微信登录
function wxLogin(cb) {
    app.showLoading();
    wx.login({
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.code) {
                app.code = res.code;
                app.showLoading();
                wx.getUserInfo({
                    withCredentials: true,
                    success(res) {
                        // console.log(res);
                        app.uinfo.encryptedData = res.encryptedData;
                        app.uinfo.iv = res.iv;
                        // console.log(app.uinfo);
                        cb && cb();
                    },
                    complete() {
                        wx.hideLoading();
                    }
                });
            } else {
                wx.showToast({
                    title: 'code不存在',
                    icon: 'none'
                });
            }
        },
        fail(err) {
            wx.hideLoading();
            wx.showToast({
                title: '微信登录失败,' + res.errMsg,
                icon: 'none'
            });
        }
    });
}
//获取openid
function getOpenid(cb) {
    var params = {};
    
    params.code = app.code;
    params.encryptedData = app.uinfo.encryptedData;
    params.iv = app.uinfo.iv;
    
    // console.log(params);
    POST({
        url: 'v14/public/get-opend',
        params: params,
        success: function (res) {
            // console.log(res);
            wx.hideLoading();

            if (res.data.code == 200) {
                app.openId = res.data.data.openid;
                
                cb && cb();
            }
        },
        fail: function (err) {
            wx.hideLoading();
            console.log(err);
            wx.showToast({
                title: '出错了~',
                icon: 'none'
            });
        },
        complete(err) {
            console.log(err);
        }
    });
}
module.exports = {
    GET: GET,
    POST: POST,
    getNews: getNews,
    getAddStudyRecord: getAddStudyRecord,
    getTeacher: getTeacher,
    getAllAdress: getAllAdress,
    modifyPartInfo: modifyPartInfo,
    getMyPoint: getMyPoint,
    upload: upload,
    publicUpload: publicUpload,
    getPoint: getPoint,
    getSelectedAdressInfo: getSelectedAdressInfo,
    arrToObj: arrToObj,
    getUserLabel: getUserLabel,
    getUserBankCard: getUserBankCard,
    share: share,
    collect: collect,
    addAgree: addAgree,
    getSwiperImgs: getSwiperImgs,
    getUserInfo: getUserInfo,
    deleteFinance: deleteFinance,
    teacherLevel: teacherLevel,
    getActy: getActy,
    setActyCount: setActyCount,
    previewImg: previewImg,
    getMsgFrdList: getMsgFrdList,
    setRemark: setRemark,
    wxPay: wxPay,
    swipLink: swipLink,
    gocomplate: gocomplate,
    memberExpires: memberExpires,
    wxLogin: wxLogin,
    getOpenid: getOpenid
    // uploadimg: uploadimg
};