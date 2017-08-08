let index = require('../constants/index')

angular.module('starter.controllers',['ngCordova'])

.controller('SearchCtrl', function($scope, $state, Flash, $http, FetchDetails, GetSearch, $timeout, $ionicLoading) {
    let dishList;
    $scope.Model = {};
    $scope.searchWithoutLogin = "true";
    let user_email = localStorage.getItem("email");
    let searchResult=[], originalResult='';
    let initial, final = 0;
    $scope.dishList=[];
    $scope.thumbNailList=[];
    let trustHosts = true;
    let options = {encodeURI:false};
    let initial = 1;
    let end=0;
    let start = 0;

    if (user_email) {
        Flash.create('success', index.THANK_YOU_REGISTRATION, 'custom-class');
        $scope.searchWithoutLogin = "false";
    }
    $scope.submit = function() {
        let letters = /^[a-zA-Z]+$/;
        let numbers = /^[0-9]+$/;
        let pinVal = $scope.Model.Pin;
        $scope.dishList='';
        start = 0;end=0;index=0;
        searchResult ='';
        originalResult ='';
        if (pinVal !== null && pinVal.match(numbers)) {
            GetSearch.results(localStorage.getItem("email"), $scope.Model.Pin, function (result) {
                if (result.length > 0) {
                     result.sort(function(compare, compareWith){
                         return (compareWith.dishId > compare.dishId ? 1 : -1);
                     });
                     searchResult = result;
                     originalResult = result;
                     if (result.length > 5) {
                        $scope.dishList = FetchDetails.getSearchItemsWithTargetPath(searchResult.slice(0, 5));                         
                     } else {
                        $scope.dishList = FetchDetails.getSearchItemsWithTargetPath(searchResult.slice(0, result.length));
                     }    
                     end = originalResult.length;
                } else if (result === undefined) {
                    Flash.create('warning', index.TECHNICAL_ISSUE, 'custom-class');
                } else {
                    Flash.create('warning', index.NO_SEARCH_RESULTS_FOUND, 'custom-class');
                }

            });

        } else {
             let message = index.PIN_CODE_MSG;
             Flash.create('warning', message, 'custom-class');
        }
   };

   $scope.getItem = function(dishId) {
        if (dishId) {
            let request = $http({
                               method: 'POST',
                               url: index.APP_URL+'/RetrieveDetails',
                               headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                               transformRequest: function(obj) {
                               let str = [];
                               for(let p in obj)
                               str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                               return str.join("&");
                               },
                               data: {
                                   DishId : dishId
                               }
            });
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
            request.success(function(data, status, headers, config){
                $ionicLoading.hide();
                if (data != null) {
                    FetchDetails.setItems(data);
                    $state.go('selectedItem');
                } else {
                    Flash.create('warning', index.ITEM_NOT_RETRIEVED, 'custom-class');
                }
            });
            request.error(function(error, status){
                $ionicLoading.hide();
            })

        } else {
            lash.create('warning', index.TECHNICAL_ISSUE, 'custom-class');
        }
   }

   $scope.loadMore = function() {
        if ($scope.dishList.length <= originalResult.length) {
            start = start+5;
            end = (originalResult.length - $scope.dishList.length) < 5 ? (originalResult.length - $scope.dishList.length) : 5;
            let index=start;
            let n=start+end;
            let temp=[];
            searchResult.filter(function(object) {
                for (index;index<n;index++) {
                    temp.push(searchResult[index]);
                }
            });
            $scope.dishList = $scope.dishList.concat(temp);
            temp = '';

        }
            $scope.$broadcast('scroll.infiniteScrollComplete');

    };

    $scope.canWeLoadMoreContent = function() {
      if (end === 0) {
          return false;
      } else {
        return (end < 5 && end !== 0) ? false : true;
      }
    };
});
