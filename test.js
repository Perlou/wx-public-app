'use strict';

var Koa = require('koa');
var sha1 = require('sha1');
var config = {
	wechat: {
		appID: 'wx91e44fa8b9ade1e4',
		appSecret: 'd84bc0be0f87c9e9cabd5b07068fc0ea',
		token: 'perlouwxpublic'
	}
};

var app = new Koa();

app.use(function *(next){
	console.log(this.query);

	var token = config.wechat.token,
		signature = this.query.signature,
		timestamp = this.query.timestamp,
		echostr = this.query.echostr,
		nonce = this.query.nonce,
		str = [token, timestamp, nonce].sort().join(''),
		sha = sha1(str);

	if(sha === signature){
		this.body = echostr + '';
	}else{
		this.body = 'worng';
	}

});

app.listen(8080);
console.log('listen: 8080');
