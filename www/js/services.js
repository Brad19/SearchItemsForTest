const index = require('../constants/index');

angular.module('starter.services', [])
.factory ('FetchDetails', function () {
  var dishItems;
  var dishDetails;
  var editItem;
  return {
      setItems : function (value) {
      dishItems = '';
      dishItems = value;
      return dishItems;
    },
    getItems : function () {
      return dishItems;
    },
    getSearchItemsWithTargetPath : function(searchItems) {
      searchItems.forEach(function(item, localIndex){
        if (!item.targetPath) {
              item.targetPath = item.awsUrl;
        }    
      });
      return searchItems;
    },
  };

})

.factory('GetSearch', function($http, $ionicLoading){
  return {
      results : function (email, pin, callback) {
           var url = `${index.APP_URL}/SearchItems`;
           var request = $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                   },
                   data: {
                    Pincode: pin,
                    Email : email
                   }
           });
           $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'}); 
           request.success(function(data, status, headers, config) {
                   $ionicLoading.hide();
                   if (data != '') {
                      callback(data);
                   } else {
                      callback(data);
                   }
           });

           request.error(function(error, status) {
                 $ionicLoading.hide();
                 callback(status);
           });
      }
  };

})



