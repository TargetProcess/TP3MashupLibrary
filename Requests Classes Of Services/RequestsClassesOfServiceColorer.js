tau.mashups
    .addDependency('tp/mashups')
    .addDependency('user/mashups')
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/context')
    .addDependency('tau/core/bus.reg')
    .addDependency('tau/configurator')
    .addDependency("tau/utils/utils.date")
    .addMashup(function(m, um, $, _, context, busRegistry, configurator, du) {

        var Colorer = function() {

            this.init = function() {
                var self = this;

                this.requestCardElements = [];
                this.requestAttributesLoaded = {};
                this.createdDates = {};
                this.lastCommentDates = {};
                this.lastCommentUserKinds = {};
                this.isReplied = {};

                this.includeIdeas = 0; //0 by default
                this.includeInitialStateOnly = 1; //1 by default
                this.hourLimits = [0, 1, 18, 24]; //[0, 1, 18, 24] by default
                this.leftInQueueNormalDayLimit = 1;
                this.leftInQueueWarningDayLimit = 3;
                this.colors = ['#d8ffa0', '', '#fffdb0', '#ffb090']; //['#d8ffa0', '', '#fffdb0', '#ffb090'] by default
                this.grayColor = '#e4e4e4'; //'#e4e4e4' by default

                context.onChange(function(ctx) {
                    self.setContext(ctx);
                    self.refresh(ctx);
                });

                busRegistry.on('create', function(eventName, sender) {
                    if (sender.bus.name == 'board_plus') {
                        sender.bus.on('start.lifecycle', _.bind(function(e) {
                            this.requestCardElements = [];
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
                if (this.requestCardElements.length == 0) {
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
                var requestUrl = configurator.getApplicationPath() + '/api/v2/Request?take=1000' + (searchCriteria ? '&where=' + searchCriteria : '') + '&select={id,createDate:CreateDate,lastCommentDate:LastCommentDate,lastCommentUserKind:LastCommentedUser.Kind, isReplied:IsReplied}&acid=' + acid;
                $.ajax({
                    url: requestUrl,
                    context: this
                }).done(function(data) {
                    this.requestAttributesLoaded = {};
                    var items = data.items || [];
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var id = item.id;
                        this.createdDates[id] = item.createDate;
                        this.lastCommentDates[id] = item.lastCommentDate;
                        this.lastCommentUserKinds[id] = item.lastCommentUserKind;
                        this.isReplied[id] = item.isReplied;
                        this.requestAttributesLoaded[id] = true;
                    }
                    this.renderAll();
                });
            };

            this.refreshDebounced = _.debounce(this.refresh, 100, false);

            this.cardAdded = function(eventName, sender) {
                var $element = sender.element;
                if ($element.data('entityType') && $element.data('entityType').toLowerCase() === 'request') {
                    this.requestCardElements.push($element);
                }
                this.refreshDebounced(this._ctx);
            };

            this._getCardId = function(card) {
                return card.attr('data-entity-id');
            };

            this._getColor = function(id, createdDate, lastCommentDate, lastCommentUserKind, isReplied) {
                var hoursDiff = getHoursDiff(createdDate, lastCommentDate);
                if ((lastCommentDate) && (lastCommentUserKind == 'User')) {
                    var leftInQueueDiff = hoursDiff;
                    if (isReplied) {
                        if (leftInQueueDiff < 24 * 30) {
                            return 'background: ' + this.grayColor;
                        } else {
                            return 'background: ' + this.colors[this.colors.length - 1];
                        }
                    }
                    if (leftInQueueDiff < (24 * this.leftInQueueNormalDayLimit)) {
                        return 'background: ' + this.grayColor;
                    }
                    if (leftInQueueDiff >= (24 * this.leftInQueueWarningDayLimit)) {
                        return 'background: ' + this.colors[this.colors.length - 1];
                    }
                    return;
                }

                var resultColor = '';
                for (var i = 0; i < this.hourLimits.length; i++) {
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
                var isReplied = this.isReplied[id];
                card.attr('style', this._getColor(id, createdDate, lastCommentDate, lastCommentUserKind, isReplied));
            };

            this.renderAll = function() {
                var self = this;
                $.each(this.requestCardElements, function(index, card) {
                    self.renderCard(card);
                });
            };
        }

        new Colorer().init();
    });
