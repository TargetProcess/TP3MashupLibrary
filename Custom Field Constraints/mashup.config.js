tau.mashups.addModule("CustomFieldConstraints/config", [
    {
        // Fields for Tasks, Bugs, User Stories, Requests, Features, Epics, Test Plans, Test Plan Runs and Projects.
        // Process Name the custom field belongs to
        "process": "Kanban",
        "constraints": {
            // Entity Type the custom field was created for.
            "userstory": {
                "entityStates": [
                    {
                        // When moving to this state in the workflow the custom field will be required.
                        "name": "Closed",
                        // Custom Fields, which will be required.
                        "requiredCustomFields": ["Resolution", "Summary"]
                    }
                ],
                "customFields": [
                    {
                        // Custom Field, which contains the constrained value
                        "name": "Resolution",
                        // Values, which makes a dependent Custom Field required
                        "valueIn": ["Rejected", "Postponed"],
                        // Custom Fields, which will be required.
                        "requiredCustomFields": ["Reason"]
                    },
                    {
                        // Custom Field, which contains the constrained value.
                        "name": "BillingType",
                        // Values, which doesn't make a dependent Custom Field required.
                        "valueNotIn": ["Internal"],
                        // Custom Fields, which will be required.
                        "requiredCustomFields": ["Customer"]
                    }
                ]
            }
        }
    },
    {
        // Fields for Users, Requesters, Teams, Team Iteration and Programs.
        "constraints": {
            // Entity Type the custom field was created for.
            "user": {
                "customFields": [
                    {
                        // Custom Field, which contains the constrained value.
                        "name": "Office",
                        // Values, which makes a dependent Custom Field required.
                        "valueIn": ["Remote"],
                        // Custom Fields, which will be required.
                        "requiredCustomFields": ["Location"]
                    },
                    {
                        // Custom Field, which contains the constrained value.
                        "name": "BillingType",
                        // Values, which doesn't make a dependent Custom Field required.
                        "valueNotIn": ["Internal"],
                        // Custom Fields, which will be required.
                        "requiredCustomFields": ["Employer"]
                    }
                ]
            }
        }
    }
]
);