/**
 * @jsx React.DOM
 */

tau
    .mashups
    .addDependency('libs/react/react-ex')
    .addDependency('TaskTestCaseTemplate/TemplatesManagerTestCaseForm')
    .addModule('TaskTestCaseTemplate/TemplatesManagerTestCase', function(React, Form) {

        'use strict';

        var TemplatesManagerTestCase = React.createClass({

            handleStartEdit: function() {
                this.props.store.editTestCase(this.props.item);
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

        return TemplatesManagerTestCase;
    });
