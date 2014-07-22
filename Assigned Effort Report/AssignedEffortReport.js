tau.mashups

    .addDependency('jQuery')
    .addDependency('react')
    .addDependency('AssignedEffortReport/Report')
    .addDependency('AssignedEffortReport/store')
    .addDependency('tau/configurator')
    .addCSS('style.css')
    .addMashup(function($, React, Report, store) {

        var SHOW_ONLY_CURRENT_ITERATION = false;

        store.options.showOnlyCurrentIteration = SHOW_ONLY_CURRENT_ITERATION;

        $(document).ready(function() {
            $('a:contains("Time By Person")').after($('<a id="allocation-link" href="#">Assigned Effort</a>').click(function() {
                React.renderComponent(Report({
                    store: store
                }), $('td.col-two > div:first')[0]);
            }));
        });
    }
);
