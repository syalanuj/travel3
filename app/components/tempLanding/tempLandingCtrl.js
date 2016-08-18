(function () {
    'use strict';

    var app = angular.module('campture');
    app.controller('TempLandingCtrl', ['$scope', '$cookies', '$rootScope', '$route', 'GearService', controller]);
    function controller($scope, $cookies, $rootScope, $route, gearService) {
        //====== Scope Variables==========
        //================================
        $scope.emailField1;
        $scope.userName;
        $scope.emailField2;
        $scope.mailSubject;
        $scope.mailMessage;
        $scope.feedback = new Object();
        $scope.isemailField1Sent = false;
        $scope.isContactUsFormSent = false;

        $scope.sendUserEmail = function () {
            var data = {
                email: $scope.emailField1
            }
            Parse.Cloud.run("sendEmailMailgun", data, {
                success: function (object) {
                    $('#response').html('Email sent!').addClass('success').fadeIn('fast');
                    $scope.isemailField1Sent = true;
                    $scope.emailField1 = undefined;
                    $scope.$apply();
                },

                error: function (object, error) {
                    console.log(error);
                    $('#response').html('Error! Email not sent!').addClass('error').fadeIn('fast');
                    $route.reload();
                }
            });
        }
        $scope.sendUserQuery = function () {
            var data = {
                name: $scope.userName,
                email: $scope.emailField2,
                subject: $scope.mailSubject,
                message: $scope.mailMessage
            }
            Parse.Cloud.run("sendUserQuery", data, {
                success: function (object) {
                    $('#response').html('Email sent!').addClass('success').fadeIn('fast');
                    $scope.isContactUsFormSent = true;
                    $scope.userName = undefined;
                    $scope.emailField2 = undefined;
                    $scope.mailSubject = undefined;
                    $scope.mailMessage = undefined;
                    $scope.$apply();
                },

                error: function (object, error) {
                    console.log(error);
                    $('#response').html('Error! Email not sent!').addClass('error').fadeIn('fast');
                    $route.reload();
                }
            });
        }
        $scope.sendFeedback = function (isValid) {
            $scope.submitted = true;
            if (isValid) {
                var data = {
                    name: $scope.feedback.name,
                    email: $scope.feedback.email,
                    comments: $scope.feedback.comments
                }
                Parse.Cloud.run("sendFeedback", data, {
                    success: function (object) {
                        $scope.submitted = false;
                        $('#feedbackModal').modal('hide');
                        $('#response').html('Email sent!').addClass('success').fadeIn('fast');
                        $scope.feedback.name = undefined;
                        $scope.feedback.email = undefined;
                        $scope.feedback.comments = undefined;
                    },

                    error: function (object, error) {
                        $scope.submitted = false;
                        $('#feedbackModal').modal('hide');
                        console.log(error);
                        $('#response').html('Error! Email not sent!').addClass('error').fadeIn('fast');
                        $route.reload();
                    }
                });
            }
        }
    };
})();