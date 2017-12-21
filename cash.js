var myapp = angular.module('myapp',[]);
myapp.controller('blog-controller',['$scope','$http','$filter',function($scope,$http,$filter){

    /*all post  */
    $scope.allPost = "ss";   // Setting Some default vaue to define variable we can just declare also

    // Variables for pagination 
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.data;
    // Variables for pagination  ends

    $http.get("http://assignment-server.herokuapp.com/posts")
    .then(function(response) {
        $scope.allPost = response.data;
        console.log($scope.allPost);
        $scope.data = response.data;
    });
    //pagination
    
    $scope.comments ="";
    $scope.loadComment = function(id){
        //console.log(id);
        var url = "http://assignment-server.herokuapp.com/posts/"+id+"?_embed=comments";
        $http.get(url)
        .then(function(response) { 
            console.log(response);   
             $scope.comments = response.data.comments;
             var tmp ="<ul class=\"list-unstyled\">";
             if($scope.comments.length===0){
                 tmp = "No Comment Found ...";
             }else{
                for(var i=0 ; i <$scope.comments.length ; i++ ){
                        tmp+="<li>"+$scope.comments[i].body+"</li>";
                }
                tmp+="</ul>";
             }
             //console.log(tmp);     
             $('#post'+id).html(tmp);
        });
    }
    
    // Load By Author 
    $scope.authorName="";

    $scope.searchByAuthor=function(a){
        var authorUrl = "http://assignment-server.herokuapp.com/posts?author="+a;
        $http.get(authorUrl)
        .then(function(response) {
            $scope.data = response.data;
            //console.log($scope.allPost);
            if($scope.data.length===0){
                // Setting up data in case no record is found 
                $scope.data = [{
                    "title":"No Post Found with this author",
                    "date":"",
                    "author":""
                }];
            }
        });   
    }
    // Add New Post 
    $scope.post= {};

    //Adding new Post Here 
    $scope.addPost = function(){
        //Getting time from user and reducing it into dd:mm:yyyy format 
        var DT = new Date($scope.post.date);
        var finalDate = DT.getDay()+":"+DT.getMonth()+":"+DT.getFullYear(); 
        var URL2="http://assignment-server.herokuapp.com/posts?title="+$scope.post.title+"&date="+$scope.post.finalDate+"&author="+$scope.post.author;
        $http.post(URL2).then(function(response){
            alert('Post Created');    // if the post created user will see a msg 
            $scope.post = {};           // resetting fields 
        });
    }
    $scope.numberOfPages=function(){
        return Math.ceil($scope.data.length/$scope.pageSize);    // getting ceil value for pagination             
    }
}]);

// Custom filter function to get starting point 
myapp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
