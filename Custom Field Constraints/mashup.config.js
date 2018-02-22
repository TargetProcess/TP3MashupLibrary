tau.mashups.addModule("CustomFieldConstraints/config", [
    {
        // fields for Tasks, Bugs, User Stories, Requests, Features, Epics, Test Plans, Test Plan Runs and Projects

        "process": "Kanban", //Process Name the custom field belongs to
        "constraints": {
            "userstory": { //Entity Type the custom field was created for
                "entityStates": [
                    {
                        "name": "Closed", //when moving to this state in the workflow the custom field will be required
                        "requiredCustomFields": ["Resolution", "Summary"] //Custom Fields, which will be required
                    }
                ],
                "customFields": [
                    {
                        "name": "Resolution", //Custom Field, which contains the constrained value
                        "valueIn": ["Rejected", "Postponed"], //values, which makes a dependent Custom Field required
                        "requiredCustomFields": ["Reason"] //Custom Fields, which will be required
                    },
                    {
                        "name": "BillingType", //Custom Field, which contains the constrained value
                        "valueNotIn": ["Internal"], //values, which doesn't make a dependent Custom Field required
                        "requiredCustomFields": ["Customer"] //Custom Fields, which will be required
                    }
                ]
            }
        }
    },
    {
        // fields for Users, Requesters, Teams, Team Iteration and Programs

        "constraints": {
            "user": { //Entity Type the custom field was created for
                "customFields": [
                    {
                        "name": "Office", //Custom Field, which contains the constrained value
                        "valueIn": ["Remote"], //values, which makes a dependent Custom Field required
                        "requiredCustomFields": ["Location"] //Custom Fields, which will be required
                    },
                    {
                        "name": "BillingType", //Custom Field, which contains the constrained value
                        "valueNotIn": ["Internal"], //values, which doesn't make a dependent Custom Field required
                        "requiredCustomFields": ["Employer"] //Custom Fields, which will be required
                    }
                ]
            }
        }
    }
]
);