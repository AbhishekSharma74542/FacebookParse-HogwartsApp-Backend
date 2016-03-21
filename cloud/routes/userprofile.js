var constant = require('cloud/constants/constant.js');
var Error = require('cloud/constants/error.js');
var twilioAccountSid = constant.twilioAccountSid;
var twilioAuthToken = constant.twilioAuthToken;
var twilioPhoneNumber = constant.twilioPhoneNumber;
var secretPasswordToken = constant.secretPasswordToken;
var language = constant.language;
var twilio = require('twilio')(twilioAccountSid, twilioAuthToken);
var UserProfile = Parse.Object.extend("UserProfile");
var global = require('cloud/global/global');
var sendgrid = require("sendgrid");
sendgrid.initialize("tricon_tracker", "tracker9");
var _ = require('underscore');
var Resource = Parse.Object.extend("Resources");



// API :: 1 "CreatedBy ABHIshek @ 3 JAN DEC :- Ping Api to check internet Connection
exports.welcome = function(req, res){
   res.send("successfully");
};
// API :: 2 "CreatedBy ABHIshek @ 3 JAN DEC :- To Create User
exports.register = function(req,res){
var userProfile = new UserProfile();
    var userRequestProfile = req.body;
    var countryCode = userRequestProfile.countryCode;
    var mobileNumber = userRequestProfile.mobile;
	console.log("mobileNumber"+mobileNumber+"countryCode"+countryCode);
	var fullContactNumber = countryCode.concat(mobileNumber);
	var registrationId = userRequestProfile.registrationId;
    var responseWrapper = new global.responseWrapper();
	var authenticationToken = mobileNumber+new Date().getTime();
    if(typeof countryCode == 'undefined' || countryCode == ''){
        responseWrapper.status = "error";
        responseWrapper.errorCode = Error.Track_701_errorCode;
        responseWrapper.errorMessage = Error.Track_701_errorMessage;
        res.setHeader(constant.ContentType,constant.applicationJson);
        res.send(responseWrapper);
    }
	if(typeof mobileNumber == 'undefined' ||  mobileNumber ==''){
        responseWrapper.status = "error";
		responseWrapper.errorCode = Error.Track_702_errorCode;
        responseWrapper.errorMessage = Error.Track_702_errorMessage;
        res.setHeader(constant.ContentType,constant.applicationJson);
        res.send(responseWrapper);
    }
	else{
		var query = new Parse.Query("UserProfile");
        query.equalTo("mobileNumber", mobileNumber);
		query.equalTo("countryCode", countryCode);
        query.find({
          success: function(results) {
		    if(typeof results === 'undefined' || results.length === 0){
			   console.log("Inside if");
			   userProfile.set("countryCode",countryCode);
			   userProfile.set("mobileNumber",mobileNumber);
			   userProfile.set("fullContactNumber",fullContactNumber);
			   userProfile.set("userAuthenticationToken",authenticationToken);
			   userProfile.set("registrationId",registrationId);
               userProfile.set("mobileVerified",false);
               userProfile.set("isActive",false);
               userProfile.set("isEmailVerified",false);
			   userProfile.save(null, {
				success: function(userProfile) {
				console.log("Inside save success");
					exports.getUserByMobileNumber(mobileNumber,countryCode,req,res);
					},
				error: function(userProfile, error) {
				console.log("Inside save error");
					exports.getUserByMobileNumber(mobileNumber,countryCode,req,res);
				}
			 });
            }else{
			console.log("Inside else");
			     var userId = results[0].id;
				 console.log("userId"+userId);
				 userProfile.set("objectId",userId);
				 userProfile.set("registrationId",registrationId);
			     userProfile.set("mobileVerified",false);
                 userProfile.set("userAuthenticationToken",authenticationToken);
				 userProfile.save(null, {
				 success: function(userProfile) {
				 console.log("Inside else save success");
					exports.getUserByMobileNumber(mobileNumber,countryCode,req,res);
					},
				 error: function(userProfile, error) {
				 console.log("Inside else save error");
					exports.getUserByMobileNumber(mobileNumber,countryCode,req,res);
				}
			 });
                
            }
          },
          error: function(error) {
		  console.log("Inside global error ");
            responseWrapper.status = "error";
            responseWrapper.errorMessage = Error.Track_700_errorCode;
            responseWrapper.errorMessage = error.message;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
          }
        });
		
    }
};
// API :: 3 "CreatedBy ABHIshek @ 3 JAN DEC :- To Retrieve User
exports.user = function(req,res){
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    var responseWrapper = new global.responseWrapper();
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    var query = new Parse.Query("UserProfile");
    query.equalTo("userAuthenticationToken", userAuthenticationToken);
	query.find().then(function(users){
            if((typeof users == 'undefined' || users == '')){
				responseWrapper.errorCode = Error.Track_703_errorCode;
		        responseWrapper.errorMessage = Error.Track_703_errorMessage;
            }
			else{
            console.log(JSON.stringify(users));
			var user = users[0];
			var currentUser = parseUserFromUserProfile(user);
			return currentUser;
            }
    }).then(function(currentUser){
			responseWrapper.response.user = currentUser;	
			responseWrapper.status = "success";
			res.setHeader('Content-Type', 'application/json');
			res.send(responseWrapper);
	},function(error){
			console.log("error 2");
			responseWrapper.error = error;
			responseWrapper.status = "error";
			res.setHeader('Content-Type', 'application/json');
			res.send(responseWrapper);
	});
     
}
// API :: 4 "CreatedBy ABHIshek @ 3 JAN DEC :- To Update User
exports.update = function(req,res){
    var userProfile = new UserProfile();
    var emailCode  = randomNo();
	console.log(emailCode);
	var user = req.body;
	console.log(user);
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    var toSendMail = false;
    var responseWrapper = new global.responseWrapper();
	var responseUser;
    if(typeof userAuthenticationToken === 'undefined'){
        console.log("Can't query");
        console.log("Inside global error ");
		responseWrapper.status = "error";
		responseWrapper.errorCode = Error.Track_703_errorCode;
		responseWrapper.errorMessage = Error.Track_703_errorMessage;
	}else{
        var query = new Parse.Query("UserProfile");
        query.equalTo("userAuthenticationToken", userAuthenticationToken);
		query.find().then(function(results){
            if(typeof results[0] === 'undefined' || results[0] === null){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_703_errorCode;
		        responseWrapper.errorMessage = Error.Track_703_errorMessage;
			}else{
				var currentUser = results[0];
				var prevEmail = currentUser.get("email");
                var uiid = currentUser.id;				
				toSendMail = (prevEmail !== user.email);
				if(toSendMail){
					currentUser.set("isEmailVerified",false);
				}
				var data = user.profilePicture.data;
				var name = user.profilePicture.name;
				console.log(data);
				var fileObject = new Parse.File(name,{base64 : data});
                console.log(JSON.stringify(fileObject));
     			currentUser.set("resource",fileObject);
				currentUser.set("firstName",user.firstName);
                currentUser.set("lastName",user.lastName);
                currentUser.set("email",user.email);
				currentUser.set("emailCode",emailCode); 
				currentUser.set("image",user.profilePicture);
				return currentUser.save();
            }  
          },
          function(error) {
            responseWrapper.status = "error";
            responseWrapper.errorMessage = error.message;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
          }).then(function(user){
			console.log("started  "+toSendMail);
			if(toSendMail){
				var recepient = [];
				recepient.push(user.get("email"));
				return sendgrid.sendEmail({
					to: recepient,
					from: "admin@hogwarts.com",
					subject: "Welcome to Hogwarts!",
						html: "<h3>Your Hogwarts emailId is updated!</h3> Please <a href='https://hogwarts001.parseapp.com/hogwarts/user/"+user.id+"/mail/"+emailCode+"'>click here</a> to verify your email address",
					replyto: "admin@hogwarts.com"
				});
			}else{
				return user;
			}
		}).then(function(httpResponse) {
		    console.log("Email sent!");
			responseWrapper.status = "success";
			responseWrapper.response = "success";
			res.setHeader(constant.ContentType,constant.applicationJson);
			res.send(responseWrapper);
		},function(httpResponse) {
			responseWrapper.response = "success";
			console.log("Uh oh, something went wrong");
			responseWrapper.status = "error";
			res.setHeader(constant.ContentType,constant.applicationJson);
			res.send(responseWrapper);
		});
    }
}
// API :: 5 "CreatedBy ABHIshek @ 3 JAN DEC :- To Upload Image
exports.uploadResource = function(req,res){
    var file = req.body;
    var uiid = req.params.uiid;
    console.log(file);
    console.log("The true user : "+JSON.stringify(req.headers.user));
    var responseWrapper = new global.responseWrapper();
	console.log(file);
    var fileObject = new Parse.File(file.name,{base64:file.data});
    var resource = new Resource();
    var query = new Parse.Query("Resources");
    query.equalTo("uiid", uiid);
    query.find().then(function(resources){
        if(resources.length > 0){
            resource = resources[0];
        }else{
            resource.set("uiid",uiid);
        }
        resource.set("resource",fileObject);
        return resource.save();
    }).then(function(resource){
        var resourceResponse = {};
        resourceResponse.uiid = uiid;
        resourceResponse.url = resource.get("resource").url();
        console.log(resource.get("resource").url());
        responseWrapper.response = resourceResponse;
        responseWrapper.status = "success";
        res.setHeader(constant.ContentType,constant.applicationJson);
        res.send(responseWrapper);
    },function(error){
        responseWrapper.status = "error";
		responseWrapper.errorCode = Error.Track_707.errorCode;
		responseWrapper.errorMessage = Error.Track_707.errorMessage;
        responseWrapper.errorDescription = error;
		res.setHeader(constant.ContentType,constant.applicationJson);
		res.send(responseWrapper);
    });
    
}
// API :: 6 "CreatedBy ABHIshek @ 3 JAN DEC :- To Verify Mail
exports.mailVerify = function(req,res){
	var emailCode = req.params.emailCode;
	var objectId = req.params.userId;
	console.log("user Id "+objectId);
	console.log("   "+objectId+"   "+emailCode+typeof(objectId)+typeof(parseInt(emailCode,10)));
	var userprofile = new UserProfile();
	var query = new Parse.Query("UserProfile");
        query.equalTo("emailCode", parseInt(emailCode,10));
		query.equalTo("objectId",objectId);
        query.find({
		  success: function(result) {
			console.log(result);
			console.log(result[0]);
            var result = result[0];  
            if(typeof result === 'undefined' || result === null){
                return null;
            }else{
                result.set("isEmailVerified",true);
                return result.save();
            }  
          },
          error: function(error) {
            console.log("Error: " + error);
			res.setHeader('Content-Type', 'text/html');
			res.send("<h2>Oops!! something unexpected happened. Please resend the verification mail</h2>");
          }
        }).then(function(user){
			var user = user[0];
			res.setHeader('Content-Type', 'text/html');
			if(user == null){
				res.send("<h2>Oops!! something unexpected happened. Please resend the verification mail</h2>");
			}else{
				res.send("<h3>Dear "+user.get("firstName")+", Your email is verified successfully!!</h3>");
			}
		});
}
// API :: 7 "CreatedBy ABHIshek @ 3 JAN DEC :- To Generate four digit Random No.
randomNo = function(){
  var min = 1000; var max = 9999;
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};
  
