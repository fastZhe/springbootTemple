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
            "id" : null, //数据主键
            "bisId" : null, //应用系统id
            "bisName" : null,  //应用系统名称
            "createTime" : null, //创建时间
            "createUserId" : null, //创建人id
            "createUserName" : null, //创建人姓名
            "db" : null, //数据库
            "dcId" : null, //数据中心id
            "dcName" : null, //数据中心名称
            "displayName" : null, //业务名称
            "dsType" : null, //数据源类型
            "dsTypeName" : null, //数据源类型名称
            "envType" : null, //环境类型
            "envTypeName" : null, //环境类型名称
            "host" : null, //主机
            "ip" : null, //ip
            "level" : null, //层级
            "name" : null, //数据数据源名称
            "nodeType" : null, //节点类型
            "nodeTypeName" : null, //节点类型名称
            "password" : null, //密码
            "pid" : null, //父节点id
            "port" : null,  //端口
            "properties" : null, //存放扩展属性，json字符串
            "remark" : null, //备注
            "schema" : null, //模式名称
            "status" : null, //状态
            "statusName":null,
            "updateTime" : null, //最后更新时间
            "updateUserId" : null, //最后更新人id
            "updateUserName":null,//更新人姓名
            "username" : null, //用户名
            "dictCode" : null,  //数据字典中各个数据的唯一标识

            //以下放入properties里的key
            "mode" : null, //oracle独有的模式
            'auth': null,  //是否权限认证,如果需要认证，显示用户名和密码properties
            'acrossDomain': null,//是否跨域，如果是，显示容器IP， properties
            'containerIp': null,// 容器IP properties
            'zookeeperIp': null,  //用来展示zookeeper的多个ip,之间用逗号隔开 properties
            'zookeeperPort': null,  //properties
            'sid': null,  //sid的值,和serviceName二选一
            'serviceName': null,  //sid的值,和serviceName二选一
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
                    "title" : "数据主键",
                    "data" : "id",
                    "visible": false,
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
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
                    "title" : "业务系统",
                    "data"  : "bisName",
                    "isNotNodeRender": false,
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "创建时间",
                    "data"  : "createTime",
                    "type" : "time",
                    "isNotNodeRender": false,
                    "isNotSearRender": false,
                    "isNotModalRender": true
                },
                {
                    "title" : "创建人ID",
                    "data"  : "createUserId",
                    "visible": false,
                    "isNotNodeRender": true,
                    "isNotSearRender": false,
                    "isNotModalRender": true
                },
                {
                    "title" : "创建人",
                    "data"  : "createUserName",
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
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
                    "title" : "数据中心ID",
                    "data"  : "dcId",
                    "type"  : "selectTree",
                    "isNotNodeRender": true
                },
                {
                    "title" : "数据中心",
                    "data"  : "dcName",
                    "isNotSearRender": true,
                    "isNotModalRender": true
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
                    "title" : "父数据源",
                    "data"  : "parent",
                    "visible": false,
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false,
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
                    "title" : "源类型",
                    "data"  : "dsTypeName",
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "环境",
                    "data"  : "envType",
                    "visible" : false,
                    "isNotNodeRender": true
                },
                {
                    "title" : "环境",
                    "data"  : "envTypeName",
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "主机",
                    "data"  : "host",
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false
                },
                {
                    "title" : "IP",
                    "data"  : "ip",
                    "isNeeded" : true ,
                    "validate" : com.validate.isIP ,
                    "chkTip" : "只能输入ip格式，如：xxx.xxx.xxx.xxx"
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
                    "title" : "密码",
                    "data"  : "password",
                    "validate" : function(value){ if( value == '' ) {
                    	return false ;
                    }else {
                    	return true ;
                    }} , //不能为空
                    "chkTip" : "密码不能为空！",
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false
                },
                {
                    "title" : "父节点ID",
                    "data"  : "pid",
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false
                },
                {
                    "title" : "端口",
                    "data"  : "port",
                    "isNeeded" : true ,
                    "validate" : com.validate.isNumber , //不能为空
                    "chkTip" : "端口为纯数字！"
                },
                {
                    "title" : "扩展属性",
                    "data"  : "properties",//
                    "visible": false,
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": true
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
                    "title" : "状态ID",
                    "data"  : "status",
                    "visible" : false ,
                    "isNeeded" : true,
                    "isNotNodeRender": true
                },
                {
                    "title" : "状态",
                    "data"  : "statusName",
                    "isNotNodeRender": false,
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "更新时间",
                    "data"  : "updateTime",
                    "visible" : false ,
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "更新人ID",
                    "data"  : "updateUserId",
                    "visible": false ,
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "更新人",
                    "data" : "updateUserName",
                    "visible": false ,
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "用户名",
                    "data"  : "username",
                    "visible": false ,
                    "validate" : function(value){ if( value == '' ) {
                    	return false ;
                    }else {
                    	return true ;
                    }} , //不能为空
                    "chkTip" : "用户名不能为空！",
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false
                },
                {
                    "title" : "是否权限认证",
                    "data"  : "auth",
                    "type"  : "select",
                    "children" : [
                        {
                            "id" : "true",
                            "text":"是"
                        },
                        {
                            "id" : "false",
                            "text" : "否"
                        }
                    ],
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": false
                },
                {
                    "title" : "是否跨域",
                    "data"  : "acrossDomain",//是否跨域，如果是，显示容器IP， properties
                    "type": "select",
                    "children" : [
                        {
                            "id" : "true",
                            "text" : "是"
                        },
                        {
                            "id" : "false",
                            "text" : "否"
                        }
                    ]
                },
                {
                    "title" : "代理IP",
                    "data"  : "containerIp",
                    "visible" : false ,
                    "isNeeded" : true ,
                    "validate" : com.validate.isIP , //不能为空
                    "chkTip" : "容器IP不能为空！"
                },
                {
                    "title" : "zookeeperIp",//用来展示zookeeper的多个ip,之间用逗号隔开 properties
                    "data"  : "zookeeperIp",
                    "visible" : false ,
                    "isNeeded" : true ,
                    "validate" : com.validate.isIP , //不能为空
                    "chkTip" : "zookeeperIp不能为空！"
                },
                {
                    "title" : "zookeeper端口",
                    "data"  : "zookeeperPort",
                    "isNeeded" : true ,
                    "visible" : false ,
                    "validate" : com.validate.isNumber , //不能为空
                    "chkTip" : "zookeeperPort不能为空！"
                },
                {
                    "title" : "模式",
                    "data"  : "mode",
                    "visible" : false
                },
                {
                    "title" : "操作",
                    "data":"opt",
                    "isNotNodeRender": true,
                    "isNotSearRender": true,
                    "isNotModalRender": true
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
        //设置table列数据操作
        Model.prototype.getAction = function() {
           return [
               {
                   "targets" : [0],
                   "visible" : false
               },
               {
                   "targets" : [12],
                   "render"  : function(data, type, row) {
                       return u.timeFormat( data ) ;
                   }
               },
               {
                   "targets": 13,
                   "render": function (data, type, row) {
                       return '<div class="btn-group"><a class="btn-edit btn btn-info">编辑</a><a class="btn-delete btn btn-danger">删除</a></div>'
                   }
               }
           ];
        };
        Model.prototype.getCellStyle = function() {
           return function(row, data, index) {
               for( var i = 0 ; i < 13 ; i++ ) {
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