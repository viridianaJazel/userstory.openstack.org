'use strict';

angular.module('dashboardProjectApp').controller('projectListCtrl', function(
    $scope,
    UserStory,
    DateService
){
    var data = [];
    var lastUpdate;
    $scope.warnings = {};

    function setWarning(key, message){

        if(message){
            $scope.warnings[key] = {
              message:message
            }
        }else{
            $scope.warnings[key] = message
      }
    }


    function getTemplateWarning(key){
        var template = '';
        if($scope.warnings[key]){
            template = '<div class="text-warning" uib-tooltip="On the tootll">'+
                        '<span class="glyphicon glyphicon-warning-sign" uib-tooltip="On the tootll"></span>'+
                        $scope.warnings[key].message+
                        '</div>';
        }
        return template;
    }
    
    function getFiles() {
        UserStory.find(
        function success(userStories, fillTable) {
            new Promise(function(resolve, reject) {
                var stringDate, realDate;

                userStories.forEach(function each (story) {

                    console.log('story', story);
                    
                    story.dateCreated = DateService.validateDate(
                        story.dateCreated, 
                        'dateCreated', setWarning);

                     if(story.lastUpdate !=='') {
                         story.lastUpdate =  moment(story.lastUpdate, 
                            "YYYY-MM-DD").format("MM-DD-YYYY");
                     } else {
                         story.lastUpdate = story.dateCreated;
                     }

                    if(!$scope.warnings['dateCreated']
                    && !$scope.warnings['lastUpdate']){
                        DateService.compareDates(story.dateCreated, 
                        story.lastUpdate, 'dateCreated', setWarning);
                    }

                    
                    data.push(
                        {
                            userStory: story.id+'-'+story.userStory,
                            dateCreated: story.dateCreated + getTemplateWarning('dateCreated'),
                            lastUpdate: story.lastUpdate + getTemplateWarning('lastUpdate'),
                            progressPercentage: story.completed.percentage,
                            progressLabel: story.completed.completed + ' / ' + story.completed.total
                        }
                    )

                   resolve(data);
                });

            })
            .then(function(result) {
                $(function () {
                    $('#table').bootstrapTable({
                        data: data
                    });
                });
            });
        });
    };
    getFiles();
});
