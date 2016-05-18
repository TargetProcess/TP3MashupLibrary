tau.mashups.addModule("CustomFieldConstraints/config", [
    {
        "process": "Kanban",
        "constraints": {
            "userStory": {
                "customFields": [
                    {
                        "name": "Age",
                        "requiredCustomFields": [
                            "Height"
                        ]
                    }
                ]
            }
        }
    }
]);