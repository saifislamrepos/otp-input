var otpapp = angular.module('otpapp', []);
otpapp.controller('otpcontroller', function otpcontroller($scope) {
	$scope.otpvalue = '';
	$scope.otperror = {
		isError: false,
		errorMessage: 'custom message (click on otp field to remove)'
	};
	$scope.testotperror = function () {
		$scope.otperror.isError = true;
	}
});
otpapp.directive('ngOtpinput', ['$compile', '$timeout', '$window', '$rootScope',
	function ($compile, $timeout, $window, $rootScope) {
		return {
			restrict: 'AE',
			scope: {
				otpvalue: '=',
				error : '='
			},
			link: function (scope, elem, attrs,ngModel) {
				var template = 	'<div class = "sub-input" ng-repeat = "otpval in otparray">'+'<input required="true" ng-model="otpval.value" type="text" maxlength="1" placeholder="."  ng-keyup="changefocus($event)" ng-keydown = "prevfocus($event)" ng-focus= "closeerror()" ng-paste="fillOtp($event)" autofocus = "{{$index == 0}}">'+ '</div>';
				var otplen = attrs.ngOtplen || 6;
				var disablepaste = eval(attrs.ngDisablepaste) || false
				scope.otparray = [];
				for (var i = 0; i < otplen ; i++) { 
					scope.otparray.push({ value: '' });
				}
				var html = angular.element(template);
				$compile(html)(scope);
				elem.append(html);
				scope.changefocus = function (event) {
					if (event.keyCode == 37 && event.target.offsetParent.previousElementSibling != null && event.target.offsetParent.previousElementSibling.className.indexOf('sub-input') > -1) {
						event.target.offsetParent.previousElementSibling.firstElementChild.focus();
					} else if (event.keyCode !== 8 && !isNaN(Number(event.key)) && event.target.offsetParent.nextElementSibling != null && event.target.offsetParent.nextElementSibling.className.indexOf('sub-input') > -1) {
						event.target.value = event.key;
						angular.element(event.target).triggerHandler('input');
						event.target.offsetParent.nextElementSibling.firstElementChild.focus();	
						
					} else if (event.keyCode == 39 && event.target.offsetParent.nextElementSibling != null && event.target.offsetParent.nextElementSibling.className.indexOf('sub-input') > -1) { 
						event.target.offsetParent.nextElementSibling.firstElementChild.focus();	
					}
				};
				scope.$on('event:resetotp',function (event) {
					scope.otparray = [];
					for (var i = 0; i < otplen; i++) {
						scope.otparray.push({ value: '' });
					}
				})
				scope.prevfocus = function (event) {
					if ((event.keyCode == 8) && event.target.offsetParent.previousElementSibling != null && event.target.offsetParent.previousElementSibling.className.indexOf('sub-input') > -1) {
						if (event.target.value == "") {
							event.target.offsetParent.previousElementSibling.firstElementChild.focus();
						}
					}
				};
				scope.closeerror = function () {
					scope.error = false;
				};
				scope.fillOtp = function (event) {
					event.preventDefault();
					if (eval(attrs.ngDisablepaste)) {
						return;
					}
					var data;
					if (typeof event.clipboardData != "undefined") {
						data = event.clipboardData.getData("text/plain");
					} else if (typeof event.view.clipboardData != "undefined") {
						data = event.view.clipboardData.getData("text");
					} else { 
						return;
					}
					var inputvalues = data.split('');
					for (var i in scope.otparray) {
						scope.otparray[i].value = inputvalues[i] || '';
					}
					var len = inputvalues.length >= otplen ? otplen-1 : inputvalues.length;
					var parent = event.target.offsetParent.offsetParent;
					var inputs = event.target.offsetParent.offsetParent.querySelectorAll('input');
					inputs[len].focus();
				};
				scope.$watch('otparray', function (newValue, oldValue, scope) {
					scope.otpvalue = '';
					for (var a in scope.otparray) {
						scope.otpvalue = scope.otpvalue + (scope.otparray[a].value || '');
					}
				},true);
			}
		};
	}
]);
