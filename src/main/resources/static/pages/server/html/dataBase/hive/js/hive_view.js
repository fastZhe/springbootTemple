define(['jquery', 'util', 'common', '../../hive/js/hive_model'], function ($, u, com, _model ) {
    "use strict";
    return function(){
        var model = new _model.Model();
        var arr = model.getInitObj( Object.keys(model.getObj()) );
        com.initModal($('body'), arr, '', {
            title : "第二步：连接信息（Hive）"
        });
        $('#_modal_useConfig').val('1010702').trigger('change').attr('disabled','disabled');
        $('#_modal_needAuth').val('1010401').trigger('change').attr('disabled','disabled');
        $('#_modal_authType').val('1010801').trigger('change').attr('disabled','disabled');

        $('#modal').on('mousedown','.btn-test,.btn-add', function(e){//这里要使用down事件来设置参数
            var obj = com.getCondition('modal');
            obj = model.getSignificantObj( model.setObj(obj) );
            var hive = model.getFinalObj( obj );
            $('#modal').data('stepTwo', hive);
        });
    };
});