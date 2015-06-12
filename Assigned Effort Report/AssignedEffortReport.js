tau.mashups
    .addDependency('jQuery')
    .addDependency('react')
    .addDependency('AssignedEffortReport.config')
    .addDependency('AssignedEffortReport/Report')
    .addDependency('AssignedEffortReport/store')
    .addCSS('style.css')
    .addMashup(function($, React, config, Report, store) {

        store.options.condition = config.CONDITION;

        $(document).ready(function() {
            $('a:contains("Time By Person")').after($('<a id="allocation-link" href="#">Assigned Effort</a>').click(function() {
                React.render(React.createFactory(Report)({
                    store: store
                }), $('td.col-two > div:first')[0]);
            }));
        });
    }
);
