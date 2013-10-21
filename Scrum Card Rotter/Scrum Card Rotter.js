tau.mashups
		.addDependency('tp/mashups')
		.addDependency('jQuery')
		.addDependency('tp3/mashups/context')
		.addDependency('Underscore')
		.addDependency('tau/core/bus.reg')
		.addDependency('tau/configurator')
		.addMashup(function(m, $, context, _, busRegistry, configurator) {

	/* the number of days a card is allowed to "rot" before we throw feedback and the color of the card*/
	var rottingDaysAllowed = 2;
	var rottingDaysAllowedColor = '#F3FF35';

	/* the number of days a card is getting critical and the color of the card */
	var rottingDaysCriticalAllowed = 5;
	var rottingDaysCriticalAllowedColor = '#FFD20F';

	/* the number of days a card is allowed to "rot" before we create some panic and the color */
	var rottingDaysMaximumAllowed = 8;
	var rottingDaysMaximumAllowedColor = '#FF0000';

   /**
	* No need to edit anything below this line !!!
	*/

	var ScrumRottingCards = function() {

		this.init = function() {

			var self = this;

			context.onChange(function(ctx) {
				self.setContext(ctx);
				self.refresh(ctx);
			});

			busRegistry.on('create', function(eventName, sender) {
				if(sender.bus.name == 'board_plus') {
					sender.bus.on('start.lifecycle', _.bind(function(e) {
						this.cards = [];
					}, self));
					sender.bus.on('view.card.skeleton.built', _.bind(self.cardAdded, self));
				}
			});

		};

		this.cards = [];

		this._ctx = {};
		this.setContext = function(ctx) {
			this._ctx = ctx;
		};

		this.refresh = function(ctx) {
			this.getCards();
		};

		// get cards
		this.getCards = function() {
			var ajaxUrl = configurator.getApplicationPath() + '/api/v1/Tasks?format=json&include=[StartDate,Id]&where=(StartDate is not null) and (EntityState.Name eq "In Progress")';

			$.ajax({
				url: ajaxUrl,
				context: this
			}).done(function(data) {
				for(var i = 0; i < data.Items.length; i++) {
					this.colorCard(data.Items[i]);
				}
			});
		};

		this.refreshDebounced = _.debounce(this.refresh, 100, false);

		this.cardAdded = function(eventName, sender) {
			this.cards.push(sender.element);
			this.refreshDebounced(this._ctx);
		};

		this.colorCard = function(currentCard) {

			try {
				var startDate = new Date(Number(currentCard.StartDate.match(/Date\((\d+)[-\+](\d+)\)/)[1]));
			} catch(e) {
				return;
			}
			var timeInProgress = new Date().getTime() - startDate.getTime();

			var color = this.getCardColor(timeInProgress);
			if (color != false) {
				$('.tau-task[data-entity-id="' + currentCard.Id + '"] .tau-card-header-container').css('background', color);
				$('.tau-task[data-entity-id="' + currentCard.Id + '"] .tau-card-header-container a.tau-id').css('cssText', "color: #000000 !important");
			}
		};

		/**
		 *
		 * @param timeInProgress
		 * @returns {string}
		 */
		this.getCardColor = function(timeInProgress) {
			var daysInProgress = timeInProgress / 86400000;

			if(daysInProgress > rottingDaysMaximumAllowed) {
				return rottingDaysMaximumAllowedColor;
			} else if(daysInProgress > rottingDaysCriticalAllowed) {
				return rottingDaysCriticalAllowedColor;
			} else if(daysInProgress > rottingDaysAllowed && daysInProgress < rottingDaysCriticalAllowed) {
				return rottingDaysAllowedColor;
			} else {
				return false;
			}
		};

	}

	new ScrumRottingCards().init();

});