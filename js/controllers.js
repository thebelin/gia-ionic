angular.module('starter.controllers', [])

.controller('giadataCtrl', ['$scope', 'giaData', 'Instances', function($scope, giaData, Instances) {
  // Control the list of available adapters
  $scope.giaInstances = Instances.all();
  console.log('giaInstances:', $scope.giaInstances);

  // This is the selected instance for interaction
  var currentInstance = 0,

  // This indicates whether to show the New Instance interface
    showNew = false,

  // The current data
    allData = {},

  // Call when the currentInstance switches and the first run
    updateGia = function () {
      console.log('update GIA: ', $scope.giaInstances[currentInstance]);
      new giaData({
        docId: $scope.giaInstances[currentInstance].docId,
        debug: true,
        pollInterval: $scope.giaInstances[currentInstance].pollInterval,
        // an update function to call on the data when it's retrieved
        onUpdate: function(newData) {
          console.log('onUpdate:', newData);
          allData = newData;

          //@todo The data has changed, so send an update through the platform update channel
        }
      }).update();
    };

  $scope.getCurrentInstance = function () {
    return currentInstance;
  };

  // Provide the ability to set the current Index
  $scope.setCurrentInstance = function (newIndex) {
    console.log('setCurrentInstance', newIndex);
    // Only use the index if the instance at that index isn't null
    if ($scope.giaInstances[newIndex]) {
      currentInstance = newIndex;
    }
    updateGia();
  };

  // Provide a base object to create a new GIA Instance from
  $scope.newInstance = {};
  $scope.toggleNewInstanceForm = function () {
    showNew = !showNew;
  };
  $scope.showNewInstanceForm = function () {
    return showNew;
  };
  // Save the newInstace data as a new instance
  $scope.addInstanceFromForm = function () {
    Instances.add($scope.newInstance);
    $scope.newInstance = {};
    $scope.showNew = false;
  };

  $scope.allData = function () {
    return allData;
  };

  // Call that function
  updateGia();
}]);
