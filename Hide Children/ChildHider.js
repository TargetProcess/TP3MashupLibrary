/*global tau,loggedUser*/
tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addDependency('tau/core/class')
    .addMashup(function($, _, context, busRegistry, configurator, Class) {

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

            init: function() {
                var self = this;

                this.$btn = null;
                this.boardId = 0;
                this.acid = null;

                this._clearCardsInfo();

                this.refreshDebounced = _.debounce(this.refresh, 100, false);

                context.onChange(function(ctx) {
                    this.acid = ctx.acid;
                    this.refresh(this.acid);
                }.bind(this));

                busRegistry.on('create', function(eventName, sender) {
                    if (sender.bus.name === 'board_plus') {
                        sender.bus.on('start.lifecycle', self._clearCardsInfo.bind(self));
                        sender.bus.on('view.card.skeleton.built', self.cardAdded.bind(self));
                        sender.bus.on('overview.board.ready', self.restoreState.bind(self));
                    }
                });

                addBusListener('application board', 'boardSettings.ready', function(e, eventArgs) {
                    this.boardId = eventArgs.boardSettings.settings.id;
                }.bind(this));

                addBusListener('board.clipboard', '$el.readyToLayout', function(e, $el) {
                    this.renderButton($el);
                }.bind(this));
            },

            _clearCardsInfo: function() {
                this.cards = [];
                this.represented = [];
                this.state = false;
            },

            apiGet: function(url, callback, objects) {
                objects = objects || [];

                $.ajax({
                    url: url,
                    method: 'GET',
                    async: false
                }).then(function(response) {
                    if (response.hasOwnProperty('items')) {
                        objects = $.merge(objects, response.items);
                    }
                    if (response.hasOwnProperty('next')) {
                        this.apiGet(response.next, callback, objects);
                    } else {
                        callback(objects);
                    }
                });
            },

            _getApiUrl: function(entityType, entityIds, parentSelector, acid) {
                return configurator.getApplicationPath() + '/api/v2/' + entityType +
                    '?take=1000&where=(id in [' + entityIds.join(',') +
                    '] and EntityState.isFinal==false)&select={id,parent:' +
                    parentSelector + '}&acid=' + acid;
            },

            refresh: function(acid) {
                if (!this.cards.length) {
                    return;
                }

                var cardIds = _
                    .chain(this.cards)
                    .map(function(card) {
                        return parseInt(card.attr('data-entity-id'), 10);
                    })
                    .sortBy(_.identity)
                    .uniq(true)
                    .value();

                if (!cardIds.length) {
                    return;
                }

                _.each(this.parentMap, function(parentSelector, entityType) {
                    var url = this._getApiUrl(entityType, cardIds, parentSelector, acid);
                    this.apiGet(url, function(data) {
                        if (data === undefined) {
                            return;
                        }
                        for (var i = 0; i < data.length; i++) {
                            var parentId = data[i].parent;
                            if (_.contains(cardIds, parentId)) {
                                this.represented.push(data[i].id);
                            }
                        }
                    }.bind(this));
                }, this);
            },

            renderButton: function($el) {
                var $toolbar = $el.find('.i-role-clipboardfilter');
                if (!$toolbar.length) {
                    $toolbar = $(
                        '<div class="tau-inline-group-clipboardfilter i-role-clipboardfilter" style="vertical-align: middle; display: inline-flex; display: -ms-flexbox; display: inline-flex; -ms-flex-align: center; align-items: center;"></div>'
                    ).appendTo($el.find('.tau-select-block'));
                }

                $toolbar.children('.i-role-mashup-hide').remove();

                this.$btn = $('<button class="tau-btn mashup-hider" style="margin: 0;">Hide Children</button>')
                    .on('click', this.toggle.bind(this));

                $('<div class="i-role-mashup-hide" style="margin-right: 4px;">').append(this.$btn).appendTo($toolbar);
            },

            _getStorageUrl: function() {
                return configurator.getApplicationPath() + '/storage/v1/childHider/U' + loggedUser.id;
            },

            restoreState: function() {
                $.ajax({
                    url: this._getStorageUrl(),
                    method: 'GET'
                }).then(function(response) {
                    var userData = response.userData;
                    if (_.has(userData, this.boardId)) {
                        if ((userData[this.boardId] == '0') != (!this.state)) {
                            this.toggle();
                        }
                    }
                }.bind(this));
            },

            saveState: function() {
                var data = {userData: {}};
                data.userData[this.boardId.toString()] = this.state ? '1' : '0';
                $.ajax({
                    url: this._getStorageUrl(),
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf8'
                });
            },

            toggle: function() {
                this.state = !this.state;
                var method = this.state ? 'hide' : 'show';
                var $cards = $('.i-role-card');
                _.each(this.represented, function(id) {
                    $cards.filter('[data-entity-id=' + id + ']')[method]();
                }, this);
                this.$btn.html(this.state ? 'Show Children (' + this.represented.length + ')' : 'Hide Children');
                this.saveState();

                refreshBoardSize();
            },

            cardAdded: function(eventName, sender) {
                var $card = sender.element && sender.element.filter('.i-role-card');
                if ($card && $card.length) {
                    this.cards.push($card);
                }
                this.refreshDebounced(this.acid);
            }
        });

        return new ChildHider();
    });
