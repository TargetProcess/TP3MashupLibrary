tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addModule('CFConstraints.interrupter', function($, _, Class) {
        var CFConstraintsInterrupter = Class.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this.dataProvider = dataProvider;
                this.requirements = requirements;
                this.requireEntityCFsCallback = requireEntityCFsCallback;
            },

            subscribe: function() {
                var entityTypesToInterrupt = this.requirements.getEntityTypesToInterrupt();
                var interrupter = this._getInterrupter();

                _.forEach(entityTypesToInterrupt, function(entityTypeToInterrupt) {
                    interrupter.interruptSave(entityTypeToInterrupt, _.bind(function(interruptedActionDeferred, entitiesChanges) {

                        var changesToHandle = this._filterChangesToHandle(entitiesChanges);

                        if (changesToHandle.length == 0) {
                            interruptedActionDeferred.resolve();
                            return;
                        }

                        this._processChangesToHandle(changesToHandle, entityTypeToInterrupt, interruptedActionDeferred);
                    }, this));
                }, this);
            },

            _throwNotImplemented: function() {
                throw new Error('Not implemented');
            },

            _getInterrupter: function() {
                this._throwNotImplemented();
            },

            _filterChangesToHandle: function(entitiesChanges) {
                return _.filter(entitiesChanges, _.bind(function(entityChanges) {
                    return _.some(entityChanges.changes, _.bind(function(change) {
                        return this._shouldChangeBeHandled(change);
                    }, this)) && entityChanges.id;
                }, this));
            },

            _shouldChangeBeHandled: function(change) {
                this._throwNotImplemented();
            },

            _processChangesToHandle: function(changesToHandle, entityTypeToInterrupt, interruptedActionDeferred) {
                var changedEntitiesIds = this._getChangedEntitiesIds(changesToHandle);
                $.when(
                        this.dataProvider.getEntitiesDetailsPromise(changedEntitiesIds, entityTypeToInterrupt),
                        this.dataProvider.getDefaultProcessPromise()
                    ).then(_.bind(function(entitiesDetailed, defaultProcess) {
                        return this._buildEntitiesWithRequirements(entitiesDetailed, changesToHandle, defaultProcess);
                    }, this)
                    ).done(_.bind(function(entitiesWithRequirements) {
                        this._handleEntitiesRequirements(entitiesWithRequirements, interruptedActionDeferred);
                    }, this));
            },

            _getChangedEntitiesIds: function(changes) {
                return _.map(changes, _.bind(function(change) {
                    return this._getChangedEntityId(change);
                }, this)).join(',');
            },

            _getChangedEntityId: function(change) {
                this._throwNotImplemented();
            },

            _buildEntitiesWithRequirements: function(entitiesDetailed, changesToHandle, defaultProcess) {
                this._throwNotImplemented();
            },

            _handleEntitiesRequirements: function(entitiesWithRequirements, interruptedActionDeferred) {
                var iterateEntitiesToRequire = _.bind(function(entitiesToRequire, index) {
                    var entityIndex = index || 0;
                    var entityToRequire = entitiesToRequire[entityIndex];
                    if (!entityToRequire) {
                        interruptedActionDeferred.resolve();
                        return;
                    }

                    var requiredCFs = this._getEntityRequiredCFs(entityToRequire);
                    if (requiredCFs.length == 0) {
                        iterateEntitiesToRequire(++entityIndex);
                        return;
                    }

                    this._requireEntityCFs(entityToRequire, requiredCFs)
                        .done(function() {
                            iterateEntitiesToRequire(++entityIndex)
                        })
                        .fail(interruptedActionDeferred.reject)
                }, this, entitiesWithRequirements);

                iterateEntitiesToRequire();
            },

            _requireEntityCFs: function(entityToRequire, customFields) {
                var requireEntityCFsDeferred = $.Deferred();
                this.requireEntityCFsCallback({entity: entityToRequire.entity, customFields: customFields}, requireEntityCFsDeferred);
                return requireEntityCFsDeferred.promise();
            }
        });

        return CFConstraintsInterrupter;
    });