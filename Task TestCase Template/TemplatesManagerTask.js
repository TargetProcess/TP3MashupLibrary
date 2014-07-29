/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('libs/react/react-ex')
    .addDependency('tau/configurator')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerTaskForm')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTask', function(React, configurator, Form) {

        'use strict';

        var TemplatesManagerTask = React.createClass({displayName: 'TemplatesManagerTask',


            handleStartEdit: function() {
                this.props.store.editTask(this.props.item);
            },

            render: function() {

                var item = this.props.item;
                var inner;

                if (item.status === 'edit') {
                    inner = (
                        Form({item: item, store: this.props.store})
                    );
                } else {
                    inner = (
                        React.DOM.div({className: "view-mode"}, 
                            React.DOM.div({className: "entity-name", onClick: this.handleStartEdit}, 
                                React.DOM.span(null, item.Name)
                            )
                        )
                    );
                }

                return (
                    React.DOM.div({className: "tm-item"}, 
                        inner
                    )
                );
            }
        });

        return TemplatesManagerTask;
    });
