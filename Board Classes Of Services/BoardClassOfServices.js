tau.mashups
    .addDependency('tp/mashups')
    .addDependency('user/mashups')
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addMashup(function(m, um, $, _, context, busRegistry, configurator) {

        var Colorer = function() {
            this.init = function() {
                //--------------------------------------------------------
                this.tagMapping = {
                    'put some tag here': '#fdfadb',
                    'done':              '#c4ced7', // you can use state name
                    'closed':            '#c4ced7',
                    'urgent':            '#f9d9d1',
                    'uppercase':         '#f9d9d1',
                    '.net':              '#d2e0ef',
                    'regression':        '#ffe1b3',
                    'outsource':         '#d2e0ef',
                    'performance':       '#e2eece',
                    'attention':         '#f9f5bd',
                    'when have time':    '#A1D9D6',
                    'enhancement':       '#A1D9D6'

                };

                this.showSeveralTags = true;
                //--------------------------------------------------------
                var self = this;


                this.taggedCards = {};
                this.cards = [];

                context.onChange(function(ctx) {
                    self.setContext(ctx);
                    self.refresh(ctx);
                });

                busRegistry.on('create', function(eventName, sender) {
                    if (sender.bus.name == 'board_plus') {
                        sender.bus.on('start.lifecycle', _.bind(function() {
                            this.cards = [];
                        }, self));
                        sender.bus.on('view.card.skeleton.built', _.bind(self.cardAdded, self));
                    }
                });
            };

            this._ctx = {};
            this.setContext = function(ctx) {
                this._ctx = ctx;
            };

            this.refresh = function(ctx) {

                var acid = ctx.acid;
                var whereTagStr = this.getFilter(this.tagMapping);
                var whereIdsStr = _.compact(this.cards.map($.proxy(function(c) {
                    return this._getCardId(c);
                }, this))).join(',');

                if (whereIdsStr === '') {
                    whereIdsStr = '0';
                }


                var requestUrl = configurator.getApplicationPath() + '/api/v2/Assignable?take=1000&where=TagObjects.Count(' + whereTagStr + ')>0 and id in [' + whereIdsStr + ']&select={id,Tags,EntityState.Name as state}&acid=' + acid;
                $.ajax({
                    url: requestUrl,
                    context: this
                }).done(_.bind(function(data) {
                        this.taggedCards = {};
                        for (var i = 0; i < data.items.length; i++) {
                            var id = data.items[i].id;
                            var tags = data.items[i].tags.split(',');
                            tags.push(data.items[i].state.toLowerCase());
                            $.each(tags, function(i) {
                                tags[i] = $.trim(tags[i].toLowerCase());
                            });
                            this.taggedCards[id] = tags;
                        }
                        this.renderAll();
                    }, this));
            };

            this.refreshDebounced = _.debounce(this.refresh, 100, false);

            this.cardAdded = function(eventName, sender) {
                this.cards.push(sender.element);
                this.refreshDebounced(this._ctx);
                //this.refreshCard(sender.element);
            };

            this._getCardId = function(card) {
                return card.attr('data-entity-id');
            };

            this.renderCard = function(card) {
                var id = this._getCardId(card);
                var tags = this.taggedCards[id];

                if (tags) {
                    var style = this.getStyle(tags);
                    card.attr('style', style);
                }
            };

            this.getStyle = function(tags) {
                var self = this;
                var colors = _.chain(tags)
                    .map(function(tag) {
                        return self.tagMapping[tag];
                    })
                    .filter(function(color) {
                        return !!color;
                    })
                    .value();

                if (colors.length === 0) {
                    return '';
                } else if (colors.length == 1 || this.showSeveralTags) {
                    return 'background: ' + colors[0];
                }

                var gradientElements = [];
                var length = colors.length;
                var delta = 1 / length;
                for (var i = 0; i < length; i++) {
                    var color = colors[i];
                    gradientElements.push(color + ' ' + (delta * i * 100 + 5) + '%');
                    gradientElements.push(color + ' ' + (delta * (i + 1) * 100 - 5) + '%');
                }


                return 'background: linear-gradient(45deg, ' + gradientElements.join(', ') + ')';
            };

            this.renderAll = function() {
                var self = this;
                $.each(this.cards, function(index, card) {
                    self.renderCard(card);
                });
            };

            this.getFilter = function(mapping) {
                var where = [];
                $.each(mapping, function(tag) {
                    where.push('Name=="' + tag + '"');
                });
                return where.join(" or ");
            };
        };

        new Colorer().init();

    });