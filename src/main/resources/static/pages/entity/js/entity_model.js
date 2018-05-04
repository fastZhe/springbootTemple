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
    function Model() {
        //提交数据时使用
        this.entity = {
            "id": null, //maxLength 10 number
            "name": null,
            "displayName": null,
            "type":null,
            "serverId": null,//父级名称
            "serverName": null,//not null maxLenth 10 nubmer
            "bisId":null,
            "bisName":null,
            "status":null,
            "statusName":null,
            "remark":null,
            "createUserId": null,
            "createUserName": null,
            "updateUserId": null,
            "updateUserName": null,
            "createTime": null,//创建时间
            "updateTime": null//修改时间
        };
        Model.prototype.setObj = function (obj) {  //设置对象属性值
            for (let key in obj) {
                this.entity[key] = obj[key];
            }
        };
        Model.prototype.getObj = function () {   //获取对象所有属性，空值也获取
            return this.entity;
        };
        Model.prototype.getSignificantObj = function () {
            let obj = {};
            for (let key in this.entity) { //只获取有意义的属性
                if (this.entity[key] || 0 == this.entity[key]) {
                    obj[key] = this.entity[key];
                }
            }
            return obj;
        };
        //获取初始化参数函数
        Model.prototype.getInitObj = function (filter) {
            let initArr = [
                {
                    "title" : "ID",
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
                    "title" : "数据源ID",
                    "data" : "serverId",
                    "isNotNodeRender": true,
                },
                {
                    "title" : "数据源",
                    "data" : "serverName",
                    "isNotSearchRender": true,
                },
                {
                    "title" : "业务系统ID",
                    "data" : "bisId",
                    "isNotNodeRender": true,
                },
                {
                    "title" : "业务系统",
                    "data" : "bisName",
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
                    "title" : "系统描述",
                    "data" : "remark",
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                },
                {
                    "title" : "创建人ID",
                    "data" : "createUserId",
                    "isNotNodeRender": true,
                },
                {
                    "title" : "创建人",
                    "data" : "createUserName",
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "修改人ID",
                    "data" : "updateUserId",
                    "isNotNodeRender": true,
                    "isNotModalRender": true,
                    "isNotSearchRender": true,
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

            if( $.isArray(filter) && filter.length ) { //如果传入过滤数组，那么将initArr数据进行过滤，只获取filter中罗列的对象
                let newInitArr = [];
                filter = filter.map(function(obj){
                    if( typeof obj === 'string') {
                        return obj.toLowerCase();
                    }
                });
                filter.map(function( source ){
                    initArr.map(function( target ) {
                        if( source == target.data.toLowerCase() ) {
                            newInitArr.push( target ) ;
                        }
                    });
                });
                return newInitArr ;//局部重绘数组
            }

            return initArr ;
        };
        //设置table列数据操作
        Model.prototype.getAction = function() {
            return [
                {
                    "targets": 15,
                    "render": function (data, type, row) {
                        return u.timeFormat(data);
                    }
                },
                {
                    "targets": [0,4,6,8,10,11,13,14,16],
                    "visible":false
                }
            ];//end of return
        };
        Model.prototype.getCellStyle = function() {
            return function (row, data, index) {
                for( let i = 0 ; i < 16 ; i++ ) {
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