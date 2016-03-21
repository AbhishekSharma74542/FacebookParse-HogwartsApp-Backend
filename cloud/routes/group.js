var userprofile = require('cloud/routes/userprofile');
var Group = Parse.Object.extend("Groups");
var global = require('cloud/global/global');
var UserProfile = Parse.Object.extend("UserProfile");
var _ = require('underscore');
//API 3 :: Created and UpdatedBy Abhishek @7th DEC,2015 :- To create new Group.
    exports.createGroup = function(req, res){
    console.log("new Group..............")
    var responseWrapper = new global.responseWrapper();
    var group = new Group();
    var groupDetails = req.body;//
    console.log(JSON.stringify(groupDetails)+"groupDetails");
    var groupName = groupDetails.groupName;
    var uiid = groupDetails.uiid;
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    console.log("userAuthenticationToken"+userAuthenticationToken);
    var userProfile = new UserProfile();
    var query = new Parse.Query("userProfile");
    query.equalTo("userAuthenticationToken",userAuthenticationToken);
    // verifying if the user who send's the req exist or not
    query.find().then(function(users){
        if(typeof users[0] === 'undefined'){
            //no such user big guy
			responseWrapper.errorCode = Error.Track_703_errorCode;
		    responseWrapper.errorMessage = Error.Track_703_errorMessage;
			
        }
        currentUser = users[0];
    return userAuthenticationToken;
    }).then(function(userAuthenticationToken){
        var groupObj = new Group();
		console.log(groupDetails.profilePicture === 'undefined');
        if(groupDetails.profilePicture === 'undefined' || groupDetails.profilePicture === null){
			responseWrapper.errorCode = Error.Track_720_errorCode;
		    responseWrapper.errorMessage = Error.Track_720_errorMessage;
    	}
		else{
			var data = groupDetails.profilePicture.data;
            var name = groupDetails.profilePicture.name;
	        var fileObject = new Parse.File(name,{base64 : data});
			groupObj.set("imageObject",groupDetails.profilePicture);
			groupObj.set("resource",fileObject);
		}
		groupObj.set("note",groupDetails.note);
		groupObj.set("description",groupDetails.description);
		groupObj.set("name",groupName);
		groupObj.set("uiid",uiid);
        groupObj.set("userAuthenticationToken",userAuthenticationToken);
        return groupObj.save();
    }).then(function(groupObj){
        theGroup = groupObj;
        var groupId = groupObj.id;
        return groupId;
    }).then(function(groupId){
        _.each(arguments,function(argument){
            console.log(JSON.stringify(argument));
        });
        responseWrapper.response = groupId;
        responseWrapper.status = "success";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        responseWrapper.status = "error";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });
    }; 

//API 6 :: Created and UpdatedBy Abhishek @7th DEC,2015:- To fetch details of user's group.
exports.groupDetailsByUiid = function(req,res){
    var groupDetails = new Group();
    var responseWrapper = new global.responseWrapper();
    var uiid = req.params.uiid;
	console.log(uiid);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == '')){
				responseWrapper.errorCode = Error.Track_703_errorCode;
		        responseWrapper.errorMessage = Error.Track_703_errorMessage;
            }
			else{
            console.log(JSON.stringify(user));
            var currentUser = user;
			return currentUser;
            }
    }).then(function(currentUser){
                        console.log("promise1");
                        console.log(JSON.stringify(currentUser));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
                        console.log(uiid);
						queryone.equalTo("uiid", uiid);
                        queryone.find().then(function(group){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(group));
                                    return group;
                                }).then(function(group){
									
									    if(typeof group === 'undefined' || group.length === 0){
										responseWrapper.errorCode = Error.Track_720_errorCode;
		                                responseWrapper.errorMessage = Error.Track_720_errorMessage;
										}
										else{
										responseWrapper.response.group = parseFromGroup(group);	
										}
                                        
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
    });
     
}	
parseFromGroup = function(result){
    var groupInfo = {};  
    console.log(JSON.stringify(result)+"responseWrapper.response.user");
	groupInfo.groupId= result.id;
	groupInfo.note= result[0].get("note");
	groupInfo.description= result[0].get("description");
	groupInfo.status= result[0].get("status");
	groupInfo.groupName = result[0].get("name");
    groupInfo.uiid = result[0].get("uiid");
	groupInfo.profilePicture = {};
	if(result[0].get("resource") != null){
	groupInfo.profilePicture.url  = result[0].get("resource").url();
	groupInfo.profilePicture = {};
	groupInfo.profilePicture  = result[0].get("imageObject");
	}
	console.log(result[0].get("resource"));
	console.log(JSON.stringify(groupInfo)+"responseWrapper.response.user");
    return groupInfo;
}

exports.groupUpdate = function(req,res){
	var updateGroupDetails = req.body;
    var responseWrapper = new global.responseWrapper();
    var uiid = updateGroupDetails.uiid;
	console.log(uiid);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == ''))
			{
			responseWrapper.errorCode = Error.Track_703_errorCode;
		    responseWrapper.errorMessage = Error.Track_703_errorMessage;	
			}
            else{
            console.log(JSON.stringify(user));
            var currentUser = user;
			return currentUser;
            }
    }).then(function(currentUser){
                        console.log("promise1");
                        console.log(JSON.stringify(currentUser));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
                        console.log(uiid);
						queryone.equalTo("uiid", uiid);
                        queryone.find().then(function(group){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(group));
                                    return group;
                                }).then(function(group){
									    if(typeof group === 'undefined' || group.length === 0){
										responseWrapper.errorCode = Error.Track_720_errorCode;
		                                responseWrapper.errorMessage = Error.Track_720_errorMessage;	
										}
										else{
										var savedGroup = updateInGroup(group,updateGroupDetails);
										console.log(JSON.stringify(savedGroup));
										return savedGroup;
										}
										}).then(function(group){
									    responseWrapper.response = "success";
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
    });
     
}	

