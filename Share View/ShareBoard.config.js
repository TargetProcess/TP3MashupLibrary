/* Build Tue Apr 28 2015 12:06:04 GMT+0300 (MSK) */
/*globals tau */
tau.mashups
    .addModule('ShareBoard/ShareBoard.config', function() {
        'use strict';

        return {
            serviceUrl: 'https://tauboard.com',
            title: 'Share %s'
        };
    });
