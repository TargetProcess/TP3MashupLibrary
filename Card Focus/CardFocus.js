tau.mashups
    .addDependency('jQuery')
    .addDependency('libs/parseUri')
    .addDependency('tau/core/class')
    .addDependency('tau/configurator')
    .addMashup(function($, parseUri, Class, configurator) {

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

        var CardFocus = Class.extend({

            init: function() {
                var uri = parseUri(window.location.href);
                this.request = uri.queryKey;

                addBusListener('application board', 'configurator.ready', function(e, appConfigurator) {
                    configurator = appConfigurator;
                }.bind(this));

                addBusListener('application board', 'boardSettings.ready', function(e, eventArgs) {
                    this.boardSettings = eventArgs.boardSettings;
                }.bind(this));

                addBusListener('board.clipboard', '$el.readyToLayout', function(e, $el) {
                    this.renderClipboardButton($el);
                }.bind(this));
            },

            renderClipboardButton: function($el) {

                var $toolbar = $el.find('.i-role-clipboardfilter');

                if (!$toolbar.length) {
                    $toolbar = $('<div class="tau-inline-group-clipboardfilter i-role-clipboardfilter" style="vertical-align: middle; display: inline-block;"></div>')
                        .appendTo($el.find('.tau-select-block'));
                }

                $toolbar.children('.mashup-focus').remove();

                var $button = $('<button class="tau-btn mashup-focus">Card Focus</button>')
                    .on('click', this.focusOnCards.bind(this));

                $toolbar.append($button);
            },

            focusOnCards: function() {
                var clipboardManager = configurator.getClipboardManager();

                clipboardManager.getAll(function(err, cards) {
                    var ids = cards.reduce(function(r, item) {
                        r.push(item.data.id); return r;
                    }, []);

                    this.boardSettings.set({
                        set: {
                            user: {
                                cardFilter: ids.join(',')
                            },
                            viewMode: "list"
                        }	
                    });

                    $('.tau-resetable-input>input').val(ids.join(','))
                    $('.tau-resetable-input>button').css('visibility','visible');
                    $('.tau-role-filter-input').blur();

                }.bind(this));
            }

        });

        return new CardFocus();

    });