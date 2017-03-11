var crypto = require('crypto');

exports.md5 = function (content) {
	var md5 = crypto.createHash('md5');
	md5.update(content);
	return md5.digest('hex');	
}