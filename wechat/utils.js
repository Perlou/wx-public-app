/**
 * @author Perlou
 * @utils.js
 * @exports {Func}
 */

'use strict'

var Promise = require('bluebird');
var xml2js = require('xml2js');
var tpl = require('./tpl');

/**
 * 将xml转换成json
 * @param xml
 * @return {obj} promise
 */	
exports.parseXMLAsync = function(xml){
	return new Promise(function(resolve, reject){
		xml2js.parseString(xml, {
			trim: true
		}, function(err, content){
			if(err){
				reject(err);
			}else{
				resolve(content);
			}
		});
	});
};

/**
 * json格式化函数
 * @param {obj} result
 * @return {obj}
 */	
function formatMessage(result){
	var message = {};

	if(typeof result === 'object'){
		var keys = Object.keys(result);
		for(var i = 0; i < keys.length; i++){
			var key = keys[i],
				item = result[key];

			if( !(item instanceof Array) || item.length == 0){
				continue;
			}

			if(item.length == 1){
				var value = item[0];

				if(typeof value === 'object'){
					//递归
					message[key] = formatMessage(val);
				}else{
					message[key] = (value || '').trim();
				}
			}else{
				message[key] = [];

				for(var j = 0; j < item.length; j++){
					message[key].push(formatMessage(item[j]));
				}
			}	
		}
	}

	return message;
}

exports.formatMessage = formatMessage;

exports.tpl = function(content, message){
	var info = {},
		type = 'text',
		fromUserName = message.FromUserName,
		toUserName = message.toUserName;

	if(Array.isArray(content)){
		type = 'news';
	}	

	type = content.type;
	info.content = content;
	info.createTime = new Date().getTime();
	info.msgType = type;
	info.fromUserName = fromUserName;
	info.toUserName = toUserName;

	return tpl.compiled(info);
};

