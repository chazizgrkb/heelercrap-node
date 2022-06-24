const net = require('net');

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
function onClientConnection(sock){
	var sendData = function(command, transaction, instructions){
		console.log(` <<< ${command} ${transaction} ${instructions} `);
		return sock.write(`${command} ${transaction} ${instructions}\r\n`);
	}
    //Log when a client connnects.
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);
     //Listen for data from the connected client.
    sock.on('data',function(data){
        //Log data from the client
        //console.log(`${sock.remoteAddress}:${sock.remotePort} Says : ${data} `);
		const cleandata = split(data.toString());
		const command = cleandata[0];
		const transaction = cleandata[1];
		console.log(` >>> ${data} `);
		console.log(cleandata);
		switch(command) {
		  case 'VER':
			global.msnp = cleandata[2];
			sendData('VER', transaction, `${msnp} CVR0`);
			break;
		  case 'CVR':
			global.email = cleandata[9];
			const version = cleandata[7];
			sendData('CVR', transaction, `${version} ${version} 1.0.0000 https://www.youtube.com/watch?v=Xe7g_-XuMJw https://www.youtube.com/watch?v=Xe7g_-XuMJw`);
			break;
		  case 'USR':
			const tweener = cleandata[3];
			switch(tweener) {
				case 'I':
				sendData('USR', transaction, 'TWN S lc=1033,id=507,tw=40,fs=1,ru=http%3A%2F%2Fmessenger%2Emsn%2Ecom,ct=1062764229,kpp=1,kv=5,ver=2.1.0173.1,tpf=43f8a4c8ed940c04e3740be46c4d1619');
			}
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