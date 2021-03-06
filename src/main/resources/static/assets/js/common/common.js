define(["jquery","util"],function($,u){
    "use strict";
    var _type = {
      get : 'get',
      post : 'post',
      delete : 'delete',
      put : 'put',
      patch : 'patch',
      copy : 'copy',
      link : 'link'
    };

    var commonValidate = {
        isEmpty : (value) => { return !(value.trim() == '') },
        isIP : /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/,
        isNumber : /^[0-9]*$/,
        isEn : /^[A-Za-z]*$/,
        isZh : /^[\u4e00-\u9fa5]{0,}$/,
        specialSymbol : /~!@#$%^&*()/ ,
        cellphone :function(d){
        		return d ? /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(d):true ;
        } ,
        email : /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/ ,
        idCard :/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)/,
    };

    var successFn = function (e) {
        if (e) {
            u.msg('success', '操作成功！', '数据操作');
        }
    };
    var errorFn = function (e) {
        if (e) {
            u.msg('error', '网络错误代码: ' + e.status, 'ajax请求出错');
        }
    };
    var completeFn = function (e) {
        if (e) {
            console.warn('该ajax为：' + document.title + ' 页面，调用路径为：' + this.url);
        }
        if(e.status) {
            switch(e.status){
                case 403:top.location.reload();break;
                //case 500:window.location.reload();break;
                case 500:u.msg('error', '服务器内部出错！', 'ajax请求');break;
                case 404:window.history.back(-1);
            }
        }
        if(!(top == window.parent)) {
            //防止出现连个横向导航页面嵌套情况发生
            top.location.reload();
        }
    };

    /*
    *   扩展jQuery 判断是否是空数组
    *       兼容jQuery对象数组,及arguments
    * */
    $.extend($, {"isEmptyArray":function( array ) {
        if( !array ) {    //未知类型，直接返回false, 并且后台抛出错误
            console.warn('%c 校验数组是否为空函数抛错，未知类型校验！','color:red');
            return false ;
        }
        if( $.isArray( array ) ) {
            if( array.length ) {
                return false ;//非空
            } else {
                return true ;//空
            }
        } else if( array instanceof $ ) {
            if( array.length ) {
                return false ;
            } else {
                return true ;
            }
        } else if( !$.isArray( array ) && array.hasOwnProperty('length') ) {    //判断说明是arguments对象
            if( array.length ) {
                return false ;
            } else {
                return true ;
            }
        }
    }});
    /*
     *  comments : url处理函数，对需要传参的url做进一步处理
     *  params   :
     *          baseUrl : 请求路径
     *          symbol  : 需要替换的符号
     *          data    : 代替符号的具体数据
     *
     */
    var initUrl = function( baseUrl, symbol, data) {

        if( -1 < baseUrl.indexOf(symbol) ) {
            return baseUrl.replace(symbol, data);
        } else {
            u.msg('error','替换url失败！详情查看console','初始化url');
            console.warn('地址为：' + baseUrl);
            console.warn('替换的符号为：' + symbol);
            console.warn('替换的数据为：' + data);
            return false ;
        }
    };

    /*
    *   获取form类型函数，通过传入form中任意input的id，来判断该form所属类型
    *   @params：flag // string
    *   @return： string prefix
    *
    * */
    var getFlag = function(flag) {
        if( flag.indexOf('_search_') > -1 || 'search' === flag ) {
            return '_search_' ;
        } else if ( flag.indexOf('_modal_') > -1 || 'modal' === flag ) {
            return '_modal_' ;
        } else if ( flag.indexOf('_node_') > -1 || 'node' === flag ) {
            return '_node_';
        }
    };


    /*
    *   给节点信息部分委托点击事件
    *   无参数，在绘制完nodeCondition部分dom之后或整个dom之后执行
    * */
    var addEventHandler = function(com) {
        //给nodeCondition部分增加点击事件处理逻辑
        $('#nodeCondition').off('click');
        $('#nodeCondition').on('click', '.panel-options', function(e) {
            var tagName = e.target.tagName ;
            var $this = $( e.target );
            var actionType = '' ;
            if( 'I' == tagName ) {
                actionType = e.target.className ;
            } else if ( 'SPAN' == tagName ) {
                actionType = $this.prev()[0].className ;
            } else if ( 'A' == tagName ) {
                actionType = $this.children('I')[0].className ;
            } else if ( 'FONT' == tagName ) {
                actionType = $this.parents('SPAN').prev()[0].className ;
            }
            var curNodeData = $('#nodeCondition').val();
            curNodeData = curNodeData ? JSON.parse( curNodeData ) : '' ;

            switch( actionType ) {
                case 'entypo-plus' :
                    $('#modal').modal('show');  //新增数据
                    break; //end of case 'entypo-plus'...
                case 'entypo-minus' :
                    if( curNodeData ) {
                        $('#modal-confirm .delete').data('delete', curNodeData);
                        $('#modal-confirm').modal('show');
                    } else {
                        console.warn('%c 删除数据异常，检查代码逻辑！','color:red');
                    }
                    break; // end of case 'entypo-minus'...
                case 'entypo-pencil' :
                    if( curNodeData ) {
                        $('#modal .btn-confirm').data('change',curNodeData );
                        $('#modal').modal('show');
                        com.setCondition( 'modal', curNodeData );
                    } else {
                        return false ;
                    }
                    break; // end of case 'entypo-pencil'...
                case 'entypo-cog' :
                    var $a = $this.is('A') ? $this : $this.parents('a');
                    if( $a.hasClass('open') ) {
                        $('#searchCondition .panel').slideUp("normal");
                        $a.removeClass('open');
                    } else {
                        $('#searchCondition .panel').slideDown("normal");
                        $a.addClass('open');
                    }
                    break; // end of 'entypo-cog'...
            } // end of switch...
        }); //end of $('#nodeCondition').on('click'...
    };

    /*
    *   获取标题栏或信息栏中显示的标题及按钮
    *   @params： headOption 对象数组或字符串数组
    *   @return： 返回对象数组
    * */
    var getHeadOption = function(headOption) {
        //初始化四种参数
        var addObj = {
            title: "增加",
            type : "add",
            icon : "entypo-plus"
        };
        var minus = {
            title: "删除",
            type : "minus",
            icon : "entypo-minus"
        };
        var collapse = {
            title: "收展",
            type : "collapse",
            icon : "entypo-down-open"
        };
        var edit = {
            title: "编辑",
            type : "edit",
            icon : "entypo-pencil"
        };
        var config = {
            title: "高级搜索",
        		type : "config",
        		icon : "entypo-cog"
        };
        var returnArr = [];
        if( $.isArray( headOption )) {    //如果有参数那么参数类型必须为数组,否则使用默认设置
            var arr = typeof( headOption[0] ) ;
            switch( arr ) {
                case 'string' :     //传入的是字符串类型，则说明是用系统默认的按钮
                    for( var i in headOption ) {
                        var sign = headOption[i].toLowerCase();
                        if( sign.indexOf('-') == -1 ) {    //用简称设置head按钮
                            switch (sign) {
                                case 'add' :
                                    returnArr.push(addObj);
                                    break;
                                case 'minus':
                                    returnArr.push(minus);
                                    break;
                                case 'collapse':
                                    returnArr.push(collapse);
                                    break;
                                case 'edit':
                                    returnArr.push(edit);
                                    break;
                                case 'config':
                                	returnArr.push(config);
                                	break;
                            } //end of switch(i)...
                        } else {    //使用字符串数组，暂不支持其他输入的按钮名称
                            u.msg('error', '标题栏设置按钮失败！', '标题栏设置');
                            return false ;
                        }
                    } //end of for( ...
                    break;
                case 'object' :     //传入的是对象类型，说明是自定义按钮，则直接返回该对象数组
                    return headOption ;
            }
        } else {
            returnArr.push( collapse );
        }
        return returnArr ;//返回初始化headOpton数组
    };

    /*
    *   获取panel的footer中是否有按钮
    *   @params : footOption 对象数组或字符串数组
    *   @return : footOption 对象数组
    *   paramObj : [{
    *                   title : //string 显示名称
    *                   icon  : //entypo 图标字体
    *                   class : //bootstrap 样式或自定义样式
    *              }]
    *   或者
    *   ["submit","reset","search","cancel"]默认提供四种按钮及样式,赋值其中的几种，显示的顺序按照其在数组中的位置决定
    * */
    var getFootButton = function( footOption ) {
        var returnArr = [];
        if( $.isArray(footOption) ) {
            var sign = typeof( footOption[0] ); //通过第一个数据类型判断传入的数据
            var submit = {
              title : "提交",
              id    : "submit",
              icon  : "entypo-check",
              class : "btn btn-green  icon-left"
            };
            var cancel = {
                title : "取消",
                id    : "cancel",
                icon : "entypo-cancel",
                class : "btn btn-warning  icon-left"
            };
            var search = {
                title : "查找",
                id    : "search",
                icon : "entypo-search",
                class : "btn btn-info  icon-left"
            };
            var reset = {
                title : "重置",
                id    : "reset",
                icon : "entypo-doc",
                class : "btn btn-default  icon-left"
            };
            switch( sign ) {
                case 'string' :
                    for(var i in footOption ) {
                        var str = footOption[i].toLowerCase() ;
                        switch( str ) {
                            case 'submit' :
                                returnArr.push( submit );
                                break;
                            case 'reset' :
                                returnArr.push( reset );
                                break;
                            case 'cancel' :
                                returnArr.push( cancel );
                                break;
                            case 'search' :
                                returnArr.push( search );
                                break;
                        } //end of switch...
                    }   //end of for ..
                    break;
                case 'object' :
                    returnArr = footOption ;
                    break;
            }

        } else {
            return false ;
        }
        return returnArr ;
    };

    /*
    *   生成行级dom结构，返回行，结构如下：
    *   <div class="form-group">
    *      <label class="col-sm....>标题</label>...
    *      <div class="....
    *           <input ....
    *      </div>
    *      ...label 与div 集合重复
    *   </div> <!-- end of <div form-group...
    *   data为每行的数据数组, defaultObj包含label与div宽度
    *
    * */
    var createRow = function( data, defaultObj ) {
        var $outterDiv  = $('<div class="form-group">');//最外层div
        var labelClass  = `col-sm-${defaultObj.labelWidth} control-label`;
        var divClass    = `col-sm-${defaultObj.inputWidth}`;
        var addTip = function( obj ){
            if( obj instanceof $ ) {
                var opt = { //给校验的输入框增加错误提示，指导正确输入
                    placement : "auto",
                    title : obj.data('chkTip')
                };
                obj.tooltip( opt );
            } else {
                u.msg('error', '设置modal参数错误', '设置modal');
                console.warn("设置modal出错！");
                top.reload();
                return false ;
            }
        };
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.isNotModalRender)
                continue;
            var nodeName = d.type || 'input' ;
            var $label      = $('<label>');
            var $innerDiv   = $('<div>');
            var $input      = $('<input>');
            $label.addClass( labelClass );
            $innerDiv.addClass( divClass );

            $label.addClass( labelClass );
            $label.text( d.title);
            $label.attr('data-toggle', 'tooltip');
            $label.attr('data-placement', 'auto');
            $label.attr('title', d.title) ;


            if (nodeName == 'input') {
                $input = $('<input>');
                $input.addClass('form-control');
                $innerDiv.append($input);
                $input.attr('name', '_modal_'.concat(d.data))
                    .attr('id', '_modal_'.concat(d.data))
                    .attr('type', 'text')
                    .data('validate', d.validate);
                if( d.isNeeded ) {
                    $input.data('isNeeded',true);
                    $input.addClass('chkNeeded');
                }
                if( d.chkTip ) {
                    $input.data('chkTip', d.chkTip) ;
                    addTip( $input );
                }
            }
            //TODO select
            if (nodeName == 'select') {
                $input = $('<select>');
                $input.addClass('form-control input');
                $input.attr('name', '_modal_'.concat(d.data))
                    .attr('id', '_modal_'.concat(d.data));
                $innerDiv.append($input);
                var children = sessionStorage.getItem( location.href+d.data ) ;
                    children = JSON.parse(children);
                if( children ) {
                    u.select2($input, children) ;

                } else {
                    d.children && d.children.length && (u.select2($input, d.children));
                }
                try{
                    $input.val(children[0].id+'').trigger('change');//设置默认值
                } catch(e) {
                    console.warn(" %c 检查该字段是否已经初始化（不能重复初始化！）","color:red");
                }

            }
            //textarea
            if (nodeName == 'textarea') {
                $input = $('<textarea>');
                $input.addClass('form-control');
                $innerDiv.append($input);
                $input.attr('name', '_modal'.concat(d.data))
                    .attr('id', '_modal_'.concat(d.data))
                    .css('width','100%')
                    .css('max-width', '100%')
                    .css('min-width', '100%')
                    .css('min-height', '68px')
                    .data('validate', d.validate);
                if( d.chkTip ) {
                    $input.data('chkTip', d.chkTip) ;
                    addTip($this);
                }
            }
            if ( nodeName == 'time' ) {
                $input = $('<input>');
                $input.attr('id', '_modal_'.concat(d.data));
                $input.addClass('form-control');
                $input.attr('name', '_modal_'.concat(d.data));
                $innerDiv.append($input);
                setTimeout(function () { //延迟执行
                    u.timePicker($input.prop('id'));
                });
            }
            if (nodeName == 'selectTree' ) {
                $input = $('<select>');
                $input.attr('id', '_modal_'.concat(d.data));
                $input.addClass('form-control');
                $input.attr('name', '_modal_'.concat(d.data));
                $innerDiv.append( $input );
                var tree = sessionStorage.getItem( location.href+d.data ) ;
                tree = JSON.parse(tree);
                if( tree ) {
                    u.select2tree($input, tree) ;
                    $input.val(tree[0].id+'').trigger('change');
                } else {
                    d.children && d.children.length && (u.select2tree($input, d.children));
                }

            }
            $outterDiv.append( $label );
            $outterDiv.append( $innerDiv );
        }// end of for....
        return $outterDiv ;
    };//end of createRow

    return {
        validate : commonValidate,
        urlMapper : {
            DataCenterController : {
                //保存数据方法
                saveDataCenter : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-centers')
                },
                //删除单条数据方法
                deleteDataCenterById : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-centers/{id}')
                },
                //删除所有数据方法
                deleteAllDataCenter : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-centers')
                },
                //修改数据方法
                updateDataCenter : {
                    type : _type.put,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-centers/{id}')
                },
                //查询所有数据方法
                selectAllDataCenter : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-centers?structure=TREE')
                },
                //查询下一层数据
                selectAllDataCenterGetChildren : {
                    type : _type.get,
                    url : window.obj.ctlBaseUrl.concat('/metadata/data-centers?pid={id}')
                },
                //查询单条数据方法
                selectDataCenterById : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-centers/{id}')
                },
                //查询功能方法
                searchDataCenter : {
                    type : _type.post,
                    url : window.obj.ctlBaseUrl.concat('/metadata/data-centers/search')
                },
                //查询数据字典静态数据的方法
                staticDataCenter:{
                		type:_type.get,
                		url:'../../pages/data_center/data/modal.json'
                }

            }, // end of DataCenterController
            BusinessController :{
                //保存数据方法
                saveBusiness : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems')
                },
                //删除单条数据方法
                deleteBusinessById : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems/{id}')
                },
               //删除所有数据方法
                deleteAllBusiness : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems')
                },
               //修改数据方法
                updateBusiness : {
                    type : _type.put,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems/{id}')
                },
                //查询所有数据方法
                selectAllBusiness : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems?structure=TREE')
                },
                //查询单条数据方法
                selectBusinessById : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems/{id}')
                },
              //动态获取数据库及相关信息
                findAdditionOptions : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/business-systems/addition-options')
                },
                //查询功能方法
                searchBusiness : {
                    type : _type.post,
                    url : window.obj.ctlBaseUrl.concat('/metadata/business-systems/search')
                }
            },// end of BusinessController
            //数字字典管理功能
            DataDictController : {
                //保存数据字典
                saveDataDict : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts/')
                },
                //单条删除数据方法
                deleteDataDictById : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts/{id}')
                },
                //全部删除方法
                deleteAllDataDict : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts')
                },
                //修改数据字典
                updateDataDict : {
                    type : _type.put,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts/{id}')
                },
                //查询字典树形结构
                selectAllDataDict : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts?structure=TREE')
                },
                //懒加载方法
                selectDataDictById : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts/{id}')
                },
                //查询方法
                searchDataDict : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-dicts/search')
                },
            }, // end of DataDictController
            DataServerController : {
                saveDataServer : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers')
                },
                deleteDataServerById : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers/{id}')
                },
                selectAllDataServer : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers?structure=TREE')
                },
                selectDataServerById : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers/{id}')
                },
                updateDataServer : {
                    type : _type.put,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers/{id}')
                },
                searchDataServer : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers/search')
                },
                //动态获取数据库及相关信息
                findAdditionOptions : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers/addition-options')
                },
              
                testConnection : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-servers/connection/test')
                }
            }, //end of DataServerController
            EntityController : {
                saveEntity : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-entities')
                },
                deleteEntityById : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-entities/{id}')
                },
                selectAllEntity : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-entities?structure=TREE')
                },
                selectEntityById : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-entities/{id}')
                },
                updateEntity : {
                    type : _type.put,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-entities/{id}')
                },
                searchEntity : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-entities/search')
                }
            },  //end of EntityController
            FieldController : {
                saveField : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-fields')
                },
                deleteFieldById : {
                    type : _type.delete,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-fields/{id}')
                },
                selectAllField : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-fields?structure=TREE')
                },
                selectFieldById : {
                    type : _type.get,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-fields/{id}')
                },
                updateField : {
                    type : _type.put,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-fields/{id}')
                },
                searchField : {
                    type : _type.post,
                     url : window.obj.ctlBaseUrl.concat('/metadata/data-fields/search')
                },
            },  //end of FieldController
            FileUploadController : {
                saveFileUpload : {
                    type:_type.post,
                    url : window.obj.ctlBaseUrl.concat('/metadata/file-upload')
                }
            }
        },     //后台url路由表

        ajax : function( url, type, params, sucFn, async, dataType,  errFn, compleFn, contentType ) {

            async = async ? true : false ;
            type = (type==null || type=="" || typeof(type)=="undefined")? "get" : type;
            dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
            params = (params==null || params=="" || typeof(params)=="undefined")? "_date = " + new Date().getTime() : params;
            dataType = (dataType==null || dataType=="" || typeof(dataType) === "undefined") ? "json" : dataType ;
            contentType = (contentType == null || contentType == "" || typeof(contentType) === "undefiend" ) ?
                                "Application/json; charset=utf-8" : contentType ;
            if( -1 < url.indexOf('{id}')) {
                url = initUrl( url, '{id}', params.id || params.pid ) ;
            }

            return $.ajax({
                url : encodeURI( url ) ,
                type : type ,
                async : async ,
                data : JSON.stringify(params) ,
                dataType : dataType ,
                contentType : contentType ,
                success : sucFn ? sucFn : successFn,
                error : errFn ? errFn : errorFn,
                complete : compleFn ? compleFn : completeFn
            });
        },// end of ajax fn
        get : function( url, params, sucFn, async, dataType, errFn, compleFn, contentType){

            dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
            async = async ? true : false ;
            params = (params==null || params=="" || typeof(params)=="undefined")? "_date = " + new Date().getTime() : params;
            contentType = (contentType == null || contentType == "" || typeof(contentType) === "undefiend" ) ?
                "Application/json; charset=utf-8" : contentType ;

            if( -1 < url.indexOf('{id}')) {
                url = initUrl( url, '{id}', params.id || params.pid ) ;
            }

            return $.ajax({
                url : encodeURI( url ) ,
                type : "get" ,
                async : async ,
                data : JSON.stringify(params) ,
                dataType : dataType ,
                contentType : contentType,
                success : sucFn ? sucFn : successFn,
                error : errFn ? errFn : errorFn,
                complete : compleFn ? compleFn : completeFn
            });
        }, // end of get fn
        post : function( url, params, sucFn, async, dataType, errFn, compleFn, contentType){
            async = async ? true : false ;
            dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
            params = (params==null || params=="" || typeof(params)=="undefined")? "_date = " + new Date().getTime() : params;
            contentType = (contentType == null || contentType == "" || typeof(contentType) === "undefiend" ) ?
                "Application/json; charset=utf-8" : contentType ;

            if( -1 < url.indexOf('{id}')) {
                url = initUrl( url, '{id}', params.id || params.pid ) ;
            }

            return $.ajax({
                url : encodeURI( url ) ,
                type : "post" ,
                async : async ,
                data : JSON.stringify(params) ,
                dataType : dataType ,
                contentType : contentType,
                success : sucFn ? sucFn : successFn,
                error : errFn ? errFn : errorFn,
                complete : compleFn ? compleFn : completeFn
            }); 
        },//end of post fn
        /*
        *   创建查询条件下dom结构
        *   [{
        *       container : Object , //装载生成的dom容器，可以为jquery对象也可以为id
        *       array : [{       //创建dom所需数组
        *          title : '...',   //用title作为label的文本
        *          data : '....',   //使用 处理后的data作为查询容器中input标签的id
        *          validate : '...' //可选参数，作为数据校验的规则，此条件为标准正则表达式
        *       }, ...."
        *       ],
        *       countCol,   //查询条件中每行显示多少个查询条件，默认3个
        *       labelName,  //标题栏显示的名称
        *       type, 容器类型：//默认值为：search ,可选Modal，node 等值（该值已经设置为自动获取）
        *       headOption, //标题栏中右侧按钮，对象数组或字符串数组,对象形式为自定义按钮设置
        *                       参数说明：
        *                       paramObj : [{
        *                           title:  //字符串类型，显示按钮的名称
        *                           type : //自定义类型，
        *                           icon ：//标题展示图标,可以为图标完全的class名称，如：entypo-pencil,可以为简称，如：pencil（使用非entypo字体必须全称）
        *                       },......]
        *                       paramsStr ： ["edit","add","minus","collapse"] 默认提供四种
        *       footOption, //在标题栏底框中显示的按钮，默认为提交和重置，可自定义,如果不提供数据则默认不绘制按钮
        *                       参数说明：
        *                       paramObj : [{
        *                           title : //string 显示名称
        *                           icon  : //entypo 图标字体
        *                           class : //bootstrap 样式或自定义样式
        *                       }]
        *                       或者
        *                       ["submit","reset","search","cancel"]默认提供四种按钮及样式,赋值其中的几种，显示的顺序按照其在数组中的位置决定
        *       defaultLabelWidth,  //默认label长度，default为空或fasle
        *       opt : Object //扩展参数，目前备选
        *
        *   }]
        * */
        searchCondition : function(container, array, countCol, labelName, type, defaultLabelWidth, headOption, footOption, opt){
            countCol = countCol ? parseInt(countCol) : 3 ;  //默认每行三个查询条件
            labelName = labelName ? labelName : '查询条件' ;

            var nodeArray = []; //将不需要绘制的数据剔除

            switch(typeof(container)){
                case 'object' :
                    if(container instanceof jQuery || container instanceof $){
                    } else {
                        u.msg('error', '请传入jQuery对象', '初始化searchCondition错误');
                        return false ;
                    }
                    break;
                case 'string':
                    container = $('#'.concat( container ));
                    break;
            }// end of switch

            type = getFlag( type ) ;
            var sign = 'isNotNodeRender';   //默认为节点绘制控制符，还有isNotSearchRender/isNotModalRender
            switch( type.replace(/_/g,'') ){ //获取当前绘制的容器类型
                case 'search':
                    sign = 'isNotSearchRender';
                    break;
                case 'modal':
                    sign = 'isNotModalRender';
                    break;
                case 'node':
                    sign = 'isNotNodeRender';
                    break;
            }
            array.map(function(ele, indx) {
                if( !ele[sign] ) {
                    nodeArray.push( ele );
                }
            });

            var $main = $('<div>'); //panel主体
            var $head = $('<div>'); //panel标题
            var $body = $('<div>'); //panel具体内容部分

            //初始化三个对象样式
            $main.addClass('panel panel-default panel-shadow');
            $head.addClass('panel-heading');
            $body.addClass('panel-body');

            //设置head具体内容
            var $headTitle = $('<div>');
            var $headOption = $('<div>');

            $headTitle.addClass('panel-title');
            $headTitle.text( labelName );   //设置标题名称

            $headOption.addClass('panel-options');

            headOption = getHeadOption( headOption ) ;
            for(var i in headOption ) {
                var obj = headOption[i] ;
                var $headOptionA = $('<a>');
                var $ai = $('<i>');
                var $txt = $('<span>');
                $headOptionA.attr('href', 'javascript:void(0);');
                if( "collapse" == obj.type ) {
                    $headOptionA.attr('data-rel', obj.type) ;
                } else if( "config" == obj.type ) {
                    $headOptionA.addClass('open');
                }
                $ai.addClass( obj.icon );
                if( !$txt.text() ) {    //如果有默认标题，使用原标题
                    $txt.text( obj.title );
                }
                $headOptionA.append($ai);
                $headOptionA.append($txt);
                $headOption.append($headOptionA);
            }

            $head.append($headTitle);
            $head.append($headOption);
            //设置head结束

            //设置body具体内容
            var $bodyForm = $('<form>');
            $bodyForm.addClass('form-horizontal form-groups-bordered');
            $body.append($bodyForm);

            var groupDiv = $('<div>');
            var exampleDiv = $('<div>');
            var cDiv = $('<div>');
            var dDiv = $('<div>');  //包含在groupDiv内的div
            var maxColWidth = 12 ;  //最大宽度
            groupDiv.addClass('form-group');
            exampleDiv.addClass('form-group bs-example');

            cDiv.addClass('form-group');//行div
            dDiv.addClass('col-sm-' + maxColWidth);//装载行的div
            groupDiv.append(dDiv);

            var rowCol = {
               labelWidth : 1,  //default value : col-sm-1
                 divWidth : 3   //default value : col-sm-3
            } ;
            if( 7 > countCol && 0 < countCol ) {    //bootstrap网格布局最大为12，取值为1~6的闭区间整数，即可以放12个col-sm-1的元素
                var eachColWidth = parseInt(maxColWidth / countCol) ;
                if( !defaultLabelWidth ) {
                    rowCol.divWidth = eachColWidth - rowCol.labelWidth ;//取默认的label长度
                } else {
                    rowCol.divWidth = Math.ceil( eachColWidth / 2 ) ;//将div的宽度设置为较大的值
                    rowCol.labelWidth = eachColWidth - rowCol.divWidth ;//将label 的宽度设置为较小的值
                }
            } else {
                u.msg('error', '查询列数值过大，请设置1~6的闭区间的整数，当前为：'+countCol,'查询条件初始化') ;
                return false ;
            }
            for( var i in nodeArray ) {
                var _o = nodeArray[i] ;
                var iLabel  = $('<label>');
                var iDiv    = $('<div>');
                var iInput  = $('<input>');
                if( _o.type ) {
                    switch( _o.type ) {
                        case 'select' :
                            break;
                        case 'selectTree' :
                            iInput = $('<select>');
                            break;
                    }
                }
                var labelWidth = 'col-sm-' + rowCol.labelWidth ;
                var   divWidth = 'col-sm-' + rowCol.divWidth ;

                iLabel.addClass( labelWidth + ' control-label');
                iLabel.text(_o.title);
                iLabel.attr('data-toggle', 'tooltip');
                iLabel.attr('data-placement', 'right');
                iLabel.attr('title', _o.title) ;

                iDiv.addClass( divWidth );

                iInput.addClass('form-control');
                iInput.attr('id', type.concat(_o.data)) ;
                iInput.attr('type', 'text');
                if( _o.type ) {
                    iInput.attr('data-type', _o.type);
                }

                if(_o.hasOwnProperty('type') ) {
                    switch( _o.type ) {
                        case 'time' :
                            u.timePicker(iInput.prop('id'), false);
                            break;
                        case 'select' : //这里及selectTree中要用延迟函数处理，外加let关键字设定闭包初始化参数
                            var key = _o.data ;
                            var id = type.concat(key);
                            setTimeout(function(){
                                var children = sessionStorage.getItem( location.href+ key ) ;
                                    if( children ) {
                                        children = JSON.parse(children) ;
                                        u.select2( id, children) ;
                                        $( '#'+id ).val( children[0].id+'' ).trigger('change');//默认选择第一个
                                    }
                            });
                            break;
                        case 'selectTree' :
                            var tKey = _o.data ;
                            var tId = type.concat(tKey);
                            setTimeout(function(){
                                var children = sessionStorage.getItem( location.href + tKey) ;
                                if( children ) {
                                    children = JSON.parse(children) ;
                                    u.select2tree( tId, children ) ;
                                    $( '#'+tId ).val( children[0].id+'' ).trigger('change');//默认选择第一个
                                }
                            });
                            break;
                    }
                }
                iDiv.append(iInput);
                cDiv.append(iLabel);
                cDiv.append(iDiv);
                if( 0 === ( parseInt(i) + 1 )%countCol ) {//设置新的一行
                    dDiv.append(cDiv);
                    cDiv = $('<div>');
                    cDiv.addClass('form-group');
                } else if( parseInt(i) === nodeArray.length - 1 ) {
                    dDiv.append(cDiv);
                }
            }
            $bodyForm.append(groupDiv);
            //绘制footer中按钮逻辑
            if( footOption ) {
                var footerBtnArr = getFootButton( footOption );
                if( footerBtnArr ) {
                    var eCenter = $('<center>');
                    for( var i in footerBtnArr ) {
                        var obj = footerBtnArr[i] ;
                        var btnConfirm = $('<button style="margin:0 5px;min-width:70px;">');

                        btnConfirm.addClass(obj.class) ;
                        btnConfirm.attr('id', type.concat(obj.id));
                        btnConfirm.text(obj.title);
                        
                        if(obj.icon){
                        	var btnConI = $('<i>');
                        	btnConI.addClass(obj.icon);
                        	btnConfirm.append(btnConI) ;
                        }
                        eCenter.append(btnConfirm);//放入到center中
                    }
                    exampleDiv.append(eCenter);
                    $bodyForm.append(exampleDiv);
                }
            }//end of isNotButton

            $main.append($head);
            $main.append($body);
            container.append($main);
            //设置body结束

            var thisObj = this ;
            setTimeout(function(){
                $("[data-toggle='tooltip']").tooltip();//延迟函数添加tooltip
                addEventHandler(thisObj) ;
            });
        },   //end of searchCondition
        getCondition : function( container ) {
           var _container = $('#'.concat( container )) ;
           var map = {};   //返回的map集合
           if( (_container instanceof $) && _container.length ) {
               var arr = [];
               var modalId = `#${container} .panel-body .col-sm-12 [id^='_search_']`;
               arr = $(modalId);
               if( arr.length ) {
                   arr.each(function(idx, ele){
                       var $self = $(this) ;
                       var  id = $(this).prop('id').replace('_search_', '') ;
                       if( ( $self.val() == "0" || $self.val().trim() ) &&
                           ($self.parent().css('display') != 'none' || id=='id' )
                       ) {
                           map[id] = $(this).val();
                       }
                   });  //将查询条件放到map中
               } else if( !arr.length ) {
                   modalId = `#${container} .panel-body .col-sm-12 [id^='_modal_']`;
                   arr = $(modalId);
                   arr.each(function(idx, ele){
                       var $self = $(this) ;
                       var  id = $(this).prop('id').replace('_modal_', '') ;
                       if( ( $self.val() == "0" || $self.val().trim() ) &&
                           ( $self.parent().css('display') != 'none' || id=='id' )
                       ) {
                           map[id] = $(this).val();
                       }
                   });  //将查询条件放到map中
               } else {
                   u.msg('error', '获取查询条件失败！', '获取查询条件函数');
                   return false ;
               }
           } else {
               u.msg('error', '获取容器对象失败！', '获取查询条件函数');
           }
           return map ;
        },  //end of getCondition
        
        setCondition : function( container, data ) {
            container = $( '#'.concat(container) );
            var flag = container.find('input').first().prop('id');
            flag = getFlag( flag );
            for( var idx in data ) {
                if( idx.toLowerCase().indexOf('time') > -1 ) {
                    var time = u.timeFormat( data[idx] ) ;
                    container.find('#'.concat(flag).concat(idx)).val( time ) ;
                }
                else if( container.find('#'.concat(flag).concat(idx)).is('select') ){
                		container.find('#'.concat(flag).concat(idx)).val(data[idx]+'').trigger('change');
                }
                else{
                    container.find('#'.concat(flag).concat(idx)).val(data[idx]) ;
                }

            }
        },  //end of setCondition
        cleanCondition : function( container ) {
            var _container = $('#'.concat( container ));
            var flag = _container.find('input').first().prop('id');
            if( !flag ) {
                console.warn('获取标识失败');
                return false ;
            }
            flag = getFlag( flag );
            var modalId = `#${container} .panel-body .col-sm-12 [id^='` + flag + `']`;
            var arr = $(modalId);
            arr.each(function( idx, ele ) {
                var $self = $(this) ;
                $self.val('');
            });
        },  //end of cleanModalCondition

        /*
         *生成模太框的统一方法，主要用来做新增，修改
         *@param $container -- jquery对象,容器的选择器
         *@param data --object,生成modal的数据，新增的话为空为columnArray 生成form
         *@param initObj	--object, 设置标题按钮名称label及input宽度（栅格值：[1-12] 任意整数）
         *@param isRerender -- boolean , 判断是否添加form，只控制是否新增三个btn按钮
         **/
        initModal : function(container, data, isRerender, initObj ) {
            //确保container为jquery对象
            switch(typeof(container)){
                case 'object' :
                    if(container instanceof jQuery || container instanceof $){
                    } else {
                        u.msg('error', '请传入jQuery对象', '初始化searchCondition错误');
                        return false ;
                    }
                    break;
                case 'string':
                    container = $('#'.concat( container ));
                    break;
            }// end of switch
            //---------------------设置modal的统一宽高
            var width = initObj?initObj.contentWidth||'130%':'130%',
            		height = initObj?initObj.contentWidth||'-15%':'-15%';
            container.find('.modal-content').eq(0).css({
            		'width':width,
            		'left':height
            });
            if( !data.length ) {
                console.warn('%c 初始化Modal，传入初始化数组为空！[本信息非系统错误，该提示在生产系统中将删除]', "color:red");
                return false ;
            }
            var _data = [];    //校验数据，将不必在modal中绘制的数据剔除
            for( var i in data ) {
                var obj = data[i] ;
                if( !obj.isNotModalRender ) {
                    _data.push( obj );
                }
            }//end of for ..in data ..
            var defaultObj = {
                title: '基础信息',
                btnCancel: '取消',
                btnConfirm: '确定',
                labelWidth: 2,
                inputWidth: 4
            };
            if (initObj) {
                $.extend(defaultObj, initObj);
            }
            var $form       = $('<form class="form form-horizontal form-groups-bordered">');  //form表单
            var $divGroup   = $('<div class="form-group">');   //内层div控制行，防止出现form-group的borderr线
            var $divCol     = $('<div class="col-sm-12">');   //divCol 实际装载所有行的容器，使内部label文字产生内边距

            //由内向外依次append
            $divGroup.append( $divCol );
            $form.append( $divGroup );
            if( container
                    .find('.modal-body .form-container').length ) {
                container
                    .find('.modal-body .form-container')
                    .append($form);
            } else {
                container.append( $form );
            }

            //判断每行需要装载条件框的个数（一个label和一个嵌套input的div为一列）
            var countCol = 2 ;//暂时硬编码
            if( 7 > countCol && 0 < countCol ) {    //bootstrap网格布局最大为12，取值为1~6的闭区间整数，即可以放12个col-sm-1的元素
                var eachColWidth = parseInt(12 / countCol) ;
                if( true ) {    //摘取自searchCondition绘制方法
                    defaultObj.inputWidth = eachColWidth - defaultObj.labelWidth ;//取默认的label长度
                } else {
                    defaultObj.inputWidth = Math.ceil( eachColWidth / 2 ) ;//将div的宽度设置为较大的值
                    defaultObj.labelWidth = eachColWidth - defaultObj.inputWidth ;//将label 的宽度设置为较小的值
                }
            } else {
                u.msg('error', '查询列数值过大，请设置1~6的闭区间的整数，当前为：'+countCol,'查询条件初始化') ;
                return false ;
            }//计算每行的label与div宽度 countCol指定每行存放几个标签

            var eachRowData = [];
            for (var i = 0; i < _data.length; i++) {//生成form
                var d = _data[i];
                // 如果是textarea就单独一行
                if(d.type == 'textarea' || d.isOneRow ){
                		$divCol.append( createRow( eachRowData, defaultObj ) );//先绘制以前的行
                    eachRowData = [d];//
                    var textAreaObj={};
                    		textAreaObj.labelWidth = 2;
                    		textAreaObj.inputWidth = 10;
                    $divCol.append( createRow( eachRowData, textAreaObj ) );//绘制textarea
                    eachRowData = [];
                    continue;
                }
                // 如果是textarea就单独一行 －－－－－－－end－－－－－－－－
                eachRowData.push(d) ;
                if( 0 === ( parseInt(i) + 1 )%countCol ) {//设置新的一行
                    $divCol.append( createRow( eachRowData, defaultObj ) );//绘制行
                    eachRowData = [];//绘制一行之后重新装载新的一行
                } else if( parseInt(i) === _data.length - 1 ) {
                    $divCol.append( createRow( eachRowData, defaultObj ) );//如果最后一行不满countCol个，直接绘制
                    eachRowData = [];//清空数组
                }
            }//end of for ...
            if( !isRerender ) {
                container.find('.modal-title').first().find('span').text(
                    defaultObj.title);
                container.find('.btn-cancel').find('span').text(
                    defaultObj.btnCancel);
                container.find('.btn-confirm').find('span').text(
                    defaultObj.btnConfirm);
                setTimeout(function () {
                    // 插件的使用
                    container.find('.modal-body')
                        .niceScroll({
                            cursorcolor: "red",
                            autohidemode: 'hidden',
                            railoffset: true
                        })
                        .resize();

                    //添加输入校验
                    container.on({
                        'keyup' : function (e) {
                            var $this = $(this);
                            var isNeeded = $this.hasClass('chkNeeded') ;
                            var value = $this.val(),
                                rule = $this.data('validate'),
                                tip = $this.data('chkTip'),
                                isPass = false ;
                            if( rule && tip ) {   //既没有校验规则也没有校验提示，什么都不做
                                if ( rule && typeof(rule) == 'object') {
                                    isPass = rule.test(value);
                                } else if( rule && typeof(rule) == 'function' ) {
                                    isPass = rule(value);
                                }

                                if ( isPass && '' !== value.trim() ) {
                                    isNeeded ? $this.removeClass('chkNeeded') : null ;
                                    $this.removeClass('chkError');
                                    $this.addClass('chkPass');
                                    $this.tooltip('hide');
                                } else if( !isPass && '' !== value.trim() ) {
                                    isNeeded ? $this.removeClass('chkNeeded') : null ;
                                    $this.removeClass('chkPass');
                                    $this.addClass('chkError');
                                    $this.tooltip('show');
                                } else if( '' === value.trim() ){
                                    $this.removeClass('chkError');
                                    $this.removeClass('chkPass');
                                    $this.data('isNeeded') ? $this.addClass('chkNeeded') : null ;
                                }
                            } else {// end of if( !rule...
                                //如果没有校验规则，如果有值添加chkPass样式
                                if( '' !== value.trim() ) {
                                    $this.addClass('chkPass');
                                } else {
                                    $this.removeClass('chkPass');
                                }
                            } // end of else

                        },//end of keyup
                        'change' : function(e) {
                        }
                    },'input[type="text"], select');// end of 添加事件

                    //增加modal事件
                    container.on('click', '.btn-confirm,.btn-add,.btn-test', function(e) {
                        var $this = $('#modal');
                        var inputArr = $this.find('input,select') ;
                        inputArr.each(function(idx,ele){
                            var $this = $(ele),checkRule = $this.data('validate'),checkPass ;
                            var value = $this.val();
                            if( checkRule&& $this.parent().css('display') != 'none') {
	                            	if ( checkRule && typeof(checkRule) == 'object') {
	                            		checkPass = checkRule.test(value);
	                                } else if( checkRule && typeof(checkRule) == 'function' ) {
	                                	checkPass = checkRule(value);
	                                }
                                !checkPass && $this.addClass('chkError')
                            }
                        });
                        if( $('#modal .chkError,.chkNeeded').length ) {    //有校验不通过的不能继续执行
                            u.msg('error', '请输入正确数值', '数据校验');
                            return false ;
                        }
                    });
                    //当模态框关闭时，清除所有框内数据以及存在的校验样式
                    container.on('hidden.bs.modal',function(e){
                        container.find('.chkNeeded,.chkError,.chkPass').each(function(idx,ele){
                            $(this).removeClass('chkError');
                            $(this).removeClass('chkNeeded');
                            $(this).removeClass('chkPass');
                        });
                    });
                    //当模态框调用show参数时，对modal中需要校验的数据增加校验的样式
                    container.on('show.bs.modal', function(e){
                        if( $('#_modal_id').val() ) {
                        } else {
                            container.find('input').each(function(idx,ele){
                                var $this = $(this);
                                if($this.data('isNeeded')) {
                                    $this.addClass('chkNeeded');
                                }
                            });
                        }
                    });

                });//end of setTimeout...
            } //end of if(!isRerender...

            $('textarea').niceScroll();
            $('textarea').on('change', function(e){
                $(this).niceScroll().resize();
            });

        },  //end of initModal
    }
});