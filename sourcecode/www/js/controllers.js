angular.module('app.controllers', [])

.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
  var Login = function ($scope, $location) {



          $scope.validate = function () {
              if ($scope.Email_id != null && $scope.Email_id != "" && $scope.Pwd != null && $scope.Pwd != "") {

              var id = localStorage.getItem($scope.Email_id);


                   if ( $scope.Pwd == id){
                      $location.path('/page4');
                  }
                  else{
                      alert("email or password wrong!!!");
                  }

          }



      };
          $scope.fetch = function (paths){
              $location.path(paths);

          };

  };


}])

.controller('signupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
  var Register = function ($scope, $location) {

          $scope.show = false;


          $scope.match = function () {
              if ($scope.reg_Pwd != null && $scope.reg_Pwd != "" && $scope.reg_Cnf_Pwd != null && $scope.reg_Cnf_Pwd != "") {

                  if ($scope.reg_Pwd == $scope.reg_Cnf_Pwd) {
                      $scope.show = false;
                  }

                   else {
                      $scope.show = true;
                  }
              }

          };

          $scope.reg = function () {

              var user = document.getElementById("reg_Email_id").value;
              var u_pwd = document.getElementById("reg_Pwd").value;
              if (typeof(Storage) != "undefined") {
                  localStorage.setItem(user, u_pwd);
                  alert("User registered successfully");
                  $location.path('/page1');

              }
          }


      };

}])

.controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
  var Mashup = function ($scope, $http) {
          $scope.productList = new Array();
          $scope.mostRecentReview;
          $scope.getProduct = function () {
              var enter = document.getElementById("search").value;
              if (enter!= null && enter != "") {
                  document.getElementById('div_ReviewList').style.display = 'none';
                  //This is the API that gives the list of venues based on the place and search query.
                  var handler = $http.get("http://api.walmartlabs.com/v1/search?apiKey=8fvbs9ask76hag28bq94v6fh&lsPublisherId=" +
                "&query="+enter+"&sort=bestseller&responseGroup=full";);
                  handler.success(function (data) {

                      if (data != null && data.response != null && data.response.v1 != undefined && data.response.v1 != null) {
                          for (var i = 0; i < data.response.v1.length; i++) {
                              $scope.productList[i] = {
                                  "name": data.response.v1[i].name,
                                  "brandName": data.response.v1[i].brandName,
                                  "shortDescription": data.response.v1[i].shortDescription
                              };
                          }
                      }

                  })
                  handler.error(function (data) {
                      alert("There was some error processing your request. Please try after some time.");
                  });
              }
          }
          $scope.getInfo = function (product) {
              if (product != null) {
                  //This is the API call being made to get the reviews(tips) for the selected place or venue.
                  var handler = $http.get("https://api.walmartlabs.com/v1/search?" + product.name+
                      "?sort=recent" +
                      "&apiKey=8fvbs9ask76hag28bq94v6fh" +
                      "&lsPublisherId=" +
                      "&limit=5");
                  handler.success(function (result) {
                      if (result != null && result.response != null) {
                          $scope.mostRecentReview = result.response.items[0];
                          //This is the Alchemy API for getting the sentiment of the most recent review for a place.
                          var callback = $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment" +
                              "?apikey=74cdedd998eaded9f39d148c6ce348c7e8725f3e" +
                              "&outputMode=json&text=" + $scope.mostRecentReview.text);
                          callback.success(function (data) {
                              if(data!=null && data.docSentiment!=null)
                              {
                                  $scope.ReviewWithSentiment = {"reviewText" : $scope.mostRecentReview.text,
                                                              "sentiment":data.docSentiment.type,
                                                               "score":data.docSentiment.score  };
                                  document.getElementById('div_ReviewList').style.display = 'block';


                              }
                          })
                      }
                  })
                  handler.error(function (result) {
                      alert("There was some error processing your request. Please try after some time.")
                  })
              }

          }

       };
}])
