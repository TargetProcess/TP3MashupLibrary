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
                       '<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: block">',
                            '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
                                '<path d="M4.28963239,8 C4.76528139,7.5024446 5.17997518,6.95581965 5.54562279,6.35884396 C5.99950607,5.61781003 6.35578528,4.84443201 6.70458737,3.90925301 C6.72791134,3.84671873 7.27378157,2.29350925 7.41809423,1.96880577 C7.69689393,1.34150642 7.99788265,1 8.5,1 C9.13391313,1 9.58406893,1.30010387 9.8222136,1.7763932 C9.95691491,2.04579583 10,2.30430637 10,2.5 L10,6 L11,6 C11.3637646,6 11.8759087,6.08033632 12.3997497,6.32684976 C13.7953857,6.98361963 14.3089106,8.43357232 13.4681646,10.6755617 C12.1262823,14.2539144 11.7098484,15 10.5,15 L1,15 L1,8 L4.28963239,8 L4.28963239,8 Z M5,8.70404172 C5.53175192,8.14979964 5.99348518,7.54220425 6.39837721,6.88115604 C6.89027682,6.07805463 7.27208615,5.24925817 7.64153763,4.25871574 C7.67859301,4.15936597 8.20677132,2.65649676 8.33190577,2.37494423 C8.46151124,2.08333194 8.53495634,2 8.5,2 C8.74108687,2 9,2 9,2.5 L9,7 L11,7 C11.0497337,7 11.154113,7.00701709 11.2934071,7.02886715 C11.5277415,7.06562548 11.7611662,7.13153364 11.9739527,7.23166846 C12.8793548,7.65774003 13.1962797,8.55258685 12.5318354,10.3244383 C11.4211266,13.2863284 11.0227849,14 10.5,14 L5,14 L5,8.70404172 Z" id="Combined-Shape" fill="#A0A1A4"></path>',
                            '</g>',
                       '</svg>',
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
