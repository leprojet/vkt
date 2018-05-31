(function(){

  "use-strict";

  angular

    .module('vktApp')
    .config(vktRoutes);

    function vktRoutes($stateProvider){
      
      $stateProvider
      .state('hausDetails', {
        name: "hausDetails",
        url: "haus-details",
        templateUrl: "./src/pages/haus.html"
      });
    }
})();