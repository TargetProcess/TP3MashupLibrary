tau.mashups
    .addModule('EmbeddedPages.config', function() {
        var EmbeddedPagesConfig = {
            tabs: [{
                /*Sample embedded page of the 'CustomPageUrl' Custom Field of a User Story of a Project with the 'Scrum' Process*/
                entityTypeName: 'UserStory',
                customFieldName: 'CustomPageUrl',
                processName: 'Scrum'
            },{
                /*Sample embedded page of the 'CustomPageUrl' Custom Field of a Bug of any Project*/
                entityTypeName: 'Bug',
                customFieldName: 'CustomPageUrl'				
            }]
        };

        return EmbeddedPagesConfig;
    });