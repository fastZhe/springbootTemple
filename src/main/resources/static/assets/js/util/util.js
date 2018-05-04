/*
 *   通用函数模块
 *
 *
 */

define(["jquery", "toastr", "dataTable", "select2", "select2CN", "select2Tree", "ztree", "daterangepicker", "niceScroll", "bootstrap"], function ($, toastr, dataTable) {
    "use strict";
    /*定义私有方法：getJqueryObj
    *   通过传入的参数获取jquery的dom对象
    *
    * @param : container  string或者jquery对象
    * @return : jQueyr Object
    */
    var getJqueryObj = function( container ){
        if (typeof container === 'string' && container.indexOf('#') === -1) {
            container = $( '#'.concat(container) ) ;
        } else if( typeof container === 'string' && container.indexOf('#') === 0 ) {
            container = $( container );
        } else if( container instanceof $ ) {
            container = container ;     //传过来的是一个对象则什么都不做
        } else {
            this.msg('error', '传入的对象参数有误，请重试！', '获取对象函数');
            return false;
        }
        return container ;
    };


    return {
        msg: function (methodType, msg, title, opt) {
            if (!methodType) return alert("消息类型为必须参数！");
            var mType = ['error', 'warning', 'success', 'info'];
            if (mType.indexOf(methodType) < 0) return msg('error', "消息类型不存在，请更改正确类型名称", '提示信息');
            var _opt = { //default opt
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-right",
                "onclick": null,
                "showDuration": "200",
                "hideDuration": "800",
                "timeOut": "2000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
            if (!opt) opt = _opt;
            if (!title) title = false;
            if (!msg) msg = "这是错误提示！";
            toastr[methodType](msg, title, opt);
        }, //end of msg ;


        //时间格式化
        //传入参数time必须为合法时间，对于format格式没有限制，但必须有且仅有一个同类的时间替换符（大小写不限），具体如下：
        /*	年份：yyyy
         * 	月份：mm
         *  日子：dd
         *  小时：hh
         *  分钟：min
         *  秒 ：ss
         *  毫秒：mis
         *  ps：如果没有format参数，将返回默认时间格式时间代码
         */
        timeFormat: function (time, format) {
            if (!format) {
                format = "yyyy-mm-dd hh:min:ss";
            } else {
                format = format.toLowerCase();
            }
            if ( '-' === time || !time ) {
                return time ;
            }

            var dateObj = function (str) {
                var time = {};
                var obj = new Date(str);
                time.year = obj.getFullYear(); //年
                time.month = obj.getMonth() + 1; //月
                time.day = obj.getDay(); //星期几
                time.date = obj.getDate(); //几号
                time.hour = obj.getHours(); //小时:24制
                time.minutes = obj.getMinutes(); //分钟
                time.seconds = obj.getSeconds(); //秒
                time.milliseconds = obj.getMilliseconds(); //毫秒
                switch (time.day) { //转换中文
                    case 1:
                        time.day = '星期一';
                        break;
                    case 2:
                        time.day = '星期二';
                        break;
                    case 3:
                        time.day = '星期三';
                        break;
                    case 4:
                        time.day = '星期四';
                        break;
                    case 5:
                        time.day = '星期五';
                        break;
                    case 6:
                        time.day = '星期六';
                        break;
                    case 7:
                        time.day = '星期日';
                        break;
                }
                return time;
            };
            if (!time) {
                time = new Date();
            }
            var o = dateObj(time);
            dateObj = null;
            return format.replace('yyyy', o.year)
                .replace('mm', o.month >= 10 ? o.month : '0' + o.month)
                .replace('dd', o.date >= 10 ? o.date : '0' + o.date)
                .replace('hh', o.hour >= 10 ? o.hour : '0' + o.hour)
                .replace('min', o.minutes >= 10 ? o.minutes : '0' + o.minutes)
                .replace('ss', o.seconds >= 10 ? o.seconds : '0' + o.seconds)
                .replace('mis', o.milliseconds >= 100 ? o.milliseconds : (o.milliseconds >= 10 ? '0' + o.milliseconds : '00' + o.milliseconds))
                .replace('chidate', o.day);
        }, //end of timeFormat

        /*
        对DataTables进行封装
            新增了分页查询功能，具体格式如下：
            后台返回JSON格式参考tableData.txt文件
        */
        createTable: function (tableId, column, rows, actionDef, isExported, sortDef, cellStyle, opt) {
            var dataSettings = {
                "aLengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
                "bStateSave": true,
                "bAutoWidth": false,
                "sWidth" : "auto" ,
                "bProcessing": true,
                "bScrollCollapse" : true,
                "oClasses": {
                    "sFilterInput": "searchInput"
                },
                "language": {
                    "sLengthMenu": "每页显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
                    "sInfoEmpty": "第 0 至 0 项，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sSearch": "表格内搜索",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sProcessing": "正在处理...",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                },
                "data": rows,
                "columns": column,
                "pagingType": "full_numbers"
            };
            if( opt ) {
                jQuery.extend( dataSettings, opt);
            }
            if (sortDef) {
                dataSettings.aaSorting = sortDef;
            }
            if (actionDef) {
                dataSettings.columnDefs = actionDef;
            }
            if (cellStyle) {
                dataSettings.createdRow = cellStyle;
            }
            var $table = jQuery('#' + tableId);

            for (var i in rows) { //将空对象赋值- ，防止框架报错
                for (var j in rows[i]) {
                    if (!rows[i][j] && rows[i][j] != 0) {
                        rows[i][j] = '-';
                    }
                }
            }
            if (isExported) { //是否导出
                require(['dataTableButton', 'jszip', 'pdfMake', 'vfs', 'h5Button'], function () {
                    dataSettings.dom = 'Bfrtip';
                    dataSettings.buttons = [
                        {
                            extend: 'copyHtml5',
                            text: '复制本页表格数据'
                        },
                        {
                            extend: 'excelHtml5',
                            text: '导出Excel'
                        },
                        {
                            extend: 'csvHtml5',
                            text: '导出CSV'
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '导出PDF'
                        }];
                });
            }
            $table.addClass('table table-hover');
            if ($.fn.dataTable.isDataTable('#' + tableId)) {
                $table.DataTable().clear();
                $table.DataTable().destroy();
            }
            return $table.DataTable(dataSettings).on('length.dt', function (e, setting, len) {
                setTimeout(function () {
                    $('body').niceScroll({
                        cursorcolor: "#424242",
                        autohidemode: 'hidden'
                    }).resize();
                });
            });
        }, //end of createTable 
        select2: function (container, data, _opt) {
            //check the container
            container = getJqueryObj( container );
            if( !container ){   //初始化失败则返回状态
                console.warn("select2初始化失败！");
                return false ;
            }
            //check the data
            /*
                data 格式为[{ id : '...',text: '...'},...]对象数组
            */
            var opt = _opt ? _opt : {};
            if (data) {
                for (var i in data) {
                    var obj = data[i];
                    if ((!obj.id && parseInt(obj.id) !== 0) || !obj.text) {
                        this.msg('error', 'select2输入参数有误，请核查!', 'select2初始化');
                        return false;
                    }
                }
                opt.data = data; //如果有数据，将数据绑定在opt中
            }
            //default params 
            var params = {
                multiple: false, //是否多选，false为单选
                placeholder: '请选择。。。',
                containerCss: { //bootstrap中z-index值最大为1070，将select设置此值，避免与bootstrap冲突
                    'z-index': 1109,
                    'height' : 34 
                },
                dropdownCss: {
                    'z-index': 1100,
                },
                language: 'zh-CN',
                dropdownAutoWidth: true, //下拉菜单自动调整宽度
            }; //end of params
            //params extend opt 
            if (opt) {
                params = $.extend(true, params, opt); //opt与params如果有相同属性，值以opt中为主
            }
            $( container ).on("select2:open", function (e) {

            });
            return $( container ).select2(params);
        }, //end of select2
        /*
        *   封装select2 ，在select2基础之上扩展，可以展示tree型数据
        *   @treeData : [ id : int , text : string, children : [ id : int , text : string, children : []...] ]
        *   @opt ： 同select2配置参数
        * */
        select2tree : function(container, treeData, _opt) {
            //check the container
            container = getJqueryObj( container );
            if( !container ){   //初始化失败则返回状态
                console.warn("select2初始化失败！");
                return false ;
            }
            //check the data
            /*
                data 格式为[{ id : '...',text: '...'},...]对象数组
            */
            var opt = _opt ? _opt : {};
            //default params
            var params = {
                multiple: false, //是否多选，false为单选
                placeholder: '请选择。。。',
                containerCss: { //bootstrap中z-index值最大为1070，将select设置此值，避免与bootstrap冲突
                    'z-index': 1109,
                    'height' : 34
                },
                dropdownCss: {
                    'z-index': 1100,
                },
                language: 'zh-CN',
                dropdownAutoWidth: true, //下拉菜单自动调整宽度
            }; //end of params
            //params extend opt
            if (opt) {
                params = $.extend(true, params, opt); //opt与params如果有相同属性，值以opt中为主
            }

            return container.select2tree(treeData, params);
        },

        ztree: function (container, treeData, opt) {

            var $ztree = getJqueryobj( container ) ;

            if (!treeData || !$ztree ) {
                this.msg('error', '输入目录数据有误！', 'ztree初始化');
                return false;
            }

            var setting = {
                edit: {
                    drag: {
                        autoExpandTrigger: true,
                        prev: function (treeId, nodes, targetNode) {
                            var pNode = targetNode.getParentNode();
                            if (pNode && pNode.dropInner === false) {
                                return false;
                            } else {
                                for (var i = 0, l = curDragNodes.length; i < l; i++) {
                                    var curPNode = curDragNodes[i].getParentNode();
                                    if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        }, //end of prev 
                        inner: function (treeId, nodes, targetNode) {
                            if (targetNode && targetNode.dropInner === false) {
                                return false;
                            } else {
                                for (var i = 0, l = curDragNodes.length; i < l; i++) {
                                    if (!targetNode && curDragNodes[i].dropRoot === false) {
                                        return false;
                                    } else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        }, // end of inner 
                        next: function (treeId, nodes, targetNode) {
                            var pNode = targetNode.getParentNode();
                            if (pNode && pNode.dropInner === false) {
                                return false;
                            } else {
                                for (var i = 0, l = curDragNodes.length; i < l; i++) {
                                    var curPNode = curDragNodes[i].getParentNode();
                                    if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        } //end of next
                    },
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                view: {
                    dblClickExpand: false,
                    showLine: false,
                    selectedMulti: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: ""
                    }
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("tree");
                        if (treeNode.isParent) {
                            zTree.expandNode(treeNode);
                            return false;
                        } else {
                            return true;
                        }
                    },
                    beforeDrag: beforeDrag,
                    beforeDrop: beforeDrop,
                    beforeDragOpen: beforeDragOpen,
                    onDrag: onDrag,
                    onDrop: onDrop,
                    onExpand: onExpand
                }
            }; // end of setting 
            // 自定义初始化参数
            if (opt) {
                setting = opt;
            }
            var className = "dark",
                curDragNodes, autoExpandNode;

            function beforeDrag(treeId, treeNodes) {
                className = (className === "dark" ? "" : "dark");
                for (var i = 0, l = treeNodes.length; i < l; i++) {
                    if (treeNodes[i].drag === false) {
                        curDragNodes = null;
                        return false;
                    } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
                        curDragNodes = null;
                        return false;
                    }
                }
                curDragNodes = treeNodes;
                return true;
            }

            function beforeDragOpen(treeId, treeNode) {
                autoExpandNode = treeNode;
                return true;
            }

            function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
                className = (className === "dark" ? "" : "dark");
                return true;
            }

            function onDrag(event, treeId, treeNodes) {
                className = (className === "dark" ? "" : "dark");
            }

            function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
                className = (className === "dark" ? "" : "dark");
            }

            function onExpand(event, treeId, treeNode) {
                if (treeNode === autoExpandNode) {
                    className = (className === "dark" ? "" : "dark");
                }
            }

            function setTrigger() {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.setting.edit.drag.autoExpandTrigger = $("#callbackTrigger").attr("checked");
            }
            return $.fn.zTree.init($ztree, setting, treeData);
        }, //end of ztree 
        'timePicker': function (id, isSinglePicker,_opt) {
            var opt = {
                startDate: new Date(),
                endDate: new Date(),
                locale:{
                    format: "YYYY-MM-DD HH:mm:ss", //设置显示格式
                    applyLabel: '确认',
                    cancelLabel: '取消',
                    fromLabel: '从',
                    toLabel: '到',
                    weekLabel: '周',
                    customRangeLabel: '选择时间段',
                    daysOfWeek:["日","一","二","三","四","五","六"],
                    monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
                },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: true,
                timePickerIncrement: 1,
                timePickerSeconds: true, //时间显示到秒
                timePicker24Hour: true,
                singleDatePicker: isSinglePicker,
                opens: 'center',
                //buttonClasses: ['btn btn-default'],
                //applyClass: 'btn-small btn-primary',
                //cancelClass: 'btn-small',
                range: {
                    "近期": ['2015-04-12 00:00:00',new Date()]
                }
            };
            if (_opt) {
                opt = _opt;
            }
            var pickerObj = getJqueryObj( id ) ;
            pickerObj.on('cancel.daterangepicker', function(ev, picker) {
                pickerObj.val('');
            });
            return pickerObj.daterangepicker(opt);
        }, //end of dateTimePicker
    };   //end of return
});