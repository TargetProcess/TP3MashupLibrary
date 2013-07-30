tau.mashups
    .addMashup(function () {
        if (document.referrer.toLowerCase().indexOf('login.aspx') != -1
            && window.location.href.toLowerCase().indexOf('restui/board.aspx') == -1){
            window.location.href = 'http://localhost/targetprocess/restui/board.aspx';
        }
    });