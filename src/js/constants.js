//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//::                                                         V A R I A B L E S ::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

var oberhausen = L.latLng({
    lat: 51.496334,
    lng: 6.863776
  }),
  hannover = L.latLng({
    lat: 52.375892,
    lng: 9.73201
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
    lng: 11.58198
  }),
  freiburg = L.latLng({
    lat: 47.999008,
    lng: 7.842104
  });

// WICHTIG: Diese Reihenfolge muß überall eingehalten werden
var startOrte = [oberhausen, hannover, celle, hamburg, muenchen, freiburg];

var Orte = [
  {
    _id: "Oberhausen",
    o_id: 0,
    coordinates: L.latLng({
      lat: 51.51399325,
      lng:  6.84932276128192
    })
  },
  {
    _id: "Hannover",
    o_id: 1,
    coordinates: L.latLng({
      lat: 52.375892,
      lng: 9.73201
    })
  },
  {
    _id: "Celle",
    o_id: 2,
    coordinates: L.latLng({
      lat: 52.617596,
      lng: 10.062851
    })
  },
  {
    _id: "Hamburg",
    o_id: 3,
    coordinates: L.latLng({
      lat: 53.551085,
      lng: 9.993682
    })
  },
  {
    _id: "München",
    o_id: 4,
    coordinates: L.latLng({
      lat: 48.135125,
      lng: 11.58198
    })
  },
  {
    _id: "Freiburg",
    o_id: 5,
    coordinates: L.latLng({
      lat: 47.999008,
      lng: 7.842104
    })
  }
];

