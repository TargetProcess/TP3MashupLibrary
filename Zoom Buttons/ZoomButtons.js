tau
    .mashups
    .addDependency('jQuery')
    .addDependency('tau/configurator')
    .addMashup(function($, configurator) {

        'use strict';

        var zoom_wait                   = null;
        var zoom_timer                  = null;
        var zoom_tries                  = 10;
        var zoom_menu_opacity           = null;
        var zoom_slider_id              = ".i-role-board-actions-group .tau-zoom-level .ui-slider--zoomer";
        var zoom_listview_id            = 'button.tau-btn.tau-btn--view-switch.i-role-board-tooltip.tau-btn-list-view.tau-checked';
        var zoom_wrapper_id             = '.tau-board-header__control--actions';
        var zoom_actionbutton_off_id    = '.tau-board-header__control--actions .tau-actions-btn:not(.tau-checked)';
        var zoom_actionbutton_on_id     = '.tau-board-header__control--actions .tau-actions-btn.tau-checked';
        var zoom_actionbubble_id        = '.tau-board-actions-bubble';


        var reg = configurator.getBusRegistry();

        var addBusListener = function(busName, eventName, listener) {

            reg.on('create', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.on(eventName, listener);
                }
            });

            reg.on('destroy', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.removeListener(eventName, listener);
                }

                if ( zoom_timer !== null ) {
                    clearTimeout( zoom_timer );
                }

                if ( zoom_wait !== null ) {
                    clearTimeout( zoom_wait );
                }
            });

            reg.getByName(busName).done(function(bus) {
                bus.on(eventName, listener);
            });
        };

        var appendZoomButtons = function(e, renderData) {
            var $el = renderData.element;

            if ( $el.find('.btnZoom').length === 0) {
                var $elWrapper = $el.find(zoom_wrapper_id);
                var $elAnchor  = $elWrapper.length ? $elWrapper : $el.find('[role=actions-button]').parent();

                var $elGroup = $('<div id="zoom-buttons" class="tau-board-header__control--mashup" style="display:flex;margin-left:10px;align-items:center;"></div>');

                $.each({
                    Min: 1,
                    XS:  2,
                    S:   3,
                    M:   4,
                    L:   5,
                    XL:  6
                }, function( name, zoom ) {
                    $elGroup.append( $(
                        '<button class="tau-btn tau-btn--icon btnZoom" id="btnZoom'+ zoom +'" data-zoom="'+ zoom +'" ><span class="tau-btn__icon">'+ name +'</span></button>'
                    ) );
                });

                $elAnchor.before( $elGroup  );
            }

            // initially we have to open the menu and wait until the slider is loaded in dom,
            // try x times and then give up, maybe its dashboard and we don't want to poll anymore

            // initialize when buttons are rendered, which is also boardchange
            waitForSlider(); // try 10 times and then give up, might be dashboard

        };

        var toolbarComponents = [
            'board.toolbar'
        ];

        toolbarComponents.forEach(function(componentName) {
            addBusListener(componentName, 'afterRender', appendZoomButtons);
        });

        $(document).on('click','.btnZoom', function(){

            // read value from clicked button, stored as data-value
            var zoom = $(this).attr('data-zoom');

            // remember current menu state
            var was_open = isActionMenuOpen();

            // try to open menu, to access the slider
            openActionMenuOrKeep( was_open );

            // set zoom of board by controlling slider inside the menu
            $(zoom_slider_id).slider('value', zoom);

            // mark the clicked button as active
            setZoomHighlight( zoom );

            // restore remembered state
            closeActionMenuOrKeep( was_open );

        });

        var checkZoomButton = function(){

            // remember current menu state
            var was_open = isActionMenuOpen();

            // try to open menu, to access the slider
            openActionMenuOrKeep( was_open );

            if ( $(zoom_slider_id).length !== 0 ) {

                // read zoom value from slider, might be changed by user
                var zoom = $(zoom_slider_id).slider('value');

                // mark the zoom button to sync with the slider
                setZoomHighlight( zoom );
            }

            // restore remembered state
            closeActionMenuOrKeep( was_open );

            // try again when menu is open
            if ( was_open ) {
                zoom_timer = setTimeout(checkZoomButton, 1000);  // try again, slider was not ready
            }
        };

        var waitForSlider = function() {

            // count down one, to break after x tries
            zoom_tries--;

            // force open menu to read values, board-change means menu is closed
            openActionMenu();

            // if board-type is not compatible, simply close the menu
            // test for listview, then we can quickly hide the buttons
            if ( $(zoom_listview_id).length !== 0) {

                // Hide buttons from Top Menu
                $('#zoom-buttons').hide();

                // close menu, because we opened it
                closeActionMenu();

                // we gave up, wrong board type
                return false;
            }

            // when the board has a slider then sync the active button highlight
            if ( $(zoom_slider_id).length !== 0 ) {

                // read zoom from slider
                var zoom = $(zoom_slider_id).slider('value');

                // mark active button
                setZoomHighlight( zoom );

                // done, close the menu which we opened
                closeActionMenu();

                // start polling sync when menu is toggled, only open, only if triggered manually
                $(zoom_actionbutton_off_id).on('click', function() {

                    // poll for slider-changes when it was manually opened
                    if( !$(this).hasClass('zoom-open') ) {

                        // test if slider has changed
                        zoom_timer = setTimeout(checkZoomButton, 1000);
                    }

                    return true;
                });

                // successfully initialized
                return true;

            } else {

                // Did not work, maybe page was not ready
                // try 10 times and then give up, probably wrong board type (eg. tree or list)

                if ( zoom_tries > 0 ) {

                    // try again, slider was not ready
                    zoom_wait = setTimeout( waitForSlider, 1000 );

                } else {

                    // give up , too many tries without menu
                    closeActionMenu();
                }

                // we gave up
                return false;
            }
        };

        var isActionMenuOpen = function() {
            return $(zoom_actionbutton_on_id).length !== 0;
        };

        var openActionMenuOrKeep = function( was_open ){
            if ( !was_open ) {
                openActionMenu();
            }
        };

        var closeActionMenuOrKeep = function( was_open ) {
            if ( !was_open ) {
                closeActionMenu();
            }
        };

        var openActionMenu = function() {
            // make menu invisible (but open)
            zoom_menu_opacity = $(zoom_actionbubble_id).css('opacity');
            $(zoom_actionbubble_id).css('opacity',0);

            // mark menu as auto-opened
            $(zoom_actionbutton_off_id).addClass('zoom-open');

            // open menu
            $(zoom_actionbutton_off_id).click();
        };

        var closeActionMenu = function() {
            // make menu visible (but closed)
            if ( zoom_menu_opacity !== null ) {
                $(zoom_actionbubble_id).css('opacity',zoom_menu_opacity);
            }

            // unmark menu as auto-opened
            $(zoom_actionbutton_on_id).removeClass('zoom-open');

            // close menu
            $(zoom_actionbutton_on_id).click();
        };

        var setZoomHighlight = function ( zoom ) {

            // clear other buttons , but keep active
            $('.btnZoom.tau-checked:not(#btnZoom'+zoom+')').removeClass('tau-checked');

            // mark active button
            $('#btnZoom'+zoom+':not(.tau-checked)'        ).addClass(   'tau-checked');
        };
    });