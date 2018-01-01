var myapp = angular.module('myapp',['ngRoute']);

myapp.config(function($routeProvider,$locationProvider){
    $routeProvider.
        when('/',{
            templateUrl:'cash.html',
            controller: 'homecontroller'
        }).
        when('/details/:id',{
            templateUrl:'details.html',
            controller:'detailsController'
        }).
        otherwise({
            redirectTo:'/'
        })

});


myapp.controller('homecontroller',['$scope','$http','$filter',function($scope,$http,$filter){

    $scope.numberOfPages =0;
    /*all post  */
    $scope.allPost = "ss";   // Setting Some default vaue to define variable we can just declare also

    // Variables for pagination 
    $scope.currentPage = 0;
    $scope.pageSize = 3;
  
    // Variables for pagination  ends

    $http.get("https://eventmanager-server.herokuapp.com/events")
    .then(function(response) {
        $scope.allPost = response.data;
        //console.log($scope.allPost);
        $scope.data = response.data;
        $scope.numberOfPages=Math.ceil($scope.data.length/$scope.pageSize); 
        
    });
    
    
       // getting ceil value for pagination             
    
    //pagination
    
   
    // Load By Author 
    $scope.organiserName="";

    $scope.searchByAuthor=function(a){
        var authorUrl = "https://eventmanager-server.herokuapp.com/events?organiser="+a;
        $http.get(authorUrl)
        .then(function(response) {
            $scope.data = response.data;
            console.log($scope.data);
            if($scope.data.length===0){
                // Setting up data in case no record is found 
                $scope.data = [{
                    "title":"No Event Found with this author",
                    "date":"",
                    "organiser":""
                }];
            }
        });   
    }
    // Add New Post 
    $scope.post= {};

    //Adding new Post Here 
    $scope.addPost = function(){
		console.log($scope.post);
        //Getting time from user and reducing it into dd:mm:yyyy format 
        var DT = new Date($scope.post.date);
        var today = new Date(DT);
		var dd = today.getDate();

		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		var monthNames = [
					"January", "February", "March",
					"April", "May", "June", "July",
					"August", "September", "October",
					"November", "December"
		];
		today = monthNames[mm]+' '+dd+' '+yyyy;
		
        
        var URL2="https://eventmanager-server.herokuapp.com/events";
        var setdata = {};
        setdata.title = $scope.post.title;
        setdata.date = today;
        setdata.organiser = $scope.post.organiser;
        setdata.price = $scope.post.price;
        
        var req = {
		 method: 'POST',
		 url: URL2,
		 data: setdata
		}
		
        $http(req).then(function(response){
            alert('New Event Loaded Successfully');    
            $scope.post = {};           // resetting fields 
        });
    }

    
}]);



//Controller for Secont Route Starts here
myapp.controller('detailsController',['$scope','$http','$filter','$location','$routeParams',function($scope,$http,$filter,$location,$routeParams){

    $scope.indiVidialPost ="";
    
    http://eventmanager-server.herokuapp.com/events/1?_embed=comments
    var url = "https://eventmanager-server.herokuapp.com/events/"+$routeParams.id+"?_embed=comments";
    
    //get that event 
    $http.get(url).then(function(response) { 
         $scope.indiVidialPost = response.data;
          console.log($scope.indiVidialPost);
    });

    $scope.loadComment = function(){
        var tmp ="<ul class=\"list-unstyled text-info comment\">";
         if($scope.indiVidialPost.comments.length===0){
             tmp = "No Comment Found ...";
         }else{
            for(var i=0 ; i <$scope.indiVidialPost.comments.length ; i++ ){
                    tmp+="<li>"+$scope.indiVidialPost.comments[i].body+"</li>";
            }
            tmp+="</ul>";
         }
         console.log(tmp);
         $('#comments').html(tmp);
    }
    
}]);

// Custom filter function to get starting point 
myapp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
