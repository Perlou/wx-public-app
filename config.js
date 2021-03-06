/**
 * @author Perlou
 * @config.js
 * @exports {obj} config
 */

var path = require('path');
var wechat_file = path.join(__dirname, './config/wechat.txt');
var utils = require('./libs/utils');

//微信公众号配置信息
var config = {
	wechat: {
		appID: 'wx91e44fa8b9ade1e4',
		appSecret: 'd84bc0be0f87c9e9cabd5b07068fc0ea',
		token: 'perlouwxpublic',
		getAccessToken: function(data){
			return utils.readFileAsync(wechat_file);
		},
		saveAccessToken: function(data){
			data = JSON.stringify(data);
			return utils.writeFileAsync(wechat_file, data);
		}
	}
};

module.exports = config;
