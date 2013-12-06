define([
    'Underscore'
    , 'tau/core/extension.base'
    , 'tp3/mashups/storage'
], function(_, ExtensionBase, Storage) {
    return ExtensionBase.extend({
        'bus afterInit + afterRender': function(evtArgs, afterInitEvtArg, afterRenderEvtArg) {
            var configService = afterInitEvtArg.config.context.configurator.service('cf.constraints.config');
            var requiredCustomFields = configService.customFields;
            var entity = configService.entity;
            var entityDeferred = configService.entityDeferred;
            var storage = new Storage();

            var $saveBtn = afterRenderEvtArg.element.find('.i-role-save');

            $saveBtn.click(function(target) {
                target.preventDefault();
                storage
                    .getEntity()
                    .ofType(entity.entityType.name)
                    .withId(entity.id)
                    .withFieldSetRestrictedTo(['customFields'])
                    .withCallOnDone(function(entity) {
                        var filledCfs = _.filter(requiredCustomFields, function(customField) {
                            var entityCustomField = _.find(entity.customFields, function(cf) {
                                return cf.name == customField.name;
                            });

                            return typeof entityCustomField != 'undefined' && entityCustomField.value != null && entityCustomField.value != '';
                        });

                        if (filledCfs.length == requiredCustomFields.length) {
                            entityDeferred.resolve();
                            $($saveBtn).parents('.ui-popup').find('.close').click();
                        }
                        else {
                            //add required styles to not set custom fields
                            afterRenderEvtArg.element.parent().parent().find('.ui-customfield__value:empty').addClass('ui-validationerror');
                        }
                    })
                    .execute();
            });
        }
    });
});