/**
 * @author Perlou
 * @weixin.js
 * @exports {Func} function
 */

'use strict';

exports.reply = function* (next){
	var message = this.weixin;
	
	if(message.MsgType === 'event'){

		if(message.Event === 'subscribe'){
			if(message.EventKey){
				console.log('扫描二维码进来' + message.EventKey + ' ' + message.tickey);
			}
			this.body = '你订阅了该号\r\n';
			 // + '消息ID' + message.MsgId;
		}else if(message.Event === 'unsubscribe'){
			console.log('取消关注');
			this.body = '';
		}

	}
	yield next();
};
