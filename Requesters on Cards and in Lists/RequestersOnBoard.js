tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addDependency('tau/models/board.customize.units/board.customize.units.base')
    .addMashup(function($, _, globalConfigurator, types, sizes, helper) {

        var units = [
            {
                id: 'request_requesters',
                classId: 'tau-board-unit_type_request_requesters',
                hideIf: function(data) {
                    return !data.requesters || !data.requesters.length;
                },
                name: 'Requesters',
                header: 'Requesters',
                types: [
                    types.REQUEST
                ],
                sections: 1,
                sizes: [sizes.S, sizes.M, sizes.L, sizes.XL],
                template: [
                    '<div class="tau-board-unit__icon-wrapper">',
                       '<div class="tau-icon-general tau-icon-thumbnail"></div>',
                    '</div>',
                    '<div class="tau-board-unit__value">',
                       '<%! _.pluck(this.data.requesters, "fullName").join(", ")%>',
                    '</div>'
                ],
                sampleData: {
                    requesters: [
                        {
                            id: 1,
                            fullName: 'Adam Mickiewicz'
                        },
                        {
                            id: 2,
                            fullName: 'Janka Kupala'
                        }
                    ]
                },

                model: 'requesters:requesters.Select({id,fullName})'
            },
            {
                id: 'request_requesters_list',
                classId: 'tau-board-unit_type_assigned_users_names',
                hideIf: function(data) {
                    return !data.requesters || !data.requesters.length;
                },
                name: 'Requesters',
                header: 'Requesters',
                settings: [
                    {
                        types: [types.REQUEST],
                        sizes: [sizes.LIST],
                        model: 'requesters:requesters.Select({id,fullName})'
                    }
                ],
                template: {
                    markup: [
                        '<%= fn.requesters(this.data.requesters) %>'
                    ],
                    customFunctions: {
                        requesters: function(data) {
                            return _.map(data, function(requester){
                                return '<span class="tau-board-unit__value">' + _.escape(requester.fullName) + '</span>'
                            }).join(", ");
                        }
                    }
                },
                listSettings: {
                    title: '<%= _.pluck(this.data.requesters, "fullName").join("&#10;") %>',
                    maxWidth: 300
                },
                sampleData: {
                    requesters: [
                        {
                            id: 1,
                            fullName: 'Adam Mickiewicz'
                        },
                        {
                            id: 2,
                            fullName: 'Janka Kupala'
                        }
                    ],
                    currentStateResponsiblePersons: []
                }
            }


        ];

        function addUnits(configurator) {
            var registry = configurator.getUnitsRegistry();
            _.extend(registry.units, registry.register(units));
        }

        var appConfigurator;
        globalConfigurator.getGlobalBus().on('configurator.ready', function(e, configurator) {

            if (!appConfigurator && configurator._id && configurator._id.match(/board/)) {

                appConfigurator = configurator;
                addUnits(appConfigurator);

            }

        });

    });
