var http = require('http');
var fs      = require("fs");
var count = 0;
var global_variable_Channels = {};

var clients = [];
var server = http.createServer(
function(request, response) {
	console.log("Server created");
	
});


server.listen(2345, function() {
    console.log((new Date()) + ' Server is listening on port 2345');
});


var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(r){
    // Code here to run on connection
	
	var connection = r.accept('echo-protocol', r.origin);
	// count = 0;
		
	// Specific id for this client & increment count
	var id = count++;
	console.log(id);
	// Store the connection method so we can loop through & contact all clients
	clients[id] = connection;

	console.log(connection.remoteAddress+' Connection accepted [' + id + ']  ---Clients:'+ clients.length);
	
	
// Create event listener for message
	connection.on('message', function(e) {
						console.log(JSON.parse(e.utf8Data).open);
								var data = JSON.parse(e.utf8Data);
								var room;

								// if someone asked to open/join a room
								if (data.open) {
									
								console.log("dataOpen::"+data.channel);
									room = global_variable_Channels[data.channel];
									
								
									if (room)
										room.push(connection);
									else{
										room = [connection];
										global_variable_Channels[data.channel] = room;
									}
									console.log("Global variable Channel is::"+global_variable_Channels.toString());
									console.log("Rooom is::"+room);									
										
								} else {
									// otherwise transmit data over relevant websockets
									var message = data.data;
								console.log("Massage::"+JSON.stringify(message));
								console.log("Rooom in else1 is::"+room);
								console.log("Global variable Channel in ELSE is::"+global_variable_Channels.toString());
									// capture relevant signaling room
									room = global_variable_Channels[data.channel];
								console.log("Rooom in else2 is::"+room);	
									if (room == null) throw 'No such signaling-room exists.';									
									// iterate over all websockets using same room-id
									for (var i = 0; i < room.length; i++) {
										var websocket = room[i];										
										// transmit data over those websockets
										websocket.send(JSON.stringify(message));
									}
								}
	});
	
	
// Create event listener for closing connection 	
	connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.'+reasonCode+"-----"+description);
	});

	
});



/*wsServer.on('request', function(r){
    // Code here to run on connection
	
	var connection = r.accept('echo-protocol', r.origin);
	// count = 0;
		
	// Specific id for this client & increment count
	var id = count++;
	console.log(id);
	// Store the connection method so we can loop through & contact all clients
	clients[id] = connection;

	console.log(connection.remoteAddress+' Connection accepted [' + id + ']  ---Clients:'+ clients.length);

	websocket.onerror = function(e) {
		console.log("Error"+e.data);
	}
	
// Create event listener for message    open    channel  data	
	websocket.onmessage = function(e) {
								console.log(e);
								var data = e.data, room;

								// if someone asked to open/join a room
								if (data.open) {
									room = global_variable_Channels[data.channel];
									if (room)
										room.push(websocket);
									else
										room = [websocket];
								} else {
									// otherwise transmit data over relevant websockets
									var message = data.message;
									
									// capture relevant signaling room
									room = global_variable_Channels[data.channel];
									
									if (room == null) throw 'No such signaling-room exists.';									
									// iterate over all websockets using same room-id
									for (var i = 0; i < room.length; i++) {
										var websocket = room[i];										
										// transmit data over those websockets
										websocket.send(data);
									}
								}
						};
	
/*	
// Create event listener for closing connection 	
	connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.'+reasonCode+"-----"+description);
	});

	
//});
*/











