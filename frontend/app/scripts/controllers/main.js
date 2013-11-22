'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', ['$scope', 'angularFire', function ($scope, angularFire) {
      var ref = new Firebase('https://dpl-dev.firebaseio.com/');
      angularFire(ref.child('versions'), $scope, 'fireVersions');
      angularFire(ref.child('status'), $scope, 'status');
      angularFire(ref.child('current'), $scope, 'current');

      $scope.$watch('fireVersions', function (versions) {
          $scope.versions = [];
          angular.forEach(versions, function (version) {
              $scope.versions.push(JSON.parse(version.payload));
          });
      });
  }]);
