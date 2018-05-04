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
    function Model() { //实体管理
        this.dataCenter = {
            "id": null, //maxLength 10 number
            "name": null,   //字段名称
            "displayName": null,//界面显示名称
            "type": null,//字段类型
            "length": null,  //字段长度
            "decimalPlace":null,//小数位
            "isPk": null,  //是否是主键
            "isPkName":null,
            "isNullable": null, //是否为空
            "isNullableName":null,
            "properties": null,//
            "entityId": null,  //实体id
            "entityName": null,//实体名称
            "status": null,  //状态
            "statusName": null, //状态名称
            "remark": null,
            "createUserId":null,  //创建人id
            "updateUserId":null,  //修改人id
            "createUserName": null,
            "updateUserName": null,
            "createTime": null, //创建时间
            "updateTime": null,//更改时间

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
                    "title" : "主键",
                    "data" : "id",
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "名称",
                    "data" : "name",
                },
                {
                    "title" : "显示名",
                    "data" : "displayName",
                },
                {
                    "title" : "类型",
                    "data" : "type",
                },
                {
                    "title" : "长度",
                    "data" : "length",
                },
                {
                	"title" : "是否为主键ID",
                    "data" : "isPk",
                    "isNotNodeRender": true,
                },
                {
                    "title" : "是否为主键",
                    "data" : "isPkName",
                    "isNotSearchRender": true,

                },
                {
                	"title" : "是否为空ID",
                    "data" : "isNullable",
                    "isNotNodeRender": true,
                },
                {
                	"title" : "是否为空",
                    "data" : "isNullableName",
                    "isNotSearchRender": true,
                },
                {
                    "title" : "实体ID",
                    "data" : "entityId",
                    "isNotNodeRender": true,
                },
                {
                    "title" : "实体",
                    "data" : "entityName",
                    "isNotSearchRender": true,
                },
                {
                    "title" : "状态ID",
                    "data" : "status",
                    "isNotNodeRender": true,
                },
                {
                    "title" : "状态",
                    "data" : "statusName",
                    "isNotSearchRender": true,
                },

                {
                    "title" : "描述",
                    "data" : "remark",
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,

                },

                {
                    "title" : "创建人ID",
                    "data" : "createUserId",
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "创建人",
                    "data" : "createUserName",
                    "isNotNodeRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "修改人ID",
                    "data" : "updateUserId",
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "修改人",
                    "data" : "updateUserName",
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "创建日期",
                    "data" : "createTime",
                    "isNotModalRender": true
                },
                {
                    "title" : "修改日期",
                    "data" : "updateTime",
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                }
            ];
            return initArr ;
        };
        //设置table列数据操作
        Model.prototype.getAction = function() {
            return [
                {
                    "targets" : 18,
                    "render" : function(data, type, row) {
                        return u.timeFormat( data ) ;
                     }
                },
                {
                    "targets": [0,5,7,9,11,13,14,16,17,19],
                    "visible":false
                },
            ];//end of return
        };
        Model.prototype.getCellStyle = function() {
            return function (row, data, index) {
                for( let i = 0 ; i < 19 ; i++ ) {
                    $('td', row).eq(i).css('text-align', 'center');
                }
            };
        };
        Model.constructor = Model;
    }//end of Model
    return {
        Model : Model
    } ;
});