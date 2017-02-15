'use strict';
(function () {

  angular.module('dashboardProjectApp')
    .controller('projectDetailController', ['$scope','$state', 'UserStory', '$location', 'DateService',
      function($scope, $state, UserStory, $location, DateService) {

        $scope.taskId = $state.params.id;
        $scope.openTasks = {};
        $scope.showText = {};
        $scope.warnings = {};

        $scope.closeTask = function(task){
          $scope.openTasks[task] = !$scope.openTasks[task];
        }

        $scope.getProjectIcon = function(key){

          if(key == 'nova')
            return 'fa fa-cogs';

          if(key == 'cinder')
            return 'fa fa-archive'

          if(key == 'keystone')
            return 'fa fa-key';

          if(key == 'swift')
            return 'fa fa-object-group';

          if(key == 'neutron')
            return 'fa fa-cloud-upload';

          if(key == 'glance')
            return 'fa fa-key';

          return 'fa fa-cog';
        }
        $scope.actualProject = {};

        function setWarning(key, message){

          if(message){
            $scope.warnings[key] = {
              message:message
            }
          }else{
            $scope.warnings[key] = message
          }
            
        }

        function getFile() {
            UserStory.findById({id:$scope.taskId},
                function success(userStory) {
                    $scope.userStory  = userStory;

                    // Formating User Story name
                     if ((userStory.description).length > 100) {
                         $scope.userStory.shortDescription = userStory.
                         description.substr(0,50) + " ...";
                     }
                     else {
                         $scope.userStory.shortDescription = userStory.
                         description;
                     }


                    $scope.userStory.createdOn = DateService.validateDate(
                        $scope.userStory.createdOn, 
                        'createdOn', setWarning);

                    $scope.userStory.updatedOn = DateService.validateDate(
                        $scope.userStory.updatedOn, 
                        'updatedOn', setWarning);

                    if(!$scope.warnings['createdOn']
                    && !$scope.warnings['updatedOn']){
                        DateService.compareDates($scope.userStory.createdOn, 
                        $scope.userStory.updatedOn, 'createdOn', setWarning);
                    }

                     for(var key in $scope.userStory.tasks_status) {
                         $scope.actualProject[key] = $scope.userStory.
                         tasks_status[key].projects[0]
                    }
                }, function onError(error){
                    $location.path('/projectDetail/notFound/' + $scope.taskId);
                }
            );
        };

        $scope.selectProject = function(keyProject,  idTask){
          $scope.actualProject[idTask] = keyProject
        }


        $scope.showMore = function(key){
          $scope.showText[key] = true;
        }

        $scope.showLess = function(key){
          $scope.showText[key] = false;
        }

        $scope.mailTo = function(user, email){
          window.location.href = "mailto:" + email + "?subject=Mail to " + email;
        }

        getFile();

      }])
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).
      toLowerCase() : '';
    }
  })
  .filter('removeDashes', function() {
      return function(string) {

        if (!angular.isString(string)) {
          return string;
        }

        return string.replace(/-/g, ' ');
      };
    })

})();
