var Track = Parse.Object.extend("Tracks");
var UserProfile = Parse.Object.extend("UserProfile");
var global = require('cloud/global/global');
var _ = require('underscore');
var constant = require('cloud/constants/constant.js');
var Error = require('cloud/constants/error.js');

exports.createTrack = function(req, res){
	var track = req.body;
	console.log(req.headers);
	console.log(track);
	console.log("new Track..............");
	var userAuthenticationToken = req.headers.userauthenticationtoken;
	var userId;
	var user = new UserProfile();
    var responseWrapper = new global.responseWrapper();
	var query = new Parse.Query("UserProfile");
    query.equalTo("userAuthenticationToken", userAuthenticationToken);
    query.find().then(function(users){
        if(typeof users === undefined || users.length === 0){
            responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_706_errorCode;
            responseWrapper.errorMessage = Error.Track_706_errorMessage;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
        }else{
            return users[0];
        }
    }).then(function(user){
        var trackObj = new Track();
        trackObj.set("uiid",track.uiid);
        trackObj.set("name",track.name);
        trackObj.set("locations",track.geoLocations);
        trackObj.set("startTime",track.startDateTime);
		trackObj.set("endTime",track.endDateTime);
		trackObj.set("totalTime",track.totalTime);
		trackObj.set("totalDistance",track.totalDistance);
		var relation = trackObj.relation("owner");
		relation.add(user);
		trackObj.set("uploadedBy",user.id);
		return trackObj.save();
    }).then(function(track){
        var resourceResponse = {};
        resourceResponse.trackId = track.id;
        responseWrapper.response = resourceResponse;
        responseWrapper.status = "success";
        res.setHeader(constant.ContentType,constant.applicationJson);
        res.send(responseWrapper);
    },function(model, error){
        responseWrapper.status = "error";
		responseWrapper.errorCode = Error.Track_713_errorCode;
		responseWrapper.errorMessage = Error.Track_713_errorMessage;
        responseWrapper.errorDescription = error;
		res.setHeader(constant.ContentType,constant.applicationJson);
		res.send(responseWrapper);
    });
};

exports.getTrack = function(req,res){
	var id = req.params.id;
	console.log('uiid'+id);
	var userAuthenticationToken = req.headers.userauthenticationtoken;
	var responseWrapper = new global.responseWrapper();
    var query = new Parse.Query("UserProfile");
        query.equalTo("userAuthenticationToken", userAuthenticationToken);
        query.find().then(function(users){
			if(typeof users === undefined || users.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_706_errorCode;
                responseWrapper.errorMessage = Error.Track_706_errorMessage;
                responseWrapper.errorDescription = error;
                res.setHeader(constant.ContentType,constant.applicationJson);
                res.send(responseWrapper);
            }else{
                return users[0];
            }
		}).then(function(result){
			var trackQuery = new Parse.Query("Tracks");
			trackQuery.equalTo("uiid", id);
			return trackQuery.find();
		}).then(function(tracks){
            console.log(JSON.stringify(tracks));
            if(typeof tracks === undefined || tracks.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_708_errorCode;
                responseWrapper.errorMessage = Error.Track_708_errorMessage;
                res.setHeader(constant.ContentType,constant.applicationJson);
                res.send(responseWrapper);
            }else{
                responseWrapper.status = "success";
                responseWrapper.response.track = parseTrack(tracks[0]);
                res.setHeader(constant.ContentType,constant.applicationJson);
                res.send(responseWrapper);    
            }
		},function(model, error){
			responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_713_errorCode;
            responseWrapper.errorMessage = Error.Track_713_errorMessage;
            responseWrapper.errorDescription = error;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
		});
	
}

