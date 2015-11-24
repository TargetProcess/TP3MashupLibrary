tau.mashups
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('app.bus')
    .addDependency('WorkflowImageStreamlinerModel')
    .addDependency('WorkflowImageStreamlinerView')
    .addDependency('libs/jquery/jquery.ui.tauBubble')
    .addMashup(function(_, $, appBus, Model, View) {
        appBus.done(function(bus) {
            bus.on('setup.workflow.rendered', function(evt) {
                var model = new Model(evt.data.processId, evt.data.entityType);
                var $placeholder = evt.data.element.find('.i-role-workflow-setup-toolbox');
                var $trigger = $('<a class="tau-link">Project State Transition</a>');
                $trigger.appendTo($placeholder);
                $trigger.tauBubble({
                    cleanupOnHide: true,
                    onShow: function() {
                        model.fetch().done(function(states) {
                            var $canvas = $('<canvas width="500" height="400"></canvas>');
                            var editor = new View($canvas[0]);
                            editor.SetStates(states);
                            $trigger.tauBubble('setContent', $canvas);
                        });

                    },
                    content: '<div style="width:500px; height:500px;"><div class="tau-loader"></div></div>'
                });

                $trigger.click(function() {
                    $(this).tauBubble('toggle');
                });

            });
        });
    });