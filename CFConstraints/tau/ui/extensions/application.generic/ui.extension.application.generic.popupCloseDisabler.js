define([
    'tau/core/extension.base'
], function(ExtensionBase) {
    return ExtensionBase.extend({
        'bus $popup.ready': function(evtArgs, popupReadyEvtArg) {
            popupReadyEvtArg.tauPopup('option', { enableClose: false });
        }
    });
});