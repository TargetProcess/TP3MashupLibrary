/* Build Fri Jun 19 2015 14:55:07 GMT+0300 (MSK) */
/*globals tau */
tau.mashups
    .addModule('ShareBoard/ShareBoard.config', function() {
        'use strict';

        return {
            serviceUrl: 'https://tauboard.com',
            title: 'Share %s'
        };
    });
