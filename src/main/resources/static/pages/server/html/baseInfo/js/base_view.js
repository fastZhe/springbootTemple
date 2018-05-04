define(['jquery', 'util', 'common', './base_model'], function ($, u, com, model) {
    "use strict";
    return function() {
        var _model = new model.Model();
        var columnArray = _model.getInitObj(Object.keys(_model.getObj()));

        com.initModal('modal', columnArray,'',{
            title:'第一步：基础信息'
        } );
        $('body').niceScroll({
            cursorcolor: "#424242",
            autohidemode: true
        }).resize();
    };//return a funciton
});