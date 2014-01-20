define([
    'tau/components/component.page.base',
    'tau/cf.constraints/ui/extensions/ui.extension.cf.constraints',
    'tau/cf.constraints/views/view.cf.constraints'
], function(ComponentPageBase, ExtensionCfConstraints, ViewType) {
    return {
        create: function(componentContext) {

            var componentConfig = {
                name: "cf constraints page component",
                extensions: [ExtensionCfConstraints],
                ViewType: ViewType
            };

            return ComponentPageBase.create(componentConfig, componentContext);
        }
    };
});
