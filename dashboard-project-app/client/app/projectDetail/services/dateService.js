angular.module('dashboardProjectApp')
  .service('DateService', ['$http', function($http) {

  
    this.validateDate = function(date, field, setWarning){
      var newDate = date;

      var format = null;


      if(moment(newDate, 'MM-DD-YYYY', true).isValid()){
        format = 'MM-DD-YYYY';
      }

      if(moment(newDate, 'YYYY-MM-DD', true).isValid()){
        format = 'YYYY-MM-DD';
      }

      if(moment(newDate, 'DD-MM-YYYY', true).isValid()){
        format = 'DD-MM-YYYY';
      }

      if(format){
        newDate = moment(newDate,  format).format("MM-DD-YYYY");
        setWarning(field, null);
      }else{
        setWarning(field, 'Warning: The date is not valid');
      }
      return newDate;
    }

    this.compareDates = function(craetedOn, updatedOn, field, setWarning){

      //If both valid date, compare
      if (moment(craetedOn).isAfter(updatedOn)){
        setWarning(field, "Warning: This date can't be bigger");
      }else{
        setWarning(field, null);
      }
    }
    
  }]);
