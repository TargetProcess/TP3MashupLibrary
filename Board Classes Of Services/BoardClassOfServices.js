tau.mashups
    .addDependency('tp/mashups')
    .addDependency('user/mashups')
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addMashup(function(m, um, $, _, context, busRegistry, configurator) {

        var colorer = function() {
            this.init = function() {

                var self = this;

                /* Coloring of the cards is done from the top down.  The first mapping that is found
                 * is going to be the one that is used.  Once a match is found, subsequent mappings are 
                 * ignored.  This mapping is NOT case-sensitive. */
                var colorMapping = {
                    'PIT Web CEPAL': '#fdfadb',
                    'in PROGRESS': '#fdfadb', // you can use state name
                    'urgent': '#f9d9d1',
                    '.net': '#d2e0ef',
                    'regression': '#ffe1b3',
                    'today': '#d2e0ef',
                    'mb_wip': '#d2e0ef',
                    'performance': '#e2eece',
                    '1week': '#f9f5bd',
                    'when have time': '#A1D9D6',
                    'done': '#dae0e8',
                    'closed': '#dae0e8'
                };

                var showSeveralTags = true; // change to 'false' if you do not want multi-colored cards

                /* NO NEED TO CHANGE ANYTHING BENEATH THIS LINE! */

                this.taggedCards = {};
                this.cards = [];

                context.onChange(function(ctx) {
                    self.setContext(ctx);
                    self.refresh(ctx);
                });

                this.showSeveralTags = showSeveralTags;

                this.tagMapping = {};
                $.each(colorMapping, $.proxy(function(i, v) {
                    this.tagMapping[i.toLowerCase()] = v;
                }, this));

                busRegistry.on('create', function(eventName, sender) {
                    if (sender.bus.name == 'board_plus') {
                        sender.bus.on('start.lifecycle', _.bind(function(e) {
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
                var whereIdsStr = _.chain(this.cards)
                    .map(_.bind(this._getCardId, this))
                    .uniq()
                    .value()
                    .join(',');

                if (whereIdsStr == '') {
                    whereIdsStr = '0';
                }


                var requestUrl = configurator.getApplicationPath() + '/api/v2/Assignable?take=1000&where=(id in [' + whereIdsStr + '])&select={id,Tags,EntityState.Name as state,Priority.Name as priority}&acid=' + acid;
                $.ajax({
                    url: requestUrl,
                    context: this
                }).done(function(data) {
                        this.taggedCards = {};
                        for (var i = 0; i < data.items.length; i++) {
                            var id = data.items[i].id;
                            var tags = data.items[i].tags.split(',');
                            tags.push(data.items[i].state);
                            tags.push(data.items[i].priority);
                            $.each(tags, function(i, v) {
                                tags[i] = $.trim(tags[i].toLowerCase());
                            });
                            this.taggedCards[id] = tags;
                        }
                        this.renderAll();
                    });
            };

            this.refreshDebounced = _.debounce(this.refresh, 100, false);

            this.cardAdded = function(eventName, sender) {
                this.cards.push(sender.element);
                this.refreshDebounced(this._ctx);
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
                } else if (colors.length == 1 || !this.showSeveralTags) {
                    return 'background: ' + colors[0];
                }

                var gradientElements = [];
                var length = colors.length;
                var delta = 1 / length;
                for (var i = 0; i < length; i++) {
                    var color = colors[i];
                    gradientElements.push(color + ' ' + (delta * i * 100 + 3) + '%');
                    gradientElements.push(color + ' ' + (delta * (i + 1) * 100 - 3) + '%');
                }


                return 'background: linear-gradient(45deg, ' + gradientElements.join(', ') + ')';
            };

            this.renderAll = function() {
                var self = this;
                $.each(this.cards, function(index, card) {
                    self.renderCard(card);
                });
            };

            this.renderAll = function() {
                var self = this;
                $.each(this.cards, function(index, card) {
                    self.renderCard(card);
                });
            };
        }

        new colorer().init();

    });
