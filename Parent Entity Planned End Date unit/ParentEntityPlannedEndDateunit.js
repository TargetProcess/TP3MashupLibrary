tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addDependency('tau/models/board.customize.units/board.customize.units.base')
    .addMashup(function($, _, globalConfigurator, types, sizes, helper) {

        var units = [{
            id: 'feature_endDate',
            classId: 'tau-board-unit_type_date',
            hideIf: function(data) {
                return !data.endDate;
            },
            sortConfig: {
                field: 'feature.plannedEndDate'
            },
            name: '${Feature,capital} planned end date',
            header: '${Feature,capital} planned end date',
            types: [
                types.STORY, types.BUG
            ],
            term: 'feature',
            sizes: [sizes.XS, sizes.S, sizes.M, sizes.L, sizes.LIST],
            template: [
                '<div class="tau-board-unit__value">&rarr;',
                '<div class="tau-board-unit__value_type_day"><%=fn.formatDayShort(this.data.endDate)%></div>',
                '<div class="tau-board-unit__value_type_month"><%=fn.formatDate(this.data.endDate, "MMM")%></div>',
                '<div class="tau-board-unit__value_type_year"><%=fn.formatDate(this.data.endDate, "yyyy")%></div>',
                '</div>'
            ],
            sampleData: {
                endDate: '\/Date(1385350733000-0500)\/'
            },
            model: 'endDate:feature.plannedEndDate'
        }, {
            id: 'userstory_planned_end',
            classId: 'tau-board-unit_type_date',
            hideIf: function(data) {
                return !data.endDate;
            },
            sortConfig: {
                field: 'userstory.plannedEndDate'
            },
            name: '${Userstory,capital} planned end date',
            header: '${Userstory,capital} planned end date',
            types: [
                types.TASK
            ],
            term: 'userstory',
            sizes: [sizes.XS, sizes.S, sizes.M, sizes.L, sizes.LIST],
            template: [
                '<div class="tau-board-unit__value">&rarr;',
                '<div class="tau-board-unit__value_type_day"><%=fn.formatDayShort(this.data.endDate)%></div>',
                '<div class="tau-board-unit__value_type_month"><%=fn.formatDate(this.data.endDate, "MMM")%></div>',
                '<div class="tau-board-unit__value_type_year"><%=fn.formatDate(this.data.endDate, "yyyy")%></div>',
                '</div>'
            ],
            sampleData: {
                endDate: '\/Date(1385350733000-0500)\/'
            },
            model: 'endDate:userstory.plannedEndDate'
        }, {
            id: 'release_endDate',
            classId: 'tau-board-unit_type_date',
            hideIf: function(data) {
                return !data.endDate;
            },
            sortConfig: {
                field: 'release.plannedEndDate'
            },
            name: '${Release,capital} finish date',
            header: '${Release,capital} finish date',
            types: [
                types.STORY, types.FEATURE
            ],
            term: 'release',
            sizes: [sizes.XS, sizes.S, sizes.M, sizes.L, sizes.LIST],
            template: [
                '<div class="tau-board-unit__value">&rarr;',
                '<div class="tau-board-unit__value_type_day"><%=fn.formatDayShort(this.data.endDate)%></div>',
                '<div class="tau-board-unit__value_type_month"><%=fn.formatDate(this.data.endDate, "MMM")%></div>',
                '<div class="tau-board-unit__value_type_year"><%=fn.formatDate(this.data.endDate, "yyyy")%></div>',
                '</div>'
            ],
            sampleData: {
                endDate: '\/Date(1385350733000-0500)\/'
            },
            model: 'endDate:release.endDate'
        }];

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
