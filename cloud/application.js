var express = require('express');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var userProfile= require('cloud/routes/userprofile');
var group = require('cloud/routes/group');
var track = require('cloud/routes/track');
var app = express();
// Use the layout engine for express
// Automatically redirect non-secure urls to secure ones
app.use(parseExpressHttpsRedirect());    
// Middleware for reading request body
app.use(express.bodyParser());  
app.use(express.methodOverride());
app.get('/hogwarts/ping', userProfile.welcome);
app.post('/hogwarts/user', userProfile.register);
app.put('/hogwarts/user', userProfile.update);
app.get('/hogwarts/user', userProfile.user);
app.get('/hogwarts/user/otp', userProfile.generateOTP);
app.post('/hogwarts/user/otp', userProfile.verifyOTP);
app.post('/hogwarts/users', userProfile.buddyDetailsByUserId);
app.get('/hogwarts/invite/:mobileNumber', userProfile.sendInvitation);
app.post('/hogwarts/group', group.createGroup);
//app.post('/hogwarts/group/registerV1', group.createGroupV1);
app.post('/hogwarts/group/:uiid/members', group.updateMember);
app.put('/hogwarts/group/:uiid/associate', group.addMemberToGroup);
app.put('/hogwarts/group/:uiid/disassociate', group.deleteMemberFromGroup);
app.get('/hogwarts/group/:uiid/members', group.groupMemberDetails);
app.delete('/hogwarts/group/:uiid', group.deleteGroup);
//app.get('/hogwarts/group/fetchDetails', group.groupDetails);
app.put('/hogwarts/group/:uiid/exit', group.exitGroup);
app.get('/hogwarts/group/:uiid', group.groupDetailsByUiid);
app.put('/hogwarts/group/:uiid', group.groupUpdate);
app.get('/hogwarts/user/groups', group.groupDetailsByUser);
//app.post('/hogwarts/groups/sync', group.syncGroups);
//app.post('/hogwarts/user/group/buddy', userProfile.buddyDetails);
app.post('/hogwarts/image/:uiid', userProfile.uploadResource);
//app.post('/hogwarts/user/resource', userProfile.uploadImage);
app.get('/hogwarts/user/:userId/mail/:emailCode', userProfile.mailVerify);
//tracks APIs
app.post('/hogwarts/track', track.createTrack);
app.get('/hogwarts/track/:id', track.getTrack);
app.get('/hogwarts/user/tracks', track.getUserTracks);
app.delete('/hogwarts/track/:id', track.deleteTrack);
app.put('/hogwarts/track', track.updateUserName);
app.post('/hogwarts/tracks/sync', track.syncTracks);
app.listen();



/* var express = require('express');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var app = express();
// Use the layout engine for express
// Automatically redirect non-secure urls to secure ones
app.use(parseExpressHttpsRedirect());    
// Middleware for reading request body 
app.use(express.bodyParser());  
app.use(express.methodOverride());
var userProfile= require('cloud/routes/userprofile');
var group = require('cloud/routes/group');
var track = require('cloud/routes/track');
app.get('/hogwarts/ping', userProfile.welcome);
app.post('/hogwarts/user', userProfile.register);
app.put('/hogwarts/user', userProfile.update);
app.get('/hogwarts/user', userProfile.user);
app.get('/hogwarts/user/otp', userProfile.generateOTP);
app.post('/hogwarts/user/otp', userProfile.verifyOTP);
app.post('/hogwarts/users', userProfile.buddyDetailsByUserId);
app.get('/hogwarts/invite/:mobileNumber', userProfile.sendInvitation);
app.post('/hogwarts/group', group.createGroup);
//app.post('/hogwarts/group/registerV1', group.createGroupV1);
app.post('/hogwarts/group/:uiid/members', group.updateMember);
app.put('/hogwarts/group/:uiid/associate', group.addMemberToGroup);
app.put('/hogwarts/group/:uiid/disassociate', group.deleteMemberFromGroup);
app.get('/hogwarts/group/:uiid/members', group.groupMemberDetails);
app.delete('/hogwarts/group/:uiid', group.deleteGroup);
//app.get('/hogwarts/group/fetchDetails', group.groupDetails);
app.put('/hogwarts/group/:uiid/exit', group.exitGroup);
app.get('/hogwarts/group/:uiid', group.groupDetailsByUiid);
app.put('/hogwarts/group/:uiid', group.groupUpdate);
app.get('/hogwarts/user/groups', group.groupDetailsByUser);
//app.post('/hogwarts/groups/sync', group.syncGroups);
//app.post('/hogwarts/user/group/buddy', userProfile.buddyDetails);
app.post('/hogwarts/image/:uiid', userProfile.uploadResource);
//app.post('/hogwarts/user/resource', userProfile.uploadImage);
app.get('/hogwarts/user/:userId/mail/:emailCode', userProfile.mailVerify);
//tracks APIs
app.post('/hogwarts/track', track.createTrack);
app.get('/hogwarts/track/:id', track.getTrack);
app.get('/hogwarts/user/tracks', track.getUserTracks);
app.delete('/hogwarts/track/:id', track.deleteTrack);
app.put('/hogwarts/track', track.updateUserName);
app.post('/hogwarts/tracks/sync', track.syncTracks);
app.listen(); */