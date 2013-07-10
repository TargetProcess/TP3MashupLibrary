tau.mashups
    .addModule('URLCustomFieldTab.config', function() {
        var urlCustomFieldTabConfig = {
            tabs: [{
                entityTypeName: 'userStory',
                customFieldName: 'Sample URL Custom Field tab for User Story'
            },{
                entityTypeName: 'bug',
                customFieldName: 'Sample URL Custom Field tab for Bug'
            }]
        };

        return urlCustomFieldTabConfig;
    });