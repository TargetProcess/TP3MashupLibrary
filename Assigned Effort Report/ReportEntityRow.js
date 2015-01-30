
/**
 * @jsx React.DOM
 */

tau.mashups
    .addDependency('react')
    .addDependency('tau/configurator')
    .addModule('AssignedEffortReport/ReportEntityRow', function(React, configurator) {

        'use strict';

        var ReportEntityRow = React.createClass({displayName: "ReportEntityRow",

            render: function() {

                var item = this.props.item;
                var path = configurator.getApplicationPath();
                return (
                    React.createElement("tr", null, 
                        React.createElement("td", null, 
                            React.createElement("img", {src: path + '/img/' + item.EntityType + '.gif'})
                        ), 
                        React.createElement("td", null, item.Name), 
                        React.createElement("td", null, item.EntityState), 
                        React.createElement("td", null, item.Role), 
                        React.createElement("td", null, item.Effort), 
                        React.createElement("td", null, item.TimeSpent), 
                        React.createElement("td", null, item.TimeRemain)
                    )

                );
            }

        });

        return ReportEntityRow;
    });