updateInGroup = function(results,updateGroupDetails){
        var result = results[0];
		console.log(updateGroupDetails.profilePicture === 'undefined');
        if(updateGroupDetails.profilePicture === 'undefined' || updateGroupDetails.profilePicture === null){
			
    	}
		else{
			var data = updateGroupDetails.profilePicture.data;
            var name = updateGroupDetails.profilePicture.name;
	        var fileObject = new Parse.File(name,{base64 : data});
			result.set("imageObject",updateGroupDetails.profilePicture);
			result.set("resource",fileObject);
		}
		result.set("groupName",updateGroupDetails.groupName);
		result.set("uiid",updateGroupDetails.uiid);
		result.set("status",updateGroupDetails.status);
		result.set("description",updateGroupDetails.description);
		result.set("note",updateGroupDetails.note);
		return result.save();
}

exports.deleteGroup = function(req,res){
	var responseWrapper = new global.responseWrapper();
    var memberDetails = req.body;
    var memberNumberToDelte = [];
    var uiid = req.params.uiid;
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    console.log("userAuthenticationToken"+userAuthenticationToken);
    var userProfile = new UserProfile();
    var query = new Parse.Query("userProfile");
    query.equalTo("userAuthenticationToken",userAuthenticationToken);
    // verifying if the user who send's the req exist or not
    query.find().then(function(users){
        if(typeof users[0] === 'undefined'){
            //no such user big guy
		responseWrapper.errorCode = Error.Track_703_errorCode;
		responseWrapper.errorMessage = Error.Track_703_errorMessage;
        }
        currentUser = users[0];
    return currentUser;
    }).then(function(currentUser){
		var groupDetails = new Group();
		var queryThree = new Parse.Query(groupDetails);
		queryThree.equalTo("uiid", uiid);
		return queryThree.find()
	}).then(function(groups){
		var group = groups[0];
		if(typeof group === 'undefined'){
            //no such user big guy
		responseWrapper.errorCode = Error.Track_720_errorCode;
		responseWrapper.errorMessage = Error.Track_720_errorMessage;
        }
		else{
		var groupMember = [];
        groupMember = group.get("member");
        if(groupMember.length === 1){
			console.log(groupMember);
			group.destroy({});
		}	
		}
		return uiid;    
    }).then(function(result){
        _.each(arguments,function(argument){
            console.log(JSON.stringify(argument));
        });
        responseWrapper.response = "success";
        responseWrapper.status = "success";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        responseWrapper.status = "error";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });
};


//API 5 :: Created and UpdatedBy Abhishek @7th DEC,2015 :- To delete a given user from the Group.
exports.exitGroup = function(req, res){
    var responseWrapper = new global.responseWrapper();
    var uiid = req.params.uiid;
    var userAuthenticationToken = req.headers.userauthenticationtoken;
	console.log("userAuthenticationToken"+userAuthenticationToken);
    var userProfile = new UserProfile();
    var query = new Parse.Query("UserProfile");
    query.equalTo("userAuthenticationToken",userAuthenticationToken);
    // verifying if the user who send's the req exist or not
    query.find().then(function(users){
		console.log(JSON.stringify(users));
        if(typeof users[0] === 'undefined'){
            //no such user big guy
			responseWrapper.errorCode = Error.Track_703_errorCode;
	 	    responseWrapper.errorMessage = Error.Track_703_errorMessage;
        }
		var currentUser = users[0];
		console.log(JSON.stringify(currentUser));
		var userId = currentUser.id;
        console.log(userId);
		return userId;
    }).then(function(userId){
	console.log(userId);
    var groupDetails = new Group();
    var querytwo = new Parse.Query(groupDetails);
    querytwo.equalTo("uiid", uiid);
    return querytwo.find().then(function(groups){
		console.log(userId);
		if(typeof groups[0] === 'undefined'){
            //no such user big guy
			responseWrapper.errorCode = Error.Track_719_errorCode;
		    responseWrapper.errorMessage = Error.Track_719_errorMessage;
        }
		var group = groups[0];
        var groupMember = [];
        groupMember = group.get("member");
        var memberToDelete = [];
		memberToDelete.push(userId);
		console.log(memberToDelete);
		var newGroup = [];
        newGroup = _.difference(groupMember, memberToDelete);
        console.log("memberNumberToDelte"+memberToDelete);
        group.set("member",newGroup);
        return group.save();    
    })
	}).then(function(result){
        responseWrapper.response = "success";
        responseWrapper.status = "success";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        responseWrapper.status = "error";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });
};




