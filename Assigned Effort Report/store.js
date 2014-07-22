tau.mashups
    .addDependency('Underscore')
    .addDependency('jQuery')
    .addDependency('tau/core/event')
    .addDependency('tau/configurator')
    .addModule('AssignedEffortReport/store', function(_, $, Event, configurator) {

        var stringify = function(obj) {

            var res = "";

            if (obj) {
                if (Array.isArray(obj)) {

                    res = obj.map(stringify).join(",");
                } else if (typeof obj === "object") {

                    res = Object.keys(obj).map(function(key) {
                        return key + "[" + stringify(obj[key]) + "]";
                    }).join(",");
                } else if (typeof obj !== "function") {

                    res = String(obj);
                }
            }

            return res;
        };

        var TreeFormat = {
            stringify: stringify
        };

        var getRoleEffortItem = function(item, roleId) {
            return _.find(item.RoleEfforts.Items, function(eff) {
                return eff.Role.Id === roleId;
            });
        };

        var load = function(resource, params) {

            var loadSimple = function(url, params) {
                return $.ajax({
                    type: 'get',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: params
                });
            };

            var loadPages = function loadPages(url, params) {

                return loadSimple(url, params)
                    .then(function(res) {
                        var items = res.Items;
                        if (res.Next) {
                            return loadPages(res.Next)
                                .then(function(nextItems) {
                                    return items.concat(nextItems);
                                });
                        } else {
                            return items;
                        }
                    });
            };

            return loadPages(configurator.getApplicationPath() + '/api/v1/' + resource, params);
        };

        var store = {

            options: {
                showOnlyCurrentIteration: false
            },

            data: {
                isLoading: false,
                users: {}
            },

            loadAssignables: function() {

                var query = [

                    'EntityState.isFinal eq "false"',
                    'Effort gt 0'
                ];

                if (this.options.showOnlyCurrentIteration) {
                    query.push('Iteration.IsCurrent eq "true"');
                }

                return load('assignables', {
                    include: '[' + TreeFormat.stringify([
                        'Id',
                        'Name', {
                            'EntityType': [
                                'Id',
                                'Name'
                            ]
                        }, {
                            'EntityState': [
                                'Id',
                                'Name'
                            ]
                        }, {
                            'RoleEfforts': [
                                'Effort',
                                'EffortToDo',
                                'TimeSpent',
                                'TimeRemain', {
                                    'Role': [
                                        'Id',
                                        'Name'
                                    ]
                                }
                            ]
                        }
                    ]) + ']',
                    take: 1000,
                    where: query.join(' and ')
                });
            },

            loadAssignments: function() {

                return load('assignments', {
                    include: '[' + TreeFormat.stringify([{
                        'Assignable': [
                            'Id'
                        ]
                    }, {
                        'Role': [
                            'Id',
                            'Name'
                        ]
                    }, {
                        'GeneralUser': [
                            'Id',
                            'FirstName',
                            'LastName', {
                                'Role': [
                                    'Id',
                                    'Name'
                                ]
                            },
                            'IsActive',
                            'DeleteDate'
                        ]
                    }]) + ']',
                    take: 1000,
                    where: '(Assignable.EntityState.isFinal eq "false")'
                });
            },

            read: function() {

                this.data.isLoading = true;
                this.fire('update');

                return $
                    .when(this.loadAssignables(), this.loadAssignments())
                    .then(this.processData.bind(this))
                    .then(function(data) {

                        this.data.isLoading = false;
                        this.data.users = data.users;
                        this.fire('update');
                        return data;
                    }.bind(this));
            },

            processData: function(assignables, assignments) {

                assignments.forEach(function(v) {
                    var item = _.findWhere(assignables, {
                        Id: v.Assignable.Id
                    });
                    if (item) {
                        item.Assignments = item.Assignments ? item.Assignments.concat(v) : [v];
                    }
                });

                var overallEffort = 0;
                var fmtData = {
                    'users': {}
                };
                _.forEach(assignables, function(item) {
                    _.forEach(item.Assignments || [], function(asmt) {

                        var roleEffortItem = getRoleEffortItem(item, asmt.Role.Id);

                        if (!roleEffortItem) {
                            return;
                        }

                        overallEffort += roleEffortItem.Effort || 0;

                        var user = asmt.GeneralUser;
                        if (!user.IsActive || user.DeleteDate) {
                            return;
                        }

                        var userRecord = fmtData.users[user.Id];
                        if (!userRecord) {
                            userRecord = {
                                'FirstName': user.FirstName,
                                'LastName': user.LastName,
                                'DefaultRole': user.Role.Name,
                                'TotalEffort': 0,
                                'TotalToDo': 0,
                                'TotalTimeSpt': 0,
                                'TotalTimeRem': 0,
                                'Items': []
                            };
                            fmtData.users[user.Id] = userRecord;
                        }

                        userRecord.TotalEffort += roleEffortItem.Effort || 0;
                        userRecord.TotalToDo += roleEffortItem.EffortToDo || 0;
                        userRecord.TotalTimeSpt += roleEffortItem.TimeSpent || 0;
                        userRecord.TotalTimeRem += roleEffortItem.TimeRemain || 0;

                        userRecord.Items.push({
                            'EntityId': item.Id,
                            'Name': item.Name,
                            'EntityType': item.EntityType.Name,
                            'EntityState': item.EntityState.Name,
                            'Role': asmt.Role.Name,
                            'Effort': roleEffortItem.Effort || 0,
                            'TimeSpent': roleEffortItem.TimeSpent || 0,
                            'TimeRemain': roleEffortItem.TimeRemain || 0
                        });
                    });
                });

                _.forEach(fmtData.users, function(v) {
                    v.EffortPercent = v.TotalEffort / overallEffort * 100;
                });

                return fmtData;
            },

            expandUser: function(user) {
                user.isExpanded = !user.isExpanded;
                this.fire('update');
            }
        };

        Event.implementOn(store);

        return store;
    });
