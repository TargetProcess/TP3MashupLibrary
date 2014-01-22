define([
    'tau/components/component.creator',
    'tau/cf.constraints/models/model.cf.constraints',
    'tau/cf.constraints/ui/templates/ui.template.cf.constraints.save'
], function(ComponentCreator, Model, Template) {
    return {
        create: function(config) {

            var creatorConfig = {
                extensions: [
                    Model
                ],
                template: Template
            };

            return ComponentCreator.create(creatorConfig, config);

        }
    };
});