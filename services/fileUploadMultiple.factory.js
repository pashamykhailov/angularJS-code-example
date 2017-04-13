/**
 * Created by Pavel on 14.06.2016.
 */

(function () {
    'use strict';

    angular
        .module('motivaer.services')
        .factory('fileUploadMultiple', fileUploadMultiple);
    /**@ngInject*/
    function fileUploadMultiple($q, firebaseStorage) {
        return {
            uploadArray: uploadArray
        };

        function uploadArray(pathFolder, appID, fileArray) {
            var storageRef = firebaseStorage.ref();
            var promises = [];

            fileArray.forEach(function (item) {
                var deferred = $q.defer();
                promises.push(deferred.promise);
                var uploadToBase = storageRef.child(pathFolder + '/' + appID + '/' + item.name).put(item);
                uploadToBase.then(function (snapshot) {
                    deferred.resolve();
                },function (error) {
                    console.log('error ', error);
                    deferred.reject();
                });
            });
            return $q.all(promises);
        }
    }
})();