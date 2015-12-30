tau.mashups.addModule("CustomFieldConstraints/config", [
    {
        "processId": 4,
        "constraints": {
            "userstory": {
                "entityStates": [
                    {
                        "name": "Open",
                        "requiredCustomFields": [
                            "ent",
                            "ment"
                        ]
                    }
                ],
                "customFields": [
                    {
                        "name": "Cf1",
                        "valueIn": [
                            "Cf1ValueThatRequiresCf2"
                        ],
                        "requiredCustomFields": [
                            "Cf2"
                        ]
                    }
                ]
            },
            "project": {
                "customFields": [
                    {
                        "name": "Cf1",
                        "valueNotIn": [
                            "Cf1ValueThatDoesNotRequireCf2"
                        ],
                        "requiredCustomFields": [
                            "Cf2"
                        ]
                    }
                ]
            }
        }
    }
]);