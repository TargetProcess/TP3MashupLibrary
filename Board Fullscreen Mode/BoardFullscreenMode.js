tau
.mashups
.addDependency('jQuery')
.addDependency('tau/configurator')
.addCSS('BoardFullscreenMode.css')
.addMashup(function($, configurator) {

    'use strict';

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
        });

        reg.getByName(busName).done(function(bus) {
            bus.on(eventName, listener);
        });
    };

    var eventName;
    var isFullScreenName;
    var requestFullScreenName;
    var args = [];

    if (document.body.webkitRequestFullScreen) {
        requestFullScreenName = 'webkitRequestFullScreen';
        eventName = 'webkitfullscreenchange';
        isFullScreenName = 'webkitIsFullScreen';
        args = [Element.ALLOW_KEYBOARD_INPUT];
    } else if (document.body.mozRequestFullScreen) {
        requestFullScreenName = 'mozRequestFullScreen';
        eventName = 'mozfullscreenchange';
        isFullScreenName = 'mozFullScreen';
    } else if (document.body.msRequestFullscreen) {
        requestFullScreenName = 'msRequestFullscreen';
        eventName = 'MSFullscreenChange';
        isFullScreenName = 'msFullscreenElement';
    } else if (document.body.requestFullScreen) {
        requestFullScreenName = 'requestFullScreen';
        isFullScreenName = 'fullScreen';
        eventName = 'fullscreenchange';
    }

    var appendFullscreenButton = function appendFullscreenButton(e, renderData) {
        var $el = renderData.element;

        var $button = $(
            '<button class="tau-btn tau-btn--icon i-role-board-tooltip tau-extension-board-tooltip" id="btnFullScreen" ' +
                'data-title="Fullscreen" alt="Toggle full screen">' +
                '<span class="tau-btn__icon">' +
                    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M3.00098 10C2.45098 10 2.00098 10.45 2.00098 11V13C2.00098 13.55 2.45098 14 3.00098 14H5.00098C5.55098 14 6.00098 13.55 6.00098 13C6.00098 12.45 5.55098 12 5.00098 12H4.00098V11C4.00098 10.45 3.55098 10 3.00098 10ZM3.00098 6C3.55098 6 4.00098 5.55 4.00098 5V4H5.00098C5.55098 4 6.00098 3.55 6.00098 3C6.00098 2.45 5.55098 2 5.00098 2H3.00098C2.45098 2 2.00098 2.45 2.00098 3V5C2.00098 5.55 2.45098 6 3.00098 6ZM12.001 12H11.001C10.451 12 10.001 12.45 10.001 13C10.001 13.55 10.451 14 11.001 14H13.001C13.551 14 14.001 13.55 14.001 13V11C14.001 10.45 13.551 10 13.001 10C12.451 10 12.001 10.45 12.001 11V12ZM10.001 3C10.001 3.55 10.451 4 11.001 4H12.001V5C12.001 5.55 12.451 6 13.001 6C13.551 6 14.001 5.55 14.001 5V3C14.001 2.45 13.551 2 13.001 2H11.001C10.451 2 10.001 2.45 10.001 3Z" fill="#A0A1A4"/>' +
                    '</svg>' +
                '</span>' +
            '</button>');

        if (!$el.find('#btnFullScreen').length) {
            var $elWrapper = $el.find('.tau-board-header__control--actions');
            var $elAnchor = $elWrapper.length ? $elWrapper: $el.find('[role=actions-button]').parent();

            $elAnchor.before($('<div class="tau-board-header__control--mashup"></div>').html($button));
        }

        $button.click(function() {
            if (requestFullScreenName) {
                var el = document.body;
                if (requestFullScreenName in el) {
                    el[requestFullScreenName].apply(el, args);
                }
            }

            $(document.body).toggleClass('fullscreen');
            if (!eventName) {
                $(document.body).one('keydown', function(e) {
                    if (e.keyCode === $.ui.keyCode.ESCAPE) {
                        $(document.body).removeClass('fullscreen');
                    }
                });
            }
        });

        if (eventName) {
            $(document).on(eventName, function() {

                if (!document[isFullScreenName]) {
                    $(document.body).removeClass('fullscreen');
                }
            });
        }
    };

    var toolbarComponents = [
        'board.toolbar',
        'dashboard.toolbar',
        'customReport.toolbar'
    ];

    toolbarComponents.forEach(function(componentName) {
        addBusListener(componentName, 'afterRender', appendFullscreenButton);
    });
});
