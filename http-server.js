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
app.get('/rdr/pprdr.asp', (req, res) => {
  res.set("PassportURLs", "DALogin=login.passport.com/login2.srf")
  console.log("Tweener Nexus Request Start?")
  res.end()
})

app.get('/login2.srf', (req, res) => {
  console.log(req.headers.authorization);
  console.log("Tweener Nexus Login Request")
  res.set("PPServer", "H: LAWPPLOG5C006")
  res.set("P3P", 'CP="DSP CUR OTPi IND OTRi ONL FIN"')
  res.set("Authentication-Info", 'Passport1.4 da-status=redir')
  res.redirect(302, 'https://login.passport.com/login2_alt.srf?lc=1033');
  //res.end()
})

app.get('/login2_alt.srf', (req, res) => {
  console.log(req.headers.authorization);
  console.log("Tweener Nexus Login Request 2")
  res.set("PPServer", "H: LAWPPIIS6B061")
  res.set("P3P", 'CP="DSP CUR OTPi IND OTRi ONL FIN"')
  res.set("Authentication-Info", "Authentication-Info: Passport1.4 da-status=success,tname=MSPAuth,tname=MSPProf,tname=MSPSec,from-PP='t=53*1hAu8ADuD3TEwdXoOMi08sD*2!cMrntTwVMTjoB3p6stWTqzbkKZPVQzA5NOt19SLI60PY!b8K4YhC!Ooo5ug$$&p=5eKBBC!yBH6ex5mftp!a9DrSb0B3hU8aqAWpaPn07iCGBw5akemiWSd7t2ot!okPvIR!Wqk!MKvi1IMpxfhkao9wpxlMWYAZ!DqRfACmyQGG112Bp9xrk04!BVBUa9*H9mJLoWw39m63YQRE1yHnYNv08nyz43D3OnMcaCoeSaEHVM7LpR*LWDme29qq2X3j8N',ru=h")
  res.end()
})

var start = function(port,host) {
	var server = https.createServer(options, app);
	
	server.listen(port, () => {
	  console.log(`HTTP server listening on ${port}`)
	})
}

module.exports = {start};