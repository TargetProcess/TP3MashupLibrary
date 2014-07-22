/**
 * @jsx React.DOM
 */

 tau.mashups
    .addDependency('Underscore')
    .addDependency('react')
    .addDependency('AssignedEffortReport/ReportUserRow')
    .addModule('AssignedEffortReport/Report', function(_, React, ReportUserRow) {

        'use strict';

        var Report = React.createClass({

            componentDidMount: function() {

                this.props.store.addEventListener('update', function() {
                    this.forceUpdate();
                }.bind(this));
                this.props.store.read();
            },

            render: function() {

                var inner;

                if (this.props.store.data.isLoading) {
                    inner = (
                        <div className="ui-wait-icon" style={{display: 'block !important'}}></div>
                    );
                } else {

                    var users = this.props.store.data.users;

                    users = _.map(users, function(v, k) {
                        return (
                            <ReportUserRow key={'u' + k} item={v} store={this.props.store} />
                        );
                    }.bind(this));

                    inner = (
                        <table className="board-efforts" style={{width: '100%'}}>
                            <tr>
                                <th colSpan="2" style={{width: '25%'}}>User</th>
                                <th style={{width: '75%'}}>Total Effort</th>
                            </tr>
                            {users}
                        </table>
                    );
                }

                return (
                    <div>
                        <span className="tableTitle">Total effort assigned to users</span>
                        <br/><br/>
                        <div>
                            {inner}
                        </div>
                    </div>
                );
            }

        });

        return Report;
    });