exports.groupDetailsByUser = function(req,res){
    var groupDetails = new Group();
    var responseWrapper = new global.responseWrapper();
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == '')){
				responseWrapper.errorCode = Error.Track_703_errorCode;
		        responseWrapper.errorMessage = Error.Track_703_errorMessage;
            }
			else{
            console.log(JSON.stringify(user));
            var currentUser = user[0];
			var userId = currentUser.id;
			console.log("here userID"+userId);
			return userId;
            }
    }).then(function(userId){
                        console.log("promise1");
                        console.log(JSON.stringify(userId));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
						var myUserIdArray = [];
						myUserIdArray.push(userId);
                        queryone.containedIn("member", myUserIdArray);
                        queryone.find().then(function(groups){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(groups));
                                    return groups;
                                }).then(function(groups){
									    if(typeof groups === 'undefined' || groups.length === 0){
										responseWrapper.errorCode = Error.Track_720_errorCode;
		                                responseWrapper.errorMessage = Error.Track_720_errorMessage;
										}
										else{
										var myGroupsArray = [];
										
										_.each(groups, function(group){
											console.log("group....../////////...................."+JSON.stringify(group));
											var myGroupArray = [];
											myGroupArray.push(group);
											console.log("myGroupArray.........................."+JSON.stringify(myGroupArray));
											myGroupsArray.push(parseFromGroup(myGroupArray))
											console.log("myGroupsArray.........................."+JSON.stringify(myGroupsArray));
										});
										responseWrapper.response.group = myGroupsArray;
										}
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
    });
     
}	
parseFromGroup = function(result){
    var groupInfo = {};  
    console.log(JSON.stringify(result)+"responseWrapper.response.user");
	groupInfo.groupId= result[0].id;
	groupInfo.note= result[0].get("note");
	groupInfo.description= result[0].get("description");
	groupInfo.status= result[0].get("status");
	groupInfo.groupName = result[0].get("name");
    groupInfo.uiid = result[0].get("uiid");
	groupInfo.profilePicture = {};
	if(result[0].get("resource") != null){
	groupInfo.profilePicture.url  = result[0].get("resource").url();
	groupInfo.profilePicture = {};
	groupInfo.profilePicture  = result[0].get("imageObject");
	}
	console.log(result[0].get("resource"));
	console.log(JSON.stringify(groupInfo)+"responseWrapper.response.user");
    return groupInfo;
}


exports.addMemberToGroup = function(req,res){
	var addMemberDetails = req.body;
    var responseWrapper = new global.responseWrapper();
    var uiid = req.params.uiid;
	console.log(uiid);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == ''))
			{
			responseWrapper.errorCode = Error.Track_703_errorCode;
		    responseWrapper.errorMessage = Error.Track_703_errorMessage;	
			}
            else{
            console.log(JSON.stringify(user));
            var currentUser = user;
			return currentUser;
            }
    }).then(function(currentUser){
                        console.log("promise1");
                        console.log(JSON.stringify(currentUser));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
                        console.log(uiid);
						queryone.equalTo("uiid", uiid);
                        queryone.find().then(function(group){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(group));
                                    return group;
                                }).then(function(group){
									    if(typeof group === 'undefined' || group.length === 0){
										responseWrapper.errorCode = Error.Track_720_errorCode;
		                                responseWrapper.errorMessage = Error.Track_720_errorMessage;	
										}
										else{
										var savedGroup = addMemberInGroup(group,addMemberDetails);
										console.log(JSON.stringify(savedGroup));
										return savedGroup;
										}
										}).then(function(group){
									    responseWrapper.response = "success";
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
    });
     
}	

addMemberInGroup = function(results,allMembers){
        console.log(JSON.stringify(results));
        console.log(JSON.stringify(allMembers));
		var result = results[0];
		var exitingMember = [];
		exitingMember = result.get("member");
		var newMebersDetailArray = [];
		var newMebersArray = [];
		_.each(allMembers, function(member){
			   
				newMebersDetailArray.push(member);
				console.log(member.memberId);
				newMebersArray.push(member.memberId);
				});
	result.set("memberMetaData",newMebersDetailArray);
	console.log("///////////////"+JSON.stringify(exitingMember)+" "+JSON.stringify(newMebersArray)+" "+exitingMember+" "+newMebersArray);
	result.set("member",_.union(exitingMember,newMebersArray));	
	return result.save();
}

exports.deleteMemberFromGroup = function(req,res){
	var deleteMemberDetails = req.body;
    var responseWrapper = new global.responseWrapper();
    var uiid = req.params.uiid;
	console.log(uiid);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == ''))
			{
			responseWrapper.errorCode = Error.Track_703_errorCode;
		    responseWrapper.errorMessage = Error.Track_703_errorMessage;	
			}
            else{
            console.log(JSON.stringify(user));
            var currentUser = user;
			return currentUser;
            }
    }).then(function(currentUser){
                        console.log("promise1");
                        console.log(JSON.stringify(currentUser));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
                        console.log(uiid);
						queryone.equalTo("uiid", uiid);
                        queryone.find().then(function(group){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(group));
                                    return group;
                                }).then(function(group){
									    if(typeof group === 'undefined' || group.length === 0){
										responseWrapper.errorCode = Error.Track_720_errorCode;
		                                responseWrapper.errorMessage = Error.Track_720_errorMessage;	
										}
										else{
										var savedGroup = deleteMemberInGroup(group,deleteMemberDetails);
										console.log(JSON.stringify(savedGroup));
										return savedGroup;
										}
										}).then(function(group){
									    responseWrapper.response = "success";
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
    });
     
}	

deleteMemberInGroup = function(results,members){
	console.log(JSON.stringify(results));
	console.log(JSON.stringify(members));
	var result = results[0];
	var exitingMember = [];
	exitingMember = result.get("member");
	console.log("existingMember"+exitingMember);
	console.log("Memberto Delete"+members);
	result.set("member",_.difference(exitingMember,members));	
	return result.save();
}

