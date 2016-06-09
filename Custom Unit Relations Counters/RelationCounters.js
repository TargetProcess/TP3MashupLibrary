tau.mashups
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addMashup(function (_, globalConfigurator, et, sz) {

        var units = [
            {
                id: 'custom_open_total_work_items',
                classId: 'tau-board-unit_type_open_total_work_items',
                name: 'Open/Total Work Items',
                hideIf: function(data) {
                    return !data.total && !data.open;
                },
                types: [
                    et.FEATURE, et.EPIC, et.STORY, et.TASK, et.BUG, et.REQUEST, et.IMPEDIMENT,
                    et.RESPONSIBLE_TEAM, et.TEAM, et.PROJECT, et.ITERATION, et.TEAM_ITERATION, et.RELEASE,
                    et.TEST_CASE, et.TEST_PLAN, et.TEST_PLAN_RUN, et.BUILD, et.PROGRAM
                ],
                sizes: [sz.XS, sz.S, sz.M, sz.L, sz.XL, sz.LIST],
                template: [
                    '<div class="tau-board-unit__value-open"><%! this.data.open||"0" %>/<%! this.data.total||"0" %></div>'
                ],
                listSettings: {
                    title: [
                        'Open: <%! this.data.open||"0" %>, Total: <%! this.data.total||"0" %>'
                    ]
                },
                model:
                'total:OutboundAssignables.Where(RelationType.Name=="Link").count()+' +
                'SlaveRelations.Where(RelationType.Name=="Link" and slave.entityType.name="Project").count(),' +
                'open:OutboundAssignables.Where(RelationType.Name=="Link" and EntityState.IsFinal!=true).count()+' +
                'SlaveRelations.Where(RelationType.Name=="Link" and slave.as<Project>.EntityState.IsFinal!=true).count()',
                sampleData: {open: 5, total: 10}
            },
            {
                id: 'custom_relation_not_links',
                classId: 'tau-board-unit_type_relations-counter-in-out',
                name: "Work Relations",
                types: [
                    et.FEATURE, et.EPIC, et.STORY, et.TASK, et.BUG, et.REQUEST, et.IMPEDIMENT,
                    et.RESPONSIBLE_TEAM, et.TEAM, et.PROJECT, et.ITERATION, et.TEAM_ITERATION, et.RELEASE,
                    et.TEST_CASE, et.TEST_PLAN, et.TEST_PLAN_RUN, et.BUILD, et.PROGRAM
                ],
                sizes: [sz.XS, sz.S, sz.M, sz.L, sz.XL, sz.LIST],
                template: {
                    markup: [
                        '<div class="tau-board-unit__value">',
                        '<div class="tau-board-unit__value-in"><%= this.data.inbound %></div>',
                        '<div class="tau-board-unit__value-out"><%= this.data.outbound %></div>',
                        '</div>'
                    ]
                },
                sampleData: {
                    inbound: 10,
                    outbound: 20
                },
                hideIf: function(data) {
                    return !data.inbound && !data.outbound;
                },
                listSettings: {
                    title: [
                        'In: <%! this.data.inbound||"0" %>, out: <%! this.data.outbound||"0" %>'
                    ]
                },
                model: 'inbound:masterRelations.Where(RelationType.Name !="Link").Count,' +
                'outbound:slaveRelations.Where(RelationType.Name !="Link").Count'
            }
        ];

        function addUnits(configurator) {
            var registry = configurator.getUnitsRegistry();
            _.extend(registry.units, registry.register(units));
        }


        var appConfigurator;
        globalConfigurator.getGlobalBus().on('configurator.ready', function (e, configurator) {

            if (!appConfigurator && configurator._id && configurator._id.match(/board/)) {

                appConfigurator = configurator;
                addUnits(appConfigurator);

            }

        });
    });