// API :: 8 "CreatedBy ABHIshek @ 3 JAN DEC :- To Generate OTP
exports.generateOTP = function(req, res){
    var responseWrapper = new global.responseWrapper();
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile();    
    var query = new Parse.Query(userdetails);
    query.equalTo("userAuthenticationToken",userAuthenticationToken); // Fetch the userId here
    query.find({
                success:function(results){
					if(results.length===0){
						responseWrapper.status = "error";
						responseWrapper.errorCode = Error.Track_703_errorCode;
						responseWrapper.errorMessage = Error.Track_703_errorMessage;
						res.setHeader(constant.ContentType,constant.applicationJson);  
					    res.send(responseWrapper);
					}
					else{
                    var num = randomNo();// taking from Function
                    var parsedUserDetails = results[0];
                    var object = parsedUserDetails;
                    var arr = [];
                    var OTP_codeArray = object.get("OTP_code");
                    console.log("OTP_codeArray"+OTP_codeArray);
                    //Storing last three OTP in array
                    if (typeof OTP_codeArray != "undefined"){
                    var len= OTP_codeArray.length;
                    arr.push(OTP_codeArray[1]);
                    arr.push(OTP_codeArray[2]);
                    arr.push(num);
                    console.log(arr[0]+"last"+arr[1]+"second"+arr[2]+"first");
                    }
 
                    if (typeof OTP_codeArray == "undefined"){
                        parsedUserDetails.set("OTP_code",[]);
                        console.log("parsedUserDetails"+JSON.stringify(parsedUserDetails));
                        arr.push(null);
						arr.push(null);
						arr.push(num);
                        console.log("first null"+ JSON.stringify(arr));
                    }
                    console.log(JSON.stringify(arr)+"Our Array");
                    parsedUserDetails.set("OTP_code",arr);
                    parsedUserDetails.set("mobileVerified",false);
                    parsedUserDetails.save();
                    var OTP_code = num;
                    var mobileNo= object.get("countryCode")+object.get("mobileNumber"); 
                    var num = OTP_code;
                       twilio.sendSms({
                                    from: '+16692311715',
                                    to: mobileNo,//Fetched the no.
                                    body: 'Your login code for Hogwarts is ' + num
                                    }, function(err, responseData) {
                                    if (err) {
                                    console.log(err);
                                    }
                                    else {
                                    console.log("error");
                                    }
                                  }); 
                    
                    responseWrapper.status = "success";
                    responseWrapper.response = "success";
                    res.send(responseWrapper);
					}
                },
                error:function(error){
                    console.log('Query Error: ' + error.message);
                     responseWrapper.status = "error";
					 responseWrapper.errorCode = Error.Track_703_errorCode;
		             responseWrapper.errorMessage = Error.Track_703_errorMessage;
                     res.send(responseWrapper);
                }
    });
};
// API :: 9 "CreatedBy ABHIshek @ 3 JAN DEC :- To Verify the OTP
exports.verifyOTP = function(req, res){
        var responseWrapper = new global.responseWrapper();
        var verifiedDetails = req.body;
        var userAuthenticationToken = req.headers.userauthenticationtoken;
		var userverification = {};
        var userVerificationDetails = new UserProfile();
		console.log("userauthenticationtoken"+userAuthenticationToken);
        var query = new Parse.Query(userVerificationDetails);
        query.equalTo("userAuthenticationToken",userAuthenticationToken);
	    query.find().then(function(results){
			console.log()
            userverification = results[0];
			console.log(JSON.stringify(userverification))
			var OTP_code = userverification.get("OTP_code");
			var verifiedCode = verifiedDetails.otp;//Fetch user input here
			console.log("verifiedCode"+verifiedCode+"OTP_code[2] "+ OTP_code[2] + "OTP_code[1]" + OTP_code[1] + "OTP_code[0]" + OTP_code[0] )
			if (OTP_code[2]== verifiedCode){
					console.log("log in ");
					responseWrapper.status = "success";
					console.log("userverification"+JSON.stringify(userverification));
					exports.updateUser(userverification.id);
				   // console.log("status "+status);
					responseWrapper.response = "success"
					//responseWrapper.response.user.userId = userverification.get("objectId");
					var value = true;
				}
				else if (OTP_code[0] == verifiedCode){
					console.log("log out due to previous OTP");
					responseWrapper.status = "error";
					responseWrapper.errorCode = Error.Track_704_errorCode;
                    responseWrapper.errorMessage = Error.Track_704_errorMessage;
					responseWrapper.errorDescription = "";
					responseWrapper.response = null;
					var value = false;
					
				}
					else if (OTP_code[1] == verifiedCode){
					console.log("log out due to previous OTP");
					responseWrapper.status = "error";
					responseWrapper.errorCode = Error.Track_704_errorCode;
                    responseWrapper.errorMessage = Error.Track_704_errorMessage;
					responseWrapper.errorDescription = "";
					responseWrapper.response = null;
					var value = false;
					
				}
				if (OTP_code[0] != verifiedCode && OTP_code[1] != verifiedCode && OTP_code[2] != verifiedCode ){
					console.log("log out due to invalid OTP");
					responseWrapper.status = "error";
					responseWrapper.errorCode = Error.Track_705_errorCode;
		            responseWrapper.errorMessage = Error.Track_705_errorMessage;
					responseWrapper.errorDescription = "";
					responseWrapper.response = null;
					var value = false;
				}
				return value;
        }).then(function(value){
			console.log(value+"value");
			var queryTwo = new Parse.Query(userVerificationDetails);
			queryTwo.equalTo("userAuthenticationToken",userAuthenticationToken);
			queryTwo.find().then(function(result){
				result[0].set("mobileVerified",value);
				return result[0].save();
		}).then(function(result){
            res.setHeader(constant.ContentType,constant.applicationJson);  
			res.send(responseWrapper);
        },function(error){
			responseWrapper.error = error;
			responseWrapper.status = "error";
			res.setHeader(constant.ContentType,constant.applicationJson);  
			res.send(responseWrapper);
        });
})
};
// API :: 10 "CreatedBy ABHIshek @ 3 JAN DEC :- To fetch info of given members using userId or mobileNumber 
exports.buddyDetailsByUserId = function(req, res){
	var queryParams = req.query.search;
	console.log("queryParams"+queryParams);
    var membersUserIdArray = req.body;
	var responseWrapper = new global.responseWrapper();
    var userAuthenticationToken = req.headers.userauthenticationtoken;
	var userProfile = new UserProfile();
    var query = new Parse.Query("UserProfile");
    query.equalTo("userAuthenticationToken",userAuthenticationToken);
	query.find().then(function(user){
        if(typeof user[0] === 'undefined'){
        responseWrapper.status = "error";
        responseWrapper.errorCode = Error.Track_703_errorCode;
		responseWrapper.errorMessage = Error.Track_703_errorMessage;
		}
        currentUser = user[0];
    return currentUser;
    }).then(function(currentUser){
    var userProfile = new UserProfile();
    var querytwo = new Parse.Query(userProfile);
	if(queryParams=="id"){
		console.log ("queryParams is id");
	    querytwo.containedIn("objectId", membersUserIdArray);
    }
	else if(queryParams=="mobile"){
		console.log ("queryParams is mobile");
	    querytwo.containedIn("fullContactNumber", membersUserIdArray);
	}
    return querytwo.find()
    }).then(function(allUsersFromUserId){
        var alluserProfiles = [];
        var userProfile = {};
        var x = allUsersFromUserId.length;
		
		for (var i=0; i<x;i++){
		
		userProfile = parseUserFromUserProfileByUserId(allUsersFromUserId[i]);	
		
		alluserProfiles.push(userProfile);
		
		userProfile = {};
		}
	responseWrapper.status = "success";
	responseWrapper.response = alluserProfiles;
	res.setHeader(constant.ContentType,constant.applicationJson);  
	res.send(responseWrapper);	
    },function(error){
					console.log("error 2");
					responseWrapper.errorCode = Error.Track_703_errorCode;
					responseWrapper.errorMessage = Error.Track_703_errorMessage;
					responseWrapper.status = "error";
					res.setHeader(constant.ContentType,constant.applicationJson);  
					res.send(responseWrapper);
    });
};
// API :: 11 "CreatedBy ABHIshek @ 3 JAN DEC :- To send invitation
exports.sendInvitation = function(req, res){
console.log("coming to invite");
var responseWrapper = new global.responseWrapper();
var mobileNumber = req.params.mobileNumber;
console.log(mobileNumber);
var userAuthenticationToken = req.headers.userauthenticationtoken;
var query = new Parse.Query("UserProfile");
query.equalTo("userAuthenticationToken", userAuthenticationToken);
query.find().then(function(results){

	 if(typeof results[0] === 'undefined' || results[0] === null){
					responseWrapper.status = "error";
					responseWrapper.errorCode = Error.Track_703_errorCode;
					responseWrapper.errorMessage = Error.Track_703_errorMessage;
					
	 }
	 else{
	      currentUser = results[0];
          return currentUser;	 
	 }
	 
}).then(function(currentUser){
	mobileNumber =''+mobileNumber;
	console.log(mobileNumber);
	console.log(JSON.stringify(currentUser));
	var msg = "Your friend"+currentUser.get("firstName")+" "+currentUser.get("lastName")+"has invited you over tricon Tracker. Please download our App from the following link. Sender Mobile Number:" + currentUser.fullContactNumber +".";
	 twilio.sendSms({
			from: '+16692311715',
			to: mobileNumber,//Fetched the no.
			body: 'Your friend has invited you over Tricon Tracker. Click over the following link to install.Sender Name:'+currentUser.get("firstName")+' '+currentUser.get("lastName")
			}, function(err, responseData) {
			if (err) {
			console.log(err);
			}
			else {
			console.log("error");
			}
		  }); 
		console.log("hello");
}).then(function(mobileNumber){
    responseWrapper.status = "success";
	responseWrapper.response = "success";
	res.setHeader(constant.ContentType,constant.applicationJson);  
	res.send(responseWrapper);	
    },function(error){
					console.log("error 2");
					responseWrapper.errorCode = Error.Track_703_errorCode;
					responseWrapper.errorMessage = Error.Track_703_errorMessage;
					responseWrapper.status = "error";
					res.setHeader(constant.ContentType,constant.applicationJson);  
					res.send(responseWrapper);
    });
};  




