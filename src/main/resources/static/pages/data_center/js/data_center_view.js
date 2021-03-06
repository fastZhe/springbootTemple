define(['jquery', 'util', 'common', './data_center_model', 'createTree'], function ($, u, com, model, tree) {
    "use strict";
    var model = new model.Model();
    var columnArray = model.getInitObj();
    var actionDef = model.getAction();
    //设置列文本对齐位置
    var cellStyle = model.getCellStyle();
    var dataCenterData = tree.createTree();
    if( window.sessionStorage ) {
        var store = window.sessionStorage ;
        if( !store.getItem( location.href.concat('pid') )) {//父节点数据存入缓存
            store.setItem( location.href.concat('pid'), JSON.stringify(dataCenterData) ) ;
        }
    } else {    //不支持h5标准的后续处理
        console.warn("该浏览器不支持h5标准");
    }
    com.searchCondition('nodeCondition', columnArray, false, '当前数据中心', 'node', '', ["add", "minus", "edit", 'config', "collapse"]);
    var searchBtn = {
            title : "查找",
            id    : "search",
            class : "btn btn-info  icon-left"
        };
        var resetBtn = {
            title : "重置",
            id    : "reset",
            class : "btn btn-default  icon-left"
        };
    com.searchCondition('searchCondition', columnArray, false, '查询条件', 'search', '', '', [searchBtn, resetBtn]);
    $('a').attr('ondragstart', 'return false');//阻止拖拽产生异常


    let _tree = [];
    let valArray = $('#main-menu a');
    Array.prototype.shift.call(valArray);//去掉第一个元素
    Array.prototype.shift.call(valArray);//去掉根节点
    valArray.each(function (i, e) {
        var _o = JSON.parse($(e).val());
        _tree.push(_o);
    });

    u.createTable('eMetaDc', columnArray, _tree, actionDef, false, false, cellStyle); //默认显示全部
    $(document).on('click', '.sidebar-menu-inner #main-menu li:eq(1)', function (e) {
        var _obj = [];
        let self = {};
        if ('A' == e.target.nodeName) {
            var $ele = $(e.target);
            if ($ele.val()) {
                if ('全部' !== $ele.find('span').text()) {
                    self = JSON.parse($ele.val());
                    if ('none' === $('#nodeCondition .panel-body').css('display')) {	//如果是未展开，则展开
                        $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                    }
                    //隐藏编辑，删除按钮
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil,#nodeCondition .entypo-down-open').parent('a').show();
                } else {
                    //清空node中数据
                    com.cleanCondition('nodeCondition');
                    if ('block' === $('#nodeCondition .panel-body').css('display')) {	//关闭信息栏
                        $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                    }
                    //显示编辑，删除按钮
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil,#nodeCondition .entypo-down-open').parent('a').hide();
                }
                var childrenArr = $ele.parent().children().find('a');
                childrenArr.each(function (idx, ele) {
                    var currentObj = $(ele);
                    var currentVal = JSON.parse(currentObj.val());
                    _obj.push(currentVal);
                });
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
                    if ('none' === $('#nodeCondition .panel-body').css('display')) {	//如果是未展开，则展开
                        $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                    }
                    //隐藏编辑，删除按钮
                    com.cleanCondition('nodeCondition');
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil,#nodeCondition .entypo-down-open').parent('a').show();
                } else {
                    //清空node中数据
                    $('#nodeCondition .entypo-minus,#nodeCondition .entypo-pencil,#nodeCondition .entypo-down-open').parent('a').hide();
                }
                var childrenArr = $ele.parent().children().find('a');
                childrenArr.each(function (idx, ele) {
                    var currentObj = $(ele);
                    var currentVal = JSON.parse(currentObj.val());
                    _obj.push(currentVal);
                });
            }
        }
        if ('INPUT' == e.target.nodeName || $(e.target).find('input').length) {
            return false;
        }
        com.setCondition('nodeCondition', self);
        $('#nodeCondition').val(JSON.stringify(self));
        let text = "当前数据中心：";
        text = text.concat(self.name || self.displayName || '全部');
        $('#nodeCondition .panel-title').text(text);
        $('#tableCondition .panel-title').text("数据中心列表");
        if (_obj.length) {
            u.createTable('eMetaDc', columnArray, _obj, actionDef, false, false, cellStyle);
        } else {
            u.createTable('eMetaDc', columnArray, [], actionDef, false, false, cellStyle);
        }
    }).on('change keyup blur', '.sidebar-menu-inner #main-menu', function (e) {
        if (e.target.nodeName == 'INPUT') {
            if ('' === this.value) {
                u.createTable('eMetaDc', columnArray, _tree, actionDef, false, false, cellStyle); //当搜索框中没有数据时，table中显示所有数据
            }
        }
    });

    //----模太框方法  -------start--------
    function confirmModal() {
        let $modal = $('<div class="modal" id="modal-confirm">'),
            $modalDialog = $('<div class="modal-dialog">'),
            $modalContent = $('<div class="modal-content">'),
            $modalHeader = $('<div class="modal-header">'),
            $modalBody = $('<div class="modal-body">').html('删除数据将不能恢复,确认要将选中的数据删除吗？'),
            $modalFooter = $('<div class="modal-footer">'),
            $closeBtn = $('<button class="close">').attr('type', 'button').attr('data-dismiss', 'modal').attr('aria-hidden', true).text('x'),
            $modalH4 = $('<h4 class="modal-title"><span class="entypo-doc-text">删除</span></h4>'),
            $cancelBtn = $('<button class="btn btn-default btn-cancel">').attr('type', 'button').attr('data-dismiss', 'modal').text('取消'),
            $deleteBtn = $('<button class="btn btn-info delete">').attr('type', 'button').attr('data-dismiss', 'modal').text('删除');
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
            let deleteData = $(this).data('delete'),
                url = com.urlMapper.DataCenterController.deleteDataCenterById.url,
                type = com.urlMapper.DataCenterController.deleteDataCenterById.type;

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
        let arr = com.getCondition('searchCondition');
        //对时间字段做特殊处理
        let cTime, uTime;
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
            com.urlMapper.DataCenterController.searchDataCenter.url, arr)
            .done(function (e) {
                let data = e.data;
                u.createTable('eMetaDc', columnArray, data, actionDef, false, false, cellStyle);
            })
            .fail(function (e) {
                u.msg('error', '获取查询数据失败!', '获取查询数据');
            });
    }); //end of _search_search
        //重置即清空搜索框数据
    $('#_search_reset').on('click', function (e) {
        e.preventDefault();
        let $ele = $('#searchCondition input');
        $ele.each(function (idx, ele) {
            let o = $(ele);
            o.val('');
        });
    });
    let container = $('#modal'), data = [];
    com.initModal(container, columnArray);

    $(document).on('click', '#modal .btn-confirm', function (e) {
        //执行查询操作
        let arr = com.getCondition('modal'), type = '', url = '', changeData, postData;
        //TODO 往回点击的时候绑定的是个空对象
        //arr.pid = ($('#nodeCondition').val() || $('#nodeCondition').val() == '{}') ? (JSON.parse($('#nodeCondition').val()).id || 0) : 0;
        changeData = $(this).data('change');
        if ( arr.id ) {
            url = com.urlMapper.DataCenterController.updateDataCenter.url;
            type = com.urlMapper.DataCenterController.updateDataCenter.type;
            for (let k in arr) {
                changeData[k] = arr[k];
            }
            postData = changeData;
        } else {
            url = com.urlMapper.DataCenterController.saveDataCenter.url;
            type = com.urlMapper.DataCenterController.saveDataCenter.type;
            postData = arr;
        }

        //TODO 后期去掉
        function sucFn() {

        }

        com.ajax(url, type, postData, sucFn).done(function (e) {
            if (0 == (e.code + '')) {
                u.msg('success', e.msg, '数据操作');
                $('#modal').modal('hide');
                tree.createTree();
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

    $('#eMetaDc').on('click', '.btn-edit', function (e) {
        let dt = $('#eMetaDc').DataTable(),
            row = $(this).closest('tr'),
            changeData = dt.row(row).data();
        $('#modal .btn-confirm').data('change', changeData);
        com.setCondition('modal', changeData);
        $('#modal').modal('show');
    }).on('click', '.btn-delete', function (e) {
        let dt = $('#eMetaDc').DataTable(),
            row = $(this).closest('tr'),
            deleteData = dt.row(row).data();
        $('#modal-confirm').modal('show');
        $('#modal-confirm .delete').data('delete',
            deleteData);
    });

    $('#_node_createTime').val('');
    $('#_node_updateTime').val('');
    $('#nodeCondition .entypo-minus').parent('a').on('click', function (e) {
        let objStr = $('#nodeCondition').val();
        if (objStr) {
            let obj = JSON.parse(objStr);
            $('#modal-confirm .delete').data('delete', obj);
        } else {
            return false;
        }
    });
    //折叠第一个全部
    $('#main-menu a').eq(0).trigger('click');

    //将信息框设置只读状态
    $('#nodeCondition input').each(function (idx, ele) {
        $(this).attr('disabled', 'disabled');
    });

    $('body').niceScroll({cursorcolor: "#424242", autohidemode: true}).resize();

    //初始化页面滚动条
    $(document).click(function () {
        $('body').niceScroll({
            cursorcolor: "#424242",
            autohidemode: true
        }).resize();
    });

    $('#modal').on('hidden.bs.modal', function (e) {
        com.cleanCondition('modal');
    });

    setTimeout(function () {
        $('#main-loading').fadeOut();
        $('#main-menu .entypo-flow-tree').parent().click();
        $('#nodeCondition .entypo-cog').parent('a').click();
    });
});