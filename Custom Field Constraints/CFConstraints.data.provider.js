tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tp3/mashups/storage')
    .addDependency('tau/libs/store2/store2')
    .addDependency('tau/core/class')
    .addModule('CFConstraints.data.provider', function($, _, Storage, Store2, Class) {
        var CFConstraintsDataProvider = Class.extend({
            init: function() {
                this.storage = new Storage();
            },

            getEntitiesDetailsPromise: function(entitiesIds, entityType) {
                var getEntitiesDetailsDeferred = $.Deferred();
                this.storage.getEntities()
                    .ofType(entityType)
                    .filteredBy({id: {$in: entitiesIds}})
                    .withFieldSetRestrictedTo(this._getEntitiesDetailsFilter(entityType))
                    .withCallOnDone(function(entitiesDetailed) {
                        getEntitiesDetailsDeferred.resolve(_.map(entitiesDetailed, _.bind(function(entityDetailed){
                            if (entityDetailed && entityDetailed.entityType){
                                entityDetailed.type = entityDetailed.entityType.name;
                            }
                            return entityDetailed;
                        }, this)));
                    })
                    .execute();
                return getEntitiesDetailsDeferred.promise();
            },

            getDefaultProcessPromise: function() {
                var getDefaultProcessDeferred = $.Deferred();
                this.storage.getEntities()
                    .ofType('process')
                    .filteredBy({isDefault: {$eq: 'true'}})
                    .withFieldSetRestrictedTo(['id'])
                    .withCallOnDone(function(processes) {
                        var defaultProcess = processes[0];
                        getDefaultProcessDeferred.resolve(defaultProcess);
                    })
                    .execute();
                return getDefaultProcessDeferred.promise();
            },

            getEntityStatesDetailsPromise: function(changesToInterrupt, entitiesDetailed, defaultProcess) {
                var getEntityStatesDetails = $.Deferred();
                this.storage.getEntities()
                    .ofType('entityState')
                    .filteredBy(this._getEntityStateFilter(entitiesDetailed, defaultProcess))
                    .withFieldSetRestrictedTo([
                        {workflow: ['id']},
                        {process: ['id']},
                        {entityType: ['name']},
                        'name',
                        'isInitial',
                        'isFinal',
                        'isPlanned',
                        {subEntityStates: ['id', 'name', {workflow: ['id']}, 'isInitial', 'isFinal', 'isPlanned']}
                    ])
                    .withCallOnDone(getEntityStatesDetails.resolve)
                    .execute();
                return getEntityStatesDetails.promise();
            },

            getTasksDetailsPromise: function(entities) {
                var getTasksDeferred = $.Deferred();
                var tasksIds = _.chain(entities)
                    .filter(function(entity) {
                        return entity.entityType.name.toLowerCase() === 'userstory';
                    })
                    .map(function(entity) {
                        return _.filter(entity.tasks, function(task) {
                            return !task.isFinal;
                        });
                    })
                    .flatten()
                    .map(function(task) {
                        return task.id;
                    })
                    .value();

                if (tasksIds.length > 0) {
                    this.storage.getEntities()
                        .ofType('task')
                        .filteredBy({id: {$in: tasksIds}})
                        .withFieldSetRestrictedTo(['id', 'name', 'customFields', {entityType: ['name']}, {project: [
                            {process: ['id']}
                        ]}, {userStory: ['id', 'name']}])
                        .withCallOnDone(getTasksDeferred.resolve)
                        .execute();
                }
                else {
                    getTasksDeferred.resolve([]);
                }

                return getTasksDeferred.promise();
            },

            getTeamProjectsPromise: function(entitiesDetailed) {
                var teamProjectIds = _.chain(entitiesDetailed)
                    .filter(function(entityDetailed) {
                        return entityDetailed.project && !_.isEmpty(entityDetailed.assignedTeams);
                    })
                    .map(function(entityDetailed) {
                        return _.pluck(entityDetailed.project.teamProjects, 'id');
                    })
                    .flatten()
                    .unique()
                    .value();
                if (_.isEmpty(teamProjectIds)) {
                    return $.when([]);
                }
                var getTeamProjectsDetails = $.Deferred();
                this.storage.getEntities()
                    .ofType('teamProject')
                    .filteredBy({id: {$in: teamProjectIds}})
                    .withFieldSetRestrictedTo([
                        {team: ['id']},
                        {project: ['id']},
                        {workflows: ['id', 'name', {entityType: ['name']}, {parentWorkflow: ['id']}]}
                    ])
                    .withCallOnDone(getTeamProjectsDetails.resolve)
                    .execute();
                return getTeamProjectsDetails.promise();
            },

            getEntityStatesForTypesAndProcessesPromise: function(configurator, entityTypes, processIds) {
                var entityTypesValues = '%22' + entityTypes.join('%22,%20%22') + '%22';
                var processIdsValues = processIds.join(',%20');
                return (new Store2(configurator))
                    .findAll('entitystate?' +
                        'take=1000&skip=0' +
                        '&select=new%20%28id,%20name,%20isInitial,%20isFinal,%20isPlanned,%20entityType%20as%20entityType,%20process%20as%20process%29' +
                        '&where=entityType.name%20in%20[' + entityTypesValues + ']%20and%20process.id%20in%20[' + processIdsValues + ']');
            },

            getCustomFieldsForTypesAndProcessesPromise: function(configurator, entityTypes, processIds) {
                var entityTypesValues = '%22' + entityTypes.join('%22,%20%22') + '%22';
                var processIdsValues = processIds.join(',%20');
                return (new Store2(configurator))
                    .findAll('customfield?' +
                        'take=1000&skip=0' +
                        '&select=new%20(required,name,%20id,%20config,%20fieldType,%20value,%20entityType.name%20as%20entityTypeName,process.id%20as%20processId)' +
                        '&where=entityType.name%20in%20[' + entityTypesValues + ']%20and%20process.id%20in%20[' + processIdsValues + ']');
            },

            getEntityProcessId: function(entityDetailed, defaultProcess) {
                return entityDetailed.entityType.name.toLowerCase() === 'project'
                    ? entityDetailed.process.id
                    : entityDetailed.project
                    ? entityDetailed.project.process.id
                    : defaultProcess.id;
            },

            _getEntitiesDetailsFilter: function(entityType) {
                var filter = ['customFields', 'name', {entityType: ['name']}];
                filter.push(this._isProjectType(entityType)
                        ? {process: ['id']}
                        : {
                        project: [
                            {process: ['id']},
                            {teamProjects: ['id']}
                        ]
                    }
                );
                if (entityType.toLowerCase() === 'userstory') {
                    filter.push({tasks: ['id', 'name', {entityState: ['isFinal']}]});
                }
                if (this._isAssignableType(entityType)) {
                    filter.push({assignedTeams: ['id', {team: ['id']}]});
                }

                return filter;
            },

            _getEntityStateFilter: function(entitiesDetailed, defaultProcess) {
                var processIds = _.chain(entitiesDetailed)
                    .map(function(entityDetailed) {
                        return this.getEntityProcessId(entityDetailed, defaultProcess);
                    }, this)
                    .unique()
                    .value();

                return {process: {id: {$in: processIds}}};
            },

            _isProjectType: function(entityType) {
                return entityType.toLowerCase() === 'project';
            },

            _isAssignableType: function(entityType) {
                return _.contains(['epic', 'feature', 'userstory', 'request', 'bug', 'task',
                    'testplan', 'testplanrun'], entityType.toLowerCase());
            }

        });

        return CFConstraintsDataProvider;
    });