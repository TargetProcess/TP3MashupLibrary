tau.mashups
.addDependency('tp/mashups')
.addDependency('user/mashups')
.addDependency('jQuery')
.addDependency('Underscore')
.addDependency('tp3/mashups/context')
.addDependency('tau/core/bus.reg')
.addDependency('tau/configurator')
.addDependency("tau/utils/utils.date")
.addMashup(function (m, um, $, _, context, busRegistry, configurator, du) {
	var colorer = function() {
		this.init = function() {
			var self = this;

			this.requestCardElements = [];
			this.requestAttributesLoaded = {};
			this.createdDates = {};
			this.lastCommentDates = {};
			this.lastCommentUserKinds = {};
			
			this.includeIdeas = 0; //0 by default
			this.includeInitialStateOnly = 1; //1 by default
			this.hourLimits = [0, 1, 18, 24]; //[0, 1, 18, 24] by default
			this.colors = ['#d8ffa0', '', '#fffdb0', '#ffb090']; //['#d8ffa0', '', '#fffdb0', '#ffb090'] by default
			this.grayColor = '#e4e4e4'; //'#e4e4e4' by default
				
			context.onChange(function(ctx) {
				self.setContext(ctx);
				self.refresh(ctx);
			});

			busRegistry.on('create', function(eventName, sender) {
				if (sender.bus.name == 'board_plus') {
					sender.bus.on('start.lifecycle', _.bind(function(e) { this.requestCardElements = []; }, self));
					sender.bus.on('view.card.skeleton.built', _.bind(self.cardAdded, self));
				}
			});
		};

		this._ctx = {};
		this.setContext = function(ctx) {
			this._ctx = ctx;
		};

		this.refresh = function(ctx) {
			if (this.requestCardElements.length == 0){
				return;
			}
			var acid = ctx.acid;
			var searchCriteria = '';
			if (this.includeInitialStateOnly) {
				searchCriteria = searchCriteria + (searchCriteria ? ' and ' : '') + 'EntityState.isInitial==true';
			}
			if (!(this.includeIdeas)) {
				searchCriteria = searchCriteria + (searchCriteria ? ' and ' : '') + 'RequestType.Name!="Idea"';
			}			
			var requestUrl = configurator.getApplicationPath() + '/api/v2/Request?take=1000' + (searchCriteria ? '&where=' + searchCriteria : '') + '&select={id,CreateDate as createDate,LastCommentDate as lastCommentDate,LastCommentedUser.Kind as lastCommentUserKind}&acid=' + acid;
			$.ajax({
				url: requestUrl,
				context: this
			}).done(function(data) {
				this.requestAttributesLoaded = {};
				for(var i = 0; i < data.items.length; i++) {
					var id = data.items[i].id;
					this.createdDates[id] = data.items[i].createDate;
					this.lastCommentDates[id] = data.items[i].lastCommentDate;
					this.lastCommentUserKinds[id] = data.items[i].lastCommentUserKind;							
					this.requestAttributesLoaded[id] = true;
				}
				this.renderAll();
			});
		};

		this.refreshDebounced = _.debounce(this.refresh, 100, false);

		this.cardAdded = function(eventName, sender) {
			var $element = sender.element;
			if ($element.data('entityType').toLowerCase() === 'request'){
				this.requestCardElements.push($element);
			}
			this.refreshDebounced(this._ctx);
		};

		this._getCardId = function (card) {
			return card.attr('data-entity-id'); 
		};

		this._getColor = function(id, createdDate, lastCommentDate, lastCommentUserKind) {
			if ((lastCommentDate)&&(lastCommentUserKind == 'User')) {
				return 'background: ' + this.grayColor;
			}
			var hoursDiff = getHoursDiff(createdDate, lastCommentDate);
			var resultColor = '';
			for(var i = 0; i < this.hourLimits.length; i++) {
				if (hoursDiff >= this.hourLimits[i]) {
					resultColor = this.colors[i];
				}
			}
			return (resultColor ? 'background: ' + resultColor : '');

			function getHoursDiff(createdDate, lastCommentDate) {
				var timeDiff = getTimeDiff(createdDate, lastCommentDate);
				return Math.floor(timeDiff / (1000 * 3600));
			}

			function getTimeDiff(createdDate, lastCommentDate) {
				var localDate = extractDate(new Date());
				if (lastCommentDate) {
					var lastCommentLocalDate = extractDate(lastCommentDate);
					return Math.abs(localDate.getTime() - lastCommentLocalDate.getTime());
				}
				if (createdDate) {
					var createdLocalDate = extractDate(createdDate);
					return Math.abs(localDate.getTime() - createdLocalDate.getTime());
				}
				return 0;
			}
						
			function extractDate(date) {
				return du.parse(date);
			}
		};
					
		this.renderCard = function(card) {
			var self = this;
			var id = this._getCardId(card);
			if (!(this.requestAttributesLoaded[id])) {
				return;
			}
			var createdDate = this.createdDates[id];
			var lastCommentDate = this.lastCommentDates[id];
			var lastCommentUserKind = this.lastCommentUserKinds[id];		
			card.attr('style', this._getColor(id, createdDate, lastCommentDate, lastCommentUserKind));
		};

		this.renderAll = function() {
			var self = this;
			$.each(this.requestCardElements, function(index, card) {
				self.renderCard(card);
			});
		};
	}

	new colorer().init();
});
