/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('Underscore')
    .addDependency('libs/react/react-ex')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerTestCase')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerTask')
    .addModule('TaskTestCaseTemplate/TemplatesManagerRow', function(_, React, TemplatesManagerTestCase,
        TemplatesManagerTask) {

        'use strict';

        var cx = React.addons.classSet;

        var TemplatesManagerRow = React.createClass({displayName: 'TemplatesManagerRow',

            handleToggleRow: function() {

                this.props.store.expandTemplate(this.props.item);
            },

            handleCreateTask: function() {
                this.props.store.createTask(this.props.item);
            },

            handleCreateTestCase: function() {
                this.props.store.createTestCase(this.props.item);
            },

            handleApply: function() {
                this.props.store.applyTemplate(this.props.item);
            },

            handleRemove: function() {
                this.props.store.removeTemplate(this.props.item);
            },

            handleStartEdit: function(e) {

                if (this.props.item.isExpanded) {

                    e.stopPropagation();
                    this.props.store.editTemplate(this.props.item);
                }

            },

            handleSave: function() {
                var val = this.refs.name.getDOMNode().value.trim();
                if (val) {
                    this.props.item.name = val;
                    this.props.store.saveTemplate(this.props.item);
                }
            },

            render: function() {

                var item = this.props.item;
                var tasksCount = _.filter(item.tasks, function(v) {
                    return v.Id;
                }).length;

                var testCasesCount = _.filter(item.testCases, function(v) {
                    return v.Id;
                }).length;

                var hasNewTask = Boolean(item.tasks.length - tasksCount);
                var hasNewTestCase = Boolean(item.testCases.length - testCasesCount);

                var expanded;

                if (item.isExpanded) {

                    var testCases = item.testCases.map(function(v) {

                        return (
                            TemplatesManagerTestCase({key: "testcase" + v.Id, item: v, store: this.props.store})
                        );
                    }.bind(this));

                    var tasks = item.tasks.map(function(v) {

                        return (
                            TemplatesManagerTask({key: "task" + v.Id, item: v, store: this.props.store})
                        );
                    }.bind(this));

                    expanded = (
                        React.DOM.tr({className: "edit-line"}, 
                            React.DOM.td({className: "td-task", colSpan: "3"}, 
                                React.DOM.div({className: "tm-caption"}, 
                                    React.DOM.b({className: "task"}, "Tasks"), 
                                    React.DOM.span({className: "counter"}, tasksCount), 
                                    React.DOM.button({className: "tau-btn tau-btn-small tau-success", 
                                        disabled: hasNewTask, 
                                        onClick: this.handleCreateTask})
                                ), 
                                React.DOM.div({className: "tm-body"}, 
                                    tasks
                                )
                            ), 
                            React.DOM.td({className: "td-test-case"}, 
                                React.DOM.div({className: "tm-caption"}, 
                                    React.DOM.b({className: "test-case"}, "Test Cases"), 
                                    React.DOM.span({className: "counter"}, testCasesCount), 
                                    React.DOM.button({className: "tau-btn tau-btn-small tau-success", 
                                        disabled: hasNewTestCase, 
                                        onClick: this.handleCreateTestCase})
                                ), 
                                React.DOM.div({className: "tm-body"}, 
                                    testCases
                                )
                            )
                        )
                    );
                }

                var inner;

                if (item.status === 'edit') {
                    inner = (
                        React.DOM.div({className: "tm-name tm-name-edit"}, 
                            React.DOM.input({type: "text", ref: "name", defaultValue: item.name, 
                                autoFocus: true, 
                                onBlur: this.handleSave})
                        )
                    );
                } else {
                    inner = (
                        React.DOM.div({className: "tm-name", onClick: this.handleStartEdit}, 
                            React.DOM.span(null, item.name)
                        )
                    );
                }

                var className = cx({
                    'info-line': true,
                    'active': item.isExpanded
                });

                return (
                    React.DOM.tbody(null, 
                        React.DOM.tr({className: className}, 
                            React.DOM.td({className: "td-name", onClick: this.handleToggleRow}, 
                                inner
                            ), 
                            React.DOM.td({className: "td-entities"}, 
                                React.DOM.span({className: "entity-icon entity-task"}, "T"), 
                                React.DOM.span({className: "counter"}, tasksCount)
                            ), 
                            React.DOM.td({className: "td-entities"}, 
                                React.DOM.span({className: "entity-icon entity-test-case"}, "TC"), 
                                React.DOM.span({className: "counter"}, testCasesCount)
                            ), 
                            React.DOM.td({className: "td-actions"}, 
                                React.DOM.button({type: "button", className: "tau-btn tau-attention", 
                                    onClick: this.handleRemove}, "Delete"), 
                                React.DOM.button({type: "button", className: "tau-btn tau-primary", 
                                    onClick: this.handleApply}, "Apply template")
                            )
                        ), 
                        expanded
                    )
                );

            }
        });

        return TemplatesManagerRow;
    });