exports.updateMember = function(req,res){
	var updateMemberDetails = req.body;
    var responseWrapper = new global.responseWrapper();
    var uiid = req.params.uiid;
	console.log(uiid);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == ''))
			{
			responseWrapper.errorCode = Error.Track_703_errorCode;
		    responseWrapper.errorMessage = Error.Track_703_errorMessage;	
			}
            else{
            console.log(JSON.stringify(user));
            var currentUser = user;
			return currentUser;
            }
    }).then(function(currentUser){
                        console.log("promise1");
                        console.log(JSON.stringify(currentUser));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
                        console.log(uiid);
						queryone.equalTo("uiid", uiid);
                        queryone.find().then(function(group){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(group));
                                    return group;
                                }).then(function(group){
									    if(typeof group === 'undefined' || group.length === 0){
										responseWrapper.errorCode = Error.Track_720_errorCode;
		                                responseWrapper.errorMessage = Error.Track_720_errorMessage;	
										}
										else{
										var savedGroup = updateMemberToGroup(group,updateMemberDetails);
										console.log(JSON.stringify(savedGroup));
										return savedGroup;
										}
										}).then(function(group){
									    responseWrapper.response = "success";
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
    });
     
}	

updateMemberToGroup = function(results,allMembers){
        console.log(JSON.stringify(results));
        console.log(JSON.stringify(allMembers));
		var result = results[0];
		var newMebersDetailArray = [];
		var newMebersArray = [];
		_.each(allMembers, function(member){
			   
				newMebersDetailArray.push(member);
				console.log(member.memberId);
				newMebersArray.push(member.memberId);
				});
	result.set("memberMetaData",newMebersDetailArray);
	console.log("///////////////"+" "+JSON.stringify(newMebersArray)+" "+" "+newMebersArray);
	result.set("member",newMebersArray);	
	return result.save();
}




