const network = require("../../utils/main.js");
const app = getApp();

var provinces = []
var citys = [];
// var districts = [];
var index = [0,0]//[0, 0, 0]; //北京市东城区
var provinceId = '';
var cityId = '';
// var districtId = '';

Component({
    properties: {},
    data: {
        provinces: provinces,
        citys: citys,
        // districts: districts,
        address: []
    },
    attached() {
        provinces = app.allAddress;
        //   console.log(app.allAddress);
        citys = provinces[index[0]].city;
        // districts = citys[index[1]].district;

        this.setData({
            provinces: provinces,
            citys: citys,
            // districts: districts,
            // address: [{ "name": provinces[index[0]].province_name, "id": provinces[index[0]].id },
            // { "name": citys[index[1]].city_name, "id": citys[index[1]].id }, { "name": districts[index[2]].district_name, "id": districts[index[2]].id }]
            address: [{ "name": provinces[index[0]].province_name, "id": provinces[index[0]].id },
            { "name": citys[index[1]].city_name, "id": citys[index[1]].id }]
        });

        // console.log(this.data.address);
    },
    methods: {
        selectProvince: function (e) {
            var that = this;
            var a = e.currentTarget.dataset;
            

            provinceId = a.id;
            // index = [a.index, 0, 0];
            index = [a.index, 0];
            citys = provinces[index[0]].city;
            // districts = citys[index[1]].district;

            var b = [{ "id": a.id, "name": a.name }];


            that.setData({
                citys: citys,
                // districts: districts,
                address: b
            });
        },
        selectCity: function (e) {
            var that = this;
            var a = e.currentTarget.dataset;
            var b = that.data.address;
            b[1] = { "id": a.id, "name": a.name };

            cityId = e.currentTarget.dataset.id;
            index[1] = a.index;
            // index[2] = 0;
            // districts = citys[index[1]].district;

            that.setData({
                // districts: districts,
                address: b
            });
            that.triggerEvent('seleted', b);
        },
        // selectDistrict: function (e) {
        //     var that = this;
        //     var a = e.currentTarget.dataset;
        //     var b = that.data.address;
        //     b[2] = { "id": a.id, "name": a.name };

        //     districtId = e.currentTarget.dataset.id;
        //     index[2] = a.index;

        //     that.setData({
        //         address: b
        //     });
        //     that.triggerEvent('seleted', b);
        // }
    }
})
