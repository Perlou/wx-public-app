/**
 * @author Perlou
 * @Wechat.js
 * @exports {Func} Wechat
 */

'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var urlPrefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
	accessToken: urlPrefix + 'token?grant_type=client_credential'
};


/**
 * 微信中间件构造函数
 * @params opts
 */
function Wechat(opts){
	var that = this;
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;

	this.getAccessToken()

		.then(function(data){
			try{
				data = Json.parse(data);
			}catch(e){
				return that.updateAccessToken();
			}

			if(that.isVaildAccessToken(data)){
				Promise.resolve(data);
			}else{
				return that.updateAccessToken();
			}
		})

		.then(function(data){
			that.access_token = data.access_token;
			that.expires_in = data.expires_in;

			that.saveAccessToken(data);
		});

}

Wechat.prototype.isVaildAccessToken = function(data){

	if(!data || !data.access_token || !data.expires_in){
		return false;
	}

	var that = this,
		access_token = data.access_token,
		expires_in = data.expires_in,
		now = (new Date().getTime());

	if(now < expires_in){
		return true;
	}else{
		return false;
	}

};

Wechat.prototype.updateAccessToken = function(){

	var that = this,
		appID = this.appID,
		appSecret = this.appSecret,
		url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;

	return new Promise(function(resolve, reject){
		request({
			url: url,
			json: true
		}).then(function(res){
			var data = res.body,
				now = (new Date().getTime()),
				expires_in = now + (data.expires_in - 20) * 1000;
			data.expires_in = expires_in;	
			resolve(data);
		});		
	});

};

module.exports = Wechat;
