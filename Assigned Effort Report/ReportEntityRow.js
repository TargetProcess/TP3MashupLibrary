
/**
 * @jsx React.DOM
 */

 tau.mashups
     .addDependency('react')
     .addDependency('tau/configurator')
     .addModule('AssignedEffortReport/ReportEntityRow', function(React, configurator) {

        'use strict';

        var ReportEntityRow = React.createClass({displayName: 'ReportEntityRow',

            render: function() {

                var item = this.props.item;
                var path = configurator.getApplicationPath();
                return (
                    React.DOM.tr(null, 
                        React.DOM.td(null, 
                            React.DOM.img({src: path + '/img/' + item.EntityType + '.gif'})
                        ), 
                        React.DOM.td(null, item.Name), 
                        React.DOM.td(null, item.EntityState), 
                        React.DOM.td(null, item.Role), 
                        React.DOM.td(null, item.Effort), 
                        React.DOM.td(null, item.TimeSpent), 
                        React.DOM.td(null, item.TimeRemain)
                    )

                );
            }

        });

        return ReportEntityRow;
    });

