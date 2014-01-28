tau.mashups
    .addDependency('tau/core/templates-factory')
    .addModule('tau/cf.constraints/ui/templates/ui.template.cf.constraints.save', function(templates) {

        var config = {
            name: 'cf.constraints.save',
            engine: 'jqote2',
            markup: [
                '<div>',
                '<div class="i-role-error-message" style="display: none;">Please enter all custom fields</div>',
                '<div><button type="button" class="tau-btn tau-primary i-role-save">Save and Continue</button></div>',
                '</div>'
            ]
        };

        return templates.register(config);
    });
