tau.mashups
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('WorkflowImageStreamlinerModel')
    .addDependency('WorkflowImageStreamlinerView')
    .addMashup(function(_, $, Model, View) {
        if (!window.Sys) {
            return;
        }
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm.add_pageLoaded(function() {
            var workflow = $(".subAddContent");
            if (!workflow.length) {
                return;
            }

            workflow.find("#ctl00_ctl00_mainArea_controlArea_imgDiagram").remove();
            var $canvas = $("<canvas width='500' height='500'></canvas>");
            workflow.append($canvas);

            var view = new View($canvas[0]);
            var processId = new Tp.URL(window.location.href).getArgumentValue('ProcessID');
            var typeName = $('#ctl00_ctl00_mainArea_controlArea_lstEntities').val().replace('Tp.BusinessObjects.', '');

            var model = new Model(processId, typeName);
            model.fetch().done(view.SetStates.bind(view));
        });
    });