/*
* 扩展select2插件， 将其可以展示树形数据
*
*   将select2插件扩展为展示一个tree结构，深度不限，自定义树可选层级，如第一级不可选，将options中配置参数，level：1，如level超过最大深度，此参数将无效
*   当不设置level时(或者level为0时)，所有tree节点均可选择
* */
(function($) {
    $.fn.select2tree = function(data, options) {
        var defaults = {
            language: "zh-CN",
            theme: "default"
        };
        var opts = $.extend(defaults, options);
        createDom( data, '', $(this) ) ;
        opts.templateResult = function(data, container) {
            if(data.element) {
                //insert span element and add 'parent' property
                var $wrapper = $("<span></span><span>" + data.text + "</span>");
                var $element = $(data.element);
                $(container).attr("val", $element.val());
                if($element.attr("parent")) {
                    $(container).attr("parent", $element.attr("parent"));
                }
                return $wrapper;
            } else {
                return data.text;
            }
        };

        return $(this).select2(opts).on("select2:open", open);
    };
    function createDom( data, parent, container ) {
        for( let i in data ) {
            let $option = $('<option>');
            let obj = data[i];
            $option.attr('value', obj.id) ;
            $option.text( obj.text || obj.name || obj.zhName || obj.displayName || obj.dictName ) ;
            if( typeof(parent) == 'number' ) { //如果有父id，那么设置parent属性
                $option.attr('parent', parent);
            }
            container.append($option);
            if( obj.children && obj.children.length ) {
                createDom(obj.children, obj.id, container);
            }
        }
    }
    function moveOption(id) {
        if(id) {
            $(".select2-results__options li[parent=" + id + "]").insertAfter(".select2-results__options li[val=" + id + "]");
            $(".select2-results__options li[parent=" + id + "]").each(function() {
                moveOption($(this).attr("val"));
            });
        } else {
            $(".select2-results__options li:not([parent])").appendTo(".select2-results__options ul");
            $(".select2-results__options li:not([parent])").each(function() {
                moveOption($(this).attr("val"));
            });
        }
    }

    //deal switch action
    function switchAction(id, open) {
        $(".select2-results__options li[parent='" + id + "']").each(function() {
            switchAction($(this).attr("val"), open);
        });
        if(open) {
            $(".select2-results__options li[val=" + id + "] span[class]:eq(0)").removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
            $(".select2-results__options li[parent='" + id + "']").slideDown();
        } else {
            $(".select2-results__options li[val=" + id + "] span[class]:eq(0)").addClass("glyphicon-chevron-right").removeClass("glyphicon-chevron-down");
            $(".select2-results__options li[parent='" + id + "']").slideUp();
        }
    }

    //get the level of li
    function getLevel(id) {
        var level = 0;
        while($(".select2-results__options li[parent][val='" + id + "']").length > 0) {
            id = $(".select2-results__options li[val='" + id + "']").attr("parent");
            level++;
        }
        return level;
    }

    function open() {
        setTimeout(function() {
            moveOption();

            $(".select2-results__options li").each(function() {
                var $this = $(this);
                //loop li add some classes and properties
                if($this.attr("parent")) {
                    $(this).siblings("li[val=" + $this.attr("parent") + "]").find("span:eq(0)").addClass("glyphicon glyphicon-chevron-down switch").css({
                        "padding": "0 10px",
                        "cursor": "default"
                    });
                    $(this).siblings("li[val=" + $this.attr("parent") + "]").find("span:eq(1)").css("font-weight", "bold");
                }
                //add gap for children
                if(!$this.attr("style")) {
                    var paddingLeft = getLevel($this.attr("val")) * 2;
                    $("li[parent='" + $this.attr("parent") + "']").css("padding-left", paddingLeft + "em");
                }
            });

            //override mousedown for collapse/expand
            $(".switch").mousedown(function() {
                switchAction($(this).parent().attr("val"), $(this).hasClass("glyphicon-chevron-right"));
                event.stopPropagation();
            });

            //override mouseup to nothing
            $(".switch").mouseup(function() {
                return false;
            });
        }, 0);
    }
})(window.jQuery);