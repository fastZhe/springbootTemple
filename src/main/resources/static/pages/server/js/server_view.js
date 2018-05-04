define(['jquery', 'util', 'common', '../../data_center/js/data_center_model', './server_model', '../../entity/js/entity_model', './server_init', 'createTree'], function ($, u, com, data_center_model, model, entity_model, init, tree) {
    "use strict";
    var dataCenterModel = new data_center_model.Model();
    var _model = new model.Model();
    var entityModel = new entity_model.Model();
    var columnArray = _model.getInitObj(Object.keys(_model.getObj()));
    var actionDef = _model.getAction();
    //设置列文本对齐位置
    var cellStyle = _model.getCellStyle();
    var allData = [];
    init = init.getType ;
    com.ajax(   //动态获取编辑模态框中的内容
        com.urlMapper.DataServerController.findAdditionOptions.url,
        com.urlMapper.DataServerController.findAdditionOptions.type,
        null,
        function (e) {
        },
        false
    ).done(
        function (e) {
            allData = e.data;
        }
    ).fail(
        function (e) {
            console.warn(e);
        }
    );

    tree.createTree('', com.urlMapper.DataServerController.selectAllDataServer);
    com.searchCondition('nodeCondition', columnArray, false, '当前数据中心', 'node', '', ["add", "minus", "edit", 'config', "collapse"]);
    com.searchCondition('searchCondition', columnArray, false, '查询条件', 'search', '', '', ["search", "reset"]);
    $('a').attr('ondragstart', 'return false');//阻止拖拽产生异常
    initModal(allData);

    var _tree = [];
    var valArray = $('#main-menu a');
    Array.prototype.shift.call(valArray);//去掉第一个元素
    Array.prototype.shift.call(valArray);//去掉根节点
    valArray.each(function (i, e) {
        var _o = JSON.parse($(e).val());
        if ('ip' in _o) { //table中只显示服务器信息，不显示数据中心信息
            _tree.push(_o);
        }
    });
    columnArray = _model.getInitObj([
        'id',
        'name',
        'displayName',
        'dsTypeName',
        'ip',
        'port',
        'db',
        'envTypeName',
        'statusName',
        'dcName',
        'bisName',
        'createUserName',
        'createTime',
        'opt'
    ]);
    u.createTable('eMetaDc', columnArray, _tree, actionDef, false, false, cellStyle); //默认显示全部
    $(document).on('click', '.sidebar-menu-inner #main-menu li:eq(1)', function (e) {
        var _obj = [];
        var self = {};
        if ('A' == e.target.nodeName) {
            var $ele = $(e.target);
            if ($ele.val()) {
                if ('全部' !== $ele.find('span').text()) {
                    self = JSON.parse($ele.val());
                    //隐藏编辑，删除按钮
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil').parent('a').show();
                } else {
                    //清空node中数据
                    com.cleanCondition('nodeCondition');
                    //显示编辑，删除按钮
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil').parent('a').hide();
                }

                $('#nodeCondition').val(JSON.stringify(self));
                var childrenArr = $ele.parent().children().find('a');
                childrenArr.each(function (idx, ele) {
                    var currentObj = $(ele);
                    var currentVal = JSON.parse(currentObj.val());
                    if ('ip' in currentVal) {
                        _obj.push(currentVal);
                    }
                });

                var obj = JSON.parse($ele.val());
                if (obj.level == 2) {
                    var params = {
                        serverId: obj.id
                    };
                    setText(self);
                    com.setCondition('nodeCondition', self);
                    com.ajax(
                        com.urlMapper.EntityController.searchEntity.url,
                        com.urlMapper.EntityController.searchEntity.type,
                        params,
                        function () {
                        }
                    )
                        .done(function (e) {
                            var data = e.data;
                            if (data.length) {
                                u.createTable('eEntity', entityModel.getInitObj(), data, entityModel.getAction(), false, false, false);
                            } else {
                                u.createTable('eEntity', entityModel.getInitObj(), [], entityModel.getAction(), false, false, false);
                            }
                            $('#eMetaDc_wrapper').hide();
                            $('#eEntity_wrapper').show();
                        });
                    return;
                } else {
                    setText(self);
                    com.setCondition('nodeCondition', self);
                }
                $('#eMetaDc_wrapper').show();
                $('#eEntity_wrapper').hide();
                if (_obj.length) {
                    u.createTable('eMetaDc', columnArray, _obj, actionDef, false, false, cellStyle);
                } else {
                    u.createTable('eMetaDc', columnArray, [], actionDef, false, false, cellStyle);
                }
                $('#eMetaDc').parents('.row').last().fadeIn();
            }
        }
        if ('SPAN' == e.target.nodeName || 'I' == e.target.nodeName) {
            var $ele = $(e.target);
            $ele = $ele.parent('a');
            if (-1 !== e.target.className.indexOf('search')) {
                return false;
            }
            if ($ele.val()) {
                if ('全部' !== $ele.find('span').text()) {
                    self = JSON.parse($ele.val());
                    //隐藏编辑，删除按钮
                    com.cleanCondition('nodeCondition');
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil').parent('a').show();
                } else {
                    //清空node中数据
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil').parent('a').hide();
                }

                $('#nodeCondition').val(JSON.stringify(self));
                var childrenArr = $ele.parent().children().find('a');
                childrenArr.each(function (idx, ele) {
                    var currentObj = $(ele);
                    var currentVal = JSON.parse(currentObj.val());
                    if ('ip' in currentVal) {
                        _obj.push(currentVal);
                    }
                });

                var obj = JSON.parse($ele.val());
                if (obj.level == 2) {
                    var params = {
                        serverId: obj.id
                    };
                    setText(self);
                    com.setCondition('nodeCondition', self);
                    com.ajax(
                        com.urlMapper.EntityController.searchEntity.url,
                        com.urlMapper.EntityController.searchEntity.type,
                        params,
                        function () {
                        }
                    )
                        .done(function (e) {
                            var data = e.data;
                            if (data.length) {
                                u.createTable('eMetaDc', entityModel.getInitObj(), data, entityModel.getAction(), false, false, false);
                            } else {
                                u.createTable('eMetaDc', entityModel.getInitObj(), [], entityModel.getAction(), false, false, false);
                            }
                            $('#eMetaDc_wrapper').hide();
                            $('#eEntity_wrapper').show();
                        });

                    return;
                } else {
                    setText(self);
                    com.setCondition('nodeCondition', self);
                }
            }
            $('#eMetaDc_wrapper').show();
            $('#eEntity_wrapper').hide();
            if (_obj.length) {
                u.createTable('eMetaDc', columnArray, _obj, actionDef, false, false, cellStyle);
            } else {
                u.createTable('eMetaDc', columnArray, [], actionDef, false, false, cellStyle);
            }
        }
        if ('INPUT' == e.target.nodeName || $(e.target).find('input').length) {
            return false;
        }
    }).on('change keyup blur', '.sidebar-menu-inner #main-menu', function (e) {
        if (e.target.nodeName == 'INPUT') {
            if ('' === this.value) {
                u.createTable('eMetaDc', columnArray, _tree, actionDef, false, false, cellStyle); //当搜索框中没有数据时，table中显示所有数据
            }
        }
    });

    //设置panel标题方法
    function setText(obj) {
        var columnArray = [];
        var nodeTitle = '';
        var tableTitle = '数据源列表';
        var nodeText = '全部';
        var tableText = '';
        var $tableTitle = $('#tableCondition .panel-title');
        $('#nodeCondition .panel').remove();
        var opt = ["add", 'config', 'collapse'];

        switch (~~obj.level) {
            case 0 :
                nodeTitle = '';
                tableTitle = '数据源列表';
                nodeText = '全部';
                columnArray = _model.getInitObj(Object.keys(obj));
                break;//全部
            case 1 :
                nodeTitle = '当前数据中心 : ';
                tableTitle = '数据源列表';
                nodeText = obj.name || obj.displayName || '全部';
                tableText = '';
                columnArray = dataCenterModel.getInitObj();
                break;//一级目录
            case 2 :
                nodeTitle = '当前数据源 : ';
                tableTitle = '实体列表';
                nodeText = obj.name || obj.displayName || '全部';
                opt = ["add", "minus", "edit", 'config', 'collapse'];
                columnArray = _model.getInitObj(Object.keys(obj));
                break;//二级目录
        }//end of switch
        com.searchCondition('nodeCondition', columnArray, false, nodeTitle.concat(nodeText), 'node', '', opt);
        if ('全部' == nodeText) {
            $('#nodeCondition .entypo-down-open').parent().hide();
            if ('block' === $('#nodeCondition .panel-body').css('display')) {	//如果是展开，则隐藏
                $('#nodeCondition .panel-body').hide();
            }
            if ('block' === $('#searchCondition .panel-body').css('display')) {
                $('#nodeCondition .entypo-cog').click();
            }
        } else {
            $('#nodeCondition .entypo-down-open').parent().show();
            $('#nodeCondition .panel-body').show();
        }
        $tableTitle.text(tableTitle.concat(tableText));
        //将信息框设置只读状态
        $('#nodeCondition input').each(function (idx, ele) {
            $(this).attr('disabled', 'disabled');
        });
    }//end of setText

    //----模太框方法  -------start--------
        function confirmModal() {
            var $modal = $('<div class="modal fade" id="modal-confirm">'),
                $modalDialog = $('<div class="modal-dialog">'),
                $modalContent = $('<div class="modal-content">'),
                $modalHeader = $('<div class="modal-header">'),
                $modalBody = $('<div class="modal-body">').html('删除数据将不能恢复,确认要将选中的数据删除吗？'),
                $modalFooter = $('<div class="modal-footer">'),
                $closeBtn = $('<button class="close">').attr('type', 'button').attr('data-dismiss', 'modal').attr('aria-hidden', true).text('x'),
                $modalH4 = $('<h4 class="modal-title"><span class="entypo-doc-text">删除</span></h4>'),
                $cancelBtn = $('<button class="btn btn-default btn-cancel">').attr('type', 'button').attr('data-dismiss', 'modal').text('取消'),
                $deleteBtn = $('<button class="btn btn-danger delete">').attr('type', 'button').attr('data-dismiss', 'modal').text('删除');
            $('body').append($modal);
            $modal.append($modalDialog);
            $modalDialog.append($modalContent);
            $modalContent.append($modalHeader);
            $modalContent.append($modalBody);
            $modalContent.append($modalFooter);
            $modalHeader.append($closeBtn);
            $modalHeader.append($modalH4);
            $modalFooter.append($cancelBtn);
            $modalFooter.append($deleteBtn);
            $('#modal-confirm .delete').on('click', function (e) {
                var deleteData = $(this).data('delete'),
                    url = com.urlMapper.DataServerController.deleteDataServerById.url,
                    type = com.urlMapper.DataServerController.deleteDataServerById.type;

                function sucFn(e) {
                    if ('0' == e.code) {
                        u.msg('success', '操作成功！', '数据操作');
                        tree.createTree();
                    } else {
                        u.msg('error', e.msg, '数据操作');
                    }
                }

                com.ajax(url, type, deleteData, sucFn);
            });
            $('#modal-confirm .cancel').on('click', function (e) {
                $('#modal-confrim').modal('hide');
            });
        }   //end of confirmModal
        confirmModal();

        $('#_search_search').on('click', function (e) {
            e.preventDefault();
            //执行查询操作
            var arr = com.getCondition('searchCondition');
            //对时间字段做特殊处理
            var cTime, uTime;
            if (arr.createTime) {
                cTime = arr.createTime.split(' - ');
                delete arr.createTime;
                arr['minCreateTime'] = cTime[0];
                arr['maxCreateTime'] = cTime[1];
            }
            if (arr.updateTime) {
                uTime = arr.updateTime.split(' - ');
                delete arr.updateTime;
                arr['minUpdateTime'] = uTime[0];
                arr['maxUpdateTime'] = uTime[1];
            }
            com.post(
                com.urlMapper.DataServerController.searchDataServer.url, arr, function () {
                })
                .done(function (e) {
                    var data = e.data;
                    $('#eEntity_wrapper').hide();
                    u.createTable('eMetaDc', columnArray, data, actionDef, false, false, cellStyle);
                })
                .fail(function (e) {
                    u.msg('error', '获取查询数据失败!', '获取查询数据');
                });
        }); //end of _search_search
            //重置即清空搜索框数据
        $('#_search_reset').on('click', function (e) {
            e.preventDefault();
            var $ele = $('#searchCondition input');
            $ele.each(function (idx, ele) {
                var o = $(ele);
                o.val('');
            });
        });

        $(document)
            .on(
                'click',
                '#modal .btn-add',
                function (e) {
                    var url , type ;
                    var $btn = $(this) ;
                    var $modal = $('#modal');
                    var array = com.getCondition('modal');
                    var stepOne = $modal.data('stepOne');
                    var stepTwo = $modal.data('stepTwo');
                    _model.setObj(stepOne);
                    _model.setObj( array );
                    array =  _model.getSignificantObj( _model.getObj() );
                    $.extend(array, stepTwo);
                    if ($.isEmptyObject(array)) {
                        $btn.removeAttr('disabled');
                        return false;
                    }
                    if (array.id) {
                        url = com.urlMapper.DataServerController.updateDataServer.url;
                        type = com.urlMapper.DataServerController.updateDataServer.type;
                    } else {
                        url = com.urlMapper.DataServerController.saveDataServer.url;
                        type = com.urlMapper.DataServerController.saveDataServer.type;
                    }

                    //TODO 空函数
                    function sucFn() {

                    }

                    com.ajax(url, type, array, sucFn).done(function (e) {
                        if (0 == (e.code + '')) {
                            u.msg('success', e.msg, '数据操作');
                            $('#modal').modal('hide');
                            tree.createTree('', com.urlMapper.DataServerController.selectAllDataServer);
                        } else {
                            u.msg('error', e.msg, '数据操作');
                        }
                    }).fail(function (e, r, m) {
                        u.msg('error', e.msg, '数据操作');
                        if (e.status == '403') {
                            top.location.reload();
                        }

                    });
                });
        $('#eMetaDc').on(
            'click',
            '.btn-edit',
            function (e) {
                var dt = $('#eMetaDc').DataTable(),
                    row = $(this).closest('tr'),
                    changeData = dt.row(row).data();
                $('#modal .btn-add').data('change', changeData);
                com.setCondition('modal', changeData);
                $('#modal').modal('show');
                //level 不能改

            })
            .on(
                'click',
                '.btn-delete',
                function (e) {
                    var dt = $('#eMetaDc').DataTable(),
                        row = $(this).closest('tr'),
                        deleteData = dt.row(row).data();
                    $('#modal-confirm').modal('show');
                    $('#modal-confirm .delete').data('delete',
                        deleteData);
                });

        $('#_node_createTime').val('');
        $('#_node_updateTime').val('');

        $('body').niceScroll({
            cursorcolor: "#424242",
            autohidemode: true
        }).resize();
        //初始化页面滚动条
        $(document).on('change', function () {
            $('body').niceScroll({
                cursorcolor: "#424242",
                autohidemode: true
            }).resize();
        });
        //init modal
        function initModal(all) {
            if ($.isEmptyObject(all) || $.isEmptyArray(all)) {
                return false;
            }
            var dsTypes = all.dsTypes;
            var envTypes = all.envTypes;
            var bisId = all.bussinessTrees.map(function (obj) {
                obj.text = obj.name || obj.zhName;

                return obj;
            });
            var acrossDomain = all.acrossDomains ;
            var dcId = all.dataCenterTrees.map(function (obj) {
                obj.text = obj.name;
                return obj;
            });
            var authTypes = all.authTypes ;
            var needAuth = all.needAuths ;
            var modes = all.modes ;
            var useConfigs = all.useConfigs ;
            var statuses = all.statuses ;
            window.sessionStorage.setItem(location.href+'dsType', JSON.stringify(dsTypes));
            window.sessionStorage.setItem(location.href+'envType', JSON.stringify(envTypes));
            window.sessionStorage.setItem(location.href+'bisId', JSON.stringify(bisId));
            window.sessionStorage.setItem(location.href+'dcId', JSON.stringify(dcId));
            window.sessionStorage.setItem(location.href+'acrossDomain', JSON.stringify(acrossDomain));
            window.sessionStorage.setItem(location.href+'authType', JSON.stringify(authTypes));
            window.sessionStorage.setItem(location.href+'needAuth', JSON.stringify(needAuth));
            window.sessionStorage.setItem(location.href+'mode', JSON.stringify(modes));
            window.sessionStorage.setItem(location.href+'useConfig', JSON.stringify(useConfigs));
            window.sessionStorage.setItem(location.href+'status', JSON.stringify(statuses));
            setTimeout(function () {
                $('#modal .panel-body').children().remove();
                $('#modal .panel-body').load(init('base'),{});
                eventHandler(dsTypes);//初始化所有绑定事件效果
            });//end of setTimeout


        }// end of initModal

        //创建内部方法，完成各个模块应该展示的字段及相应的事件处理
        //采用事件委托方式
        function eventHandler( dsTypes ) {
            var $modal = $('#modal');//modal框

            //获取所选的数据库
            $modal.on('change', '#_modal_dsType', function(e) {
                var id = $(this).val();
                var type = '' ;
                var obj = {} ;
                !function findId(arr) {
                    for(var i in arr ){
                        if( arr[i].hasOwnProperty('length') ) {//array
                            findId( arr[i] ) ;
                        } else {//object
                            if( arr[i].children ) {//有孩子节点，先找孩子节点
                                findId( arr[i].children ) ;
                            } else {
                                for(var j in arr[i] ) {
                                    if( arr[i][j] == id ) {//find it
                                        type = arr[i].value ;//返回具体的数据源名称
                                        obj = arr[i] ;
                                        return false ;
                                    }
                                }
                            }
                        }
                    }
                }( dsTypes ) ;
                $modal.data('type',type);
                $modal.data('obj', obj);
            });

            //是否跨域字段相关操作
            $modal.on('change', '#_modal_acrossDomain', function (e) {
                var $divContainerIp = $('#_modal_containerIp').parent();
                var $labelContainerIp = $divContainerIp.prev();
                var $this = $(this);
                var val = $this.val();
                //TODO hardCode
                if ( "1010501" == val ) {    //暂时硬编码
                    $divContainerIp.fadeIn();
                    $labelContainerIp.fadeIn();
                } else {
                    $divContainerIp.fadeOut();
                    $labelContainerIp.fadeOut();
                }
            });

            $modal.on('shown.bs.modal', function (e) {   //修复niceScrolll与bootstrap的bug，使tooltip正常显示
                $(this).find('.modal-body').css('overflow', 'visible');//矫正tooltip显示正常
            });

            $modal.on('click', '.btn-test', function (e) {//测试连接模块
                e.preventDefault();
                var $btn = $(e.target);
                //1 校验必填项
                $btn.attr('disabled', 'disabled');
                var inputArr = $modal.find('input');
                inputArr.each(function (idx, ele) {
                    var $this = $(ele);
                    if ($this.data('validate') && !$this.val() && $this.parent().css('display') != 'none') {
                        $this.addClass('chkError');
                    }
                });
                if ($('#modal .chkError').length) {    //有校验不通过的不能继续执行
                    u.msg('error', '请输入正确数值', '数据校验');
                    $btn.removeAttr('disabled');
                    return false;
                }
                //2 获取数据
                var array = com.getCondition('modal');
                var stepOne = $modal.data('stepOne');
                var stepTwo = $modal.data('stepTwo');
                _model.setObj(stepOne);
                _model.setObj( array );
                array =  _model.getSignificantObj( _model.getObj() );
                $.extend(array, stepTwo);
                if ($.isEmptyObject(array)) {
                    $btn.removeAttr('disabled');
                    return false;
                }
                //3 测试连接
                com.ajax(
                    com.urlMapper.DataServerController.testConnection.url,
                    com.urlMapper.DataServerController.testConnection.type,
                    array,
                    function (e) {
                        if (!~~e.code) {
                            u.msg('success', '连接成功！', '测试连接');
                            $btn.removeAttr('disabled');
                        } else {
                            console.warn("%c 测试连接ajax请求正常，状态码异常", "{color:red}");
                        }
                        return false;
                    },
                    function (e) {
                        u.msg('error', '连接失败！', '测试连接');
                        $btn.removeAttr('disabled');
                        return false;
                    }
                );
                return false;
            });

            $modal.on('click', '.btn-next', function(){//点击下一步，获取基本信息
                var inputArr = $modal.find('input,select') ;
                inputArr.each(function(idx,ele){
                    var $this = $(ele),checkRule = $this.data('validate'),checkPass ;
                    var value = $this.val();
                    if( checkRule&& $this.parent().css('display') != 'none') {
                        if ( checkRule && typeof(checkRule) == 'object') {
                            checkPass = checkRule.test(value);
                        } else if( checkRule && typeof(checkRule) == 'function' ) {
                            checkPass = checkRule(value);
                        }
                        !checkPass && $this.addClass('chkError') ;
                    } else if( checkRule && $this.parent().css('display') == 'none' ) {
                        $this.removeClass('chkError');
                    }
                });
                if( $('#modal .chkError').length ) {
                    u.msg('error', '请补充基本信息', '基本信息');
                    return false;
                }
                var stepOne = com.getCondition( 'modal' );
                $modal.data('stepOne',stepOne);
                var type = $modal.data('type');
                if( type ) {
                    $('#modal .panel-body').children().remove();
                    $('#modal .panel-body').load( init(type), {});
                    $('.modal-backdrop').each(function(){
                        if($('.modal-backdrop').length > 1) {
                            $(this).remove();
                        }
                    });
                    btnToggle();
                } else {
                    u.msg('error', '请选择数据源类型！', '数据源');
                }
            });

            $modal.on('click', '.btn-prev', function(){//点击上一步，返回基本信息
                $('#modal .panel-body').children().remove();
                var $panel = $('#modal .panel-body').load( init('base'), {}, function(){
                    var idx = setInterval(function(){   //回调中并不能检测dom是否绘制完毕，因此轮询监测
                        if( $panel.children().length ){
                            clearInterval( idx );
                            com.setCondition('modal', $modal.data('stepOne'));
                            $modal.data('stepOne', '');
                            btnToggle();
                        }
                    }, 200);
                });
                $('.modal-backdrop').each(function(){
                    if($('.modal-backdrop').length > 1) {
                        $(this).remove();
                    }
                });
            });

            $modal.on('hidden.bs.modal', function (e) {
                if( $modal.data('stepOne') ){
                    $('#modal .panel-body').children().remove();
                    $('#modal .panel-body').load( init('base'), {});
                }
                $modal.data({
                    "type":'',
                    "obj" :'',
                    "stepOne" : '',
                    "stepTwo" : ''
                });
                btnToggle();
            });
            $('#eEntity_wrapper').fadeOut();
        }
        //分别显示按钮组
        function btnToggle() {
            var isStepOne = $('#modal').data('stepOne') ? true : false;
            var $stepOne = $('#stepOne');
            var $stepTwo = $('#stepTwo');
            if( !isStepOne ) {//stepOne show and stepTwo hide
                $stepOne.removeClass('hide');
                $stepTwo.addClass('hide');
            } else {
                $stepOne.addClass('hide');
                $stepTwo.removeClass('hide');
            }
        }

        setTimeout(function () {
            $('#main-menu a').eq(1).trigger('click');
            $('#main-loading').fadeOut();
        });
});