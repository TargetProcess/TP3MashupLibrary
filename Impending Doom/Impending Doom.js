tau.mashups
    .addDependency('tp/mashups')
    .addDependency('jQuery')
    .addDependency('tp3/mashups/context')
    .addDependency('Underscore')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addMashup(function(m, $, context, _, busRegistry, configurator) {

        /**
         * No need to edit anything below this line !!!
         */

        var ImpendingDoom = function() {

            this.init = function() {
                var self = this;

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

			this.apiCalls = {
				'userstory': 'UserStories',
				'bug': 'Bugs',
				'feature': 'Features',
				'task': 'Tasks'
			};

            this.cards = [];

            this._ctx = {};
            this.setContext = function(ctx) {
                this._ctx = ctx;
            };

            this.refresh = function() {
                this.getCards();
            };

            // get cards
            this.getCards = function() {
				_.each(this.getCardTypes(), function(cardType) {
					var ajaxUrl = configurator.getApplicationPath() + '/api/v1/' + this.apiCalls[cardType] + '?format=json&include=[PlannedEndDate,Id]&where=(PlannedEndDate is not null) and (EntityState.IsFinal eq "false")';

	                $.ajax({
	                    url: ajaxUrl,
	                    context: this
	                }).done(_.bind(function(data) {
	                        for (var i = 0; i < data.Items.length; i++) {
	                            this.colorCard(data.Items[i]);
	                        }
	                    }, this));
				}, this);                
            };

            this.refreshDebounced = _.debounce(this.refresh, 100, false);

			this.getCardTypes = function() {
				return _.uniq(_.reduce(this.cards, function(running, card) {
					running.push(card.data('entityType'));
					return running;
				}, []));
			};

            this.cardAdded = function(eventName, sender) {
                this.cards.push(sender.element);
                this.refreshDebounced(this._ctx);
            };

            this.colorCard = function(currentCard) {
                var color = this.getCardColor(currentCard.PlannedEndDate);
                if (color) {
                    $('div[data-entity-id='+currentCard.Id+']').attr('style', 'background: '+color+';');
                }
            };

			this.convertDate = function(apiDate) {
				return new Date(Number(apiDate.match(/Date\((\d+)[-\+](\d+)\)/)[1]));
			};

            /**
             *
             * @param dueDate
             * @returns {string}
             */
            this.getCardColor = function(dueDate) {
				dueDate = this.convertDate(dueDate);
                var diff = dueDate.getTime() - (new Date()).getTime();
				if (diff < 0) {
					return '#F26C4F';
				} else {
					/* Convert ms to days
					* 86400000 = 1000ms/sec * 60sec/min * 60min/hr * 24hr/day */
					var daysToGo = (diff / 86400000);
					if (daysToGo > 2) {
						/* We're not due for at least 2 days */
						return '#3BB878';
					} else if (daysToGo > 1) {
						/* We're due tomorrow */
						return '#FFF467';
					} else {
						/* We're due today */
						return '#FBAF5C';
					}
				}
				return false;
            };

        };

        new ImpendingDoom().init();

    });
