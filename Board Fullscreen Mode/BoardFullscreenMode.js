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

            var $button = $('<button id="btnFullScreen" data-title="Fullscreen" ' +
                'class="tau-extension-board-tooltip tau-btn" ' +
                'style="float: right; width: 24px; padding: 0; text-align: center; ' +
                'background: url(\'../javascript/tau/css.board/images/icons-general.svg?v=2.15.0.15001\') ' +
                'no-repeat -815px -155px;" alt="Toggle full screen"></button>');

            if (!$el.find('#btnFullScreen').length) {
                $el.find('.tau-board-name').before($button);
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
