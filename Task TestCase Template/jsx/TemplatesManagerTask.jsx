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

        var TemplatesManagerTask = React.createClass({


            handleStartEdit: function() {
                this.props.store.editTask(this.props.item);
            },

            render: function() {

                var item = this.props.item;
                var inner;

                if (item.status === 'edit') {
                    inner = (
                        <Form item={item} store={this.props.store} />
                    );
                } else {
                    inner = (
                        <div className="view-mode">
                            <div className="entity-name" onClick={this.handleStartEdit}>
                                <span>{item.Name}</span>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="tm-item">
                        {inner}
                    </div>
                );
            }
        });

        return TemplatesManagerTask;
    });
