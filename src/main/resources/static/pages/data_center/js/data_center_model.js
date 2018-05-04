/*
*       返回的初始化参数数组(getInitObj方法)
*       参数说明：
*       title : table中展示的标题，此处为dataTable必须参数
*       data ： table中展示的数据，此处为dataTable必须参数
*       visible : table中需隐藏的列，此处为dataTable必须参数
*
*       type : 页面中展示的形式：默认input，参数可选为：select，time，
*       validate : 校验规则，标准正则表达式（非字符串）或校验函数，
*       chkTip : 校验时提示的文字，说明该字段应该输入具体格式的值
*       isNotModalRender : 是否在模态框中绘制
*       isNotNodeRender :   是否在节点信息栏中绘制
*       isNotSearchRender : 是否在搜索信息栏中绘制
*
*/

define(['jquery', 'util'], function ($, u) {
    function Model() { //数据中心model
        this.dataCenter = {
            id: null,
            name: null, //数据中心名称 not null
            displayName: null,//业务名称
            longitude: null,   //经度
            latitude: null,     //维度
            level: null,
            levelName: null,
            pid: null,//不能为空，纯数字 maxLength 10
            parentName: null,
            remark: null,
            createUserId: null,
            createUserName: null,
            updateUserId: null,
            updateUserName: null,
            createTime: null,
            updateTime: null
        };
        Model.prototype.setObj = function (obj) {  //设置对象属性值
            for (let key in obj) {
                this.dataCenter[key] = obj[key];
            }
        };
        Model.prototype.getObj = function () {   //获取对象所有属性，空值也获取
            return this.dataCenter;
        };
        Model.prototype.getSignificantObj = function () {
            let obj = {};
            for (let key in this.dataCenter) { //只获取有意义的属性
                if (this.dataCenter[key] || 0 == this.dataCenter[key]) {
                    obj[key] = this.dataCenter[key];
                }
            }
            return obj;
        };
        //获取初始化参数函数
        Model.prototype.getInitObj = function () {
            let initArr = [
                {
                    "title" : "id",
                    "data" : "id" ,
                    "isNotNodeRender" : true ,
                    "isNotSearchRender" : true ,
                    "isNotModalRender" : true
                },
                {
                    "title": "名称",
                    "data": "name",
                    "isNeeded" : true ,
                    "validate": /^[\u4e00-\u9fa5]{1,}$/,
                    "chkTip": "只能输入纯汉字"
                },
                {
                    "title": "显示名称",
                    "data": "displayName",
                    "isNeeded" : true ,
                    "validate": /^[\u4e00-\u9fa5]{1,}$/,
                    "chkTip": "只能输入纯汉字"
                },
                {
                    "title": "经度",
                    "data": "longitude",
                    "isNeeded": true,
                    "validate": function (d) {
                        let val = (~~d).toFixed(2);
                        return (~~d >= -90 && ~~d <= 90)
                    },
                    "chkTip": "请输入[-90 , 90]的实数"
                },
                {
                    "title": "纬度",
                    "data": "latitude",
                    "isNeeded": true,
                    "validate": function (d) {
                        let val = (~~d).toFixed(2);
                        return (~~d >= -180 && ~~d <= 180)
                    },
                    "chkTip": "请输入[-180 , 180]的实数"
                },

                {
                    "title": "所属层级ID",
                    "data": "level",
                    "isNotNodeRender": true,
                    "isNotModalRender": true,
                    "isNotSearchRender": true,
                    "type": "select",
                    "children": [{
                        "id": '1',
                        "text": "一级"
                    }, {
                        "id": '2',
                        "text": "二级"
                    }, {
                        "id": '3',
                        "text": "三级"
                    }]
                },
                {
                    "title": "所属层级",
                    "data": "levelName",
                    "isNotModalRender": true,
                    "isNotSearchRender" : true,
                    "type": "select",
                    "children": [{
                        "id": '1',
                        "text": "一级"
                    }, {
                        "id": '2',
                        "text": "二级"
                    }, {
                        "id": '3',
                        "text": "三级"
                    }]
                },
                {
                    "title": "父节点",
                    "data": "pid",
                    "type": "selectTree",
                    "children": [],
                    "isNotNodeRender": true,
                },
                {
                    "title": "父节点",
                    "data": "parentName",
                    "isNotSearchRender" : true ,
                    "isNotModalRender": true,
                },
                {
                    "title": "描述",
                    "data": "remark",
                    "type" : "textarea",
                    "isNotNodeRender" : true ,
                    "isNotSearchRender" : true
                },
                {
                    "title": "创建人ID",
                    "isNotModalRender": true,
                    "isNotNodeRender": true,
                    "data": "createUserId"
                },
                {
                    "title": "创建人",
                    "isNotModalRender": true,
                    "isNotSearchRender" : true ,
                    "data": "createUserName"
                },
                {
                    "title": "修改人ID",
                    "isNotNodeRender": true,
                    "isNotModalRender": true,
                    "isNotSearchRender" : true,
                    "data": "updateUserId"
                },
                {
                    "title": "修改人",
                    "isNotNodeRender": true,
                    "isNotModalRender": true,
                    "isNotSearchRender" : true ,
                    "data": "updateUserName"
                },
                {
                    "title": "创建时间",
                    "data": "createTime",
                    "isNotModalRender": true,
                    "type": "time"
                },
                {
                    "title": "修改时间",
                    "data": "updateTime",
                    "isNotNodeRender": true,
                    "isNotModalRender": true,
                    "isNotSearchRender" : true ,
                    "type": "time"
                },
                {
                    "title": "操作",
                    "isNotNodeRender": true,
                    "isNotModalRender": true,
                    "isNotSearchRender" : true ,
                }
            ];
            return initArr;
        };
        //设置table列数据操作
        Model.prototype.getAction = function () {
            return [
                {
                    "targets": 0,
                    "render": function (data, type, row) {
                        return data;
                    }
                },
                {
                    "targets": 14,
                    "render": function (data, type, row) {
                        return u.timeFormat(data);
                    }
                },
                //列表隐藏的列
                {
                    "targets": [0, 5, 7, 9, 10, 12, 13, 15],
                    "visible": false

                },
                {
                    "targets": 16,
                    "render": function (data, type, row) {
                        return '<div class="btn-group"><a class="btn-edit btn btn-info">编辑</a><a class="btn-delete btn btn-danger">删除</a></div>'
                    }
                }
            ];//end of return
        };
        Model.prototype.getCellStyle = function () {
            return function (row, data, index) {
                for( let i = 0 ; i < 9 ; i++ ) {
                    $('td', row).eq(i).css('text-align', 'center');
                }
            };
        };
        Model.constructor = Model;
    }//end of Model
    return {
        Model: Model
    };
});