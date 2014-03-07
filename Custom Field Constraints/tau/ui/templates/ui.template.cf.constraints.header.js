tau.mashups
    .addDependency('tau/core/templates-factory')
    .addModule('tau/cf.constraints/ui/templates/ui.template.cf.constraints.header', function(templates) {

        var config = {
            name: 'cf.constraints.header',
            engine: 'jqote2',
            markup: [
                '<div>',
                '<em class="ui-type-icon ui-type-icon-<%! this.entity.entityType.name.toLowerCase() %>"><%! this.entity.id %></em>',
                '<%! this.entity.name %>',
                '</div>'
            ]
        };

        return templates.register(config);
    });
