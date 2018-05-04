define(['jquery', 'tweenMax', 'menu', 'common'], function ($, tm, m, com) {
    "use strict" ;
    if ($('#main-menu').length) {
        $('#main-menu').remove();
    }
    var tree = [];
    //定义图标数组
    var iconArray = [
        "entypo-flow-tree", //根目录
        "entypo-flow-line", //一级目录
        "entypo-flow-parallel", //二级目录
        "entypo-flow-cascade",  //三级目录
        "entypo-flow-branch",   //四级目录
    ];
    var root = $('.sidebar-menu-inner');
    if (root.length === 0) {
        window.alert('不能执行');
        return false;
    }

    function createTree(data, fartherNode, labels) {
        if (data && 0 === data.length) {
            return false;
        }
        for (var I in data) {
            var liNode = $('<li>');
            var aNode = $('<a>');
            var iNode = $('<i>');
            var spanNode = $('<span>');

            iNode.attr('class', (( iconArray[~~data[I][labels.level]] ) || 'entypo-home'));
            iNode.appendTo(aNode);
            //将name设置为data属性，方便做查询
            liNode.data('name', ( data[I][labels.text] || '全部'));

            spanNode.attr('class', 'title');
            spanNode.text( data[I][labels.text] || '全部');
            spanNode.appendTo(aNode);

            aNode.attr('href', 'javascript:void(0);');

            if (data[I] && data[I].hasOwnProperty('children')) {   //对父节点的孩子节点做处理，防止dom中存储重复数据
                var children = null;
                children = data[I].children;
                data[I].children = true;
                aNode.val(JSON.stringify(data[I]));//将该对象插入到dom元素中
                data[I].children = JSON.parse(JSON.stringify(children));//快速复制对象
                children = null;
            } else {
                aNode.val(JSON.stringify(data[I]));//将该对象插入到dom元素中
            }
            aNode.appendTo(liNode);


            if (data[I] && data[I].children && 0 != data[I].children.length) {
                liNode.attr('class', 'has-sub');
                var _ulNode = $('<ul>');
                _ulNode.appendTo(liNode);
                createTree(data[I].children, _ulNode, labels); //递归
            }
            liNode.appendTo(fartherNode);
        }
    }   //end of createTree

    function search(str) {
        clearResult();//设置高亮前，先清空上一次的结果

        var treeObj = $('#main-menu').children();
        //去除第一个元素，input查询框
        Array.prototype.shift.call(treeObj);
        var setClass = function (data) {
            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var $data = $(data[i]);
                    if ($data.data('name') && -1 < $data.data('name').indexOf(str)) {
                        $data.addClass('active');
                        var farther = $data.parent();
                        while ('main-menu' !== farther.prop('id')) {
                            if ('UL' === farther.prop('tagName')) {
                                m.menu_do_expand(farther, farther.parent(), submenu_options);
                            }
                            farther = farther.parent();
                        }
                    }
                    if (0 != $data.children.length) {
                        setClass($data.children());
                    }
                }
            }
        }; //将符合条件的所有结果增加高亮
        setClass(treeObj);
    }   // end of search

    //清空搜索结果
    function clearResult() {
        var treeObj = $('#main-menu').children();
        var removeClass = function (data) {
            for (var i = 0; i < data.length; i++) {
                var $data = $(data[i]);
                if ($data.hasClass('active')) {
                    $data.removeClass('active');
                    var farther = $data.parent();
                    while ('main-menu' != farther.prop('id')) {
                        if ('UL' == farther.prop('tagName')) {
                            m.menu_do_collapse(farther, farther.parent(), submenu_options);
                        }
                        farther = farther.parent();
                    }
                }
                if (0 != $data.children.length) {
                    removeClass($data.children());
                }
            }
        };
        removeClass(treeObj);
    } //end of clearResult

    function getTree( lazyLoad, urlObj ) {
        if ($('#main-menu').length) {
            $('#main-menu').remove();
            tree = [] ;
        }
        var labels = {};  //存储绘制树形图时获取的属性名称

        if( !lazyLoad ) {    //判断是否是懒加载，默认是全量加载

            var temp = com.urlMapper.DataCenterController.selectAllDataCenter;
            if( urlObj ) {
                temp = urlObj ;
            }
            com.ajax(temp.url, temp.type, null, function (e) {
                if ($.isArray(e.data)) {
                    tree = e.data;
                } else if( !$.isEmptyObject(e.data) ) {
                    tree.push(e.data);
                } else {
                    console.warn("树形图绘制出错！");
                    return false ;
                }
            }, false);
            //设置labels参数 这里需要罗列各个功能获取的包括层级及展示的名称字段，做统一绘制树形图
            if( temp.url.indexOf('data-centers') > -1 ) {
                //数据中心的树形图
                labels = {
                    "level" : "level",
                    "text"  : "name"
                };
            } else if( temp.url.indexOf('data-dicts') > -1 ) {
                //数据字典的树形图
                labels = {
                    "level" : "level",
                    "text"  : "dictName"
                };
            } else if( temp.url.indexOf('business-systems') > -1 ) {
                //应用系统
                labels = {
                    "level" : "level",
                    "text"  : "zhName"
                };
            } else if( temp.url.indexOf('data-servers') > -1 ) {
                //服务器
                labels = {
                    "level" : "level",
                    "text"  : "name"
                };
            } else if( temp.url.indexOf('fields') > -1 ) {
                labels = {
                    "level" : "level",
                    "text" : "name"
                };
            } else if( temp.url.indexOf('entities') > -1 ) {
                labels = {
                  "level" : "level",
                  "text"  : "name"
                };
            }

            var $mainUl = $('<ul id="main-menu" class="main-menu multiple-expanded"></ul>');
            var $search = $(`<li>
                            <a href="javascript:void(0);">
                                <i class="entypo-search"></i>
                                <span class="title">
                                    <input type="text" class="selfDef">
                                </span>
                            </a>
                    </li>`);
            $mainUl.append($search);
            createTree(tree, $mainUl, labels);
            root.append($mainUl);

            $search.find('input').on('change', function () {    //绑定事件
                if (this.value) {
                    search(this.value);
                } else {
                    clearResult();
                }
            });

            m.setup_sidebar_menu();
            m.setup_horizontal_menu();
        } else {    //采用懒加载模式
            //校验传进来的参数
            if( lazyLoad.pid ) {
                var temp = com.urlMapper.DataCenterController.selectAllDataCenterGetChildren;
                //获取数据
                com.ajax(temp.url, temp.type, null, function (e) {
                    if ($.isArray(e.data)) {
                        tree = e.data;
                    } else {
                        tree.push(e.data);
                    }
                }, false);
                /*
                *   @remark 懒加载处理逻辑
                *   1. 获取该父亲节点
                *   2. 通过获取的后台数据生成前端dom节点
                *   3. 添加到该父亲节点之下
                *
                * */




            } else {
                //如果没有pid无法解析数据
                console.warn('createTree传入数据有误，没有pid无法解析数据!');
                return false ;
            }
        }
        //tree = [] ;   //置空
        return tree ;
    }
    return {
        createTree : getTree
    };
});