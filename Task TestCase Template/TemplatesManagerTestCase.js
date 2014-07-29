/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('libs/react/react-ex')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerTestCaseForm')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTestCase', function(React, Form) {

        'use strict';

        var TemplatesManagerTestCase = React.createClass({displayName: 'TemplatesManagerTestCase',

            handleStartEdit: function() {
                this.props.store.editTestCase(this.props.item);
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

        return TemplatesManagerTestCase;
    });
