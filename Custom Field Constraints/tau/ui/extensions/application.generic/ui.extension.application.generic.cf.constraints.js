tau.mashups
    .addDependency('Underscore')
    .addDependency('tau/core/extension.base')
    .addDependency('tp3/mashups/storage')
    .addModule('tau/cf.constraints/ui/extensions/application.generic/ui.extension.application.generic.cf.constraints', function(_, ExtensionBase, Storage) {

        return ExtensionBase.extend({
            'bus afterInit + $popup.ready': function(evtArgs, afterInitEvtArg, popupReadyEvtArg) {
                popupReadyEvtArg.tauPopup('option', { enableClose: false });
                var configService = afterInitEvtArg.config.context.configurator.service('cf.constraints.config'),
                    resetAction = _.bind(this._reset, this, configService),
                    $closeElement = popupReadyEvtArg.tauPopup('widget').find('.close');

                configService.entityDeferred.done(_.bind(this._exit, this));

                popupReadyEvtArg.tauPopup({
                    show: _.bind(function($close, reset) {
                        $close.off('click');
                        $close.on('click', _.bind(function(event) {
                            event.preventDefault();
                            reset();
                        }, this));
                    }, this, $closeElement, resetAction)
                });
            },
            'bus afterInit > destroy': function(evtArgs, afterInitEvtArg, destroyEvtArg) {
                if (destroyEvtArg && destroyEvtArg.doNotReset) {
                    return;
                }
                this._reset(afterInitEvtArg.config.context.configurator.service('cf.constraints.config'));
            },
            _exit: function() {
                this.fire('destroy', {doNotReset: true});
            },
            _reset: function(configService) {
                var customFieldSet = {
                    customFields: _.map(configService.customFields, function(requiredCustomField) {
                        return {
                            name: requiredCustomField.name,
                            type: requiredCustomField.type,
                            value: null
                        }
                    }, this)
                };

                new Storage()
                    .updateEntity()
                    .ofType(configService.entity.entityType.name)
                    .withId(configService.entity.id)
                    .usingFieldValues(customFieldSet)
                    .withCallOnDone(_.bind(function() {
                        configService.entityDeferred.reject({
                            response: {
                                Message: "The changes were not saved as you didn't fill out the required custom fields"
                            },
                            status: 400
                        });
                        this._exit();
                    }, this))
                    .execute();
            }
        });
    });