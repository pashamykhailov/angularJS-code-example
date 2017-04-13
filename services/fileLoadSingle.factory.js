/**
 * Created by Pavel on 13.06.2016.
 */

(function () {
    'use strict';

    angular
        .module('motivaer.services')
        .factory('fileLoadSingle', fileLoadSingle);

    /** ngInject*/
    function fileLoadSingle($q, firebaseStorage) {
        return {
            uploadSingle: uploadSingle
        };
        function uploadSingle(pathFolder, appID, file) {
            var deferred = $q.defer();
            var storageRef = firebaseStorage.ref();
            var uploadToBase = storageRef.child(pathFolder + '/' + appID + '/logo' + file.name).put(file);
            uploadToBase.on('state_changed', function (snapshot) {
                console.log('loaded');
            }, function (error) {
                // Handle unsuccessful uploads
                console.log('error ', error);
                deferred.reject();
            }, function () {
                var downloadURL = uploadToBase.snapshot.downloadURL;
                deferred.resolve(downloadURL);
            });

            return deferred.promise;
        }
    }
})();