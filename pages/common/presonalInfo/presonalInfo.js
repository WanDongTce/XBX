const network = require("../../../utils/main.js");
var app = getApp();
var provinceId = '';
var cityId = '';
var districtId = '';
var schoolId = '';
var gradeId = '';
var classId = '';

Page({
    data: {
        base: '../../../',
        genderId: 1,//性别
        schoolIndex: '',
        schoolList: [],
        gardeIndex: '',
        gradeList: [],
        classIndex: '',
        classList: [],
        showPicker: false,
        address: []
    },
    onLoad: function () {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.addressPicker = this.selectComponent("#addressPicker");
    },
    //性别
    genderBindTap: function (e) {
        var that = this;
        var id = that.data.genderId;
        var a = e.currentTarget.dataset.gander;
        if (id != a) {
            that.setData({
                genderId: a
            });
        }
    },
    showPicerFn() {
        this.setData({
            showPicker: true
        });
    },
    getAddressInfo(e) {
        var that = this;
        var res = network.getSelectedAdressInfo(e.detail);
        // console.log(res);
        that.setData({
            address: res,
            schoolIndex: '',
            schoolList: [],
            gardeIndex: '',
            gradeList: [],
            classIndex: '',
            classList: []
        });

        provinceId = res[0].id;
        cityId = res[1].id;
        districtId = res[2].id;

        that.getSchoolAddrsByAreaId(districtId);
        that.hidePicker();
    },
    hidePicker() {
        this.setData({
            showPicker: false
        });
    },
    //获取学校
    getSchoolAddrsByAreaId: function (districtId) {
        var that = this;
        if (!districtId) {
            wx.showToast({
                title: '请选择地区',
                icon: 'none',
                duration: 1000
            })
        } else {
            network.POST({
                url: 'v9/address/search-school',
                params: {
                    'district': districtId
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        that.setData({
                            schoolList: res.data.data
                        });
                        // console.log(that.data.schoolList);
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
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
    },
    //选择学校
    bindPickerSchool: function (e) {
        var that = this;
        if (!districtId) {
            wx.showToast({
                title: '请选择地址',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!that.data.schoolList.length) {
            wx.showToast({
                title: '暂无学校',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            // console.log(e);
            var a = e.detail.value;
            that.setData({
                schoolIndex: a,
                gardeIndex: '',
                gradeList: [],
                classIndex: '',
                classList: []
            });
            schoolId = that.data.schoolList[a].school_id;
            that.getGradeList(schoolId);
        }
    },
    //获取年级
    getGradeList: function (schoolId) {
        var that = this;
        if (!schoolId) {
            wx.showToast({
                title: '请选择学校',
                icon: 'none',
                duration: 1000
            })
        } else {
            network.POST({
                url: 'v9/address/grade',
                params: {
                    'schoolid': schoolId
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        that.setData({
                            gradeList: res.data.data
                        });
                        //   console.log(that.data.gradeList)
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
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
    //选择年级
    bindPickerGrade: function (e) {
        var that = this;
        if (that.data.gradeList.length == 0) {
            wx.showToast({
                title: '暂无年级',
                icon: 'none',
                duration: 1000
            })
        } else {
            var a = e.detail.value;
            gradeId = that.data.gradeList[a].id;
            that.setData({
                gradeIndex: a,
                classIndex: '',
                classList: []
            });
            that.getClassList(schoolId, gradeId);
        }
    },
    //获取班级
    getClassList: function (schoolId, gradeId) {
        var that = this;
        if (!gradeId) {
            wx.showToast({
                title: '请选择年级',
                icon: 'none',
                duration: 1000
            })
        } else {
            network.POST({
                url: 'v9/address/class',
                params: {
                    'schoolid': schoolId,
                    'gradeid': gradeId
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        that.setData({
                            classList: res.data.data
                        })
                        // console.log(that.data.classList);
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
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
    },
    //选择班级
    bindPickerClass: function (e) {
        var that = this;
        if (that.data.classList.length == 0) {
            wx.showToast({
                title: '暂无班级',
                icon: 'none',
                duration: 1000
            })
        } else {
            var a = e.detail.value;
            classId = that.data.classList[a].id;
            that.setData({
                classIndex: a
            });
        }
    },
    //提交表单
    bindFormSubmit: function (e) {
          // console.log(e);
        var that = this;
        var name = e.detail.value.name.replace(/^\s*|\s*$/, '');
        var regName = /^[\u4E00-\u9FA5A-Za-z]+$/;

        if (name.length == 0) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!regName.test(name)) {
            wx.showToast({
                title: '姓名只能是汉字',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!schoolId) {
            wx.showToast({
                title: '请选择学校',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!gradeId) {
            wx.showToast({
                title: '请选择年级',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!classId) {
            wx.showToast({
                title: '请选择班级',
                icon: 'none',
                duration: 1000
            })
        }
        else {

            network.POST({
                url: 'v14/user-info/update',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "nickname": name,
                    "sex": that.data.genderId,
                    "province_id": provinceId,
                    "city_id": cityId,
                    "district_id": districtId,
                    "schoolid": schoolId,
                    "gradeid": gradeId,
                    "classid": classId
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res)
                    if (res.data.code == 200) {
                        that.saveInfo(name);
                        /*
                        wx.navigateTo({
                            url: '/pages/common/addReferee/addReferee'
                        })
                        */
                        wx.switchTab({
                          url: '/pages/main/pages/home/home'
                        });
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
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

        };
    },
    next: function () {
      /*
      wx.navigateTo({
        url: '/pages/common/addReferee/addReferee'
      })
      */
      wx.switchTab({
        url: '/pages/main/pages/home/home'
      });
    },
  onShow: function () {
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
    saveInfo(name){
        var that = this;
        var a = wx.getStorageSync('userInfo');
        a.step = app.userInfo.step = 8;
        a.register_realname = app.userInfo.register_realname = name;
        a.register_province_id = app.userInfo.register_province_id = provinceId;
        a.register_city_id = app.userInfo.register_city_id = cityId;
        a.register_area_id = app.userInfo.register_area_id = districtId;
        a.register_community_id = app.userInfo.register_community_id = schoolId;
        a.grade_id = app.userInfo.grade_id = gradeId;
        a.class_id = app.userInfo.class_id = classId;
        a.register_community_name = app.userInfo.register_community_name = that.data.schoolList[that.data.schoolIndex].name;
        a.register_province_name = app.userInfo.register_province_name = that.data.address[0].name;
        a.register_city_name = app.userInfo.register_city_name = that.data.address[1].name;
        a.register_area_name = app.userInfo.register_area_name = that.data.address[2].name;
        a.grade_name = app.userInfo.grade_name = that.data.gradeList[that.data.gradeIndex].name;
        a.class_name = app.userInfo.class_name = that.data.classList[that.data.classIndex].name;

        wx.setStorageSync('userInfo', a);
    }
})