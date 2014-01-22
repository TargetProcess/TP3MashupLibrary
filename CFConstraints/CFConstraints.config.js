tau.mashups    
    .addModule('CFConstraints.config', function() {
        return [{
            processId: 1,
            constraints: {
                'userstory': {
                    'entityStates': [
                        {
                            name: 'Open',
                            requiredCustomFields: ['Cf1']
                        }
                    ],
                    'customFields': [
                        {
                            name: 'Cf1',
                            valueIn: ['Cf1ValueThatRequiresCf2'],
                            requiredCustomFields: ['Cf2']
                        }                       
                    ]
                },
                'project': {
                    'customFields': [
                        {
                            name: 'Cf1',
                            valueNotIn: ['Cf1ValueThatDoesNotRequireCf2'],
                            requiredCustomFields: ['Cf2']
                        }                    
                    ]
                }
            }
        }];
    });