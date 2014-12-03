angular.module('deployer', [ ])
    .controller('MainController', ['$scope', '$http', '$attrs',
    function ($scope, $http, $attrs) {

    	var socket = io();
        
        $scope.response = '';
        $scope.logs = '';

        $scope.isTerminalActive = true;

        function updateScroll (elemClass) {
        	var el = document.querySelector('.' + elemClass);
        	el.scrollTop = el.scrollHeight + el.offsetTop;
        }
        
        $scope.sendCommandRequest = function (url) {
            socket.emit('command', url);
            $scope.response = '';
        };

        $scope.sendCustomCommand = function () {
        	socket.emit('custom-command', $scope.cmdText);
        	$scope.cmdText = $scope.response = '';
        };

        $scope.sendOnEnter = function (e) {
        	if (e.which == 13) {
        		$scope.sendCustomCommand();
        	}
        };

        $scope.switchTab = function (tab) {
        	$scope.isTerminalActive = $scope.isLogActive = false;

        	switch (tab) {
        		case 'term':
        			$scope.isTerminalActive = true;
        			break;
        		case 'log':
        			$scope.isLogActive = true;
        			break;
        	}
        }

        socket.on('response', function (data) {
            var res = $scope.logs + data;
            res = res.split('\n');
            res = _.last(res, 600).join('\n');
            
        	$scope.$apply(function () {
    			$scope.response = res;
    		});
    		updateScroll('stdout');
        });

        socket.on('success', function () {
        	if(!$scope.$$phase) {
        		$scope.$apply(function () {
        			$scope.status = 'Success';
        		});
        	}
        });

        socket.on('log', function (data) {
        	var logs = $scope.logs + data;
        	logs = logs.split('\n');
        	logs = _.last(logs, 600).join('\n');

        	if(!$scope.$$phase) {
        		$scope.$apply(function () {
        			$scope.logs = logs;
        		});
        	}
        	updateScroll('logs');
        });
        
    }]);