(function() {

    "use-strict";

    angular

        .module('vktApp')
        .config(vktRoutes);

    function vktRoutes($stateProvider) {

        $stateProvider
            .state('progress', {
                name: 'progress',
                url: '/progress',
                templateUrl: './src/pages/progress.html'
            })
            .state('dsgvo', {
                name: 'DS-GVO',
                url: '/dsgvo',
                templateUrl: './src/pages/dsgvo.html'
            });
    }
})();