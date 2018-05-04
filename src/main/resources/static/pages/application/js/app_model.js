/*
*       返回的初始化参数数组(getInitObj方法)
*       参数说明：
*       title : table中展示的标题，此处为dataTable必须参数
*       data ： table中展示的数据，此处为dataTable必须参数
*       visible : table中需隐藏的列，此处为dataTable必须参数
*
*       url : 后台接口的对象，该对象中包含具体路径及请求方式
*       type : 页面中展示的形式：默认input，参数可选为：select，time，
*       validate : 校验规则，标准正则表达式（非字符串）或校验函数，
*       isNeeded : 该字段是否必填字段，boolean值，默认否
*       chkTip : 校验时提示的文字，说明该字段应该输入具体格式的值
*       isNotModalRender : 是否在模态框中绘制
*       isNotNodeRender :   是否在节点信息栏中绘制
*       isNotSearchRender : 是否在搜索信息栏中绘制
*
* */

define(['jquery', 'util', 'common'], function ($, u, com) {
    function Model() { //应用系统
        this.dataCenter = {
            "code": null,   //应用编码
            "contact": null,//联系人
            "createTime": null,//创建时间
            "createUserId": null,
            "createUserName": null,
            "dept": null,
            "enName": null,
            "id": null, //maxLength 10 number
            "level": null,
            "mobile": null,
            "parentName": null,//父级名称
            "phone": null,
            "pid": null,//not null maxLenth 10 nubmer
            "shortEnName": null,
            "shortZhName": null,
            "status": null,//系统状态
            "updateTime": null,
            "updateUserId": null,
            "updateUserName": null,
            "version": null,
            "zhName": null,//not null 中文
            "remark": null
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
        Model.prototype.getInitObj = function ( filter ) {
            var initArr = [
                {
                    "title" : "数据主键",
                     "data" : "id",
                    "visible": false,
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "系统编码",
                    "data" : "code",
                    "isNeeded" : true ,
                    "validate" : com.validate.isNumber,
                    "chkTip" : "只能输入纯数字"
                },
                {
                    "title" : "中文名称",
                    "data" : "zhName",
                    "isNeeded" : true,
                    "validate" : com.validate.isZh,
                    "chkTip" : "只能输入纯汉字"
                },
                {
                    "title" : "中文简称",
                    "data" : "shortZhName",
                    "isNeeded" : true,
                    "validate" : com.validate.isZh,
                    "chkTip" : "只能输入纯汉字"
                },
                {
                    "title" : "英文名称",
                    "data" : "enName",
                    "isNeeded" : true,
                    "validate" : com.validate.isEn,
                    "chkTip" : "只能输入纯字母"
                },
                {
                    "title" : "英文简称",
                    "data" : "shortEnName",
                    "isNeeded" : true,
                    "validate" : com.validate.isEn,
                    "chkTip" : "只能输入纯字母"
                },
                {
                    "title" : "系统描述",
                    "data" : "remark",
                    "type" : "textarea",
                    "visible" : false ,
                    "isNotNodeRender" : true ,
                    "isNotSearchRender" : true
                },
                {
                    "title" : "系统状态",
                    "data" : "status",
                    "type" : "select",
                    "children" : "status",
                    "visible" : false ,
                    "isNotNodeRender" : true
                },
                {
                    "title" : "联系人",
                    "data" : "contact",
                    "visible" : false ,
                    "isNotSearchRender" : true
                },
                {
                    "title" : "电话",
                    "data" : "phone",
                    "validate" : com.validate.cellphone,
                    "chkTip" : "只能输入有效电话号码",
                    "visible" : false ,
                    "isNotSearchRender" : true
                },
                {
                    "title" : "修改用户",
                    "data" : "updateUserName",
                    "visible" : false ,
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "修改日期",
                    "data" : "updateTime",
                    "visible" : false ,
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
                    "title" : "创建人ID",
                    "data" : "createUserId",
                    "visible": false,
                    "isNotNodeRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "创建人",
                    "data" : "createUserName",
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "部门",
                    "data" : "dept",
                    "visible" : false,
                    "isNotSearchRender": true,
                },
                {
                    "title" : "所属层级",
                    "data" : "level",
                    "visible" : false,
                    "isNotNodeRender": true,
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "手机号",
                    "data" : "mobile",
                    "validate" : com.validate.cellphone,
                    "chkTip" : "只能输入有效电话号码",
                    "visible": false,
                    "isNotSearchRender": true
                },
                {
                    "title" : "父节点",
                    "data" : "parentName",
                    "isNotSearchRender": true,
                    "isNotModalRender": true
                },
                {
                    "title" : "父节点",
                    "data" : "pid",
                    "visible": false,
                    "type" : "selectTree",
                    "isNotNodeRender": true
                },
                {
                    "title" : "系统版本",
                    "data" : "version",
                    "isNeeded" : true ,
                    "validate" : com.validate.isEmpty,
                    "chkTip" : "不能为空值！"
                },
                {
                    "title" : "操作",
                    "data" : "",
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
                    "targets": 2,
                    "render": function (data, type, row) {
                        return u.timeFormat(data);
                    }
                },
                {
                    "targets": 21,
                    "render": function (data, type, row) {
                        return '<div class="btn-group"><a class="btn-edit btn btn-info">编辑</a><a class="btn-delete btn btn-danger">删除</a></div>'
                    }
                }
            ];//end of return
        };
        Model.prototype.getCellStyle = function() {
            return function (row, data, index) {
                for( var i = 0 ; i < 22 ; i++ ) {
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