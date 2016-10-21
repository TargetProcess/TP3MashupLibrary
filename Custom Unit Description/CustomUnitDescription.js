tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addMashup(function($, _, globalConfigurator, types, sizes, helper) {

        var units = [
            {
                id: 'custom_rich_text',
                classId: 'tau-board-unit_type_custom-rich-text',
                name: 'Description',
                types: [ types.PROJECT, types.FEATURE, types.EPIC, types.STORY, types.TASK, types.BUG, types.REQUEST ],
                sections: 1,
                sizes: [ sizes.M, sizes.L, sizes.XL ],
                template: [
                  '<% if(this.data.description) { %>',
                    '<div class="tau-board-unit__value" style="white-space:normal">',
                    '<% var tmp = document.createElement("DIV"); %>',
                    '<% tmp.innerHTML = this.data.description; %>',
                    '<% var plain = tmp.textContent || tmp.innerText || ""; %>',
                    '<% if(plain.length > 150) { plain = plain.substring(0, 150) + "..."; } %>',
                    '<%= plain.replace(/\u00a0/g, " ") %>',
                    '</div>',
                  '<% } %>'
                ],
                model: 'description:Description',
                sampleData: { description: '<div>Entity description</div>' }
           },
           {
                id: 'custom_rich_text_list',
                classId: 'tau-board-unit_type_custom-rich-text',
                name: 'Description',
                types: [ types.PROJECT, types.FEATURE, types.EPIC, types.STORY, types.TASK, types.BUG, types.REQUEST ],
                sections: 1,
                sizes: [ sizes.LIST ],
                template: [
                  '<% if(this.data.description) { %>',
                    '<div class="tau-board-unit__value">',
                    '<% var tmp = document.createElement("DIV"); %>',
                    '<% tmp.innerHTML = this.data.description; %>',
                    '<% var plain = tmp.textContent || tmp.innerText || ""; %>',
                    '<% if(plain.length > 300) { plain = plain.substring(0, 300); } %>',
                    '<%= plain.replace(/\u00a0/g, " ") %>',
                    '</div>',
                  '<% } %>'
                ],
                model: 'description:Description',
                sampleData: { description: '<div>Entity description</div>' }
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
