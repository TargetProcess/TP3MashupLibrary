tau
    .mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/core/event')
    .addModule('TaskTestCaseTemplate/store', function($, _, Event) {

        'use strict';

        var store = {

            items: [],

            read: function() {

                if (this.items) {
                    this.fire('update');
                }

                $
                    .ajax({
                        type: 'GET',
                        url: this.configurator.getApplicationPath() + '/storage/v1/ApplyTemplateMashup/' +
                            '?where=(scope == "Public")&select={publicData,key}',
                        contentType: 'application/json; charset=utf8'
                    })
                    .then(function(data) {

                        var items = data.items;

                        this.items = items.map(function(v) {

                            var testCases = _.compact(JSON.parse(v.publicData.testCases) || []);
                            testCases = testCases.map(function(v) {
                                v.steps = v.steps || [];
                                return v;
                            });

                            return {
                                key: v.key,
                                isExpanded: v.isExpanded,
                                name: v.publicData.name,
                                tasks: _.compact(JSON.parse(v.publicData.tasks) || []),
                                testCases: testCases
                            };
                        });

                        this.fire('update');

                    }.bind(this));
            },

            createTemplate: function() {

                var template = {
                    key: 0,
                    name: 'New Template',
                    tasks: [],
                    testCases: []
                };

                this.write(template).then(function(res) {
                    template.key = res.key;
                    this.items.push(template);
                    this.fire('update');
                }.bind(this));

            },

            expandTemplate: function(template) {

                this.items.forEach(function(v) {
                    if (v !== template) {
                        v.isExpanded = false;
                        v.status = '';

                        v.tasks.forEach(function(v) {
                            v.status = '';
                        });

                        v.testCases.forEach(function(v) {
                            if (v.status === 'edit') {
                                v.status = '';
                            }
                        });

                    }
                });

                template.isExpanded = true;
                this.fire('update');
            },

            editTemplate: function(template) {
                template.status = 'edit';
                this.fire('update');
            },

            saveTemplate: function(item) {

                item.status = '';

                this.write(item);
                this.fire('update');
            },

            removeTemplate: function(item) {

                this.items = _.without(this.items, item);

                $.ajax({
                    type: 'POST',
                    url: this.configurator.getApplicationPath() + '/storage/v1/ApplyTemplateMashup/' + item.key,
                    contentType: 'application/json; charset=utf8',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
                    }
                });

                this.fire('update');
            },

            applyTemplate: function(template) {

                return this
                    .getCurrentEntity()
                    .then(function(userStory) {

                        var tasksToSave = _.filter(template.tasks, function(v) {
                            return v.Name;
                        });

                        var testCasesToSave = _.filter(template.testCases, function(v) {
                            return v.Name;
                        });

                        var tasks = tasksToSave.reduce(function(res, item) {
                            return res.then(this.createTaskByTemplate(item, userStory));
                        }.bind(this), $.when(true));

                        var testCases = testCasesToSave.reduce(function(res, item) {
                            return res.then(this.createTestCaseByTemplate(item, userStory));
                        }.bind(this), $.when(true));

                        return $.when(tasks, testCases);
                    }.bind(this));
            },

            createTaskByTemplate: function(task, userStory) {

                return this.configurator.getStore().saveDef('tasks', {
                    $set: {
                        Name: task.Name,
                        Description: task.Description,
                        UserStory: {
                            Id: userStory.id
                        },
                        Project: {
                            Id: userStory.project.id
                        }
                    },
                    fields: [
                        'id',
                        'name',
                        {
                            'userStory': [
                                'id'
                            ]
                        }
                    ]
                });
            },

            createTestCaseByTemplate: function(testCase, userStory) {

                var store = this.configurator.getStore();
                return store.saveDef('testCases', {
                    $set: {
                        Name: testCase.Name,
                        Description: this.getTestCaseDescription(testCase),
                        UserStory: {
                            Id: userStory.id
                        },
                        Project: {
                            Id: userStory.project.id
                        }
                    },
                    fields: [
                        'id',
                        'name',
                        {
                            'userStory': [
                                'id'
                            ]
                        }
                    ]
                })
                .then(function(res) {

                    var id = res.data.id;
                    var stepsToSave = testCase.steps;

                    var steps = stepsToSave.reduce(function(res, item, k) {
                        return res.then(function() {
                            return store.saveDef('testSteps', {
                                $set: {
                                    TestCase: {
                                        Id: id
                                    },
                                    Description: item.Description,
                                    Result: item.Result,
                                    RunOrder: k + 1
                                }
                            });
                        });
                    }.bind(this), $.when(true));

                    return steps;
                });
            },

            getTestCaseDescription: function(item) {

                var description = item.Description;
                if (!item.Description && (item.Steps || item.Success)) {
                    description = '<h4>Steps</h4>' + (item.Steps || '') +
                        '<br /><br /><h4>Success</h4>' + (item.Success || '');
                }

                return description;
            },

            getCurrentEntity: function() {

                var id = this.entity.id;

                return this.configurator.getStore().getDef('UserStory', {
                    id: id,
                    fields: [{
                        'project': ['id']
                    }]
                });
            },

            editTask: function(task) {

                var template = _.find(this.items, function(item) {
                    return _.indexOf(item.tasks, task) >= 0;
                });

                template.tasks.forEach(function(v) {
                    v.status = '';
                });

                task.status = 'edit';
                this.fire('update');
            },

            removeTask: function(task) {

                var template = _.find(this.items, function(item) {
                    return _.indexOf(item.tasks, task) >= 0;
                });

                template.tasks = _.without(template.tasks, task);

                this.write(template);
                this.fire('update');
                // this.write();
            },

            saveTask: function(task) {

                var template = _.find(this.items, function(item) {
                    return _.indexOf(item.tasks, task) >= 0;
                });
                task.Id = task.Id || Number(new Date());
                task.status = '';

                this.write(template);
                this.fire('update');
                // this.write();
            },

            createTask: function(template) {

                var hasEdit = _.findWhere(template.tasks, {
                    Id: 0
                });
                if (!hasEdit) {
                    template.tasks.unshift({
                        Id: 0,
                        Name: '',
                        Description: '',
                        status: 'edit'
                    });
                    this.fire('update');
                }
            },

            editTestCase: function(testCase) {

                var template = _.find(this.items, function(item) {
                    return _.indexOf(item.testCases, testCase) >= 0;
                });

                template.testCases.forEach(function(v) {

                    if (v.status === 'edit') {
                        v.status = '';
                    }
                });

                testCase.status = 'edit';
                this.fire('update');
            },

            removeTestCase: function(task) {

                var template = _.find(this.items, function(item) {
                    return _.indexOf(item.testCases, task) >= 0;
                });

                template.testCases = _.without(template.testCases, task);

                this.fire('update');
                this.write(template);
            },

            saveTestCase: function(testcase) {

                var template = _.find(this.items, function(item) {
                    return _.indexOf(item.testCases, testcase) >= 0;
                });
                testcase.Id = testcase.Id || Number(new Date());
                testcase.status = '';

                this.fire('update');
                this.write(template);
            },

            createTestCase: function(template) {

                var hasEdit = _.findWhere(template.testCases, {
                    Id: 0
                });
                if (!hasEdit) {

                    template.testCases.unshift({
                        Id: 0,
                        Name: '',
                        Description: '',
                        status: 'edit',
                        steps: []
                    });
                    this.fire('update');
                }
            },

            write: function(template) {

                var templateData = _.pick(template, 'name');

                ['tasks', 'testCases'].forEach(function(key) {
                    templateData[key] = JSON.stringify(_.compact(template[key].map(function(v) {

                        if (!v.Id || v.status === 'edit') {
                            return null;
                        }

                        var item = _.clone(v);
                        delete item.status;

                        return item;
                    })));
                });

                return $.ajax({
                    type: 'POST',
                    url: this.configurator.getApplicationPath() + '/storage/v1/ApplyTemplateMashup/',
                    contentType: 'application/json; charset=utf8',
                    data: JSON.stringify({
                        'key': template.key || '',
                        'scope': 'Public',
                        'publicData': templateData,
                        'userData': null
                    })
                });
            }
        };

        Event.implementOn(store);

        return store;
    });
