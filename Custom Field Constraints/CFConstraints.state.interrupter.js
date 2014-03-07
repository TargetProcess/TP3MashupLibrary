tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('CFConstraints.interrupter')
    .addModule('CFConstraints.state.interrupter', function($, _, CFConstraintsInterrupter) {
        var CFConstraintsStateInterrupter = CFConstraintsInterrupter.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
            },

            _shouldChangeBeHandled: function(change) {
                return change.name.toLowerCase() === 'entitystate';
            },

            _getEntityRequiredCFs: function(entityToRequire) {
                return this.requirements.getRequiredCFsForState(entityToRequire);
            },

            _buildEntitiesWithRequirements: function(entitiesDetailed, changesToHandle, defaultProcess) {
                var entitiesToHandleDeferred = $.Deferred();

                this.dataProvider.getEntityStatesDetailsPromise(changesToHandle, entitiesDetailed, defaultProcess).done(_.bind(function(entityStatesDetailed) {
                    this.dataProvider.getTasksDetailsPromise(entitiesDetailed).done(_.bind(function(tasks) {
                        this._getEntitiesWithRequirements(entitiesToHandleDeferred, entitiesDetailed, entityStatesDetailed, changesToHandle, defaultProcess, tasks);
                    }, this))
                }, this));

                return entitiesToHandleDeferred.promise();
            },

            _getEntitiesWithRequirements: function(entitiesToHandleDeferred, entitiesDetailed, entityStatesDetailed, changesToHandle, defaultProcess, tasks) {
                var entitiesToHandle = _.map(entitiesDetailed, function(entity) {
                    var entities = [];

                    var newState = this._getNewState(entity, entityStatesDetailed, changesToHandle, defaultProcess);
                    var entityToHandle = {
                        entity: entity,
                        processId: this.dataProvider.getEntityProcessId(entity, defaultProcess),
                        requirementsData: {
                            newState: newState
                        }
                    };

                    if (entity.entityType.name.toLowerCase() === 'userstory' && newState.isFinal) {
                        entities = entities.concat(this._getUserStoryTasksToHandle(entityToHandle, tasks, entityStatesDetailed, defaultProcess));
                    }

                    entities.push(entityToHandle);

                    return entities;
                }, this);

                entitiesToHandleDeferred.resolve(_.flatten(entitiesToHandle, true));
            },

            _getUserStoryTasksToHandle: function(entityToHandle, tasks, entityStatesDetailed, defaultProcess) {
                var userStory = entityToHandle.entity;

                var entityTasks = _.filter(tasks, function(task) {
                    return task.userStory.id == userStory.id;
                });

                if (entityTasks.length === 0) {
                    return [];
                }

                var taskNewState = _.find(entityStatesDetailed, function(entityState) {
                    return entityState.isFinal
                        && entityState.process.id == entityToHandle.processId
                        && entityState.entityType.name.toLowerCase() === 'task';
                });

                return _.map(entityTasks, function(task) {
                    return {
                        entity: task,
                        processId: this.dataProvider.getEntityProcessId(task, defaultProcess),
                        requirementsData: {
                            newState: taskNewState
                        }
                    }
                }, this);
            },

            _getNewState: function(entity, entityStatesDetailed, changesToInterrupt, defaultProcess) {
                this._throwNotImplemented();
            }
        });

        return CFConstraintsStateInterrupter;
    });