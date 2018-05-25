(function() {
    angular

        .module('vktApp')
        .service('Mapservice', Mapservice);

    function Mapservice() {

        this.getMap = function(overlay, centre) {
            var startZoom = 5;

            var map = L.map('map');
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            var osm = new L.tileLayer(osmUrl, {
                minZoom: 1,
                maxZoom: 20,
                attribution: osmAttrib
            });

            var basemaps = {
                "OpenStreetMap": osm
            };

            map.addLayer(osm);

            map.setView(centre, startZoom);
            map.flyTo(centre, startZoom);

            L.control.groupedLayers(basemaps, overlay).addTo(map);

            return map;
        }
    }
})();