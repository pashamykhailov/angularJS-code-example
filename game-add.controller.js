/**
 * Created by Pavel on 18.05.2016.
 */

(function () {
    'use strict';

    angular
        .module('appUp')
        .controller('GameAddController', GameAddController);

    /** @ngInject */
    function GameAddController($state, $q, fileLoadSingle, firebaseDatabase, $sce, $scope, fileUploadMultiple, CATALOG) {
        $scope.app = {
            addition: new Date(),
            downloads: '35 352',
            images: {},
            videoLink: 'RdGVz104b3E',
            views: '999 444',
            stars: [1, 2, 3, 4, 5],
            starsAmount: 300,
            type: 'game',
            pricing: 'true',
            platform: 'android',
            novelty: 'true',
            enterBest: 'true'
        };
        $scope.versionString = '';
        $scope.myPattern = new RegExp('\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$');

        // Show youtube preview in scope function
        $scope.updateVideoLink = function () {
            if ($scope.app.videoLink) {
                $scope.videoLinkWithSCE = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.app.videoLink);
                $scope.showVideoTrigger = true;
            } else {
                $scope.showVideoTrigger = false;
            }
        };

        $scope.callMyMask = function (inputVal) {
            if (inputVal) {
                var mask = ['000', '000', '000'];
                inputVal = inputVal.split('.');
                $scope.app.minVersion = Number(mask.reduce(function (startElem, current, i) {
                    var len = inputVal[i].length;
                    if (len > 3 || isNaN(inputVal[i])) {
                        throw new Error("Неправильный формат данных: " + inputVal[i])
                    } else {
                        return startElem + current.slice(0, -len) + inputVal[i];
                    }
                }, 1));
                console.log('minVersion  ', $scope.app.minVersion);
                console.log('minVersion length ', $scope.app.minVersion.toString().length);
            }
        };

        // Functions to work with images
        function refactoringLogoImage() {
            if ($scope.fileUpload) {
                $scope.app.icon = {
                    name: $scope.fileUpload.name,
                    link: 'images/' + $scope.app.platform + '/' + $scope.app.appID.name + '/logo' + $scope.fileUpload.name,
                    state: true
                };
            }
        }

        function refactoringImages() {
            if ($scope.uploadArray) {
                for (var i = 0; i < $scope.uploadArray.length; i++) {
                    $scope.app.images[$scope.uploadArray[i].name.replace(/\./g, ' ')] = {
                        name: $scope.uploadArray[i].name,
                        link: 'images/' + $scope.app.platform + '/' + $scope.app.appID.name + '/' + $scope.uploadArray[i].name,
                        state: true,
                        deleteIndex: i
                    };
                }
            }
        }


        $scope.deleteScopeVal = function (variable) {
            $scope.app[variable] = '';
            $scope.app[variable] = null;
        };
        $scope.cleanUploadInput = function () {
            document.querySelector('#logo-icon').value = null;
        };

        $scope.cleanUploadInputWithMultiplyIcons = function () {
            document.querySelector('#multiply-icons').value = null;
        };

        $scope.deleteArray = function (index) {
            $scope.uploadArray.splice(index, 1);
            $scope.uploadArray = angular.copy($scope.uploadArray);
        };

        // Functions to work with stars counter
        $scope.getSelectedText = function () {
            if ($scope.app.starsCount !== undefined) {
                return $scope.app.starsCount;
            } else {
                return "Please rate the app";
            }
        };

        //Making valid $scope.app.appID object
        function convertAppIDObject() {
            $scope.app.appID = {
                id: $scope.app.appID.id,
                name: $scope.app.appID.id.replace(/[^a-zA-Z0-9]/g, "")
            };
        }

        // Function to push data to firebase
        function addDataToBase() {
            var deferred = $q.defer();

            convertAppIDObject();
            refactoringLogoImage();
            refactoringImages();
            // A post entry.
            var appData = {
                addedDate: $scope.app.addition,
                appName: $scope.app.appName,
                appID: $scope.app.appID,
                parentCategory: $scope.app.newCategory,
                description: $scope.app.description,
                downloads: $scope.app.downloads,
                icon: $scope.app.icon,
                images: $scope.app.images,
                isFree: $scope.app.pricing,
                isNew: $scope.app.novelty,
                isTop: $scope.app.enterBest,
                marketLink: $scope.app.appLink,
                platform: $scope.app.platform,
                rating: $scope.app.starsCount,
                sizeKB: $scope.app.size,
                type: $scope.app.type,
                vendor: $scope.app.appVendor,
                minVersion: $scope.app.minVersion,
                video: $scope.app.videoLink,
                views: $scope.app.views
            };

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates[$scope.app.appID.name] = appData;
            console.log('updates ', updates);
            firebaseDatabase.ref(CATALOG + "/" + $scope.app.platform).update(updates).then(function () {
                console.log('all data ', appData);
                deferred.resolve();
            }).catch(function (error) {
                deferred.reject();
                $scope.loadingImage = 'display-none';
                alert('You don\'t have permissions');
            });
            return deferred.promise;
        }

        $scope.addToFirebase = function () {
            if ($scope.addGame.$valid) {
                $scope.loadingImage = 'display-flex';
                addDataToBase().then(function () {
                    fileLoadSingle.uploadSingle('images/' + $scope.app.platform + '/', $scope.app.appID.name, $scope.fileUpload).then(function () {
                        fileUploadMultiple.uploadArray('images/' + $scope.app.platform + '/', $scope.app.appID.name, $scope.uploadArray).then(function () {
                            $scope.loadingImage = 'display-none';
                            $state.go('main.catalog');
                        });
                    });
                });
            }
        };
    }

})();