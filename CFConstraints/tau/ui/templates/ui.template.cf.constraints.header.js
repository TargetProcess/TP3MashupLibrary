define([
    'tau/core/templates-factory'
], function(templates) {

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
