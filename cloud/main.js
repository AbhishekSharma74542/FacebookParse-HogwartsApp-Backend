// Use Parse.Cloud.define to define as many cloud functions as you want.
console.log("Stage1");
require('cloud/application');
  console.log("Stage1");
//Default function
Parse.Cloud.define("hello", function(request, response) {
  console.log("Stage2");
  response.success("Hello world! This is response after success");
});
Parse.Cloud.afterSave('Groups', function (request) {
				console.log(request+"request");
                console.log('####&&&&&****** Experiments :: afterSave :: ' + JSON.stringify(request));
                console.log("Stage3");
            });