exports.groupMemberDetails = function(req,res){
	var updateMemberDetails = req.body;
    var responseWrapper = new global.responseWrapper();
    var uiid = req.params.uiid;
	console.log(uiid);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
    var userdetails = new UserProfile(); 
    var query = new Parse.Query(userdetails);
    query.equalTo('userAuthenticationToken', userAuthenticationToken);
    query.find().then(function(user){
            if((typeof user == 'undefined' || user == ''))
			{
			responseWrapper.errorCode = Error.Track_703_errorCode;
		    responseWrapper.errorMessage = Error.Track_703_errorMessage;	
			}
            else{
            console.log(JSON.stringify(user));
            var currentUser = user;
			return currentUser;
            }
    }).then(function(currentUser){
                        console.log("promise1");
                        console.log(JSON.stringify(currentUser));
                        var groupDetails = new Group();
                        console.log(JSON.stringify(groupDetails)+JSON.stringify(Group));                        
                        var queryone = new Parse.Query(groupDetails);
                        console.log(userAuthenticationToken+"userAuthenticationToken");
                        console.log(uiid);
						queryone.equalTo("uiid", uiid);
                        queryone.find().then(function(groups){
                                    console.log("success 1");
                                    console.log("group"+JSON.stringify(groups));
                                    var group = groups[0];
									var existingGroupMember = group.get("member");
									console.log("existingGroupMember"+existingGroupMember);
									return existingGroupMember;
                                }).then(function(existingGroupMember){
									console.log(existingGroupMember);
									var allUserDetails = [];
									var userdetailsInfo = new UserProfile(); 
									var querytwo = new Parse.Query("UserProfile");
									querytwo.containedIn("objectId", existingGroupMember);
									querytwo.find().then(function(users){
									console.log("users"+JSON.stringify(users));
									_.each(users, function(user){
			                        allUserDetails.push(parseUserFromUserProfile(user));
									});	
									})
									return allUserDetails;
								}).then(function(allUserDetails){
									    responseWrapper.response = allUserDetails;
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

});
}
var parseUserFromUserProfile = function(result){
    var user = {};  
    //user.userId= result.get("objectId");//this returns undefined
    console.log(JSON.stringify(result)+"responseWrapper.response.user");
	user.userId= result.id;
    user.firstName = result.get("firstName");
    user.lastName = result.get("lastName");
    user.mobile = result.get("mobileNumber");
    user.email = result.get("email");
    user.countryCode = result.get("countryCode");
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




























/* exports.updateMemberTogroup = function(req, res){
    var responseWrapper = new global.responseWrapper();
    var memberDetails = req.body;
    var membersToAdd = [];
    var membersToAdd = memberDetails.newMembers;
    var myGroupMemberToAdd = [];
    var x = membersToAdd.length;
        for(var i=0;i<x;i++){
             
            myGroupMemberToAdd.push(membersToAdd[i].substr(3));
        }
    membersToAdd = myGroupMemberToAdd;
    var groupName = memberDetails.groupName;
    console.log("memberDetails.groupName"+memberDetails.groupName+"groupName"+groupName);
    var memberNumberToDelte = [];
    var memberNumberToDelte = memberDetails.removeMembers;
    var myGroupMemberToDelete = [];
    var y = memberNumberToDelte.length;
        for(var i=0;i<y;i++){
             
            myGroupMemberToDelete.push(memberNumberToDelte[i].substr(3));
        }
    memberNumberToDelte = myGroupMemberToDelete;
    var uiId = memberDetails.uiid;
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    console.log("userAuthenticationToken"+userAuthenticationToken);
    var userProfile = new UserProfile();
    var querythree = new Parse.Query("userProfile");
    querythree.equalTo("userAuthenticationToken",userAuthenticationToken);
    // verifying if the user who send's the req exist or not
    querythree.find().then(function(users){
        if(typeof users[0] === 'undefined'){
            //no such user big guy
        }
        currentUser = users[0];
    return userAuthenticationToken;
    }).then(function(userAuthenticationToken){
    var responseWrapper = new global.responseWrapper();
    var groupDetails = new Group();
    var theGroup;
    var query = new Parse.Query(groupDetails);
    query.equalTo("uiid", uiId);
    return query.find()
    }).then(function(groups){
         
        var groupId = groups[0].id;
        var groupMember = [];
        groupMember = groups[0].get("groupMember");
         
        _.each(membersToAdd,function(memberNumber){
            groupMember.push(memberNumber);
        });
        var newGroup = [];
        newGroup = _.difference(groupMember, memberNumberToDelte);
        console.log("memberNumberToDelte"+memberNumberToDelte);
        groups[0].set("groupMember",newGroup);
        groups[0].set("groupName",groupName);
        return groups[0].save();    
    }).then(function(group){
        theGroup = group;
        var groupId = group.id;
        var queryone = new Parse.Query("UserProfile");
        queryone.containedIn('mobileNumber',group.get("groupMember"));
        return queryone.find();
    }).then(function(members){ 
        var promises = [];
        var existingUsers = [];
        _.each(members,function(member){
            var memberNumber = member.get("mobileNumber");
            existingUsers.push(memberNumber);
            var groupParticipantOf = [];
            groupParticipantOf = member.get("groupParticipantOf");
            if(typeof groupParticipantOf === 'undefined' ){
                groupParticipantOf = []
            }
             
            groupParticipantOf.push(theGroup.id);
            member.set("groupParticipantOf",_.uniq(groupParticipantOf));
            console.log(memberDetails.groupName+"groupName"+groupName);
            promises.push(member.save());                
        }); 
         
        _.each(_.difference(theGroup.get("groupMember"),existingUsers),function(number){
             
            var user = new UserProfile();
         
            user.set("mobileNumber",number);
            user.set("countryCode","+91");
            var groupParticipantOf = [];
            groupParticipantOf.push(theGroup.id);
            user.set("groupParticipantOf",groupParticipantOf);
            promises.push(user.save());
        });
        return Parse.Promise.when(promises);
    }).then(function(allPromises){
        console.log("coming to delete...........................................");
        var querytwo = new Parse.Query("UserProfile");
        console.log("memberNumberToDelte"+JSON.stringify(memberNumberToDelte));
        querytwo.containedIn('mobileNumber',memberNumberToDelte);
        return querytwo.find();
    }).then(function(members){ 
        console.log(JSON.stringify(members));
        var promises = [];
        var existingUsers = [];
        _.each(members,function(member){
            console.log(JSON.stringify(member));
            var groupParticipantOf = [];
            groupParticipantOf = member.get("groupParticipantOf");
            var removeGroupParticipantOf = [];
            removeGroupParticipantOf.push(theGroup.id);
            groupParticipantOf = _.difference(groupParticipantOf,removeGroupParticipantOf);
            member.set("groupParticipantOf",_.uniq(groupParticipantOf));
            return member.save();                
        });
        }).then(function(result){
        _.each(arguments,function(argument){
            console.log(JSON.stringify(argument));
        });
        responseWrapper.response = "Updated the group";
        responseWrapper.status = "success";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        responseWrapper.error = error;
        responseWrapper.status = "error";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });
}; */






/* exports.addMemberToGroup = function(req, res){
    var memberDetails = req.body;
    var membersToAdd = [];
    var membersToAdd = memberDetails.newMembers;
    var uiId = memberDetails.uiid;
    var responseWrapper = new global.responseWrapper();
    var groupDetails = new Group();
    var theGroup;
    var query = new Parse.Query(groupDetails);
    query.equalTo("uiid", uiId);
    query.find().then(function(groups){
         
        var groupId = groups[0].id;
         
        var groupMember = [];
        groupMember = groups[0].get("groupMember");
         
        _.each(membersToAdd,function(memberNumber){
            groupMember.push(memberNumber);
        });
         
        groups[0].set("groupMember",groupMember);
        return groups[0].save();
    }).then(function(group){
        theGroup = group;
         
        var groupId = group.id;
        var queryone = new Parse.Query("UserProfile");
        queryone.containedIn('mobileNumber',group.get("groupMember"));
         
        return queryone.find();
    }).then(function(members){ 
         
         
        var promises = [];
        var existingUsers = [];
        _.each(members,function(member){
            var memberNumber = member.get("mobileNumber");
            existingUsers.push(memberNumber);
            var groupParticipantOf = [];
            groupParticipantOf = member.get("groupParticipantOf");
            if(typeof groupParticipantOf === 'undefined' ){
                groupParticipantOf = []
            }
            groupParticipantOf.push(theGroup.id);
            member.set("groupParticipantOf",_.uniq(groupParticipantOf));
            promises.push(member.save());                
        }); 
         
        console.log(JSON.stringify(theGroup)+"     "+existingUsers);
        _.each(_.difference(theGroup.get("groupMember"),existingUsers),function(number){
            console.log("loop");
            var user = new UserProfile();
            console.log("number.substr(3)"+number.substr(3)+"number.substr(0,3)"+number.substr(0,3));
            var userMobileNumber = number.substr(3);
            var userNumberCountryCode = number.substr(0,3);
            user.set("mobileNumber",userMobileNumber);
            user.set("countryCode",userNumberCountryCode);
            var groupParticipantOf = [];
            groupParticipantOf.push(theGroup.id);
            user.set("groupParticipantOf",groupParticipantOf);
            promises.push(user.save());
        });
        return Parse.Promise.when(promises);
    }).then(function(result){
        _.each(arguments,function(argument){
            console.log(JSON.stringify(argument));
        });
        responseWrapper.response = "Added member";
        responseWrapper.status = "success";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        responseWrapper.error = error;
        responseWrapper.status = "error";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });
}; */
   
   
//API 2 :: Created and UpdatedBy Abhishek @7th DEC,2015:- To update member group. 


     
//API 4 :: Created and UpdatedBy Abhishek @7th DEC,2015 :- To delete new Group.


exports.createGroupV1 = function(req, res){
    console.log("new Group..............")
    var groupDetails = req.body;//
    console.log(groupDetails+"groupDetails");
    var uiid = groupDetails.uiid;
    var name = groupDetails.Name;
    var grouparr = [];
    var userId = groupDetails.userId;
    var x = groupDetails.members.length;
        for(i=0;i<x;i++){
        grouparr.push(groupDetails.members[i]); 
        }
    var responseWrapper = new global.responseWrapper();
    if((typeof name == 'undefined' || name == '')){
        responseWrapper = genericResponseErrorForCreateGroup();
        console.log(JSON.stringify(responseWrapper));
        res.send(responseWrapper);
    }else{
        responseWrapper = genericResponseSuccessForCreateGroup(name,userId,uiid,grouparr);
        console.log(JSON.stringify(responseWrapper));
        res.send(responseWrapper);
    }
};
 
var genericResponseErrorForCreateGroup = function(){
    console.log("Error");
    var responseWrapper = new global.responseWrapper();
    responseWrapper.status = "Error";
    responseWrapper.errorDescription = "GroupName/UserId invalid";
    responseWrapper.errorMessage = "Invalid Request";
    responseWrapper.response = null;
    res.setHeader('Content-Type', 'application/json');
    return responseWrapper;
}
 
var genericResponseSuccessForCreateGroup = function(name,userId,uiid,grouparr){
        console.log("success");
        var responseWrapper = new global.responseWrapper();
        var group = new Group();
        group.set("groupName",name);
        group.set("userId",userId);
        group.set("uiid",uiid);
        group.set("groupMember",grouparr);
        console.log("ok till now");
        group.save(null, {
        success: function(groups) {
            console.log("Now Saving");
            var x = groups.id;
            console.log(x);
            responseWrapper.status = "success";
            if(x != "undefined"){
            console.log("groupId"+"   "+groups.get("groupName")+"   "+groups.get("groupMember")+"   "+groups.get("uiid")+"  "+groups.id);
            responseWrapper.response.group = {};
            responseWrapper.response.group.name = groups.get("groupName");
            responseWrapper.response.group.groupMember = groups.get("groupMember");
            responseWrapper.response.group.uiid = groups.get("uiid");
            responseWrapper.response.group.groupId = groups.id;
            return responseWrapper;
            }
            },
        error: function(groups, error) {
            responseWrapper = genericResponseErrorForCreateGroup();
            return responseWrapper;
            }
        });
     
}
 
 
//API 5 :: Created and UpdatedBy Abhishek @7th DEC,2015 :- To delete a given user from the Group.
exports.deleteMember = function(req, res){
    var responseWrapper = new global.responseWrapper();
    var memberDetails = req.body;
    var memberNumberToDelte = [];
    var uiId = memberDetails.uiid;
    var memberNumberToDelte = memberDetails.removeMembers;
    console.log("memberNumberToDelte"+memberNumberToDelte);
    var myGroupMemberToDelete = [];
    var y = memberNumberToDelte.length;
        for(var i=0;i<y;i++){
            myGroupMemberToDelete.push(memberNumberToDelte[i].substr(3));
        }
    memberNumberToDelte = myGroupMemberToDelete;
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    console.log("userAuthenticationToken"+userAuthenticationToken);
    var userProfile = new UserProfile();
    var querythree = new Parse.Query("userProfile");
    querythree.equalTo("userAuthenticationToken",userAuthenticationToken);
    // verifying if the user who send's the req exist or not
    querythree.find().then(function(users){
        if(typeof users[0] === 'undefined'){
            //no such user big guy
        }
        currentUser = users[0];
    return userAuthenticationToken;
    }).then(function(userAuthenticationToken){
    var responseWrapper = new global.responseWrapper();
    var groupDetails = new Group();
    var theGroup;
    var query = new Parse.Query(groupDetails);
    query.equalTo("uiid", uiId);
    return query.find()
    }).then(function(groups){
         
        var groupId = groups[0].id;
        var groupMember = [];
        groupMember = groups[0].get("groupMember");
        var newGroup = [];
        newGroup = _.difference(groupMember, memberNumberToDelte);
        console.log("memberNumberToDelte"+memberNumberToDelte);
        groups[0].set("groupMember",newGroup);
        return groups[0].save();    
    }).then(function(group){
        theGroup = group;
        var groupId = group.id;
        var queryone = new Parse.Query("UserProfile");
        queryone.containedIn('mobileNumber',memberNumberToDelte);
        return queryone.find();
    }).then(function(members){ 
        console.log(JSON.stringify(members));
        var promises = [];
        var existingUsers = [];
        _.each(members,function(member){
            console.log(JSON.stringify(member));
            var groupParticipantOf = [];
            groupParticipantOf = member.get("groupParticipantOf");
            var removeGroupParticipantOf = [];
            removeGroupParticipantOf.push(theGroup.id);
            groupParticipantOf = _.difference(groupParticipantOf,removeGroupParticipantOf);
            member.set("groupParticipantOf",_.uniq(groupParticipantOf));
            return member.save();                
        });
        }).then(function(result){
        _.each(arguments,function(argument){
            console.log(JSON.stringify(argument));
        });
        responseWrapper.response = "Deleted the Members";
        responseWrapper.status = "success";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        responseWrapper.error = error;
        responseWrapper.status = "error";
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });
};
 
 

//API 7 :: CreatedBy Rahul and UpdatedBy Abhishek @ 7th DEC : Sync Function for group Api's
exports.syncGroups = function(req,res){
    var load = req.body;
    var userId = load.userId;
    var createGroups = load.create;
    var updateGroups = load.update;
    var deleteGroups = load.delete;
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    console.log("userAuthenticationToken"+userAuthenticationToken);
    groupsToUpdateIds = [];
    //Getting uiids of every group to update in one Array...
    _.each(updateGroups,function(perGroup){
         groupsToUpdateIds.push(perGroup.uiid);
         console.log(perGroup.name);
     });
    //Getting uiids of every group to delete in one Array...
    groupsToDeleteIds = [];
     _.each(deleteGroups,function(perGroup){
         groupsToDeleteIds.push(perGroup.uiid);
     });
    var arrangeGroupToUser = {};
    var groupUsers = [];
    var currentUser;
    var groupToAlter; 
    var groupDeleteUser= {};
    var query = new Parse.Query("UserProfile");
        query.equalTo("userAuthenticationToken",userAuthenticationToken);
        var responseWrapper = new global.responseWrapper();
        var userProfile = new UserProfile();
        // verifying if the user who send's the req exist or not
        query.find().then(function(users){
            if(typeof users[0] === 'undefined'){
                            //no such user big guy
            }
            currentUser = users[0];
 
//                  Now Quering for the groups to Update
             
            var query = new Parse.Query("Groups");
            query.containedIn("uiid",groupsToUpdateIds);
            return query.find();
        }).then(function(groups){
            _.each(groups,function(perGroup){
    //          Now Checking the list of user's in the req and list of user's already present in the group
    //          and Updating the member's list
                var obj = _.find(updateGroups,function(grp){return grp.uiid === perGroup.get("uiid")});
                //Fetching previous members
                 
                var previousMembers = perGroup.get("groupMember");
                 
                // Something Wrong here////
                 
                var toDeleteMembers = _.difference(previousMembers,obj.members);
                console.log(JSON.stringify(obj.members)+"vvvvvvvvvvvvvvvv"+JSON.stringify(previousMembers) +"vvvvvvvvvvvvvvvv"+JSON.stringify(toDeleteMembers));
                if(typeof toDeleteMembers !== 'undefined' && toDeleteMembers.length>0){
                    _.each(toDeleteMembers,function(member){
                        if(typeof arrangeGroupToUser[member] === 'undefined'){
                            var activity = {};
                            activity.toDelete = [];
                            activity.toDelete.push(perGroup.id);
                            console.log(JSON.stringify(activity));
                            arrangeGroupToUser[member] = activity; 
                        }else{
                            var activity = arrangeGroupToUser[member];
                            console.log(JSON.stringify(member)+"----"+JSON.stringify(activity)+"----"+JSON.stringify(arrangeGroupToUser[member]));
                            if(typeof activity.toDelete === 'undefined'){
                                activity.toDelete = [];
                            }
                            activity.toDelete.push(perGroup.id);
                        }
                    });
                }
                perGroup.set("groupName", obj.groupName);
                var myGroupMemberArray = [];
                var x = obj.members.length;
                for(var i=0;i<x;i++){
                 
                console.log(obj.members[i].substr(3));
                myGroupMemberArray.push(obj.members[i].substr(3));          
                }
                perGroup.set("groupMember", myGroupMemberArray);
            });
            return groups
        }).then(function(groupsToUpdate){
        console.log("save update started");
//      Now saving both the updated groups and newly created groups at the same time    
        var promises = [];
        _.each(_.union(groupsToUpdate,processGroupsFromRequests(createGroups,currentUser)),function(group){
            promises.push(group.save());
             
        })
        return Parse.Promise.when(promises);
         
// arguments contains all the saved group         
    }).then(function(savedGroups){
        _.each(arguments,function(savedGroup){
            var members = savedGroup.get("groupMember");
            groupUsers.push(members);
            _.each(members,function(member){
                console.log("typeof arrangeGroupToUser[member]" +typeof arrangeGroupToUser[member]);
                if(typeof arrangeGroupToUser[member] === 'undefined'){
                    console.log
                    var activity = {};
                    activity.toAddUpdate = [];
                    activity.toAddUpdate.push(savedGroup.id);
                    arrangeGroupToUser[member] = activity; 
                    console.log("typeof arrangeGroupToUser[member]" + JSON.stringify(activity));
                    console.log("typeof arrangeGroupToUser[member]" + JSON.stringify(arrangeGroupToUser[member]));
                }else{
                    var activity = arrangeGroupToUser[member];
                    if(typeof activity.toAddUpdate === 'undefined'){
                        activity.toAddUpdate = [];
                    }
                    activity.toAddUpdate.push(savedGroup.id);
                }
            });
        });
        // Deleting the groups
        var query = new Parse.Query("Groups");
        query.containedIn("uiid",groupsToDeleteIds);
        return query.find();
    }).then(function(groupsToDestroy){
        groupToAlter = groupsToDestroy;
        _.each(groupsToDestroy,function(savedGroup){
            var members = savedGroup.get("groupMember");
            var member = currentUser.get("mobileNumber");
            groupUsers.push(member);
            if(typeof arrangeGroupToUser[member] === 'undefined'){
                var activity = {};
                activity.toDelete = [];
                activity.toDelete.push(savedGroup.id);
                arrangeGroupToUser[member] = activity; 
            }else{
                var activity = arrangeGroupToUser[member];
                console.log(member+"----"+activity);
                if(typeof activity.toDelete === 'undefined'){
                    activity.toDelete = [];
                }
                activity.toDelete.push(savedGroup.id);
            }
        });
        return groupsToDestroy;
    }).then(function(groupsToDestroy){
        var query = new Parse.Query("UserProfile");
        query.containedIn("mobileNumber",_.uniq(_.flatten(groupUsers)));
        console.log("totalUsers"+_.uniq(_.flatten(groupUsers)));
        return query.find();
    }).then(function(groupUsers){
        var existingUsers = [];
        var promises = [];
        console.log("final Object"+JSON.stringify(arrangeGroupToUser));
        _.each(groupUsers,function(user){
            var num = user.get("mobileNumber");
            existingUsers.push(num);
            var activity = arrangeGroupToUser[num];
            var groupParticipant = user.get("groupParticipantOf");  
            if(typeof groupParticipant === 'undefined'){
                groupParticipant = [];
            }
            if(typeof activity.toAddUpdate !== 'undefined'){
                groupParticipant.push(activity.toAddUpdate);    
            }
            if(typeof activity.toDelete !== 'undefined'){
                groupParticipant = _.difference(groupParticipant,activity.toDelete);
                _.each(activity.toDelete,function(groupId){
                    if(typeof groupDeleteUser[groupId] === 'undefined'){
                        var toDeleteUser = [];
                        toDeleteUser.push(num);
                        groupDeleteUser[groupId] = toDeleteUser;
                    }else{
                        groupDeleteUser[groupId].push(num);
                    }
                }); 
            }
            user.set("groupParticipantOf",_.uniq(_.flatten(groupParticipant)));
            promises.push(user.save());
        });
        var newUsers = _.difference(_.keys(arrangeGroupToUser),existingUsers);
        console.log("new users"+newUsers+"           existing "+existingUsers);
        _.each(newUsers,function(number){
            var user = new UserProfile();
            console.log(number+"number.substr(3)"+number.substr(3)+"number.substr(0,3)"+number.substr(0,3));
            var userNumberCountryCode = "+91";
            user.set("countryCode",userNumberCountryCode);
            user.set("mobileNumber",number);
            user.set("groupParticipantOf", arrangeGroupToUser[number].toAddUpdate);
            promises.push(user.save());
        });
        return Parse.Promise.when(promises);
    }).then(function(){
        _.each(arguments,function(savedUser){
            console.log("user saved" + JSON.stringify(savedUser));
        });
        var promises = [];
        _.each(groupToAlter,function(group){
            var delUserArray = groupDeleteUser[group.id];
            if(typeof delUserArray !== 'undefined'){
                var x = _.difference(group.get("groupMember"),delUserArray).length;
                var myGroupMemberArray = [];
                for(var i=0;i<x;i++){
                 
                console.log(_.difference(group.get("groupMember"),delUserArray)[i].substr(3));
                myGroupMemberArray.push(_.difference(group.get("groupMember"),delUserArray)[i].substr(3));          
                }
                group.set("groupMember",myGroupMemberArray);
            }
            promises.push(group.save());
        });
        return Parse.Promise.when(promises); 
         
    }).then(function(result){
        console.log("operation successful");
        responseWrapper.status = "success";
        responseWrapper.response = {"status":"success"};
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    },function(error){
        console.log("operation failed");
        responseWrapper.status = "error";
        responseWrapper.errorMessage = error;
        res.setHeader('Content-Type', 'application/json');
        res.send(responseWrapper);
    });;
 
                 
}
 
function processGroupsFromRequests(rawGroups,owner){
    var returnGroups = [];
    _.each(rawGroups,function(perGroup){
        var myGroupMemberArray = [];
        var groupObj = new Group();
        groupObj.set("uiid",perGroup.uiid);
        groupObj.set("groupName",perGroup.groupName);
        var x = perGroup.members.length;
        for(var i=0;i<x;i++){
                 
                console.log("her..................................." +perGroup.members[i].substr(3));
                myGroupMemberArray.push(perGroup.members[i].substr(3));         
                }
        groupObj.set("groupMember",myGroupMemberArray);
        groupObj.set("userId",owner.id);
        groupObj.set("userAuthenticationToken",owner.get("userAuthenticationToken"));
        returnGroups.push(groupObj);
    });
    return returnGroups;
}
