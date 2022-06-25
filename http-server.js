const backend = require('./backend');
const express = require('express');
const https = require('https');
const fs = require('fs');

// quite frankly it doesn't matter if the cert is invalid or whatever, just get fiddler lol

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

app = express()
app.get('/rdr/pprdr.asp', async (req, res) => {
  res.set("PassportURLs", "DALogin=login.passport.com/login2.srf")
  console.log("Tweener Nexus Request Start?")
  res.end()
})

app.get('/login2.srf', async (req, res) => {
  console.log("Tweener Nexus Login Request")
  res.set("PPServer", "H: LAWPPLOG5C006")
  res.set("P3P", 'CP="DSP CUR OTPi IND OTRi ONL FIN"')
  res.set("Authentication-Info", 'Passport1.4 da-status=redir')
  res.redirect(302, 'https://login.passport.com/login2_part2.srf?lc=1033');
  //res.end()
})

app.get('/login2_part2.srf', async (req, res) => {
  var header1 = req.headers.authorization.split(/\s*,\s*/);
  var username = header1[2].split('=')[1].split('@')[0]; // ass code
  var pass = header1[3].split('=')[1]; // ass code
  console.log("Tweener Nexus Login Request 2")
	res.set("PPServer", "H: LAWPPIIS6B061")
	res.set("P3P", 'CP="DSP CUR OTPi IND OTRi ONL FIN"')
	const asyncExample = async () =>{
		try {
		//const fuck = await backend.authenticate(username, pass);
		if (await backend.authenticate(username, pass) === true) {	
			res.set("Authentication-Info", "Passport1.4 da-status=success,tname=MSPAuth,tname=MSPProf,tname=MSPSec,from-PP='t=53*1hAu8ADuD3TEwdXoOMi08sD*2!cMrntTwVMTjoB3p6stWTqzbkKZPVQzA5NOt19SLI60PY!b8K4YhC!Ooo5ug$$&p=5eKBBC!yBH6ex5mftp!a9DrSb0B3hU8aqAWpaPn07iCGBw5akemiWSd7t2ot!okPvIR!Wqk!MKvi1IMpxfhkao9wpxlMWYAZ!DqRfACmyQGG112Bp9xrk04!BVBUa9*H9mJLoWw39m63YQRE1yHnYNv08nyz43D3OnMcaCoeSaEHVM7LpR*LWDme29qq2X3j8N',ru=h")
		} else {
			res.set("WWW-Authenticate", "Passport1.4 da-status=failed,srealm=Passport.NET,ts=-3,prompt,cburl=http//www.passportimages.com/XPPassportLogo.gif,cbtxt=Type%20your%20e-mail%20address%20and%20password%20correctly.%20If%20you%20haven%E2%80%99t%20registered%20with%20.NET%20Passport%2C%20click%20the%20Get%20a%20.NET%20Passport%20link.")
		}
			res.end()
		} catch (err) {
		console.log(err);
		}
	}
	asyncExample();
})

var start = function(port,host) {
	var server = https.createServer(options, app);
	
	server.listen(port, () => {
	  console.log(`HTTP server listening on ${port}`)
	})
}

module.exports = {start};