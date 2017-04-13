/**
 * Created by Pavel on 14.06.2016.
 */

(function () {
    'use strict';

    angular
        .module('motivaer.directives')
        .directive('fileLoadMultiple', [fileLoadMultiple]);
    /**@ngInject*/
    function fileLoadMultiple() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                filesFromBase: '=?'
            },
            link: function (scope, elem, attrs, ctrl) {
                scope.model = scope.model || [];
                scope.files = scope.files || [];

                scope.$watch('filesFromBase', function () {
                    scope.files = scope.filesFromBase;
                    scope.model = scope.filesFromBase;
                });
                //for sync render after delete and adding new value
                scope.$watch('model', function (newVal) {
                    if (newVal) {
                        scope.model = scope.files;
                    } else {
                        scope.files = scope.model;
                    }
                    ctrl.$render();
                });

                elem.bind("change", function (e) {
                    scope.files = scope.files || [];

                    if ((e.srcElement || e.target).hasOwnProperty('files')) return console.log("Directive fileLoadSingle attached to wrong DOM element (type of input should be 'files')");

                    var files = (e.srcElement || e.target).files;

                    // file load via createObjectURL -------
                    var URL = window.URL || window.webkitURL;

                    if (URL) {
                        for (var i = 0; i < files.length; i++) {
                            files[i].url = URL.createObjectURL(files[i]);
                            files[i].state = true;
                            scope.files.push(files[i]);
                            ctrl.$setViewValue(angular.copy(scope.files));
                        }
                    }
                });
            }
        }
    }
})();