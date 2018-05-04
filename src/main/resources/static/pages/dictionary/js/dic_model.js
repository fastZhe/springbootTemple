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
* */

define(['jquery', 'util', 'common'], function ($, u, com) {
    function Model() { //数据中心model
        this.dictData = {
            "createTime": null,
            "createUserId": null,
            "createUserName": null,
            "dictCode": null,//数据项编码 not null
            "dictName": null,//数据项名称 not null
            "dictValue": null,//数据项值 not null
            "id": null,// number maxLength 10
            "idx": null,//数据项排序索引
            "level": null,
            "levelName": null,
            "parentName": null,
            "parentTypeName": null,
            "pid": null,// number maxLength 10
            "remark": null,
            "type": null,
            "typeName": null,
            "updateTime": null,
            "updateUserId": null,
            "updateUserName": null
        };
        Model.prototype.setObj = function (obj) {  //设置对象属性值
            for (var key in obj) {
                this.dictData[key] = obj[key];
            }
        };
        Model.prototype.getObj = function () {   //获取对象所有属性，空值也获取
            return this.dictData;
        };
        Model.prototype.getSignificantObj = function () {
            var obj = {};
            for (var key in this.dictData) { //只获取有意义的属性
                if (this.dataCenter[key] || 0 == this.dataCenter[key]) {
                    obj[key] = this.dictData[key];
                }
            }
            return obj;
        };
        //获取初始化参数函数
        Model.prototype.getInitObj = function () {
            var initArr = [
                {
                    "title" : "数据主键",
                    "data" : "id",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "类型编码",
                    "data": "type" ,
                    "isNeeded" : true ,
                    "chkTip" : "请输入类型编码",
                    "validate" : com.validate.isEmpty
                },
                {
                    "title": "类型名称",
                    "data": "typeName",
                    "isNeeded" : true ,
                    "chkTip" : "请输入类型名称",
                    "validate" : com.validate.isEmpty
                },
                {
                    "title": "数据项编码",
                    "data": "dictCode",
                    "isNeeded" : true ,
                    "chkTip" : "请输入数据项编码",
                    "validate" : com.validate.isEmpty
                },
                {
                    "title": "数据项名称",
                    "data" : "dictName",
                    "isNeeded" : true ,
                    "chkTip" : "请输入数据项名称",
                    "validate" : com.validate.isEmpty
                },
                {
                    "title": "数据项值",
                    "data" : "dictValue",
                    "isNeeded" : true ,
                    "chkTip" : "请输入数据项值",
                    "validate" : com.validate.isEmpty
                },
                {
                    "title": "数据项层级id",
                    "data" : "level",
                    "visible" : false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "数据项层级",
                     "data": "levelName",
                    "isNotModalRender" : true ,
                    "isNotSearchRender" : true ,
                },
                {
                    "title": "父数据项id",
                    "data" : "pid",
                    "visible": false,
                    "type" : "selectTree",
                    "isNotNodeRender" :  true,
                    "isNotModalRender" : true
                },
                {
                    "title": "父数据项",
                     "data": "parentDictName",
                    "isNotModalRender" : true ,
                    "isNotSearchRender" : true
                },
                {
                    "title": "创建时间",
                    "data": "createTime",
                    "isNotModalRender" : true
                },
                {
                    "title": "创建人id",
                     "data": "createUserId",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true
                },
                {
                    "title": "创建人",
                    "data": "createUserName",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  false,
                    "isNotSearchRender" : true
                },
                {
                    "title": "父节点类型名称",
                     "data": "parentTypeName",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "说明",
                     "data": "remark",
                    "visible": false,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "更新时间",
                     "data": "updateTime",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "修改者Id",
                    "data": "updateUserId",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "更新人姓名",
                    "data": "updateUserName",
                    "visible": false,
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                },
                {
                    "title": "操作",
                    "isNotModalRender" : true,
                    "isNotNodeRender" :  true,
                    "isNotSearchRender" : true
                }
            ];
            return initArr ;
        };
        //设置table列数据操作
        Model.prototype.getAction = function() {
            return [
                {
                    "targets" : 10,
                    "render" : function(data, type, row) {
                        return u.timeFormat(data) ;
                    }
                },
                {
                    "targets" : 15,
                    "render" : function(data, type, row) {
                        return u.timeFormat(data);
                    }
                },
                {
                    "targets": 18,
                    "render": function (data, type, row) {
                        return '<div class="btn-group"><a class="btn-edit btn btn-info">编辑</a><a class="btn-delete btn btn-danger">删除</a></div>'
                    }
                }
            ];//end of return
        };
        Model.prototype.getCellStyle = function() {
            return function (row, data, index) {
                $('td', row).eq(0).css('text-align', 'center');
                $('td', row).eq(1).css('text-align', 'center');
                $('td', row).eq(2).css('text-align', 'center');
                $('td', row).eq(3).css('text-align', 'center');
                $('td', row).eq(4).css('text-align', 'center');
                $('td', row).eq(5).css('text-align', 'center');
                $('td', row).eq(6).css('text-align', 'center');
                $('td', row).eq(7).css('text-align', 'center');
                $('td', row).eq(8).css('text-align', 'center');
            };
        };
        Model.constructor = Model;
    }//end of Model
    return {
        Model : Model
    } ;
});