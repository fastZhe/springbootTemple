define(['jquery', 'util', 'common', '../../server/js/server_model', './entity_model', '../../field/js/field_model', 'createTree'],
    function ($, u, com, server_model, entity_model, field_model, tree) {
        "use strict";
        //数据源模型
        var serverModel = new server_model.Model();

        //实体模型
        var entityModel = new entity_model.Model();

        //字段模型
        var fieldModel = new field_model.Model();

        //创建左侧导航树，每个节点的"A"标签值为对应的数据对象
        tree.createTree('', com.urlMapper.EntityController.selectAllEntity);

        //初始化当前节点信息
        com.searchCondition('nodeCondition', entityModel.getInitObj(), false, '全部', 'node', '', ['config', "collapse"]);

        //初始化高级查询
        com.searchCondition('searchCondition', entityModel.getInitObj(), false, '查询条件', 'search', '', '', ["search", "reset"]);
        $('a').attr('ondragstart', 'return false');//阻止拖拽产生异常

        let entityTableData = [];//从树中获取要在表中展示的数据
        let valArray = $('#main-menu a');//获取树中的A标签
        Array.prototype.shift.call(valArray);//去掉第一个元素，第一个元素为input搜索框
        Array.prototype.shift.call(valArray);//去掉根节点，根节点为“全部”
        valArray.each(function (i, e) {
            //a标签的值为每个数据对象
            var entity = JSON.parse($(e).val());
            //level为1的为server对象，level为2的为entity对象
            if (entity.level == 2) {
                entityTableData.push(entity);
            }
        });
        //初始化表元素
        $('#entity_table_wrapper').show();
        $('#field_table_wrapper').hide();
        u.createTable('entity_table', entityModel.getInitObj(), entityTableData, entityModel.getAction(), false, false, entityModel.getCellStyle()); //默认显示全部

        //左侧树元素点击事件
        $(document).on('click', '.sidebar-menu-inner #main-menu li:eq(1)', function (e) {

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
                    com.searchCondition('nodeCondition', entityModel.getInitObj(), false, '全部', 'node', '', ['config', "collapse"]);
                    com.cleanCondition('nodeCondition');//清空当前节点中数据
                    //合并当前节点
                    if ('block' === $('#nodeCondition .panel-body').css('display')) {
                        $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                    }
                    //显示高级搜索
                    $('#nodeCondition .entypo-cog').parent('a').show();
                    //隐藏折叠等按钮
                    $('#nodeCondition .entypo-down-open').parent('a').hide();

                } else if (currentNodeData.level == 1) {//数据源节点
                    //重新绘制数据源
                    $('#nodeCondition').empty();
                    com.searchCondition('nodeCondition', serverModel.getInitObj(), false, '当前数据源', 'node', '', ['config', "collapse"]);
                    let text = "当前数据源：";
                    text = text.concat(currentNodeData.name);
                    $('#nodeCondition .panel-title').text(text);

                    //展开当前节点
                    if ('none' === $('#nodeCondition .panel-body').css('display')) {
                        $('#nodeCondition .panel-options .entypo-down-open').parent('a').click();
                    }

                    //显示高级搜索、折叠等按钮
                    $('#nodeCondition .entypo-cog,#nodeCondition .entypo-down-open').parent('a').show();

                } else {//实体节点（叶子）

                    //如果显示，点击"高级查询"按钮将查询区域隐藏
                    if ('block' === $('#searchCondition .panel-body').css('display')) {
                        $('#nodeCondition .panel-options .entypo-cog').parent('a').click();
                    }

                    //重新绘制当前节点区域
                    $('#nodeCondition').empty();
                    com.searchCondition('nodeCondition', entityModel.getInitObj(), false, '当前实体', 'node', '', ['config', "collapse"]);
                    let text = "当前实体：";
                    text = text.concat(currentNodeData.name);
                    $('#nodeCondition .panel-title').text(text);

                    //"高级查询"按钮隐藏
                    $('#nodeCondition .entypo-cog').parent('a').hide();

                }
                com.setCondition('nodeCondition', currentNodeData);
                $('#nodeCondition').val(JSON.stringify(currentNodeData));

            }

            setCurrentNodeInfo();

            //设置子节点列表信息
            function setChildrenTableInfo() {
                if (currentNodeData.level == 2) {//叶子节点
                    //查询字段数据
                    let params = {"entityId": currentNodeData.id};
                    com.post(com.urlMapper.FieldController.searchField.url, params, function () {
                    }).done(function (e) {
                        $('#field_table_wrapper').show();
                        $('#entity_table_wrapper').hide();
                        $('#recordSet .panel-title').text('字段列表');
                        u.createTable('field_table', fieldModel.getInitObj(), e.data, fieldModel.getAction(), false, false, fieldModel.getCellStyle());
                    }).fail(function (e) {
                        u.msg('error', '获取字段数据失败!', '获取字段数据');
                    });
                } else {
                    $('#entity_table_wrapper').show();
                    $('#field_table_wrapper').hide();
                    $('#recordSet .panel-title').text('实体列表');
                    u.createTable('entity_table', entityModel.getInitObj(), childrenData, entityModel.getAction(), false, false, entityModel.getCellStyle());
                }
            }

            setChildrenTableInfo();


        }).on('change keyup blur', '.sidebar-menu-inner #main-menu', function (e) {
            if (e.target.nodeName == 'INPUT') {
                if ('' === this.value) {
                    $('#entity_table_wrapper').show();
                    $('#field_table_wrapper').hide();
                    u.createTable('entity_table', entityModel.getInitObj(), entityTableData, entityModel.getAction(), false, false, entityModel.getCellStyle()); //当搜索框中没有数据时，table中显示所有数据
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
                    url = com.urlMapper.EntityController.deleteEntityById.url,
                    type = com.urlMapper.EntityController.deleteEntityById.type;

                function sucFn(e) {
                    if ('0' == e.code) {
                        u.msg('success', '操作成功！', '数据操作');
                        tree.createTree('', com.urlMapper.EntityController.selectAllEntity);
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

        //查询按钮
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
            com.post(com.urlMapper.EntityController.searchEntity.url, arr).done(function (e) {
                let data = e.data;
                u.createTable('entity_table', entityModel.getInitObj(), data, entityModel.getAction(), false, false, entityModel.getCellStyle());
            }).fail(function (e) {
                u.msg('error', '获取查询数据失败!', '获取查询数据');
            });
        }); //end of _search_search

        // 重置即清空搜索框数据
        $('#_search_reset').on('click', function (e) {
            e.preventDefault();
            let $ele = $('#searchCondition input');
            $ele.each(function (idx, ele) {
                let o = $(ele);
                o.val('');
            });
        });
        let container = $('#modal'), data = [];
        com.initModal(container, entityModel.getInitObj());

        //模态框确认
        $(document).on('click', '#modal .btn-confirm', function (e) {
            //执行查询操作
            let arr = com.getCondition('modal'), type = '', url = '', changeData, postData;
            //TODO 往回点击的时候绑定的是个空对象
            //arr.pid = ($('#nodeCondition').val() || $('#nodeCondition').val() == '{}') ? (JSON.parse($('#nodeCondition').val()).id || 0) : 0;
            changeData = $(this).data('change');
            if ( arr.id ) {
                url = com.urlMapper.EntityController.updateEntity.url;
                type = com.urlMapper.EntityController.updateEntity.type;
                for (let k in arr) {
                    changeData[k] = arr[k];
                }
                postData = changeData;
            } else {
                url = com.urlMapper.EntityController.saveEntity.url;
                type = com.urlMapper.EntityController.saveEntity.type;
                postData = arr;
            }

            com.ajax(url, type, postData).done(function (e) {
                if (0 == (e.code + '')) {
                    u.msg('success', e.msg, '数据操作');
                    $('#modal').modal('hide');
                    tree.createTree('', com.urlMapper.EntityController.selectAllEntity);
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

        //折叠第一个全部
        $('#nodeCondition .panel-options').children('a').eq(0).trigger('click');
        $('#main-menu a').eq(0).trigger('click');

        //将信息框设置只读状态
        $('#nodeCondition input').each(function (idx, ele) {
            $(this).attr('disabled', 'disabled');
        });

        $('body').niceScroll({
            cursorcolor: "#424242",
            autohidemode: true
        }).resize();

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

            //点击全部
            $('#main-menu .entypo-flow-tree').parent().click();

            //点击高级搜索
            $('#nodeCondition .entypo-cog').parent('a').click();

        });
    });