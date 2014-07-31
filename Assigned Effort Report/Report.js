/**
 * @jsx React.DOM
 */

 tau.mashups
    .addDependency('Underscore')
    .addDependency('react')
    .addDependency('AssignedEffortReport/ReportUserRow')
    .addModule('AssignedEffortReport/Report', function(_, React, ReportUserRow) {

        'use strict';

        var Report = React.createClass({displayName: 'Report',

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
                        React.DOM.div({className: "ui-wait-icon", style: {display: 'block !important'}})
                    );
                } else {

                    var users = this.props.store.data.users;

                    users = _.map(users, function(v, k) {
                        return (
                            ReportUserRow({key: 'u' + k, item: v, store: this.props.store})
                        );
                    }.bind(this));

                    inner = (
                        React.DOM.table({className: "board-efforts", style: {width: '100%'}}, 
                            React.DOM.tr(null, 
                                React.DOM.th({colSpan: "2", style: {width: '25%'}}, "User"), 
                                React.DOM.th({style: {width: '75%'}}, "Total Effort")
                            ), 
                            users
                        )
                    );
                }

                return (
                    React.DOM.div(null, 
                        React.DOM.span({className: "tableTitle"}, "Total effort assigned to users"), 
                        React.DOM.br(null), React.DOM.br(null), 
                        React.DOM.div(null, 
                            inner
                        )
                    )
                );
            }

        });

        return Report;
    });