exports.getUserTracks = function(req,res){
	var userAuthenticationToken = req.headers.userauthenticationtoken;
	var responseWrapper = new global.responseWrapper();
	var userId;
    var query = new Parse.Query("UserProfile");
        query.equalTo("userAuthenticationToken", userAuthenticationToken);
        query.find().then(function(users){
			if(typeof users === undefined || users.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_706_errorCode;
                responseWrapper.errorMessage = Error.Track_706_errorMessage;
                res.setHeader(constant.ContentType,constant.applicationJson);
                res.send(responseWrapper);
            }else{
                return users[0];
            }
		}).then(function(user){
			userId = user.id;
            console.log(user.id);
			var trackQuery = new Parse.Query("Tracks");
			trackQuery.equalTo("uploadedBy", user.id);
			var sharedTrackQuery = new Parse.Query("Tracks");
            var users = [];
            users.push(user.id);
			sharedTrackQuery.containedIn("sharedWith", users);
			return Parse.Query.or(trackQuery,sharedTrackQuery).find();
		}).then(function(tracks){
			responseWrapper.status = "success";
			responseWrapper.response.tracks = parseUserTracks(tracks,userId);
            console.log(responseWrapper);
			res.setHeader(constant.ContentType,constant.applicationJson);
			res.send(responseWrapper);
		},function(model, error){
            console.log(model);
			responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_713_errorCode;
            responseWrapper.errorMessage = Error.Track_713_errorMessage;
            responseWrapper.errorDescription = error;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
		});
	
}

exports.deleteTrack = function(req,res){
	var id = req.params.id;
    var userAuthenticationToken = req.headers.userauthenticationtoken;
	var currentUser;
	var responseWrapper = new global.responseWrapper();
    var query = new Parse.Query("UserProfile");
        query.equalTo("userAuthenticationToken", userAuthenticationToken);
        query.find().then(function(users){
			if(typeof users === undefined || users.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_706_errorCode;
                responseWrapper.errorMessage = Error.Track_706_errorMessage;
                res.setHeader(constant.ContentType,constant.applicationJson);
                res.send(responseWrapper);
            }else{
                console.log(users[0].id);
                return users[0];
            }
		}).then(function(user){
			currentUser = user;
			var trackQuery = new Parse.Query("Tracks");
			trackQuery.equalTo("uiid", id);
			return trackQuery.find();
		}).then(function(tracks){
			var trackUserId = tracks[0].get("uploadedBy");
			console.log(tracks[0]);
			if(currentUser.id === trackUserId){
				console.log("goin to delete");
				return tracks[0].destroy();
			}else{
				console.log(tracks[0].get("sharedWith"));
				console.log("dont have privilege");
			}
		}).then(function(result){
			responseWrapper.status = "success";
			responseWrapper.response = "success";
			res.setHeader(constant.ContentType,constant.applicationJson);
			res.send(responseWrapper);
		},function(model, error){
			responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_713_errorCode;
            responseWrapper.errorMessage = Error.Track_713_errorMessage;
            responseWrapper.errorDescription = error;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
		});
}

function saveUpdateTrack(user, track){
	var query = new Parse.Query("Tracks");
	query.equalTo("uid", track.uid);
        query.find({
          success: function(results) {
				console.log(results);
				if(typeof results === 'undefined' || results.length === 0){
				  //no such data add new entry
					var trackObj = new Track();
				}else{
					var trackObj = results[0];
				}
				trackObj.set("locations",track.geoLocations);
				trackObj.set("startTime",track.startDateTime);
				trackObj.set("endTime",track.endDateTime);
				trackObj.set("totalTime",track.totalTime);
				trackObj.set("totalDistance",track.totalDistance);
				trackObj.set("owner",user.objectId);
				trackObj.set("uploadedBy",user.objectId);
				trackObj.save();
				return trackObj;

		  },
		  error: function(error) {
			  console.log(error);
		  }
		});  
}

function parseTrack(trackObj){
    var track = new global.trackWrapper();
    track.id= trackObj.id;
	track.name = trackObj.get("name");
    track.uiid = trackObj.get("uiid");
	track.geoLocations = trackObj.get("locations");
	track.startDateTime = trackObj.get("startTime");
	track.endDateTime = trackObj.get("endTime");
	track.totalTime = trackObj.get("totalTime");
	track.totalDistance = trackObj.get("totalDistance");
	track.ownerId =	trackObj.get("uploadedBy");
    return track;
}

