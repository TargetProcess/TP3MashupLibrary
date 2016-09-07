/*globals tau*/
tau
    .mashups
    .addDependency('HideForNonResponsible/HideForNonResponsible.config')
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('tau/configurator')
    .addDependency('tau/core/class')
    .addDependency('tau/core/event')
    .addMashup(function(mashupConfig, _, $, configurator, Class, EventEmitter) {

        'use strict';

        var reg = configurator.getBusRegistry();
        var boardSettings;

        var addBusListener = function(busName, eventName, listener, isImmediate) {
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

            if (isImmediate) {
                reg.getByName(busName).done(function(bus) {
                    bus.removeListener(eventName, listener);
                    bus.on(eventName, listener);
                });
            }
        };

        configurator.getGlobalBus().once('configurator.ready', function(e, appConfigurator) {
            configurator = appConfigurator;
        });

        addBusListener('board_plus', 'boardSettings.ready', function(e, bs) {
            boardSettings = bs.boardSettings;
        });

        var types = configurator.getStore().getTypes().getDictionary();

        var getCollection = function(typeName) {
            return types[typeName.toLowerCase()].resource;
        };

        var getParents = function(typeName) {
            var type = types[typeName];
            if (type.parent) {
                var parentType = types[type.parent];
                return [parentType].concat(getParents(parentType.name));
            } else {
                return [];
            }
        };

        var whenList = function(defs) {
            return $.whenList(defs).then(function() {
                var items = _.toArray(arguments).reduce(function(res, v) {
                    return res.concat(v);
                }, []);

                return items;
            });
        };

        var load = function(resource, params) {

            var loadSimple = function(url, params) {
                return $.ajax({
                    type: 'get',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: params
                });
            };

            var loadPages = function loadPages(url, params) {
                return loadSimple(url, params)
                    .then(function(res) {
                        var items = res.Items;
                        if (res.Next) {
                            return loadPages(res.Next)
                                .then(function(nextItems) {
                                    return items.concat(nextItems);
                                });
                        } else {
                            return items;
                        }
                    });
            };

            return loadPages(configurator.getApplicationPath() + '/api/v1/' + resource, params);
        };

        var processResult = function(result) {
            if (_.isArray(result)) {
                return result.map(function(v) {
                    return processResult(v);
                });
            } else if (_.isObject(result)) {

                return _.object(_.map(result, function(v, k) {
                    var key = k[0].toLowerCase() + k.slice(1);
                    if (key === 'Items' && _.isArray(v)) {
                        return processResult(v);
                    }
                    return [key, processResult(v)];
                }));
            } else {
                return result;
            }
        };

        var stringify = function(obj) {
            var res = '';

            if (obj) {
                if (Array.isArray(obj)) {
                    res = obj.map(stringify).join(',');
                } else if (typeof obj === 'object') {
                    res = Object.keys(obj).map(function(key) {
                        return key + '[' + stringify(obj[key]) + ']';
                    }).join(',');
                } else if (typeof obj !== 'function') {
                    res = String(obj);
                }
            }

            return res;
        };

        var TreeFormat = {
            stringify: stringify
        };

        var Colorer = Class.extend({

            options: {
                colors: {}
            },

            mergeTypes: function(cardsByType) {

                var res = {assignable: []};

                _.keys(cardsByType).forEach(function(typeName) {

                    var parents = getParents(typeName);
                    var isAssignable = _.any(parents, function(v) {
                        return v.name === 'assignable';
                    });

                    if (isAssignable) {
                        res.assignable = res.assignable.concat(cardsByType[typeName]);
                    }
                });

                return res;
            },

            execute: function() {
                if (!this.axisCache) {
                    this.axisCache = this.createAxisCache(this.$boardEl);
                }

                var $cards = this.getCardsEl();

                return $
                    .when(this.getCardsData($cards))
                    .then(function(data) {
                        return this.applyToCards(data, $cards);
                    }.bind(this));
            },

            reset: function() {
                return this.$boardEl
                    .find('.tau-card-v2.hiddenByResposible')
                    .show()
                    .toggleClass('hiddenByResposible', false);
            },

            createAxisCache: function() {
                return _.object(this.$boardEl.find('[data-dimension=' + this.usersAxis +
                    '] .i-role-cellaxis-viewtrigger').toArray().map(function(v) {
                    return [$(v).data('id'), $(v).data('entityId')];
                }));
            },

            getCardsEl: function() {
                return this.$boardEl.find('.tau-card-v2:not(.hiddenByResposible)');
            },

            getCardsData: function($cards) {
                var ids = $cards.map(function() {
                    if (!$(this).data('entity-type')) {
                        return null;
                    }

                    return {
                        entityTypeName: $(this).data('entity-type'),
                        id: $(this).data('entity-id')
                    };
                });

                ids = _.groupBy(ids, function(v) {
                    return v.entityTypeName;
                });

                ids = _.object(_.map(ids, function(v, k) {
                    return [k, _.unique(_.compact(_.pluck(v, 'id')))];
                }));

                ids = this.mergeTypes(ids);

                var res = _.map(ids, function(ids, entityTypeName) {
                    var fields = [{
                        'EntityState': [
                            'Id', {
                                'Role': ['Id']
                            }
                        ],
                        'Assignments': [{
                            'GeneralUser': ['Id']
                        }, {
                            'Role': ['Id']
                        }]
                    }];
                    if (!fields.length) {
                        return [];
                    } else {

                        // prevent too large request error if many cards
                        var i = 0;
                        var defs = [];
                        var take = 50;
                        var part = ids.slice(i, i + take);

                        while (part.length) {

                            defs.push(load(getCollection(entityTypeName), {
                                include: '[' + TreeFormat.stringify(fields) + ']',
                                where: '(id in (' + part.join(',') + '))'
                            }).then(processResult));

                            i += take;
                            part = ids.slice(i, i + take);
                        }
                        return whenList(defs);
                    }
                });

                return whenList(res);
            },

            applyToCards: function(data, $cards) {
                var hash = _.object(data.map(function(v) {
                    return [v.id, v];
                }));

                $cards.toArray().forEach(function(v) {
                    var $el = $(v);
                    this.applyToCard(hash[$el.data('entity-id')], $el);
                }.bind(this));
            },

            applyToCard: function(cardData, $cardEl) {
                if (cardData) {
                    $cardEl.addClass('hiddenByResposible');

                    var axisId = $cardEl.parents('.i-role-cellholder:first').data(this.usersAxis);
                    var userId = this.axisCache[axisId];

                    var isShow = true;
                    if (userId) {
                        if (cardData.entityState.role) {
                            var currentAssignments = _.filter(cardData.assignments.items, function(v) {
                                return v.role.id === cardData.entityState.role.id;
                            });

                            isShow = _.any(currentAssignments, function(v) {
                                return v.generalUser.id === userId;
                            });
                        } else {
                            isShow = false;
                        }
                    }

                    if (!isShow) {
                        $cardEl.hide();
                    }
                }
            }
        });

        var colorer = new Colorer();

        var saveToStorage = function(isActive) {
            try {
                window.localStorage.setItem('mashup_hide_for_non_responsible_active', JSON.stringify(isActive));
            } catch (e) {
            }
        };


        var store = {
            isActive: false,
            isApply: false,

            init: function($boardEl) {

                var activeByStorageDefault = false;

                if (mashupConfig.hideByDefaultForUsers &&
                    mashupConfig.hideByDefaultForUsers.length &&
                    mashupConfig.hideByDefaultForUsers.indexOf(window.loggedUser.id) >= 0) {
                    activeByStorageDefault = true;
                } else {
                    activeByStorageDefault = Boolean(mashupConfig.hideByDefault);
                }

                var activeByStorage = activeByStorageDefault;
                try {
                    activeByStorage = JSON.parse(window.localStorage.getItem('mashup_hide_for_non_responsible_active'));
                    activeByStorage = (activeByStorage === null) ? activeByStorageDefault : activeByStorage;
                } catch (e) {
                }

                this.isActive = activeByStorage;

                this.isApply = false;
                this.fireChange();

                reg.getByName('board_plus').done(function(bus) {
                    this.boardBus = bus;
                }.bind(this));

                boardSettings.get({
                    fields: ['x', 'y', 'viewMode', 'cells'],
                    callback: function(res) {
                        if (res.viewMode !== 'board') {
                            this.isApply = false;
                            return;
                        }

                        var axis = _.find(['x', 'y'], function(k) {
                            var v = res[k];
                            return v && v.types && (v.types.indexOf('assigneduser') >=
                                0);
                        });

                        var cellTypes = (res.cells && res.cells.types) || [];
                        var isCells = _.any(cellTypes, function(v) {
                            var parents = getParents(v);
                            return _.any(parents, function(v) {
                                return v.name === 'assignable';
                            });
                        });

                        this.isApply = Boolean(axis) && isCells;

                        if (this.isApply) {
                            colorer.usersAxis = axis;
                            colorer.$boardEl = $boardEl;

                            if (this.isActive) {
                                this.activate();
                            }
                        }

                        this.fireChange();
                    }.bind(this)
                });
            },

            execute: function() {
                if (this.isApply && this.isActive) {
                    $
                        .when(colorer.execute())
                        .then(this.resizeBoard.bind(this));
                }
            },

            activate: function() {
                if (this.isApply) {
                    this.isActive = true;
                    saveToStorage(true);
                    $
                        .when(colorer.execute())
                        .then(this.resizeBoard.bind(this));
                    this.fireChange();
                }
            },

            deactivate: function() {
                this.isActive = false;
                saveToStorage(false);
                $
                    .when(colorer.reset())
                    .then(this.resizeBoard.bind(this));
                this.fireChange();
            },

            toggle: function() {
                if (this.isActive) {
                    this.deactivate();
                } else {
                    this.activate();
                }
                this.fireChange();
            },

            fireChange: function() {
                this.fire('change');
            },

            resizeBoard: function() {
                setTimeout(function() {
                    this.boardBus.fire('resize.executed', {});
                }.bind(this), 100);
            }
        };

        EventEmitter.implementOn(store);

        addBusListener('board_plus', 'board.configuration.ready', function() {
            store.isApply = false;
        });

        addBusListener('board_plus', 'boardSettings.ready', function(e, bs) {
            boardSettings = bs.boardSettings;
        });

        addBusListener('board_plus', 'overview.board.ready', function(e, renderData) {
            store.init(renderData.element);
        });

        addBusListener('board_plus', 'view.card.skeleton.built', _.debounce(store.execute.bind(store), 500));

        var $button = $(
            '<button class="tau-btn i-role-board-tooltip tau-extension-board-tooltip" style="float: right; margin-left: 7px;"' +
            ' data-title="Show only responsible cards">' +
            'Hide not Responsible' +
            '</button>');

        var renderButton = function($el) {
            if (store.isApply) {

                $button.text(store.isActive ?
                    'Show not Responsible' :
                    'Hide not Responsible');
                $button.data('title', store.isActive ?
                    'Show all cards assigned' :
                    'Show only responsible cards');
                $el.find('[role=zoomer]').before($button);
                $button.off('click');
                $button.on('click', store.toggle.bind(store));
            } else {

                $button.detach();
            }
        };

        addBusListener('board.toolbar', 'afterRender', function(e, renderData) {
            renderButton(renderData.element);
            store.on('change', function() {
                renderButton(renderData.element);
            });
        });
    });
