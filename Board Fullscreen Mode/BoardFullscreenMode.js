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

        addBusListener('board.toolbar', 'afterRender', function(e, renderData) {
            var $el = renderData.element;

            var $button = $(
                '<button class="tau-btn i-role-board-tooltip tau-extension-board-tooltip tau-btn-fullscreen" id="btnFullScreen" ' +
                    'data-title="Fullscreen" alt="Toggle full screen">' +
                    '<i class="icon icon-fullscreen tau-icons-general"></i>' +
                '</button>');

            if (!$el.find('#btnFullScreen').length) {

                var $elWrapper = $el.find('.tau-board-header__control--actions');
                var $elAnchor = $elWrapper.length ? $elWrapper: $el.find('[role=actions-button]');

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

        });

    });