function parseUserTracks(tracks, userId){
	var returnTracks = []
	_.each(tracks,function(trackObj){
		var track = new global.userTrackWrapper();
		track.id= trackObj.id;
		track.name = trackObj.get("name");
		track.uiid = trackObj.get("uiid");
		track.isShared = (trackObj.get("uploadedBy")!==userId);
		track.startDateTime = trackObj.get("startTime");
		track.endDateTime = trackObj.get("endTime");
		track.totalTime = trackObj.get("totalTime");
		track.totalDistance = trackObj.get("totalDistance");
		track.ownerId =	trackObj.get("uploadedBy");
		returnTracks.push(track)
	});
    return returnTracks;
}

exports.syncTracks = function(req,res){
    var userAuthenticationToken = req.headers.userauthenticationtoken;
    var syncData = req.body;
    var tracksToCreate; 
    var tracksToUpdate = syncData.update;
//    console.log(JSON.stringify(tracksToUpdate));
    tracksToUpdateIds = [];
     _.each(tracksToUpdate,function(perTrack){
         tracksToUpdateIds.push(perTrack.uiid);
         console.log(perTrack.name);
     });
    var tracksToDelete = syncData.delete;
//    console.log(tracksToDelete);
    tracksToDeleteIds = [];
     _.each(tracksToDelete,function(perTrack){
         tracksToDeleteIds.push(perTrack.uiid);
     });
    var currentUser;
    var query = new Parse.Query("UserProfile");
	var responseWrapper = new global.responseWrapper();
    var steps = {};
    console.log("process started");
    query.equalTo("userAuthenticationToken",userAuthenticationToken);
    query.find().then(function(users){
		
		if(typeof users === undefined || users.length === 0){
            responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_706_errorCode;
            responseWrapper.errorMessage = Error.Track_706_errorMessage;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
        }else{
            console.log(users[0].id);
            return users[0];
        }
	}).then(function(user){
        console.log("user found");
        tracksToCreate = processTracksFromRequests(syncData.create,user);
        currentUser = user;
        var promises = [];
        _.each(tracksToCreate,function(track){
           promises.push(track.save()); 
        });
//        return Parse.Promise.as(Parse.Object.saveAll(tracksToCreate,{
//            success : function(savedTracks){
//                console.log("save update finished");
//                return savedTracks;
//            },
//            error : function(data,error){
//                return error;
//            }
//        }));
        return Parse.Promise.when(promises);
    }).then(function(tracks){
        steps.create = "success";
        var query = new Parse.Query("Tracks");
        query.containedIn("uiid",tracksToUpdateIds);
        return query.find();
    }).then(function(tracks){
        console.log("to update tracks found "+tracks);
//        console.log(JSON.stringify(tracksToUpdate));
        _.each(tracks,function(perTrack){
            var obj = _.find(tracksToUpdate,function(trk){return trk.uiid === perTrack.get("uiid")});
//            console.log(obj);
            perTrack.set("name", obj.name); 
        });
//        console.log(JSON.stringify(tracksToUpdate));
        return tracks;    
    }).then(function(tracksToUpdateName){
        console.log("save update started");
        var promises = [];
        _.each(tracksToUpdateName,function(track){
           promises.push(track.save()); 
        });
//        return Parse.Promise.as(Parse.Object.saveAll(tracksToUpdateName,{
//            success : function(savedTracks){
//                console.log("save update finished");
//                return savedTracks;
//            },
//            error : function(data,error){
//                return error;
//            }
//        })); 
        return Parse.Promise.when(promises);
    }).then(function(savedTracks){
        steps.update = "success";
        console.log("delete started");
        var query = new Parse.Query("Tracks");
        query.containedIn("uiid",tracksToDeleteIds);
        return query.find();
    }).then(function(tracksToDestroy){
//        console.log("delete tracks found "+tracksToDestroy);
        var promises = [];
        _.each(tracksToDestroy,function(track){
           promises.push(track.destroy()); 
        });
//        return Parse.Promise.as(Parse.Object.destroyAll(tracksToDestroy,{
//            success : function(deletedTracks){
//                console.log("delete finished "+deletedTracks);
//                return deletedTracks;
//            },
//            error : function(data,error){
//                return error;
//            }
//        })); 
        return Parse.Promise.when(promises);
    }).then(function(result){
        steps.delete = "success";
        console.log("operation successful");
		responseWrapper.status = "success";
		responseWrapper.response = steps;
		res.setHeader(constant.ContentType,constant.applicationJson);
		res.send(responseWrapper);
    },function(model, error){
        responseWrapper.status = "error";
        responseWrapper.errorCode = Error.Track_713_errorCode;
        responseWrapper.errorMessage = Error.Track_713_errorMessage;
        responseWrapper.errorDescription = error;
        responseWrapper.response = steps;
        res.setHeader(constant.ContentType,constant.applicationJson);
        res.send(responseWrapper);
    }); 
}

