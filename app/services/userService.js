var app = angular.module('campture');
app.factory('UserService',['$http',function($http){
    return{
        registerUser:registerUser,
        loginUser:loginUser
    };
    
    
    function registerUser (user){
        return $http({
            method: 'POST',
            url: '/api/user',
            data: user
        })
    };
    
    function loginUser (user){
        return $http({
            method: 'POST',
            url: '/api/login',
            data: user
        })
    };
}]);