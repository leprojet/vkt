(function() {


    angular

        .module('vktApp')
        .service('APIService', APIService);

    function APIService($rootScope, $q, $http) {

        $rootScope.apiProcessList = [];

        var apiToken = '58d904a497c67e00015b45fcca7c5482f5164beb94d3cd4e53f15b1d';

        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        //::                                                                                           E N D P O I N T S :::
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        this.getRoute = function(start, end) {

            var _coordinates = start.lng + ',' + start.lat + '|' + end.lng + ',' + end.lat;
            var routeUrl = "https://api.openrouteservice.org/directions?api_key=" + apiToken + "&coordinates=" + _coordinates + "&profile=driving-car&units=km&language=de";
            return get(routeUrl, null);
        }

        this.getPoint = function(strasse, nr, plz, ort) {
            var searchURL = "https://nominatim.openstreetmap.org/search?q=" + nr + '+' + strasse + '+' + ort + '+' + plz + "&format=json&polygon=1&addressdetails=1";
            return get(searchURL, null);
        }

        this.getAddressFromPoint = function(_point){
            var requestPath = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + point.lat + "&lon=" + point.lng;
            return get(requestPath, null);
        };

        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        //::                                                                                                       G E T :::
        //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        var get = function(requestPath, data) {

            var request = {
                id: $rootScope.apiProcessList.length + 1,
                path: requestPath,
                abort: $q.defer()
            };
            $rootScope.apiProcessList.push(request);
            showLoadingArea();

            return $http({
                url: requestPath,
                method: 'GET',
                cash: true,
                data: data,
                timeout: $rootScope.apiProcessList[request.id - 1].abort.promise,
                cancel: $rootScope.apiProcessList[request.id - 1].abort
            }).then(function successCallback(response) {
                $rootScope.apiProcessList.splice($rootScope.apiProcessList.indexOf(request), 1);
                showLoadingArea();
                return response.data;
            }, function errorCallback(response) {
                $rootScope.apiProcessList.splice($rootScope.apiProcessList.indexOf(request), 1);
                showLoadingArea();
                console.error('API-REQUEST ERROR', response.config.url);
                throw response;
            });

        };

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // :::                                                                                                   P O S T :::
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


        var post = function(requestPath, data) {

            var request = {
                id: $rootScope.apiProcessList.length + 1,
                path: requestPath,
                abort: $q.defer()
            };
            $rootScope.apiProcessList.push(request);
            showLoadingArea();

            return $http({
                url: apiURL + requestPath,
                method: 'POST',
                data: data,
                timeout: $rootScope.apiProcessList[request.id - 1].abort.promise,
                cancel: $rootScope.apiProcessList[request.id - 1].abort
            }).then(function successCallback(response) {
                $rootScope.apiProcessList.splice($rootScope.apiProcessList.indexOf(request), 1);
                showLoadingArea();
                return response.data;
            }, function errorCallback(response) {
                $rootScope.apiProcessList.splice($rootScope.apiProcessList.indexOf(request), 1);
                showLoadingArea();
                console.error('API-REQUEST ERROR', response.config.url);
                throw response;
            });
        };

        function showLoadingArea() {
            if ($rootScope.apiProcessList.length !== 0) {
                document.getElementById('loading-dimmer').style.display = 'unset';
                console.log('Loading...');
            } else {
                document.getElementById('loading-dimmer').style.display = 'none';
                console.log('Loading done.');
            }
        }
    }
})();

// Address from Point
// var searchURL = "http://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + point.lat + "&lon=" + point.lng

