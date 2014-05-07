tau.mashups
    .addDependency('Underscore')
    .addDependency('tp3/mashups/storage')
    .addDependency('tp3/mashups/sliceinterrupter')
    .addDependency('CFConstraints.cf.interrupter')
    .addDependency('CFConstraints.slice.decoder')
    .addModule('CFConstraints.cf.interrupter.slice', function(_, Storage, SliceInterrupter, CFConstraintsCFInterrupter, SliceDecoder) {
        var CFConstraintsCFInterrupterSlice = CFConstraintsCFInterrupter.extend({
            CUSTOM_FIELD_NO_VALUE_STRING: 'na',
            CUSTOM_FIELD_CHANGE_ID_PREFIX_REGEX: /^ddl/,

            init: function(dataProvider, requirements, requireEntityCFsCallback) {
                this._super(dataProvider, requirements, requireEntityCFsCallback);
                this.sliceDecoder = new SliceDecoder();
            },

            _getInterrupter: function() {
                return new SliceInterrupter();
            },

            _shouldChangeBeHandled: function(change) {
                return change.name && this.CUSTOM_FIELD_CHANGE_ID_PREFIX_REGEX.test(change.name.toLowerCase());
            },

            _getChangedEntityId: function(change) {
                return this.sliceDecoder.decode(change.id);
            },

            _getCFsChanges: function(entity, changesToHandle) {
                var entityChanges = _.find(changesToHandle, function(change) {
                    return parseInt(this.sliceDecoder.decode(change.id)) === entity.id;
                }, this);

                var cfsChangesToHandle = _.reduce(entityChanges.changes, function(cfsChangesToHandleMemo, change) {
                    return this._shouldChangeBeHandled(change)
                        ? cfsChangesToHandleMemo.concat({
                        name: this._getCFNameFromChange(change),
                        value: this._getCFValueFromChange(change)
                    })
                        : cfsChangesToHandleMemo;
                }, [], this);

                return _.filter(cfsChangesToHandle, function(changedCf) {
                    return _.find(entity.customFields, function(cf) {
                        return changedCf.name.toLowerCase() == cf.name.toLowerCase() && changedCf.value != cf.value;
                    });
                });
            },

            _getCFNameFromChange: function(change) {
                return change.name.replace(this.CUSTOM_FIELD_CHANGE_ID_PREFIX_REGEX, '');
            },

            _getCFValueFromChange: function(change) {
                var value = this.sliceDecoder.decode(change.value);
                return value !== this.CUSTOM_FIELD_NO_VALUE_STRING ? value : null;

            }
        });

        return CFConstraintsCFInterrupterSlice;
    });