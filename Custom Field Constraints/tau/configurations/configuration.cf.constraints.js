tau.mashups
    .addDependency('Underscore')
    .addDependency('tau/core/class')
    .addDependency('tau/cf.constraints/ui/templates/ui.template.cf.constraints')
    .addModule('tau/cf.constraints/configurations/configuration.cf.constraints', function(_, Class, Template) {

        var ConfigurationCFConstraints = Class.extend({

            getConfig: function(config) {
                var childControls = _.map(config.customFields, function(customField) {

                    var cfTypeLowered = customField.type.toLowerCase();

                    switch (cfTypeLowered) {
                        case 'multipleselectionlist':
                            return this._getEditorConfig(customField, 'multiselect');
                        case 'richtext':
                            return this._getRichTextEditorConfig(customField);
                        default:
                            return this._getEditorConfig(customField, cfTypeLowered);
                    }
                }.bind(this));

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
            },

            _getEditorConfig: function(customField, cfTypeLowered, customSelector) {
                return {
                    selector: customSelector || '.i-role-customFields',
                    type: 'customField.' + cfTypeLowered,
                    customField: customField,
                    name: 'customField-' + customField.name
                };
            },

            _getRichTextEditorConfig: function(customField) {
                return {
                    type: 'container',
                    name: 'customField-' + customField.name + '-container',
                    selector: '.i-role-customFields',
                    template: {
                        name: 'cf.constraints.richText',
                        markup: [
                            '<div class="ui-customfield  ui-customfield_empty_true ui-customfield_editable_true cf-constraints-richText">',
                            '<table><tbody><tr>',
                            '<td class="ui-customfield__label">', customField.name, '</td>',
                            '<td class="ui_custom_field_value_container i-role-richText"></td>',
                            '</tr></tbody></table>',
                            '</div>'
                        ]
                    },
                    layout: 'selectable',
                    children: [
                        this._getEditorConfig(customField, 'richtext', '.i-role-richText')
                    ]
                };
            }
        });

        return ConfigurationCFConstraints;
    });