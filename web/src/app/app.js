var api_endpoint_v2 = '/api/v2'; //rasa UI API = location of Nodejs server.js script running, edit this if the nodejs web front end is not running on the server instance

var app = angular.module('app', ['ngRoute', 'chart.js', 'ngResource', 'ngTagsInput', 'jsonFormatter'])

.controller('app', function($scope, $route, $routeParams, $location,$timeout) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     $scope.go = function ( path ) {
       $location.path( path );
     };

     $scope.formData = {};

     $scope.$on('setAlertText', function(event, alert_text) {
       $('#alertTextDiv').addClass('show');
       $scope.alert_text = alert_text;
       $timeout(function(){$('#alertTextDiv').removeClass('show')}, 10000);   
     });
})
