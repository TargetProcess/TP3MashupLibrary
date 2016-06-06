tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')      
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addMashup(function($, _, globalConfigurator, types, sizes) {

        function addUnits(configurator) {
            var unitRegistry = configurator.getUnitsRegistry();
            var projectLong = unitRegistry.getUnitById('project_long');    
            if (projectLong) {
              var settingsToExtend = _.find(projectLong.settings, function(setting){
                return _.contains(setting.types, types.STORY) &&
                 _.contains(setting.sizes, sizes.LIST) 
              });     
              if (settingsToExtend) {
                settingsToExtend.types.push(types.INBOUND_RELATION_CARD);
                settingsToExtend.types.push(types.OUTBOUND_RELATION_CARD);
              }                                                               
            }
        }


        var appConfigurator;
        globalConfigurator.getGlobalBus().on('configurator.ready', function(e, configurator) {

            if (!appConfigurator && configurator._id && configurator._id.match(/board/)) {

                appConfigurator = configurator;
                addUnits(appConfigurator);

            }

        });


 });
