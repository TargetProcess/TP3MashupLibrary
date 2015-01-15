/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('libs/react/react-ex')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerTestCaseForm')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTestCase', function(React, Form) {

        'use strict';

        var TemplatesManagerTestCase = React.createClass({displayName: "TemplatesManagerTestCase",

            handleStartEdit: function() {
                this.props.store.editTestCase(this.props.item);
            },

            render: function() {

                var item = this.props.item;
                var inner;

                if (item.status === 'edit') {
                    inner = (
                        React.createElement(Form, {item: item, store: this.props.store})
                    );
                } else {
                    inner = (
                        React.createElement("div", {className: "view-mode"}, 
                            React.createElement("div", {className: "entity-name", onClick: this.handleStartEdit}, 
                                React.createElement("span", null, item.Name)
                            )
                        )
                    );
                }

                return (
                    React.createElement("div", {className: "tm-item"}, 
                        inner
                    )
                );
            }
        });

        return TemplatesManagerTestCase;
    });
