define([
    'tau/components/component.page.base'
    , 'tau/cf.constraints/views/view.cf.constraints'
], function(ComponentPageBase, ViewType) {
    return {
        create: function(componentContext) {

            var componentConfig = {
                name: "cf constraints page component",
                extensions: [],
                ViewType: ViewType
            };

            return ComponentPageBase.create(componentConfig, componentContext);
        }
    };
});
