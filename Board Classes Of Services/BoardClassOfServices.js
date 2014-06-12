tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('BoardClassOfServices.config')
    .addDependency('tau/core/class')
    .addDependency('app.bus')
    .addDependency('tau/configurator')
    .addMashup(function($, _, config, Class, appBus, configurator) {

        'use strict';

        configurator.getGlobalBus().once('configurator.ready', function(e, appConfigurator) {
            configurator = appConfigurator;
        });

        var types = configurator.getStore().getTypes().getDictionary();

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

        var Colorer = Class.extend({

            options: config,

            colorsConfigCache: {},

            init: function() {

                this.options.colors = _.object(_.map(this.options.colors, function(v, k) {
                    return [k.toLowerCase(), v];
                }));
            },

            getColorsConfigByType: function(typeName) {

                if (this.colorsConfigCache[typeName]) {
                    return this.colorsConfigCache[typeName];
                }

                var colors = this.options.colors;
                var color = colors[typeName] || {};

                var parents = getParents(typeName);
                parents.forEach(function(parentType) {

                    var parentColor = colors[parentType.name];
                    if (parentColor) {
                        color = _.extend(_.deepClone(parentColor), color);
                    }
                }.bind(this));

                this.colorsConfigCache[typeName] = color;
                return color;
            },

            getFieldsConfigByType: function(typeName) {

                var colorsConfig = this.getColorsConfigByType(typeName);
                var fields = this.collectFields(colorsConfig);

                var cf = _.find(fields, function(field) {
                    return _.isObject(field) && _.keys(field)[0] === 'customFields';
                });
                if (cf) {
                    fields = _.without(fields, cf);
                    fields.push('customFields');
                }
                if (typeName !== 'user' && typeName !== 'projectmember') {
                    fields.push({
                        'entityType': ['id', 'name']
                    });
                }

                return fields;
            },

            mergeTypes: function(cardsByType) {

                var colors = this.options.colors;
                _.keys(cardsByType).forEach(function(typeName) {

                    if (!colors[typeName]) {

                        var parents = getParents(typeName);

                        for (var i = 0, c = parents.length; i < c; i++) {
                            var parentTypeName = parents[i].name;

                            if (colors[parentTypeName]) {
                                if (!cardsByType[parentTypeName]) {
                                    cardsByType[parentTypeName] = [];
                                }
                                cardsByType[parentTypeName] = cardsByType[parentTypeName].concat(cardsByType[typeName]);
                                delete cardsByType[typeName];
                                break;
                            }
                        }
                    }
                });

                return cardsByType;
            },

            collectFields: function(colorsConfig) {

                var fields = [];
                _.forEach(colorsConfig, function(value, fieldName) {

                    var field;

                    if (_.isObject(value) && !_.isArray(value) && !_.isFunction(value)) {

                        if (_.any(_.values(value), _.isObject)) {
                            field = {};
                            field[fieldName] = this.collectFields(value);
                        } else {
                            field = fieldName;
                        }
                    } else if (_.isArray(value)) {

                        field = {};
                        field[fieldName] = this.collectFields(value[0]);
                    }

                    if (field) {
                        fields.push(field);
                    }
                }.bind(this));

                return fields;
            },

            execute: function() {

                var $cards = this.getCardsEl();

                $
                    .when(this.getCardsData($cards))
                    .then(function(data) {
                        return this.applyToCards(data, $cards);
                    }.bind(this));
            },

            getCardsEl: function() {
                return $('.tau-card:not(.coloredByMashup),.tau-card-v2:not(.coloredByMashup)');
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

                var defs = _.map(ids, function(ids, entityTypeName) {
                    var fields = this.getFieldsConfigByType(entityTypeName);
                    if (!fields.length) {
                        return [];
                    } else {
                        // prevent too large request error if many cards
                        var i = 0;
                        var defs = [];
                        var take = 50;
                        var part = ids.slice(i, i + take);
                        while (part.length) {
                            defs.push(configurator.getStore()
                                .getDef(entityTypeName, {
                                    fields: this.getFieldsConfigByType(entityTypeName),
                                    $query: {
                                        id: {
                                            $in: part
                                        }
                                    }
                                }));
                            i += take;
                            part = ids.slice(i, i + take);
                        }

                        return whenList(defs);
                    }
                }.bind(this));

                return whenList(defs);
            },

            applyToCards: function(data, $cards) {

                var hash = _.object(data.map(function(v) {
                    return [v.id, v];
                }));

                $cards.each(function(k, v) {

                    var $el = $(v);
                    this.applyToCard(hash[$el.data('entity-id')], $el);
                }.bind(this));
            },

            applyToCard: function(cardData, $cardEl) {
                if (cardData) {
                    $cardEl.addClass('coloredByMashup');
                    return this.applyBackgroundByValues(cardData, $cardEl);
                }
            },

            applyBackgroundByValues: function(cardData, $cardEl) {

                var values = this.collectValues(cardData);
                /*eslint-disable */
                var colors = this.collectColors(values, this.getColorsConfigByType(cardData.__type));
                /*eslint-enable */

                if (!colors.length) {
                    return $cardEl;

                } else if (colors.length === 1 || this.options.colorType === 'single') {

                    $cardEl.css('background', colors[0]);
                    return $cardEl;
                }

                var gradientElements = [];
                var delta = 1 / colors.length;

                colors.forEach(function(color, i) {
                    gradientElements.push(color + ' ' + (delta * i * 100 + 3) + '%');
                    gradientElements.push(color + ' ' + (delta * (i + 1) * 100 - 3) + '%');
                });
                $cardEl.css('background', 'linear-gradient(45deg, ' + gradientElements.join(', ') + ')');
                return $cardEl;
            },

            collectValues: function(cardData) {

                if (!_.isArray(cardData.tags)) {
                    cardData.tags = _.compact((cardData.tags || '').split(',').map(function(tag) {
                        return tag.trim().toLowerCase();
                    }));
                }

                return cardData;
            },

            collectColors: function(value, fieldColorConfig) {

                var colors = [];
                if (!fieldColorConfig || (fieldColorConfig.match && !fieldColorConfig.match(value))) {
                    return colors;
                }

                if (_.isArray(value) && _.isArray(fieldColorConfig)) {

                    colors = fieldColorConfig.reduce(function matchInEntityArrayData(colors, colorsConfig) {
                        return colors.concat(value.reduce(function(colors, value) {
                            return colors.concat(this.collectColors(value, colorsConfig));
                        }.bind(this), []));
                    }.bind(this), colors);
                } else if (_.isArray(value) && _.isObject(fieldColorConfig)) {

                    colors = colors.concat(value.reduce(function(colors, value) {
                        return colors.concat(this.collectColors(value, fieldColorConfig));
                    }.bind(this), []));
                } else if (_.isObject(value) && _.isObject(fieldColorConfig)) {

                    colors = colors.concat(_.keys(value).reduce(function(colors, fieldName) {
                        return colors.concat(this.collectColors(value[fieldName], fieldColorConfig[fieldName]));
                    }.bind(this), []));
                } else {

                    var findFunc = this.matchValueAndConfigValue.bind(this, value);
                    var key = _.find(_.keys(fieldColorConfig), findFunc);
                    if (key) {
                        var color = fieldColorConfig[key];
                        colors.push(color);
                    }
                }

                return colors;
            },

            matchValueAndConfigValue: function(value, configValue) {
                return String(value).toLowerCase() === String(configValue).toLowerCase();
            }
        });

        $
            .when(appBus)
            .then(function(bus) {
                var colorer = new Colorer();
                var listener = _.debounce(colorer.execute.bind(colorer), 500);
                bus.on('overview.board.ready', listener);
                bus.on('view.card.skeleton.built', listener);
                bus.on('destroy', listener);
            });
    });
