tau.mashups
    .addDependency('tp/mashups')
    .addDependency('user/mashups')
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addDependency('tau/core/class')
    .addMashup(function(m, um, $, _, context, busRegistry, configurator, Class) {

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

        var refreshBoardSize = function() {

            configurator.getBusRegistry().getByName('board_plus').then(function(bus) {

                bus.fire('resize.executed', {
                    onlyHeaders: false,
                    refreshElement: true
                });

            });

        };

        var ChildHider = Class.extend({

            parentMap: {
                'Feature': 'Epic.Id',
                'UserStory': 'Feature.Id',
                'Task': 'UserStory.Id'
            },

            _ctx: {},

            init: function() {
                var self = this;

                this.cards = [];
                this.represented = [];
                this.state = false;
                this.$btn = null;
                this.boardId = 0;

                this.refreshDebounced = _.debounce(this.refresh, 100, false);

                context.onChange(function(ctx, data) {
                    this._ctx = ctx;
                    this.refresh(ctx);
                }.bind(this));

                busRegistry.on('create', function(eventName, sender) {
                    if (sender.bus.name == 'board_plus') {
                        sender.bus.on('start.lifecycle', _.bind(function(e) {
                            this.cards = [];
                            this.represented = [];
                            this.state = false;
                        }, self));
                        sender.bus.on('view.card.skeleton.built', _.bind(self.cardAdded, self));
                        sender.bus.on('overview.board.ready', _.bind(self.restoreState, self));
                    }
                });

                addBusListener('application board', 'boardSettings.ready', function(e, eventArgs) {
                    this.boardId = eventArgs.boardSettings.settings.id;
                }.bind(this));

                addBusListener('board.clipboard', '$el.readyToLayout', function(e, $el) {
                    this.renderButton($el);
                }.bind(this));
            },

            apiGet: function(url, callback, _objects) {
                if (_objects === undefined) {
                    _objects = []
                };
                $.ajax({
                    url: url,
                    method: 'GET',
                    async: false
                }).then(function(response) {
                    if (response.hasOwnProperty("items")) {
                        _objects = $.merge(_objects, response.items);
                    }
                    if (response.hasOwnProperty("next")) {
                        getTpApi(response.next, callback, _objects);
                    } else {
                        callback(_objects);
                    }
                });
            },

            refresh: function(ctx) {
                var acid = ctx.acid;
                var cardIds = this.cards.map(function(c) {
                    return parseInt(c.attr('data-entity-id'));
                });
                var whereIdsStr = cardIds.join(',');

                if (whereIdsStr == '') {
                    whereIdsStr = '0';
                }

                _.each(this.parentMap, _.bind(function(parentSelector, entityType) {
                    this.apiGet(configurator.getApplicationPath() + '/api/v2/' + entityType +
                        '?take=1000&where=(id in [' + whereIdsStr +
                        '] and EntityState.isFinal==false)&select={id,parent:' +
                        parentSelector + '}&acid=' + acid, _.bind(function(data) {
                            if (data === undefined) return;
                            for (var i = 0; i < data.length; i++) {
                                var id = data[i].id;
                                var parentId = data[i].parent;
                                if (_.contains(cardIds, parentId))
                                    this.represented.push(id);
                            }
                        }, this));
                }, this));
            },

            renderButton: function($el) {
                var $toolbar = $el.find('.i-role-clipboardfilter');

                if (!$toolbar.length) {
                    $toolbar = $(
                            '<div class="tau-inline-group-clipboardfilter i-role-clipboardfilter" style="vertical-align: middle; display: inline-flex; display: -ms-flexbox; display: inline-flex; -ms-flex-align: center; align-items: center;"></div>'
                        )
                        .appendTo($el.find('.tau-select-block'));
                }

                $toolbar.children('.i-role-mashup-hide').remove();

                this.$btn = $('<button class="tau-btn mashup-hider" style="margin: 0;">Hide Children</button>')
                    .on('click', this.toggle.bind(this));

                $('<div class="i-role-mashup-hide" style="margin-right: 4px;">').append(this.$btn).appendTo($toolbar);
            },

            restoreState: function() {
                $.ajax({
                    url: configurator.getApplicationPath() + '/storage/v1/childHider/U' +
                        loggedUser.id,
                    method: 'GET'
                }).then(_.bind(function(response) {
                    if (_.has(response.userData, this.boardId)) {
                        if ((response.userData[this.boardId] == "0") != (!this.state)) {
                            this.toggle();
                        }
                    }
                }, this));
            },

            saveState: function() {
                var data = {
                    "userData": {}
                };
                data['userData'][this.boardId.toString()] = this.state ? "1" : "0";
                $.ajax({
                    url: configurator.getApplicationPath() + '/storage/v1/childHider/U' +
                        loggedUser.id,
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf8'
                });
            },

            toggle: function() {
                this.state = !this.state;
                _.each(this.represented, _.bind(function(id) {
                    $('div[role=card][data-entity-id=' + id + ']')[this.state ? 'hide' :
                        'show']();
                }, this));
                this.$btn.html(this.state ? 'Show Children (' + this.represented.length + ')' :
                    'Hide Children');
                this.saveState();

                refreshBoardSize();

            },

            cardAdded: function(eventName, sender) {
                this.cards.push(sender.element);
                this.refreshDebounced(this._ctx);
            },
        });

        return new ChildHider();

    });
