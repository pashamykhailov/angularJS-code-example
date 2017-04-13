/**
 * Created by Pavel on 13.06.2016.
 */

(function () {
    'use strict';

    angular
        .module('motivaer.directives')
        .directive('fileLoadSingle', fileLoadSingle);
    /**@ngInject*/
    function fileLoadSingle() {
        return {
            restrict: "A",
            scope: {
                fileUploadSingle: "=",
                fileSingleUrl: '='
            },
            link: function ($scope, el) {
                el.bind("change", function (domEvent) {
                    if ((domEvent.srcElement || domEvent.target).hasOwnProperty('files')) return console.log("Directive fileLoadSingle attached to wrong DOM element (type of input should be 'files')");
                    var file = (domEvent.srcElement || domEvent.target).files[0];
                    var URL = window.URL || window.webkitURL;
                    $scope.fileSingleUrl = {};

                    if (URL) {
                        $scope.fileSingleUrl.url = URL.createObjectURL(file);
                        $scope.fileSingleUrl.state = true;
                        $scope.fileUploadSingle = file;
                        $scope.fileUploadSingle.state  = true;
                        console.log('$scope.fileUploadSingle ', $scope.fileUploadSingle);
                        console.log('$scope.fileSingleUrl ', $scope.fileSingleUrl);
                        $scope.$apply();
                    }
                });
            }
        }

    }
})();