require(["util", "niceScroll", "ztree", "common", "menu", "jquery"], function(u, n, z, com, m, $) {
    let data = [];
    com.get('../../data/data.json', null, function(result) {
        let array = [];
        m.parssMenueTreeByDeepModel(result, array);
        data = array;
        m.initMenu(data, $('#main-menu'));
        m.setupHorizontalMenu();
        $('.thisIsLoading').remove();
        $('header').show();
    }, false);
    $(function() {
        $('body').niceScroll({
            cursorcolor: "#424242",
            touchbehavior: false,
            autohidemode: false, 
        });
        $('#main-menu').on('click', function(e){
            let self = $(e.target) ;
            let url = '';
            if( self.is('A') ) {
                url = self.attr('url');
            } else {    //非a则获取a
                url = self.parent('a').attr('url') ;
            }

            if( url && url.indexOf('index') == -1 && url !== '#') {
                let iframe = $('iframe');
                iframe.attr('src', url);
            } else {
                return false ;
            }
        });
    });
});