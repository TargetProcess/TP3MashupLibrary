tau.mashups
    .addDependency('jQuery')
    .addDependency('react')
    .addDependency('AssignedEffortReport.config')
    .addDependency('AssignedEffortReport/Report')
    .addDependency('AssignedEffortReport/store')
    .addCSS('style.css')
    .addMashup(function($, React, config, Report, store) {

        store.options.showOnlyCurrentIteration = config.SHOW_ONLY_CURRENT_ITERATION;

        $(document).ready(function() {
            $('a:contains("Time By Person")').after($('<a id="allocation-link" href="#">Assigned Effort</a>').click(function() {
                React.renderComponent(Report({
                    store: store
                }), $('td.col-two > div:first')[0]);
            }));
        });
    }
);
