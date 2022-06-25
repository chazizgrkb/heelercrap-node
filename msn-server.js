const net = require('net');
const backend = require('./backend');

var split = function(str){
	str = str.replace('\r\n', '');
	return str.split(' ');
}

//Create an instance of the server
var start = function(port,host) {
	const server = net.createServer(onClientConnection);

	//Start listening with the server on given port and host.
	server.listen(port,host,function(){
	   console.log(`MSN Messenger Server started on port ${port} at ${host}`); 
	});
}

//Declare connection listener function
async function onClientConnection(sock){
	var sendData = async function(command, transaction, instructions){
		console.log(` Output: <<< ${command} ${transaction} ${instructions} `);
		return sock.write(`${command} ${transaction} ${instructions}\r\n`);
	}
	
	// why.
	var sendDataNoTransaction = async function(command){
		console.log(` Output: <<< ${command}`);
		return sock.write(`${command}\r\n`);
	}
	
    //Log when a client connnects.
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);
     //Listen for data from the connected client.
    sock.on('data',async function(data){
        //Log data from the client
        //console.log(`${sock.remoteAddress}:${sock.remotePort} Says : ${data} `);
		const cleandata = split(data.toString());
		const command = cleandata[0];
		const transaction = cleandata[1];
		console.log(`(${sock.remoteAddress}:${sock.remotePort}) Input: >>> ${data} `);
		console.log(cleandata);
		switch(command) {
		  case 'VER':
			global.msnp = cleandata[2];
			await sendData('VER', transaction, `${msnp} CVR0`);
			break;
		  case 'CVR':
			global.email = cleandata[9];
			const version = cleandata[7];
			await sendData('CVR', transaction, `${version} ${version} 1.0.0000 https://www.youtube.com/watch?v=Xe7g_-XuMJw https://www.youtube.com/watch?v=Xe7g_-XuMJw`);
			break;
		  case 'USR':
			const tweener = cleandata[3];
			switch(tweener) {
				case 'I':
				await sendData('USR', transaction, 'TWN S lc=1033,id=507,tw=40,fs=1,ru=http%3A%2F%2Fmessenger%2Emsn%2Ecom,ct=1062764229,kpp=1,kv=5,ver=2.1.0173.1,tpf=43f8a4c8ed940c04e3740be46c4d1619');
				break;

				case 'S':
				await sendData('USR', transaction, `OK ${email} ${email} 1 0`);
				await sendDataNoTransaction(`MSG Hotmail Hotmail 491\r\n
   MIME-Version: 1.0\r\n
   Content-Type: text/x-msmsgsprofile; charset=UTF-8\r\n
   LoginTime: 1050223062\r\n
   EmailEnabled: 0\r\n
   MemberIdHigh: 85040\r\n
   MemberIdLow: -517030579\r\n
   lang_preference: 1033\r\n
   preferredEmail: ${email}\r\n
   country: US\r\n
   PostalCode: 90201\r\n
   Gender: m\r\n
   Kid: 0\r\n
   Age: \r\n
   BDayPre: 5\r\n
   Birthday: 0\r\n
   Wallet: 0\r\n
   Flags: 1027\r\n
   sid: 507\r\n
   kv: 4\r\n
   MSPAuth: 41bbzZ*NzDmDQ8ic4HWo89b9zhCBk!ÃÂÃÂ¢ÃÂÃÂÃÂÃÂONDJKB3Los8UMgBnCOLSwQKo!8IeIHÃÂÃÂ¢ÃÂÃÂÃÂÃÂQF0vVItSlOzIL36e5MAdMaB3mpZw$$\r\n
   ClientIP: 1.2.3.4\r\n
   ClientPort: 516\r\n`);
				break;
			}
			break;
		  case 'SYN':
		    const syncVersion = cleandata[2];
			if (syncVersion > 0) {
			await sendData('SYN', transaction, 1); // has to be exact or else it hangs.
			} else {
			await sendData('SYN', transaction, '1 2 4'); // has to be exact or else it hangs.
			await sendDataNoTransaction('GTC A');
			await sendDataNoTransaction('BLP AL');
			await sendDataNoTransaction("LSG 0 Other%20Contacts 0\r\nLSG 1 Coworkers 0\r\nLSG 2 Friends 0\r\nLSG 3 Family 0");
			await sendDataNoTransaction("LST bob@passport.com Bob 1 0\r\nBPR MOB Y");
			await sendDataNoTransaction("LST fred@passport.com Fred 3 0");
			//sendDataNoTransaction("LST gamerappa@heelercrap.com Gamerappa 3 0");
			}
		  break;
		  case 'CHG':
		    const uStatus = cleandata[2];
			await sendData('CHG', transaction, `${uStatus} 0`);
		  break;
		  default:
			// code block
			break;
		}
        //Send back the data to the client.
        //sock.write(`You Said ${data}`);
    });
    //Handle client connection termination.
    sock.on('close',function(){
        console.log(`${sock.remoteAddress}:${sock.remotePort} Terminated the connection`);
    });
    //Handle Client connection error.
    sock.on('error',function(error){
        console.error(`${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`);
    });
};

module.exports = {start};