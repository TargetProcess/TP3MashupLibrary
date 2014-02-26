tau.mashups
    .addDependency('Underscore')
    .addDependency('tp3/mashups/topmenu')
    .addDependency('tp3/mashups/componenteventlistener')
    .addDependency('Tp2Pages.config')
    .addCSS('Tp2Pages.css')
    .addMashup(function(_, topmenu, ComponentEventListener, settings) {
        var DEFAULT_ITEM = {
            'TP2 Home' : '/Default.aspx'
        };

        new ComponentEventListener('board.main.menu').on('afterRenderAll', function(event, afterRenderData) {
            // Get the mash-up configuration
            var uris = _.extend(DEFAULT_ITEM, settings.uris);
            var appPath = afterRenderData.data.context.configurator.getApplicationPath();

            function createMenuItemCallback(uri) {
                return function () {
                    var paramJoin =  uri.indexOf('?') == -1 ? '?' : '&';
                    $(this).tauIFramePopup({ url: [appPath, uri.replace(/^\s+|\s+$/g,''), paramJoin, 'rmnav=1&tp3=1&tp2link=1'].join('') });
                    $(this).tauIFramePopup('show');
                }
            }

            // Create and fill up the new menu
            var menuItem = topmenu.addItem('TP2');
            _.each(_.keys(uris), function (element) {
                menuItem.addItem(element).onClick(createMenuItemCallback(uris[element]));
            });
        });
    });
