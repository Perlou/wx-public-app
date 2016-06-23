/**
 * @author Perlou
 * @g.js
 * @exports {Func} function
 */

'use strict'

var sha1 = require('sha1');
var Wechat = require('./Wechat');
var getRawBody = require('raw-body');
var utils = require('./utils');

// 文本消息xml格式
// <xml>
//  <ToUserName><![CDATA[toUser]]></ToUserName>
//  <FromUserName><![CDATA[fromUser]]></FromUserName>
//  <CreateTime>1348831860</CreateTime>
//  <MsgType><![CDATA[text]]></MsgType>
//  <Content><![CDATA[this is a test]]></Content>
// </xml>

module.exports = function(opts){
	var wechat = new Wechat(opts);
	return function *(next){
		var that = this,
			token = opts.token,
			signature = this.query.signature,
			nonce = this.query.nonce,
			timestamp = this.query.timestamp,
			echostr = this.query.echostr,
			str = [token, timestamp, nonce].sort().join(''),
			sha = sha1(str);

		if(this.method === 'GET'){
			if(sha === signature){
				this.body = echostr + '';
			}else{
				this.body = 'worng';
			}				
		}else if(this.method === 'POST'){
			if(sha !== signature){
				this.body = 'worng';
				return false;
			}

			var data = yield getRawBody(this.req, {
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			});

			var content = yield utils.parseXMLAsync(data);
			var message = utils.formatMessage(content.xml);

			this.weixin = message;

			yield handler.call(this, next);

			wechat.reply.call(this);

			// if(message.MsgType === 'event'){
			// 	if(message.Event === 'subscribe'){
			// 		var now = new Date().getTime();

			// 		that.status = 200;
			// 		that.type = 'application/xml';
			// 		that.body = '<xml>'+
			// 					 '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>' +
			// 					 '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>' +
			// 					 '<CreateTime>'+ now +'</CreateTime>' +
			// 					 '<MsgType><![CDATA[text]]></MsgType>' +
			// 					 '<Content><![CDATA[朱小郯童鞋泥嚎！]]></Content>' +
			// 					 '<MsgId>1234567890123456</MsgId>' +
			// 					'</xml>';		
			// 		return;			
			// 	}
			// }
		}
	
	};
};
