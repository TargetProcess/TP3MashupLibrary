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

        var TemplatesManagerRow = React.createClass({displayName: "TemplatesManagerRow",

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
                            React.createElement(TemplatesManagerTestCase, {key: "testcase" + v.Id, item: v, store: this.props.store})
                        );
                    }.bind(this));

                    var tasks = item.tasks.map(function(v) {

                        return (
                            React.createElement(TemplatesManagerTask, {key: "task" + v.Id, item: v, store: this.props.store})
                        );
                    }.bind(this));

                    expanded = (
                        React.createElement("tr", {className: "edit-line"}, 
                            React.createElement("td", {className: "td-task", colSpan: "3"}, 
                                React.createElement("div", {className: "tm-caption"}, 
                                    React.createElement("b", {className: "task"}, "Tasks"), 
                                    React.createElement("span", {className: "counter"}, tasksCount), 
                                    React.createElement("button", {className: "tau-btn tau-btn-small tau-success", 
                                        disabled: hasNewTask, 
                                        onClick: this.handleCreateTask})
                                ), 
                                React.createElement("div", {className: "tm-body"}, 
                                    tasks
                                )
                            ), 
                            React.createElement("td", {className: "td-test-case"}, 
                                React.createElement("div", {className: "tm-caption"}, 
                                    React.createElement("b", {className: "test-case"}, "Test Cases"), 
                                    React.createElement("span", {className: "counter"}, testCasesCount), 
                                    React.createElement("button", {className: "tau-btn tau-btn-small tau-success", 
                                        disabled: hasNewTestCase, 
                                        onClick: this.handleCreateTestCase})
                                ), 
                                React.createElement("div", {className: "tm-body"}, 
                                    testCases
                                )
                            )
                        )
                    );
                }

                var inner;

                if (item.status === 'edit') {
                    inner = (
                        React.createElement("div", {className: "tm-name tm-name-edit"}, 
                            React.createElement("input", {type: "text", ref: "name", defaultValue: item.name, 
                                autoFocus: true, 
                                onBlur: this.handleSave})
                        )
                    );
                } else {
                    inner = (
                        React.createElement("div", {className: "tm-name", onClick: this.handleStartEdit}, 
                            React.createElement("span", null, item.name)
                        )
                    );
                }

                var className = cx({
                    'info-line': true,
                    'active': item.isExpanded
                });

                return (
                    React.createElement("tbody", null, 
                        React.createElement("tr", {className: className}, 
                            React.createElement("td", {className: "td-name", onClick: this.handleToggleRow}, 
                                inner
                            ), 
                            React.createElement("td", {className: "td-entities"}, 
                                React.createElement("span", {className: "entity-icon entity-task"}, "T"), 
                                React.createElement("span", {className: "counter"}, tasksCount)
                            ), 
                            React.createElement("td", {className: "td-entities"}, 
                                React.createElement("span", {className: "entity-icon entity-test-case"}, "TC"), 
                                React.createElement("span", {className: "counter"}, testCasesCount)
                            ), 
                            React.createElement("td", {className: "td-actions"}, 
                                React.createElement("button", {type: "button", className: "tau-btn tau-attention", 
                                    onClick: this.handleRemove}, "Delete"), 
                                React.createElement("button", {type: "button", className: "tau-btn tau-primary", 
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
