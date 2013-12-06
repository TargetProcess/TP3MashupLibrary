define([
    'tau/components/component.creator'
    , 'tau/cf.constraints/models/model.cf.constraints.header'
    , 'tau/cf.constraints/ui/templates/ui.template.cf.constraints.header'
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
