'use strict';
//need to update configSHA, set to correct values when config files on master branch get updated
var soajs_account = {
	"label": "SOAJS Open Source",
	"owner": "soajs",
	"provider": "github",
	"type": "organization",
	"access": "public",
	"repos": [
		{
			"name": "soajs/soajs.controller",
            "serviceName": "controller",
			"type": "service"
		},
		{
			"name": "soajs/soajs.artifact",
            "serviceName": "artifact",
			"type": "service"
		}
	]
};

module.exports = soajs_account;