// API :: 12 "CreatedBy ABHIshek @ 3 JAN DEC :- To fetch User Details By mobileNumber
exports.getUserByMobileNumber = function(mobile,countryCode,req, res){
var responseWrapper = new global.responseWrapper();
    if(typeof mobile !== 'undefined'){
        var query = new Parse.Query("UserProfile");
        query.equalTo("mobileNumber", mobile);
		query.equalTo("countryCode", countryCode);
        query.find({
          success: function(results) {
            console.log("Successfully retrieved " + results.length + " scores.");
            if(typeof results === 'undefined' || results.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_702_errorCode;
                responseWrapper.errorMessage = Error.Track_702_errorMessage;
            }else{
                responseWrapper.response.user = parseUserFromUserProfileForRegistration(results[0]);
                responseWrapper.status = "success";
            }
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
          },
          error: function(error) {
            responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_702_errorCode;
            responseWrapper.errorMessage = Error.Track_702_errorMessage;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
          }
        });
    }else{
        responseWrapper.status = "error";
        responseWrapper.errorMessage = "No valid user param passed";
        res.setHeader(constant.ContentType,constant.applicationJson);
        res.send(responseWrapper);
    }
}; 
// FUNCTION :: 1 "CreatedBy ABHIshek @ 3 JAN DEC :-  FETCHING USER DETAILS
var parseUserFromUserProfile = function(result){
    var user = {};  
    console.log(JSON.stringify(result)+"responseWrapper.response.user");
	user.userId= result.id;
    user.firstName = result.get("firstName");
    user.lastName = result.get("lastName");
    user.mobile = result.get("fullContactNumber");
    user.email = result.get("email");
    user.mobileVerified = result.get("mobileVerified");
	user.emailVerified = result.get("isEmailVerified");
	user.profilePicture = {};
	if(result.get("resource") != null){
	user.profilePicture.url  = result.get("resource").url();
	user.profilePicture.data  = result.get("profilePictureData");
	user.profilePicture.name  = result.get("profilePictureName");	
	}
	console.log(result.get("resource"));
	console.log(JSON.stringify(user)+"responseWrapper.response.user"+result.firstName);
    return user;
}
// FUNCTION :: 2 "CreatedBy ABHIshek @ 3 JAN DEC :- FETCHING USER DETAILS BY USERID
var parseUserFromUserProfileByUserId = function(result){
    var user = {};  
    //user.userId= result.get("objectId");//this returns undefined
    user.userId= result.id;
    user.firstName = result.get("firstName");
    user.lastName = result.get("lastName");
    user.mobile = result.get("fullContactNumber");
    user.lastSeen = result.get("lastSeen");
	user.isActive = result.get("isActive");
	user.profilePicture = {};
	if(result.get("resource") != null){
	user.profilePicture.url  = result.get("resource").url();
	user.profilePicture.data  = result.get("profilePictureData");
	user.profilePicture.name  = result.get("profilePictureName");	
	}
	console.log(result.get("resource"));
	
	return user;
}
// FUNCTION :: 3 "CreatedBy ABHIshek @ 3 JAN DEC :- FETCHING AFTER REGISTRATION
var parseUserFromUserProfileForRegistration = function(result){
    var user = new global.userWrapperForRegistration();
    user.userId= result.id;
    user.mobile = result.get("mobileNumber");
    user.countryCode = result.get("countryCode");
	user.mobileVerified = result.get("mobileVerified");
	user.userAuthenticationToken = result.get("userAuthenticationToken");
    return user;
}
// FUNCTION :: 4 "CreatedBy ABHIshek @ 3 JAN DEC :- UPDATING USER DETAILS
exports.updateUser = function(userId){
		var userProfile = new UserProfile();
		userProfile.set("objectId",userId);
		userProfile.set("mobileVerified",true);
		userProfile.set("isActive",true);
		console.log("Inside updateUser method  " +   userId  );
        userProfile.save(null, {
        success: function(userProfile) {
            console.log("Inside updateUser method  success" );
            },
        error: function(userProfile, error) {
             console.log("Inside updateUser method  failure" );
            }
        });
    
}
// FUNCTION :: 5 "CreatedBy ABHIshek @ 3 JAN DEC :- SENDING BUDDY DETAILS
var parseBuddyFromUserProfile = function(result){
    var user = new global.buddyWrapper();
    user.userId= result.id;
    var mobileNo = result.get("mobileNumber");
    var countryCode = result.get("countryCode");
	user.mobile = countryCode+mobileNo;
	console.log("countryCode+mobileNo"+countryCode+mobileNo);
	user.lastSeen = result.get("updatedAt");
	user.isActive = result.get("isActive");
	console.log("parsed user Info"+ JSON.stringify(user));
    return user;
}


 
