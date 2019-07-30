tau.mashups
    .addDependency('tau/core/class')
    .addDependency('tau/configurator')
    .addModule('WorkflowImageStreamlinerModel', function(Class, configurator) {
        return Class.extend({
            init: function(processId, entityType) {
                this._store2 = configurator.getStore2();
                this._processId = processId;
                this._entityType = entityType;
            },
            fetch: function() {
                return this._store2
                    .findAll('entityState?select={id,name,nextStates,isInitial,isFinal,isPlanned}&take=1000&where=(process.id = ' + this._processId + ' and entityType.name = "' + this._entityType + '")');
            }
        });
    });