function processTracksFromRequests(rawTracks,owner){
    var returnTracks = [];
    _.each(rawTracks,function(perTrack){
        var trackObj = new Track();
        trackObj.set("uiid",perTrack.uiid);
        trackObj.set("name",perTrack.name);
		trackObj.set("locations",perTrack.geoLocations);
		trackObj.set("startTime",perTrack.startDateTime);
		trackObj.set("endTime",perTrack.endDateTime);
		trackObj.set("totalTime",perTrack.totalTime);
		trackObj.set("totalDistance",perTrack.totalDistance);
		trackObj.set("uploadedBy",owner.id);
		var relation = trackObj.relation("owner");
		relation.add(owner);
        returnTracks.push(trackObj);
    });
    return returnTracks;
}

exports.updateUserName = function(req,res){
	var trackReq = req.body;
	var userAuthenticationToken = req.headers.userauthenticationtoken;
	var responseWrapper = new global.responseWrapper();
	var userId;
    var query = new Parse.Query("UserProfile");
        query.equalTo("userAuthenticationToken", userAuthenticationToken);
        query.find().then(function(users){
			if(typeof users === undefined || users.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_706_errorCode;
                responseWrapper.errorMessage = Error.Track_706_errorMessage;
                res.setHeader(constant.ContentType,constant.applicationJson);
                res.send(responseWrapper);
            }else{
                console.log(users[0].id);
                return users[0];
            }
		}).then(function(user){
			userId = user.id;
			var trackQuery = new Parse.Query("Tracks");
//			query.equalTo("owner", user);
			trackQuery.equalTo("uiid",trackReq.uiid);
			return trackQuery.find();
		}).then(function(tracks){
            console.log(tracks);
            if(typeof tracks === undefined || tracks.length === 0){
                responseWrapper.status = "error";
                responseWrapper.errorCode = Error.Track_712_errorCode;
                responseWrapper.errorMessage = Error.Track_712_errorMessage;
                res.setHeader(constant.ContentType,constant.applicationJson);
                console.log("read");
                res.send(responseWrapper);
            }else{
                var track = tracks[0];
                track.set("name",trackReq.name);
                return track.save();   
            }
		}).then(function(track){
			responseWrapper.status = "success";
			responseWrapper.response = "success";
			res.setHeader(constant.ContentType,constant.applicationJson);
			res.send(responseWrapper);
		},function(model, error){
			responseWrapper.status = "error";
            responseWrapper.errorCode = Error.Track_713_errorCode;
            responseWrapper.errorMessage = Error.Track_713_errorMessage;
            responseWrapper.errorDescription = error;
            res.setHeader(constant.ContentType,constant.applicationJson);
            res.send(responseWrapper);
		});	
}

