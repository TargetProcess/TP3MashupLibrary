tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addDependency('tau/models/board.customize.units/board.customize.units.base')
    .addDependency('tau/models/board.customize.units/board.customize.units.interaction')
    .addDependency('react')
    .addDependency('react-dom')
    .addMashup(function ($, _, globalConfigurator, et, sz, helper, interactionUtils, react, reactDOM) {
        var css = '.avatar__avatar__0-0-6 {border-radius: 50%;background-position: center;background-size: cover;}';
        var style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);

        var styles = {'avatar': 'avatar__avatar__0-0-6'};

        var Avatar = function Avatar(_ref) {
            var url = _ref.url,
                _ref$size = _ref.size,
                size = _ref$size === undefined ? 36 : _ref$size;
            return react.createElement('div', {
                className: styles.avatar,
                style: { width: size, height: size, backgroundImage: 'url("' + url + '")' }
            });
        };

        var openUnitEditor = interactionUtils.openUnitEditor.bind(interactionUtils);

        var size = 22;
        var UnitAvatar = function(url) {
            var tmp = document.createElement('div');
            reactDOM.render(react.createElement(Avatar, {size: size, url: url + size}, null), tmp);
            return tmp.innerHTML;
        };


        var sampleAssignedUsers = {
            users: [
                {
                    id: 1,
                    fullName: 'Uladzimir Karatkievich',
                    email: 'u.karatkievich@writer.com',
                    avatarUri: helper.url('/Javascript/tau/css/images/icons/users/karat.png?size='),
                    isActive: true
                },
                {
                    id: 2,
                    fullName: 'Janka Kupala',
                    email: 'ja.kupala@writer.com',
                    avatarUri: helper.url('/Javascript/tau/css/images/icons/users/kupala.png?size='),
                    isActive: true
                },
                {
                    id: 3,
                    fullName: 'Adam Mickiewicz',
                    email: 'a.mickiewicz@writer.com',
                    avatarUri: helper.url('/Javascript/tau/css/images/icons/users/mick.png?size='),
                    isActive: true
                },
                {
                    id: 4,
                    fullName: 'Uladzimir Karatkievich',
                    email: 'u.karatkievich@writer.com',
                    avatarUri: helper.url('/Javascript/tau/css/images/icons/user.png?size='),
                    isActive: true
                }
            ],
            currentStateResponsiblePersons: [1, 2, 3, 4]
        };
        function collectionWithCount(collection, minCount, elementRender) {
            var result = [];
            var count = Math.min(collection.length, minCount);
            for (var i = 0; i < count; i++) {
                result.push('<div class="tau-board-unit_type_list__item">');
                result.push(elementRender(collection[i]));
                result.push('</div>');
            }
            if (collection.length > minCount) {
                result.push('<div class="tau-board-unit_type_list__others-counter">');
                result.push(collection.length - minCount);
                result.push('</div>');
            }
            return _.flatten(result, true).join('');
        }

        function assignedPeopleTemplate(count) {
            return {
                markup : [
                    '<%= fn.assignedPeople(this.data, ' + count + ', this.settings) %>'
                ],
                customFunctions : {
                    assignedPeople : function (data, minCount, settings) {
                        var isResponsible = this.isResponsible.bind(this, data);
                        var getUserText = this.getUserText.bind(this);
                        var ordered = this.getPeopleOrdered(data);

                        return collectionWithCount(ordered, minCount, function (user) {
                            return [
                                '<div class="tau-avatar',
                                isResponsible(user) ? '' : ' tau-avatar-not-currentResponsible',
                                '">',
                                '<span',
                                settings.isDesignMode ? '' : (' title="' + getUserText(user) + '"'),
                                '>',
                                UnitAvatar(user.avatarUri),
                                '</span>',
                                '</div>'
                            ];
                        });
                    }
                }
            };
        }

        var units = [
            {
                id : 'assigned_users_all',
                classId : 'tau-board-unit_type_avatars-list',
                hideIf : function (data) {
                    return !data.users || !data.users.length;
                },
                name : 'Assigned people',
                header : 'Assignments',
                types : [et.FEATURE, et.EPIC, et.STORY, et.TASK, et.BUG, et.REQUEST, et.TEST_PLAN_RUN],
                sizes : [sz.M, sz.L, sz.XL, sz.LIST],
                sections : 1,
                model : 'users:assignedUser.Select({id,avatarUri,fullName,email}),currentStateResponsiblePersons',
                template : assignedPeopleTemplate(999),
                listSettings : {
                    title : '<%= _.map(fn.getPeopleOrdered(this.data), fn.getUserText).join("&#10;") %>'
                },
                sampleData : sampleAssignedUsers,
                interactionConfig : {
                    isEditable : true,
                    handler : openUnitEditor('assignments')
                }
            }
        ];

        function addUnits(configurator) {
            var registry = configurator.getUnitsRegistry();
            _.extend(registry.units, registry.register(units));
        }

        var appConfigurator;
        globalConfigurator.getGlobalBus().on('configurator.ready', function(e, configurator) {

            if (!appConfigurator && configurator._id && configurator._id.match(/board/)) {

                appConfigurator = configurator;
                addUnits(appConfigurator);

            }

        });

    });
