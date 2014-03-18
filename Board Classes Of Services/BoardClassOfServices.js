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

        var Colorer = Class.extend({

            options: config,

            init: function() {

                this.fields = this.collectFields(this.options.colors);

                var cf = _.find(this.fields, function(field) {
                    return _.isObject(field) && _.keys(field)[0] === 'customFields';
                });
                if (cf) {
                    this.fields = _.without(this.fields, cf);
                    this.fields.push('customFields');
                }
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

                var ids = _.uniq(_.compact($cards.map(function() {
                    return $(this).data('entity-id');
                })));

                if (!ids.length) {
                    return [];
                }

                return configurator.getStore()
                    .getDef('Assignables', {
                        fields: this.fields,
                        $query: {
                            id: {
                                $in: ids
                            }
                        }
                    })
                    .then(function(items) {
                        return items.map(function(item) {
                            return item;
                        });
                    });
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

                $cardEl.addClass('coloredByMashup');
                return this.applyBackgroundByValues(cardData, $cardEl);
            },

            applyBackgroundByValues: function(cardData, $cardEl) {

                var values = this.collectValues(cardData);
                var colors = this.collectColors(values, this.options.colors);

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
