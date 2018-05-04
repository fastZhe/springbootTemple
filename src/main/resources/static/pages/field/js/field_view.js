define(['jquery','util', 'common','../../entity/js/entity_model', './field_model', 'createTree'], function($, u, com, entity_model,field_model, tree){
    "use strict" ;

    var entityModel = new entity_model.Model();

    var fieldModel = new field_model.Model() ;


    var columnArray = fieldModel.getInitObj();
    var actionDef = fieldModel.getAction();

    //设置列文本对齐位置
    var cellStyle = fieldModel.getCellStyle();
    tree.createTree('', com.urlMapper.FieldController.selectAllField);
    com.searchCondition('nodeCondition', columnArray, false, '当前字段', 'node', '', ['config',"collapse"]);
    com.searchCondition('searchCondition', columnArray, false, '查询条件', 'search', '', '',["search","reset"]);
    $('a').attr('ondragstart', 'return false');//阻止拖拽产生异常
    let fieldTableData = [];
    let valArray = $('#main-menu a');
    Array.prototype.shift.call(valArray);//去掉第一个元素
    Array.prototype.shift.call(valArray);//去掉根节点
    valArray.each(function (i, e) {
        var field = JSON.parse($(e).val());
        if( field.level == 2 ) {
            fieldTableData.push(field);
        }

    });
    u.createTable('field_table', columnArray, fieldTableData, actionDef, false, false, cellStyle); //默认显示全部
    $(document).on('click','.sidebar-menu-inner #main-menu li:eq(1)',function(e){
        function verify() {
            let nodeName = e.target.nodeName;

            if('INPUT' ==nodeName || $(e.target).find('input').length){
                return false;
            }

            let eventNodes = ['A', 'I', 'SPAN'];
            if (eventNodes.indexOf(nodeName) < 0) {
                return false;
            }

            let currentNode = ('A' == nodeName ? $(e.target) : $(e.target).parent('a'));
            if (!currentNode.val()) {
                return false;
            }
            return true;
        }

        if (!verify()) {
            return false;
        }

        let currentNodeData = {}, childrenData = [];

        function buildCurrentNodeAndChildrenData() {
            let nodeName = e.target.nodeName;

            let currentNode = ('A' == nodeName ? $(e.target) : $(e.target).parent('a'));

            //设置当前节点数据
            currentNodeData = JSON.parse(currentNode.val());

            //将子元素添加到数组
            var childrenNodes = currentNode.next().children().find('a');
            childrenNodes.each(function (idx, childNode) {
                var $childNode = $(childNode);
                var childData = JSON.parse($childNode.val());

                if (currentNodeData.level == 0) {
                    if (childData.level == 2) {
                        childrenData.push(childData);
                    }
                } else if (childData.level == (currentNodeData.level + 1)) {
                    childrenData.push(childData);
                }
            });

        }

        buildCurrentNodeAndChildrenData();


        //设置当前节点和初始化按钮
        function setCurrentNodeInfo() {
            //控制当前节点信息栏显示
            if (currentNodeData.level == 0) {//全部节点（根）
                $('#nodeCondition').empty();
                com.searchCondition('nodeCondition', fieldModel.getInitObj(), false, '全部', 'node', '', ['config', "collapse"]);
                com.cleanCondition('nodeCondition');//清空当前节点中数据
                //合并当前节点
                if ('block' === $('#nodeCondition .panel-body').css('display')) {
                    $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                }
                //隐藏高级搜索、折叠等按钮
                $('#nodeCondition .entypo-cog').parent('a').show();

                $('#nodeCondition .entypo-down-open').parent('a').hide();
                $('#field_table_table_wrapper').show();

            } else if (currentNodeData.level == 1) {//实体节点
                $('#nodeCondition').empty();
                com.searchCondition('nodeCondition', entityModel.getInitObj(), false, '当前实体', 'node', '', ['config', "collapse"]);
                let text = "当前实体：";
                text = text.concat(currentNodeData.name);
                $('#nodeCondition .panel-title').text(text);
                //展开当前节点
                if ('none' === $('#nodeCondition .panel-body').css('display')) {
                    $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                }
                //显示高级搜索、折叠等按钮
                $('#nodeCondition .entypo-cog,#nodeCondition .entypo-down-open').parent('a').show();

            } else {//字段节点（叶子）

                //如果显示，点击"高级查询"按钮将查询区域隐藏
                if ('block' === $('#searchCondition .panel-body').css('display')) {
                    $('#nodeCondition .panel-options .entypo-cog').parent('a').click();
                }

                //重新绘制当前节点区域
                $('#nodeCondition').empty();
                com.searchCondition('nodeCondition', fieldModel.getInitObj(), false, '当前字段', 'node', '', ['config', "collapse"]);
                let text = "当前字段：";
                text = text.concat(currentNodeData.name);
                $('#nodeCondition .panel-title').text(text);

                //隐藏高级搜索
                $('#nodeCondition .entypo-cog').parent('a').hide();

            }
            com.setCondition('nodeCondition', currentNodeData);
            $('#nodeCondition').val(JSON.stringify(currentNodeData));
        }

        setCurrentNodeInfo();

        function setChildrenTableInfo() {
            if (currentNodeData.level == 2) {//叶子节点
                $('#recordSet').hide();
            }else{
                $('#recordSet').show();
                $('#recordSet .panel-title').text('字段列表');
                u.createTable('field_table', columnArray, childrenData, actionDef, false, false, cellStyle);
            }
        }

        setChildrenTableInfo();

    }).on('change keyup blur','.sidebar-menu-inner #main-menu',function(e){
        if(e.target.nodeName == 'INPUT'){
            if ('' === this.value) {
                u.createTable('field_table', columnArray, fieldTableData, actionDef, false, false, cellStyle); //当搜索框中没有数据时，table中显示所有数据
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
                url = com.urlMapper.FieldController.deleteFieldById.url,
                type = com.urlMapper.FieldController.deleteFieldById.type;

            function sucFn(e) {
                if ('0' == e.code) {
                    u.msg('success', '操作成功！', '数据操作');
                    tree.createTree('',com.urlMapper.FieldController.selectAllField);
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
        let cTime , uTime ;
        if( arr.createTime ) {
            cTime = arr.createTime.split(' - ');
            delete arr.createTime;
            arr['minCreateTime'] = cTime[0];
            arr['maxCreateTime'] = cTime[1];
        }
        if( arr.updateTime ) {
            uTime = arr.updateTime.split(' - ');
            delete arr.updateTime;
            arr['minUpdateTime'] = uTime[0];
            arr['maxUpdateTime'] = uTime[1];
        }
        com.post(
            com.urlMapper.FieldController.searchField.url, arr)
            .done(function (e) {
                let data = e.data;
                u.createTable('field_table', columnArray, data, actionDef, false, false, cellStyle);
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
        //arr.pid = ($('#nodeCondition').val()||$('#nodeCondition').val()=='{}') ? (JSON.parse($('#nodeCondition').val()).id || 0) : 0;
        changeData = $(this).data('change');
        if ( arr.pid ) {
            url = com.urlMapper.FieldController.updateField.url;
            type = com.urlMapper.FieldController.updateField.type;
            for (let k in arr) {
                changeData[k] = arr[k];
            }
            postData = changeData;
        } else {
            url = com.urlMapper.FieldController.saveField.url;
            type = com.urlMapper.FieldController.saveField.type;
            postData = arr;
        }

        com.ajax(url, type, postData).done(function(e){
            if (0 == (e.code+'')) {
                u.msg('success',e.msg,'数据操作');
                $('#modal').modal('hide');
                tree.createTree('',com.urlMapper.FieldController.selectAllField);
            } else {
                u.msg('error', e.msg, '数据操作');
            }
        }).fail(function(e,r,m){
            u.msg('error', e.msg, '数据操作');
            if(e.status == '403'){
                top.location.reload();
            }

        });
    });

    //折叠第一个全部
    $('#nodeCondition .panel-options').children('a').eq(0).trigger('click');
    $('#main-menu a').eq(0).trigger('click');

    //将信息框设置只读状态
    $('#nodeCondition input').each(function( idx, ele ){
        $(this).attr('disabled', 'disabled') ;
    });

    $('body').niceScroll({
        cursorcolor: "#424242",
        autohidemode: true
    }).resize();

    //初始化页面滚动条
    $(document).click(function(){
        $('body').niceScroll({
            cursorcolor: "#424242",
            autohidemode: true
        }).resize();
    });

    $('#modal').on('hidden.bs.modal', function(e){
        com.cleanCondition('modal');
    });


    setTimeout(function() {
        $('#main-loading').fadeOut();
        $('#main-menu .entypo-flow-tree').parent().click();
        $('#nodeCondition .entypo-cog').parent('a').click();
    });
});