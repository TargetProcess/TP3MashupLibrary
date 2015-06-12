tau.mashups
    .addDependency('tau/core/templates-factory')
    .addModule('tau/cf.constraints/ui/templates/ui.template.cf.constraints', function(templates) {

        var config = {
            name: 'cf.constraints',
            engine: 'jqote2',
            markup: [
                '<div class="cf-constraints-container tau-page-entity main-container">',
                '<div class="cf-constraints-entity-name tau-entity-caption i-role-entity-name"></div>',
                '<div class="cf-constraints-note">Please specify the following custom fields</div>',
                '<div class="cf-constraints-customFields i-role-customFields"></div>',
                '<div class="cf-constraints-save i-role-save"></div>',
                '</div>'
            ]
        };

        return templates.register(config);
    });
