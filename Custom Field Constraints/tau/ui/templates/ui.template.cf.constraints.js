define([
    'tau/core/templates-factory'
], function(templates) {

    var config = {
        name: 'cf.constraints',
        engine: 'jqote2',
        markup: [
            '<div class="cf-constraints-container tau-page-entity">',
            '<div class="cf-constraints-entity-name tau-entity-caption i-role-entity-name"></div>',
            '<div class="cf-constraints-note">Please specify the following custom fields</div>',
            '<div class="cf-constraints-customFields i-role-customFields"></div>',
            '<div class="cf-constraints-save i-role-save"></div>',
            '</div>'
        ]
    };

    return templates.register(config);
});
