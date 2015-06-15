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

        var TemplatesManagerRow = React.createClass({

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
                            <TemplatesManagerTestCase key={"testcase" + v.Id} item={v} store={this.props.store} />
                        );
                    }.bind(this));

                    var tasks = item.tasks.map(function(v) {

                        return (
                            <TemplatesManagerTask key={"task" + v.Id} item={v} store={this.props.store} />
                        );
                    }.bind(this));

                    expanded = (
                        <tr className="edit-line">
                            <td className="td-task" colSpan="3">
                                <div className="tm-caption">
                                    <b className="task">Tasks</b>
                                    <span className="counter">{tasksCount}</span>
                                    <button className="tau-btn tau-btn-small tau-success"
                                        disabled={hasNewTask}
                                        onClick={this.handleCreateTask}></button>
                                </div>
                                <div className="tm-body">
                                    {tasks}
                                </div>
                            </td>
                            <td className="td-test-case">
                                <div className="tm-caption">
                                    <b className="test-case">Test Cases</b>
                                    <span className="counter">{testCasesCount}</span>
                                    <button className="tau-btn tau-btn-small tau-success"
                                        disabled={hasNewTestCase}
                                        onClick={this.handleCreateTestCase}></button>
                                </div>
                                <div className="tm-body">
                                    {testCases}
                                </div>
                            </td>
                        </tr>
                    );
                }

                var inner;

                if (item.status === 'edit') {
                    inner = (
                        <div className="tm-name tm-name-edit">
                            <input type="text" ref="name" defaultValue={item.name}
                                autoFocus={true}
                                onBlur={this.handleSave} />
                        </div>
                    );
                } else {
                    inner = (
                        <div className="tm-name" onClick={this.handleStartEdit}>
                            <span>{item.name}</span>
                        </div>
                    );
                }

                var className = cx({
                    'info-line': true,
                    'active': item.isExpanded
                });

                return (
                    <tbody>
                        <tr className={className}>
                            <td className="td-name" onClick={this.handleToggleRow}>
                                {inner}
                            </td>
                            <td className="td-entities">
                                <span className="entity-icon entity-task">T</span>
                                <span className="counter">{tasksCount}</span>
                            </td>
                            <td className="td-entities">
                                <span className="entity-icon entity-test-case">TC</span>
                                <span className="counter">{testCasesCount}</span>
                            </td>
                            <td className="td-actions">
                                <button type="button" className="tau-btn tau-attention"
                                    onClick={this.handleRemove}>Delete</button>
                                <button type="button" className="tau-btn tau-primary"
                                    onClick={this.handleApply}>Apply template</button>
                            </td>
                        </tr>
                        {expanded}
                    </tbody>
                );

            }
        });

        return TemplatesManagerRow;
    });
