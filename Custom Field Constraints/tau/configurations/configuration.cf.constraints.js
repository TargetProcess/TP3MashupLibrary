tau.mashups
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addDependency('tau/cf.constraints/ui/templates/ui.template.cf.constraints')
    .addModule('tau/cf.constraints/configurations/configuration.cf.constraints', function(_, Class, Template) {

        var ConfigurationCFConstraints = Class.extend({

            getConfig: function(config) {
                var childControls = _.map(config.customFields, function(customField) {
                    var cfTypeLowered = customField.type.toLowerCase();
                    if (cfTypeLowered === 'multipleselectionlist') {
                        cfTypeLowered = 'multiselect';
                    }

                    return {
                        selector: '.i-role-customFields',
                        type: 'customField.' + cfTypeLowered,
                        customField: customField,
                        name: 'customField-' + customField.name
                    }
                });

                childControls.push({
                    selector: '.i-role-entity-name',
                    namespace: 'tau/cf.constraints',
                    type: 'cf.constraints.header'
                });

                childControls.push({
                    selector: '.i-role-save',
                    namespace: 'tau/cf.constraints',
                    type: 'cf.constraints.save'
                });

                return {
                    layout: 'selectable',
                    template: Template,
                    children: childControls
                };
            }
        });

        return ConfigurationCFConstraints;
    });