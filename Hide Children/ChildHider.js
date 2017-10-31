/*global tau,loggedUser*/
tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addDependency('tau/core/class')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addMashup(function($, _, context, busRegistry, configurator, Class, et) {

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

        var ChildHider = Class.extend({
            parentMap: [
                {entityType: et.FEATURE, parentEntityType: et.EPIC},
                {entityType: et.STORY, parentEntityType: et.FEATURE},
                {entityType: et.TASK, parentEntityType: et.STORY},
                {entityType: et.BUG, parentEntityType: et.STORY},
                {entityType: et.BUG, parentEntityType: et.FEATURE}
            ],

            init: function() {
                var self = this;

                this.$board = null;
                this.$btn = null;
                this.acid = null;
                this.boardId = 0;

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
                        sender.bus.on('overview.board.ready', function(event, board) {
                            self.$board = board.element;
                            self.restoreState();
                        }.bind(self));
                    }
                });

                addBusListener('application board', 'boardSettings.ready', function(e, eventArgs) {
                    this.boardId = eventArgs.boardSettings.settings.id;
                }.bind(this));

                addBusListener('board.toolbar', 'toolbarData.ready:last + afterRender', function(e, toolbarData,
                    renderData) {
                    if (toolbarData.viewMode !== 'newlist') {
                        this.renderButton(renderData.element);
                    }
                }.bind(this));
            },

            _clearCardsInfo: function() {
                this.cardsByType = {};
                this.childrenIds = {};
                this.hideChildren = false;
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
                    '])&select={id,parent:' +
                    parentSelector + '}&acid=' + acid;
            },

            _processResponse: function(parentIds, data) {
                if (data === undefined) {
                    return;
                }

                var hasChanges = false;
                for (var i = 0; i < data.length; i++) {
                    var childId = data[i].id;
                    var parentId = data[i].parent;
                    if (parentId && _.contains(parentIds, parentId) && this.childrenIds[childId] !== childId) {
                        this.childrenIds[childId] = childId;
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    this.updateCardsVisibility();
                }
            },

            refresh: function(acid) {
                _.each(this.parentMap, function(entry) {
                    var parentIds = this.cardsByType[entry.parentEntityType] || [];
                    if (!parentIds.length) {
                        return;
                    }

                    // sort and remove duplicate ids, e.g. on timeline or on one-to-many board
                    var cardIds = this.cardsByType[entry.entityType];
                    cardIds = _
                        .chain(cardIds)
                        .sortBy(_.identity)
                        .uniq(true)
                        .value();
                    if (!cardIds.length) {
                        return;
                    }

                    var parentSelector = entry.parentEntityType + '.id';
                    var url = this._getApiUrl(entry.entityType, cardIds, parentSelector, acid);
                    this.apiGet(url, function(data) {
                        this._processResponse(parentIds, data);
                    }.bind(this));
                }, this);
            },

            renderButton: function($el) {
                var $container = $el.find('.i-role-filter-control').parent();

                if (this.$btn && $container.parent().find('.i-role-mashup-hide-button').is(this.$btn)) {
                    return;
                }

                this.$btn = $('<button class="tau-btn mashup-hider i-role-mashup-hide-button" style="margin: 0;">Hide Children</button>')
                    .on('click', this.toggle.bind(this));


                var $buttonBlock = $('<div class="tau-board-header__control" style="margin-left: 10px">');
                $buttonBlock.append(this.$btn);

                $container.after($buttonBlock);
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
                        // '1' - hideChildren === true
                        // '0' or undefined - hideChildren === false
                        var shouldHideChildren = userData[this.boardId] === '1';
                        if (shouldHideChildren !== this.hideChildren) {
                            this.hideChildren = shouldHideChildren;
                            this.updateCardsVisibility();
                            this.refreshBoardSize();
                        }
                    }
                }.bind(this));
            },

            saveState: function() {
                var data = {userData: {}};
                data.userData[this.boardId.toString()] = this.hideChildren ? '1' : '0';
                $.ajax({
                    url: this._getStorageUrl(),
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json; charset=utf8'
                });
            },

            toggle: function() {
                this.hideChildren = !this.hideChildren;
                this.saveState();
                this.updateCardsVisibility();
                this.refreshBoardSize();
            },

            updateCardsVisibility: function() {
                var $cards = $('.i-role-card', this.$board);
                var $cardsToHide = $();
                var cardsCount = 0;

                _.each(this.childrenIds, function(id) {
                    var $cardToHide = $cards.filter('[data-entity-id=' + id + ']');
                    if ($cardToHide.length) {
                        $cardsToHide = $cardsToHide.add($cardToHide);
                        cardsCount++;
                    }
                });

                if (this.hideChildren) {
                    $cardsToHide.addClass('tau-hide');
                    this.$btn.html('Show Children (' + cardsCount + ')');
                } else {
                    $cardsToHide.removeClass('tau-hide');
                    this.$btn.html('Hide Children');
                }
            },

            refreshBoardSize: function() {
                configurator.getBusRegistry().getByName('board_plus').then(function(bus) {
                    bus.fire('resize.executed', {
                        onlyHeaders: false,
                        refreshElement: true
                    });
                });
            },

            cardAdded: function(eventName, sender) {
                var $card = sender.element && sender.element.filter('.i-role-card');
                if ($card && $card.length) {
                    var type = ($card.attr('data-entity-type') || '').toLowerCase();
                    if (type) {
                        this.cardsByType[type] = this.cardsByType[type] || [];
                        var id = parseInt($card.attr('data-entity-id'), 10);
                        this.cardsByType[type].push(id);
                    }
                }
                this.refreshDebounced(this.acid);
            }
        });

        return new ChildHider();
    });
