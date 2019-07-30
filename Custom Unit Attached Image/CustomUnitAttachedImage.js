tau.mashups
    .addDependency('jQuery')
    .addDependency('Underscore')
    .addDependency('tau/configurator')
    .addDependency('tau/models/board.customize.units/const.entity.types.names')
    .addDependency('tau/models/board.customize.units/const.card.sizes')
    .addDependency('tau/models/board.customize.units/board.customize.units.base')
    .addMashup(function($, _, globalConfigurator, types, sizes, helper) {
        var getLast = true;

        function getImageProperty(originAttachments, property, defaultValue) {
            var attachments = [].concat(originAttachments);
            if (getLast) {
                attachments.reverse();
            }
            for (var i = 0; i < attachments.length; i++) {
                if((attachments[i].mimeType !== null) && (attachments[i].mimeType.indexOf('image') >= 0)) {
                    return property(attachments[i]);
                }
            }
            return defaultValue;
        }

        var units = [
            {
                id: 'attachment_image_thumbnail_large',
                sizeInPx: 100,
                sizes: [sizes.M, sizes.L],
            },
            {
                id: 'attachment_image_thumbnail_small',
                sizeInPx: 50,
                sizes: [sizes.S],
            },
            {
                id: 'attachment_image_thumbnail_xs',
                sizeInPx: 20,
                sizes: [sizes.XS],
            },
            {
                id: 'attachment_image_thumbnail_list',
                sizeInPx: 20,
                sizes: [sizes.LIST],
                name: 'Image'
            }
        ].map(function(unitSettings) {
            var sizeInPx = unitSettings.sizeInPx;
            return {
                id: unitSettings.id,
                classId: 'tau-board-unit_type_attachment-image-thumbnail',
                hideIf: function(data) {
                    return !data.attachments.length || data.attachments.length === 0;
                },
                name: unitSettings.name || 'Attached Image Thumbnail',
                types: [
                    types.FEATURE, types.STORY, types.TASK, types.BUG, types.REQUEST, types.TEST_CASE, types.IMPEDIMENT, types.ITERATION,
                    types.TEAM_ITERATION, types.RELEASE, types.TEST_PLAN, types.TEST_PLAN_RUN, types.BUILD, types.EPIC, types.PORTFOLIO_EPIC
                ],
                sizes: unitSettings.sizes,
                template: {
                    markup: [
                        '<div class="tau-board-unit__value tau-board-unit_type_list__item" style=" max-width: 100%; max-height: 100%; width: 100%;">',
                        '<img style="width: ' + sizeInPx + 'px;" src="<%! fn.getImage(this.data.attachments).replace("width=100", "width=' + sizeInPx + '").replace("height=100", "height=' + sizeInPx + '") %>">',
                        '</div>'
                    ],
                    customFunctions: {
                        getImage: function(originAttachments) {
                            return getImageProperty(originAttachments, (img) => img.thumbnailUri, "");
                        },
                        getTitle: function(originAttachments) {
                            return getImageProperty(originAttachments, (img) => img.name, "");
                        }
                    }
                },
                listSettings : {
                    title: '<%= fn.getTitle(this.data.attachments) %>'
                },
                sampleData: {
                    attachments: [
                        {
                            thumbnailUri: helper.url('/Javascript/tau/css.board/favicons/png/144x144.png'),
                            mimeType: 'image/png'
                        }
                    ]

                },
                model: 'attachments:attachments.Select({thumbnailUri,mimeType,name})',
                priority: 2
            };
        });

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
