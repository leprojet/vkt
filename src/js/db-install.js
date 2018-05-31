(function(){

  "use strict";

  angular

  .module('vktApp',['ui.router'])
  .controller('vktDbCtrl', vktDbCtrl);

  function vktDbCtrl($scope, $state){
    console.log('DB-Install');
    var db = new PouchDB('vkt19');
    $scope.databaseOK = false;
    $scope.databaseInfo = false;

    $scope.createDB = function(){
      db.get('options').then(function(response){
        console.log("Database allready exists...");
        $scope.databaseOK = true;
      }).catch(function(err){
        console.log("Database not found. Creating...");
        createDatabase();
        $scope.databaseOK = true;
      });
    };

    function createDatabase(){
      db.put({
        _id: "options",
        name: "vkt19",
        description: "Vater Kind Tour 2019 - Planungs Tool",
        projectCentre: oberhausen
      }).then(function(response){
        db.info().then(function(response){
          console.log(response);
        }).catch(function(err){
          console.log("ERROR: could not get db-info", err);
        })
        console.log('Done.');
        $scope.databaseOK = true;
      }).catch(function(err){
        console.log("Could not instatiate Database.", err);
      });
    }

    $scope.populateDB = function(){

      db.get('Oberhausen').then(function(response){
        console.log("Data allready inserted into DB.");
        return;
      }).catch(function(err){
        db.bulkDocs(Orte).then(function(response){
          console.log(response);
        }).catch(function(err){
          console.log("ERROR: Could not populate DB", err);
        })
      })
    };

    $scope.deleteDB = function(){
      db.destroy().then(function(response){
        console.log(response);
        console.log("Database deleted");
        db = new PouchDB('vkt19');
      }).catch(function(err){
        console.log("ERROR: Could not delete database.", err);
      });
    };

    $scope.showDBInfo = function(){
      
      db.info().then(function(response){
        console.log(response);
        $scope.docCount = response.doc_count;
        $scope.dbName = response.db_name;
        $scope.databaseInfo = true;
      });
    };

    $scope.showDBOptions = function(){
      db.get('options').then(function(response){
        console.log(response);
      }).catch(function(err){
        console.log("ERROR: Could not get options", err);
      })
    }
  }
})();