tau.mashups
    .addModule('QuickFilters.config', function() {

        'use strict';

        return {
            predefinedFilters: [{
                'Filter': '?Comments.Where(CreateDate >= today - 7(days))',
                'Desc': 'Items with recent comments'
            },{
                'Filter': '?AssignedUser.Where(it is me) or Owner is me',
                'Desc': 'My items'
            }]
        };
    });
