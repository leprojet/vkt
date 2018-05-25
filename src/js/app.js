(function() {

    angular

        .module('vktApp', ['ui.router'])
        .controller("vktCtrl", function($scope, $http, $state, $q, APIService, Mapservice) {

            // TODO: Circle um Zielort ohne Füllung

            console.log("Windows.scope");
            window.scope = $scope;

            // var db = new PouchDB('vkt19');

            $scope.opacity = 0.2;
            $scope.searchable = true;
            $scope.showDetailRoutes = false;

            // Grober Umrechnungsfaktor Luftlinie -> tatsächliche Fahrtstrecke
            var manhattenFactor = 1.3;

            var maxStrecke = 400000; // 400km Radius

            function onEachFeature(feature, layer) {
                if (feature.properties && feature.properties.popup) {
                    layer.bindPopup(feature.properties, popup);
                }
            }

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                         V A R I A B L E S ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            var
                oberhausen = L.latLng({
                    lat: 51.496334,
                    lng: 6.863776
                }),
                hannover = L.latLng({
                    lat: 52.375892,
                    lng: 9.732010
                }),
                celle = L.latLng({
                    lat: 52.617596,
                    lng: 10.062851
                }),
                hamburg = L.latLng({
                    lat: 53.551085,
                    lng: 9.993682
                }),
                muenchen = L.latLng({
                    lat: 48.135125,
                    lng: 11.581980
                }),
                freiburg = L.latLng({
                    lat: 47.999008,
                    lng: 7.842104
                });

            // WICHTIG: Diese Reihenfolge muß überall eingehalten werden
            var startOrte = [
                oberhausen,
                hannover,
                celle,
                hamburg,
                muenchen,
                freiburg
            ];

            var
                ob = {
                    "type": "Feature",
                    "properties": {
                        "name": "Oberhausen",
                        "popup": "Oberhausen"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            10,
                            10
                        ]
                    }
                };

            var test = {};
            test._id = 'Oberhausen';
            test.coordinates = oberhausen;

            $scope.houses = [{
                    name: 'Progress',
                    url: 'progress'
                },
                {
                    name: 'DS-GVO',
                    url: 'dsgvo'
                }
            ];

            $scope.activeRoute = $scope.houses[0];
            $state.go($scope.activeRoute);

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                             C I R C L E S ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            var c_oberhausen = L.circle(oberhausen, {
                radius: maxStrecke,
                fillOpacity: $scope.opacity,
                fillColor: '#66ccff',
                color: '#66ccff',
                weight: 1
            });
            var c_hannover = L.circle(hannover, {
                radius: maxStrecke,
                fillOpacity: $scope.opacity,
                fillColor: '#ffff00',
                color: '#ffff00',
                weight: 1
            });
            var c_celle = L.circle(celle, {
                radius: maxStrecke,
                fillOpacity: $scope.opacity,
                fillColor: '#ff9900',
                color: '#ff9900',
                weight: 1
            });
            var c_hamburg = L.circle(hamburg, {
                radius: maxStrecke,
                fillOpacity: $scope.opacity,
                fillColor: '#ff3300',
                color: '#ff3300',
                weight: 1
            });
            var c_muenchen = L.circle(muenchen, {
                radius: maxStrecke,
                fillOpacity: $scope.opacity,
                fillColor: '#99cc00',
                color: '#99cc00',
                weight: 1
            });
            var c_freiburg = L.circle(freiburg, {
                radius: maxStrecke,
                fillOpacity: $scope.opacity,
                fillColor: '#996633',
                color: '#996633',
                weight: 1
            });


            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                               M A R K E R ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


            var m_oberhausen = L.marker(oberhausen, { title: "Oberhausen" });
            var m_hannover = L.marker(hannover, { title: "Hannover" });
            var m_celle = L.marker(celle, { title: "Celle" });
            var m_hamburg = L.marker(hamburg, { title: "Hamburg" });
            var m_muenchen = L.marker(muenchen, { title: "München" });
            var m_freiburg = L.marker(freiburg, { title: "Freiburg" });

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: P O P U P S ::

            m_oberhausen.bindPopup("Oberhausen");
            m_hannover.bindPopup("Hannover");
            m_celle.bindPopup("Celle");
            m_hamburg.bindPopup("Hamburg");
            m_muenchen.bindPopup("München");
            m_freiburg.bindPopup("Freiburg");


            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                             O V E R L A Y ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            var overlay = {
                "Kreise": {
                    "Ingo & Co.": c_oberhausen,
                    "Hendrik": c_hannover,
                    "Axel": c_celle,
                    "Christoph": c_hamburg,
                    "Don": c_muenchen,
                    "Tom": c_freiburg
                },
                "Pömpel": {
                    "Ingo & Co.": m_oberhausen,
                    "Hendrik": m_hannover,
                    "Axel": m_celle,
                    "Christoph": m_hamburg,
                    "Don": m_muenchen,
                    "Tom": m_freiburg
                }
            };



            // L.geoJSON(geojsonFeature, { onEachFeature: onEachFeature }).addTo(map);

            $scope.strasse = 'Liebknechtstraße';
            $scope.nr = '45';
            $scope.plz = "46047";
            $scope.ort = "Oberhausen";


            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                                     M A P ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            var map = Mapservice.getMap(overlay, oberhausen);

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                               M A R K E R ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            $scope.setMarker = function() {

                if ($scope.m) {
                    $scope.m.remove();
                }

                APIService.getPoint($scope.strasse, $scope.nr, $scope.plz, $scope.ort).then(function(response) {
                    var addresse = response[0];
                    $scope.point = L.latLng({
                        lat: addresse.lat,
                        lon: addresse.lon
                    });

                    $scope.m = L.marker($scope.point).addTo(map);
                    $scope.m.bindPopup($scope.strasse + " " + $scope.nr + " in " + $scope.ort);
                    getDistances($scope.point);
                })
            }

            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            //::                                                               R O U T E S ::
            //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            // TODO: openrouteservice api prüfen, ob mehrere orte abgefragt werden können
            $scope.routesExact = [];

            function getRoutes() {

                var promises = [];

                for (var ort in startOrte) {
                    promises.push(
                        APIService.getRoute(startOrte[ort], $scope.point).then(function(response) {
                            return response.routes[0].summary.distance;
                        })
                    );
                }

                var def_prom = $q.all(promises);

                return def_prom;
            };

            $scope.deleteMarker = function() {
                $scope.strasse = '';
                $scope.nr = '';
                $scope.plz = "";
                $scope.ort = "";
                $scope.d_oberhausen = null;

                if ($scope.m) {
                    $scope.m.remove();
                }

                $scope.showDetailRoutes = false;
            }

            function getDistances(point) {
                $scope.d_oberhausen = point.distanceTo(oberhausen) / 1000;
                $scope.d_hannover = point.distanceTo(hannover) / 1000;
                $scope.d_celle = point.distanceTo(celle) / 1000;
                $scope.d_hamburg = point.distanceTo(hamburg) / 1000;
                $scope.d_muenchen = point.distanceTo(muenchen) / 1000;
                $scope.d_freiburg = point.distanceTo(freiburg) / 1000;

                $scope.d_r_oberhausen = $scope.d_oberhausen * manhattenFactor;
                $scope.d_r_hannover = $scope.d_hannover * manhattenFactor;
                $scope.d_r_celle = $scope.d_celle * manhattenFactor;
                $scope.d_r_hamburg = $scope.d_hamburg * manhattenFactor;
                $scope.d_r_muenchen = $scope.d_muenchen * manhattenFactor;
                $scope.d_r_freiburg = $scope.d_freiburg * manhattenFactor;
            }

            $scope.getExactDistances = function() {
                $scope.showDetailRoutes = true;
                var routes = [];
                var r = getRoutes();
                r.then(function(res) {
                    routes = res;
                    $scope.d_e_oberhausen = routes[0];
                    $scope.d_e_hannover = routes[1];
                    $scope.d_e_celle = routes[2];
                    $scope.d_e_hamburg = routes[3];
                    $scope.d_e_muenchen = routes[4];
                    $scope.d_e_freiburg = routes[5];

                    $scope.d_d_l_oberhausen = $scope.d_e_oberhausen - $scope.d_oberhausen;
                    $scope.d_d_l_hannover = $scope.d_e_hannover - $scope.d_hannover;
                    $scope.d_d_l_celle = $scope.d_e_celle - $scope.d_celle;
                    $scope.d_d_l_hamburg = $scope.d_e_hamburg - $scope.d_hamburg;
                    $scope.d_d_l_muenchen = $scope.d_e_muenchen - $scope.d_muenchen;
                    $scope.d_d_l_freiburg = $scope.d_e_freiburg - $scope.d_freiburg;

                    $scope.d_d_r_oberhausen = $scope.d_e_oberhausen - $scope.d_r_oberhausen;
                    $scope.d_d_r_hannover = $scope.d_e_hannover - $scope.d_r_hannover;
                    $scope.d_d_r_celle = $scope.d_e_celle - $scope.d_r_celle;
                    $scope.d_d_r_hamburg = $scope.d_e_hamburg - $scope.d_r_hamburg;
                    $scope.d_d_r_muenchen = $scope.d_e_muenchen - $scope.d_r_muenchen;
                    $scope.d_d_r_freiburg = $scope.d_e_freiburg - $scope.d_r_freiburg;
                });
            }

            $scope.showRoute = function() {
                $state.go($scope.activeRoute.url);
            }
        })
})();