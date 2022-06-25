const bcrypt = require('bcrypt');
const db = require('./database');

async function authenticate(name, pass) {
	try {
	const queryResult = await db.result('SELECT `password` FROM `users` WHERE `name` = ?', name);
	const hash = queryResult[0].password;
	const finalHash = hash.replace('$2y$', '$2a$');
	const validPassword = bcrypt.compare(pass, finalHash, function(err, result) {
		console.log("password is " + result);
		return result;
	});
	} catch (err) {
    console.log(err);
	}
}

module.exports = {authenticate};