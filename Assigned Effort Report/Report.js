/**
 * @jsx React.DOM
 */

 tau.mashups
    .addDependency('Underscore')
    .addDependency('react')
    .addDependency('AssignedEffortReport/ReportUserRow')
    .addModule('AssignedEffortReport/Report', function(_, React, ReportUserRow) {

        'use strict';

        var Report = React.createClass({displayName: "Report",

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
                        React.createElement("div", {className: "ui-wait-icon", style: {display: 'block !important'}})
                    );
                } else {

                    var users = this.props.store.data.users;

                    users = _.map(users, function(v, k) {
                        return (
                            React.createElement(ReportUserRow, {key: 'u' + k, item: v, store: this.props.store})
                        );
                    }.bind(this));

                    inner = (
                        React.createElement("table", {className: "board-efforts", style: {width: '100%'}}, 
                            React.createElement("tr", null, 
                                React.createElement("th", {colSpan: "2", style: {width: '25%'}}, "User"), 
                                React.createElement("th", {style: {width: '75%'}}, "Total Effort")
                            ), 
                            users
                        )
                    );
                }

                return (
                    React.createElement("div", null, 
                        React.createElement("span", {className: "tableTitle"}, "Total effort assigned to users"), 
                        React.createElement("br", null), React.createElement("br", null), 
                        React.createElement("div", null, 
                            inner
                        )
                    )
                );
            }

        });

        return Report;
    });

