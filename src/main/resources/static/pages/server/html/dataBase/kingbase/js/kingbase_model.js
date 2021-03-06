/*
*       返回的初始化参数数组(getInitObj方法)
*       参数说明：
*       title : table中展示的标题，此处为dataTable必须参数
*       data ： table中展示的数据，此处为dataTable必须参数
*       visible : table中需隐藏的列，此处为dataTable必须参数
*
*       type : 页面中展示的形式：默认input，参数可选为：select，time，
*       validate : 校验规则，标准正则表达式（非字符串）或校验函数，
*       isNotModalRender : 是否在模态框中绘制
*       isNotNodeRender :   是否在节点信息栏中绘制
*       isNotSearchRender : 是否在搜索信息栏中绘制
*
* */

define(['jquery', 'util', 'common'], function ($, u, com) {
    function Model() { //数据数据源model
        this.kingbaseData = {
        	"useConfig" : null,//不使用配置文件
        	"ip"    : null ,//ip
            "port"  : null ,//端口
            "db"    : null ,//服务器名称
            "needAuth" : null, // 是否需要验证
            "authType" : null,//认证类型
            "username" : null,//用户名
            "password" : null//密码
        };
        Model.prototype.setObj = function (obj) {  //设置对象属性值
            for (var key in obj) {
                this.kingbaseData[key] = obj[key];
            }
        };
        Model.prototype.getObj = function () {   //获取对象所有属性，空值也获取
            return this.kingbaseData;
        };
        Model.prototype.getSignificantObj = function () {
            var obj = {};
            for (var key in this.kingbaseData) { //只获取有意义的属性
                if (this.kingbaseData[key] || 0 == this.kingbaseData[key]) {
                    obj[key] = this.kingbaseData[key];
                }
            }
            return obj;
        };
        //获取初始化参数函数
        Model.prototype.getInitObj = function (  filter ) {
            var initArr = [
                {
                    "title" : "数据库",
                    "data"  : "db",
                    "isNeeded" : true ,
                    "validate" : function( val ){
                        if( val.trim() ) {
                            return true ;
                        } else {
                            return false ;
                        }
                    } , //不能为空
                    "chkTip" : "该字段不能为空！"
                },
                {
                    "title" : "IP",
                    "data"  : "ip",
                    "isNeeded" : true ,
                    "validate" : com.validate.isIP ,
                    "chkTip" : "只能输入ip格式，如：xxx.xxx.xxx.xxx"
                },
                {
                    "title" : "密码",
                    "data"  : "password",
                    "isNeeded" : true,
                    "validate" : function(value){ if( value == '' ) {
                        return false ;
                    }else {
                        return true ;
                    }} , //不能为空
                    "chkTip" : "密码不能为空！"
                },
                {
                    "title" : "端口",
                    "data"  : "port",
                    "isNeeded" : true ,
                    "validate" : com.validate.isNumber , //不能为空
                    "chkTip" : "端口为纯数字！"
                },
                {
                    "title" : "用户名",
                    "data"  : "username",
                    "isNeeded" : true ,
                    "validate" : ( val ) => { return val.trim() == "" ? false : true; } , //不能为空
                    "chkTip" : "用户名不能为空！"
                },
                {
                    "title" : "是否需要验证",
                    "data" : "needAuth",
                    "type"  : "select",
                    "isNotModalRender":true
                },
                {
                    "title" : "是否配置文件",
                    "data" : "useConfig",
                    "type" : "select",
                    "isNotModalRender":true
                },
                {
                    "title" : "认证类型",
                    "data" : "authType",
                    "type" : "select",
                    "isNotModalRender":true
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
        Model.prototype.getFinalObj = function( obj ) {
        	obj.useConfig = "1010702";//默认不是用配置文件
            obj.needAuth = "1010401";//默认为认证
            obj.authType = "1010801";//默认用户名和密码
            return {
                "ip" : obj.ip ,
                "port" : obj.port ,
                "db" : obj.db ,
                "properties" : JSON.stringify({
                        "authInfo" : {
                            "authType" : obj.authType,
                            "user" : obj.username,
                            "password" : obj.password
                        }
                })
            };
        };

        Model.constructor = Model;
    }//end of Model
    return {
        Model : Model
    } ;
});