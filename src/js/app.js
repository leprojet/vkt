(function() {
  "use strict";

  angular

    .module("vktApp", ["ui.router", "ngAnimate", "pouchdb"])
    .controller("vktCtrl", vktCtrl);

  function vktCtrl($scope, $http, $state, $q, APIService, Mapservice, pouchDB) {
    console.log("Windows.scope");
    window.scope = $scope;
    // var db = new PouchDB("vkt19");
    var db = pouchDB("vkt19");

    var CitiesFromDb = [];

    $scope.opacity = 0.2;
    $scope.searchable = false;
    $scope.showDetailRoutes = false;
    $scope.centre = null;

    $scope.orte = [];

    // Grober Umrechnungsfaktor Luftlinie -> tatsächliche Fahrtstrecke
    var manhattenFactor = 1.3;

    // 400km Radius
    var maxStrecke = 400000;

    function onEachFeature(feature, layer) {
      if (feature.properties && feature.properties.popup) {
        layer.bindPopup(feature.properties, popup);
      }
    }

    db
      .get("options")
      .then(function(response) {
        $scope.centre = response.projectCentre;
      })
      .catch(function(err) {
        console.log("ERROR: Could not read options.");
      });

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //::                                                                   M E N U ::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    $scope.houses = [
      {
        name: "Haus-Details",
        url: "hausDetails"
      }
    ];

    $scope.activeRoute = $scope.houses[0];

    $scope.showRoute = function() {
      $state.go($scope.activeRoute.url);
    };

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //::                                                             C I R C L E S ::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    var c_oberhausen = L.circle(oberhausen, {
      radius: maxStrecke,
      fillOpacity: $scope.opacity,
      fillColor: "#66ccff",
      color: "#66ccff",
      weight: 1
    });
    var c_hannover = L.circle(hannover, {
      radius: maxStrecke,
      fillOpacity: $scope.opacity,
      fillColor: "#ffff00",
      color: "#ffff00",
      weight: 1
    });
    var c_celle = L.circle(celle, {
      radius: maxStrecke,
      fillOpacity: $scope.opacity,
      fillColor: "#ff9900",
      color: "#ff9900",
      weight: 1
    });
    var c_hamburg = L.circle(hamburg, {
      radius: maxStrecke,
      fillOpacity: $scope.opacity,
      fillColor: "#ff3300",
      color: "#ff3300",
      weight: 1
    });
    var c_muenchen = L.circle(muenchen, {
      radius: maxStrecke,
      fillOpacity: $scope.opacity,
      fillColor: "#99cc00",
      color: "#99cc00",
      weight: 1
    });
    var c_freiburg = L.circle(freiburg, {
      radius: maxStrecke,
      fillOpacity: $scope.opacity,
      fillColor: "#996633",
      color: "#996633",
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
      Kreise: {
        "Ingo & Co.": c_oberhausen,
        Hendrik: c_hannover,
        Axel: c_celle,
        Christoph: c_hamburg,
        Don: c_muenchen,
        Tom: c_freiburg
      },
      Pömpel: {
        "Ingo & Co.": m_oberhausen,
        Hendrik: m_hannover,
        Axel: m_celle,
        Christoph: m_hamburg,
        Don: m_muenchen,
        Tom: m_freiburg
      }
    };

    // L.geoJSON(geojsonFeature, { onEachFeature: onEachFeature }).addTo(map);

    $scope.strasse = "Liebknechtstraße";
    $scope.nr = "45";
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

      APIService.getPoint(
        $scope.strasse,
        $scope.nr,
        $scope.plz,
        $scope.ort
      ).then(function(response) {
        var addresse = response[0];
        $scope.point = L.latLng({
          lat: addresse.lat,
          lon: addresse.lon
        });

        $scope.m = L.marker($scope.point).addTo(map);
        $scope.m.bindPopup(
          $scope.strasse + " " + $scope.nr + " in " + $scope.ort
        );
        // getDistances($scope.point);
        readCities();

      });
    };

    $scope.deleteMarker = function() {
      $scope.strasse = "";
      $scope.nr = "";
      $scope.plz = "";
      $scope.ort = "";
      $scope.d_oberhausen = null;
      $scope.orte = [];

      if ($scope.m) {
        $scope.m.remove();
      }

      $scope.point = null;

      $scope.showDetailRoutes = false;
      map.setView($scope.centre, 5);
      map.flyTo($scope.centre, 5);
    };

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //::                                                               R O U T E S ::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    // TODO: openrouteservice api prüfen, ob mehrere orte abgefragt werden können
    $scope.routesExact = [];

    function getRoutes(arr) {
      var promises = [];

      for (var ort in arr) {
        promises.push(
          APIService.getRoute(arr[ort], $scope.point).then(function(response) {
            return response.routes[0].summary.distance;
          })
        );
      }

      var def_prom = $q.all(promises);

      return def_prom;
    }

    function getDBRoutes(arr) {
      var promises = [];

      for (var ort in arr) {
        promises.push(
          APIService.getRoute(arr[ort]['coordinates'], $scope.point).then(function(response) {
            return response.routes[0].summary.distance;
          }).catch(function(err){
            console.log(err);
          })
        );
      }

      var def_prom = $q.all(promises);

      return def_prom;
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
      var point = $scope.point;
      var routes = [];

      var r = getDBRoutes($scope.orte);

      r.then(function(response){
        $scope.routes = response;
        for (var ort in $scope.orte){
          $scope.orte[ort]['exakteStrecke'] = $scope.routes[ort];
          $scope.orte[ort]['differenz'] = ($scope.orte[ort].fahrstrecke - $scope.routes[ort]) * -1;
        }
      });
      console.log("LF ", $scope.routes);
      //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      //::                                               A L T E  V E R S I O N::
      //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
      // var r = getRoutes(startOrte);
      // r.then(function(res) {
      //   routes = res;
      //   $scope.d_e_oberhausen = routes[0];
      //   $scope.d_e_hannover = routes[1];
      //   $scope.d_e_celle = routes[2];
      //   $scope.d_e_hamburg = routes[3];
      //   $scope.d_e_muenchen = routes[4];
      //   $scope.d_e_freiburg = routes[5];
      // });
    };

    $scope.zoomTo = function() {
      map.setView($scope.point, 15);
      map.flyTo($scope.point, 15);
    };

    $scope.zoomOut = function() {
      map.setView($scope.centre, 5);
      map.flyTo($scope.centre, 5);
    };

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //::                                                               H A U S ::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    $scope.score = 1;

    $scope.hoveringOver = function(star) {
      $scope.score = star;
    };

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //::                                                        P O U C H  D B ::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    function readCities() {
      CitiesFromDb = [];
      $scope.orte = [];
      db
        .allDocs({ include_docs: true })
        .then(function(response) {
          for (var i = 0; i < response.total_rows; i++) {
            // Keine Options, nur Orte
            if (response.rows[i].key === "options") {
              continue;
            }
            var coords = response.rows[i].doc.coordinates;
            var l = $scope.point.distanceTo(coords) / 1000;
            var f = l * manhattenFactor;
            $scope.orte.push({
              id: response.rows[i].doc.o_id,
              name: response.rows[i].key,
              coordinates: coords,
              luftlinie: l,
              fahrstrecke: f
            });
          }

          sortArray($scope.orte, "id", "asc");

          console.log("Cities ", $scope.orte);
        })
        .catch(function(err) {
          console.log("ERROR: Could not fetch data", err);
        });
    };

    function sortArray(arr, prop, order) {
      if (order === null || order === undefined) order = "asc";

      arr.sort(function(a, b) {
        switch (order) {
          case "asc":
            return a[prop] - b[prop];
            break;
          case "desc":
            return b[prop] - a[prop];
            break;
        }
      });

      return arr;
    }
  }
})();
