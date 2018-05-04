/*
*       返回的初始化参数数组(getInitObj方法)
*       参数说明：
*       title : table中展示的标题，此处为dataTable必须参数
*       data ： table中展示的数据，此处为dataTable必须参数
*       visible : table中需隐藏的列，此处为dataTable必须参数
*
*       isOneRow : 该字段是否独占一行，默认false
*       type : 页面中展示的形式：默认input，参数可选为：select，time，
*       validate : 校验规则，标准正则表达式（非字符串）或校验函数，
*       isNotModalRender : 是否在模态框中绘制
*       isNotNodeRender :   是否在节点信息栏中绘制
*       isNotSearchRender : 是否在搜索信息栏中绘制
*
* */

define(['jquery', 'util', 'common'], function ($, u, com) {
    function Model() { //数据数据源model
        this.dataCenter = {
            "name" : null, //数据数据源名称
            "displayName" : null, //业务名称
            "dcId" : null, //数据中心id
            "bisId" : null, //应用系统id
            "envType" : null, //环境类型
            "status" : null,//状态
            "remark" : null, //备注
            "dsType" : null, //数据源类型
            'acrossDomain': null,//是否跨域，如果是，显示容器IP， properties
            'containerIp': null// 容器IP properties
        };
        Model.prototype.setObj = function (obj) {  //设置对象属性值
            for (var key in obj) {
                this.dataCenter[key] = obj[key];
            }
        };
        Model.prototype.getObj = function () {   //获取对象所有属性，空值也获取
            return this.dataCenter;
        };
        Model.prototype.getSignificantObj = function () {
            var obj = {};
            for (var key in this.dataCenter) { //只获取有意义的属性
                if (this.dataCenter[key] || 0 == this.dataCenter[key]) {
                    obj[key] = this.dataCenter[key];
                }
            }
            return obj;
        };
        //获取初始化参数函数
        Model.prototype.getInitObj = function (  filter ) {
            var initArr = [
                {
                    "title" : "业务系统ID",
                    "data"  : "bisId",
                    "visible": false,
                    "isNeeded" : true ,
                    "type"  : "selectTree",
                    "isNotNodeRender": true,
                    "isNotSearRender": false,
                    "isNotModalRender": false
                },
                {
                    "title" : "数据中心ID",
                    "data"  : "dcId",
                    "type"  : "selectTree",
                    "isNotNodeRender": true
                },
                {
                    "title" : "显示名",
                    "data"  : "displayName",
                    "isNeeded" : true ,
                    "validate" : function(value){ if( value == '' ) {
                        return false ;
                    }else {
                        return true ;
                    }} , //不能为空
                    "chkTip" : "简称不能为空！"
                },
                {
                    "title" : "数据源类型",
                    "data"  : "dsType",
                    "visible": false,
                    "type" : "selectTree",
                    "isOneRow" : true ,
                    "isNotNodeRender": true
                },
                {
                    "title" : "环境",
                    "data"  : "envType",
                    "visible" : false,
                    "type" : "select",
                    "isNotNodeRender": true
                },
                {
                    "title" : "状态",
                    "data" : "status",
                    "type" : "select"
                },
                {
                    "title" : "源名称",
                    "data"  : "name",
                    "isNeeded" : true,
                    "validate" : function(value){ if( value == '' ) {
                        return false ;
                    }else {
                        return true ;
                    }} , //不能为空
                    "chkTip" : "数据源名称不能为空！"
                },
                {
                    "title" : "备注",
                    "data"  : "remark",
                    "type"  : "textarea",
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false
                },
                {
                    "title" : "是否跨域",
                    "data"  : "acrossDomain",//是否跨域，如果是，显示容器IP， properties
                    "type": "select"
                },
                {
                    "title" : "代理IP",
                    "data"  : "containerIp",
                    "visible" : false ,
                    "isNeeded" : true ,
                    "validate" : com.validate.isIP , //不能为空
                    "chkTip" : "容器IP不能为空！"
                }
            ];

            if( $.isArray(filter) && filter.length ) { //如果传入过滤数组，那么将initArr数据进行过滤，只获取filter中罗列的对象
                var newInitArr = [];
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

        Model.constructor = Model;
    }//end of Model
    return {
        Model : Model
    } ;
});