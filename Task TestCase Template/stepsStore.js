tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/core/event')
    .addModule('TaskTestCaseTemplate/stepsStore', function($, _, Event) {

        'use strict';

        var Store = function(testcase) {

            this.testcase = testcase;
            this.items = [];
        };

        _.extend(Store.prototype, {

            read: function() {

                this.items = _.deepClone(this.testcase.steps);
                this.fire('update');
            },

            reorderSteps: function(items, lastMovedTo) {

                this.items = items;
                this.lastMovedTo = lastMovedTo;
                this.fire('update');
            },

            createStep: function() {

                this.items.push({
                    Description: 'Do something',
                    Result: 'Get something'
                });
                this.fire('update');
            },

            editStep: function(step) {

                if (step.isEditing) {
                    return;
                }

                this.items.forEach(function(v) {
                    v.isEditing = false;
                });

                step.isEditing = true;
                this.fire('update');
            },

            saveStep: function(step) {

                step.isEditing = false;
                this.fire('update');
            },

            removeStep: function(step) {
                this.items = _.without(this.items, step);
                this.fire('update');
            }
        });

        Event.implementOn(Store.prototype);

        return Store;
    });
