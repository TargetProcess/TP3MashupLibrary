tau.mashups
    .addDependency('Underscore')
    .addDependency('tp3/mashups/sliceinterrupter')
    .addDependency('tp3/mashups/storage')
    .addDependency('CFConstraints.state.interrupter')
    .addDependency('CFConstraints.slice.decoder')
    .addModule('CFConstraints.state.interrupter.slice', function(_, SliceInterrupter, Storage, CFConstraintsStateInterrupter, SliceDecoder) {
        var CFConstraintsStateInterrupterSlice = CFConstraintsStateInterrupter.extend({
            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
                this.sliceDecoder = new SliceDecoder();
            },

            _getInterrupter: function() {
                return new SliceInterrupter();
            },

            _getChangedEntityId: function(change) {
                return this.sliceDecoder.decode(change.id);
            },

            _getNewState: function(entity, entityStatesDetailed, changesToInterrupt, defaultProcess, teamProjects) {
                var entityStateChange = _.find(changesToInterrupt, function(change) {
                    return parseInt(this.sliceDecoder.decode(change.id)) === entity.id;
                }, this);

                return this._getEntityState(entity, entityStatesDetailed, entityStateChange.changes, defaultProcess, teamProjects);
            },

            _getEntityState: function(entity, entityStates, changes, defaultProcess, teamProjects) {
                var change = _.find(changes, function(change) {
                    return this._shouldChangeBeHandled(change);
                }, this);
                if (!change) {
                    return null;
                }
                var stateName = this.sliceDecoder.decode(change.value);

                if (this._isTeamStateChange(change)) {
                    return this._getTeamState(stateName, entity, entityStates, teamProjects);
                } else {
                    return _.find(entityStates, function(state) {
                        return state.process.id === this.dataProvider.getEntityProcessId(entity, defaultProcess)
                            && state.entityType.name === entity.entityType.name
                            && this.isStateEqual(stateName, state)
                    }, this);
                }
            },

            _getTeamState: function(stateName, entity, entityStates, teamProjects) {
                if (_.isEmpty(entity.assignedTeams)) {
                    return null;
                }
                var workflowIds = _.compact(_.map(entity.assignedTeams, function(teamAssignment) {
                    var teamId = teamAssignment.team.id;
                    var teamProject = _.find(teamProjects, function(teamProjects) {
                        return teamProjects.project.id === entity.project.id &&
                            teamProjects.team.id === teamId;
                    });
                    if (!teamProject) {
                        return null;
                    }
                    return _.find(teamProject.workflows, function(workflow) {
                        return workflow.entityType.name === entity.entityType.name;
                    }).id;
                }));
                return _.find(entityStates, function(state) {
                    if (this.isProperState(stateName, state, workflowIds)) {
                        return true;
                    }
                    return _.some(state.subEntityStates, function(sub) {
                        return this.isProperState(stateName, sub, workflowIds);
                    }.bind(this));
                }.bind(this));
            },

            isProperState: function(stateName, state, workflowIds) {
                return _.contains(workflowIds, state.workflow.id) && this.isStateEqual(stateName, state)
            },

            isStateEqual: function(expectedStateName, actualState) {
                var lowerName = expectedStateName.toLowerCase();
                return (lowerName === actualState.name.toLowerCase()
                    || (lowerName === '_initial' && actualState.isInitial)
                    || (lowerName === '_final' && actualState.isFinal)
                    || (lowerName === '_planned' && actualState.isPlanned)
                );
            }
        });

        return CFConstraintsStateInterrupterSlice;
    });
