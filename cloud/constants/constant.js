constant = {
	twilioAccountSid : "AC72b10ce995f9609f267aeb042a2167bb",
	twilioAuthToken : "26c8ddac2cba278fc422b43828b95ce5",
	twilioPhoneNumber : "+1 669-231-1715",
	language : "en",
	secretPasswordToken : "abhis",
	applicationJson : "application/json",
	ContentType : "Content-Type",
    urlAuthException : {
        REGISTER_URL : { 
            url : "/tracker/user",
            method : "POST",
            matchType : "full"
        },
        MAIL_URL : { 
            url : "/mail/",
            method : "GET",
            matchType : "part"
        }
    }
};



module.exports = constant
