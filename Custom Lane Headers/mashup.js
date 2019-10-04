tau.mashups
    .addDependency('tau/api/board/v1/customize')
    .addDependency('tau/const/entityType.names')
    .addMashup(function(customizeApi, entityTypes){

        // This will add full project name to boards and roadmaps where Sprints/Iterations or User Stories
        // are selected as Horizontal Lanes
        customizeApi.registerDefaultAxisHeaderLayout([entityTypes.ITERATION, entityTypes.STORY], {
            sections: [
                {
                    units: [
                        {id: 'project_long', alignment: 'base'}
                    ]
                }
            ]
        });

        // This will add full name of the Release to boards and roadmaps where Features
        // are selected as Horizontal Lanes
        customizeApi.registerDefaultAxisHeaderLayout([entityTypes.FEATURE], {
            sections: [
                {
                    units: [
                        {id: 'release_long', alignment: 'base'}
                    ]
                }
            ]
        });

        // See https://github.com/TargetProcess/custom-lane-headers/tree/master/examples for more examples
        // of lanes customization
    });