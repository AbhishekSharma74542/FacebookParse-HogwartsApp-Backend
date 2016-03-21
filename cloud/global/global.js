global = {
	errorMessages : {
		SYSTEM_ERROR : "Unknown system error occurred, Please try later"
	},
	failureMessages : {
		INVALID_SESSION : "Provided User Authentication Token is invalid",
		UNKNOWN_USER : "No such User exists with the details provided in Request Data"
	},
	responseContent : { 
		status: "",
		failureCode: "",
		errorMessage: "",
		errorDescription: "",
		response:{}
	},
	user: {
		userId: "", 
		userAuthenticationToken: "",
		firstName: "",
		lastName: "",
		mobile: "",
		email: "",
		mobileVerified: false,
		emailVerified: false,
		countryCode:"",
		isActive:"",
		lastSeen:""
		//OTP_code:""
	},
	responseWrapper : function(){
		this.status = "";
		this.errorCode = "";
		this.errorMessage = "";
		this.errorDescription = "";
		this.response = {};
	},
	userWrapper : function(){
		this.userId= "";
		this.userAuthenticationToken= "";
		this.firstName= "";
		this.lastName= "";
		this.mobile= "";
		this.email= "";
		this.mobileVerified= false,
		this.emailVerified= false,
		this.countryCode= ""
	},
	userWrapperForRegistration : function(){
		this.userId= "";
		this.userAuthenticationToken= "";
		this.mobile= "";
		this.mobileVerified= false,
		this.countryCode= ""
	},
	trackWrapper : function(){
		this.name = null;
		this.geoLocations = [];
		this.startDateTime = null;
		this.endDateTime = null;
		this.totalTime = null;
		this.totalDistance = null;
		this.uiid = null;
	},
	userTrackWrapper : function(){
		this.name = null;
		this.startDateTime = null;
		this.endDateTime = null;
		this.totalTime = null;
		this.totalDistance = null;
		this.uiid = null;
		this.isShared = null;
        this.id = null;
        this.sharedBy=null;
	},
	buddyWrapper : function(){
		this.userId= "";
		this.mobile= "";
		this.lastSeen= "",
		this.isActive= false
	}
	
};

module.exports = global;