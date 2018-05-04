define(['jquery', 'util', 'common', '../../dqe/js/dqe_model'], function ($, u, com, _model ) {
    "use strict";
    return function(){
        var model = new _model.Model();
        var arr = model.getInitObj( Object.keys(model.getObj()) );
        com.initModal($('body'), arr, '', {
            title : "第二步：连接信息（DataCell Query Engine）"
        });
        $('#_modal_needAuth').val('1010401').trigger('change');
        $('#_modal_authType').val('1010801').trigger('change');
        $('#_modal_useConfig').val('1010702').trigger('change').attr('disabled','disabled');

        $('#modal').on('mousedown','.btn-test,.btn-add', function(e){//这里要使用down事件来设置参数
            var obj = com.getCondition('modal');
            obj = model.getSignificantObj( model.setObj(obj) );
            var mysql = model.getFinalObj( obj );
            $('#modal').data('stepTwo', mysql);
        });
        
        $('#_modal_needAuth').on('change', function(e){//这里要使用down事件来设置参数
        	
        	if('1010401' == $(this).val()){
        		
        		$('#_modal_username').removeAttr('disabled');
        		$('#_modal_password').removeAttr('disabled');
        		$('#_modal_authType').removeAttr('disabled');
        	}else{
        		$('#_modal_username').attr('disabled','disabled');
        		$('#_modal_password').attr('disabled','disabled');
        		$('#_modal_authType').attr('disabled','disabled');
        	}
        });
        
        
    };
});