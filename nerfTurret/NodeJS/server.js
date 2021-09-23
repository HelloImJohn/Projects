//START OF DEBUGOPTIONS
let logPortData = true;
let printCoordsInConsole = false;
let askForPort = true;
//Type specific arduino port here (works only if you set aksForPort to "false"
let type_port_here = "/dev/cu.usbmodem142201";

//END OF DEBUG OPTIONS
//Import readlineSync for user interaction
let readlineSync = require('readline-sync');
//Get Port from User Input
var portInput;
if(askForPort) {
    var portInput = readlineSync.question("Arduino Port:");
}
//Import SerialPort
let SerialPort = require('serialport');
//Import parser
let Readline = require('@serialport/parser-readline');
//Create SerialPort
var port;
if(askForPort){
    var port = new SerialPort(portInput, {
        baudRate:115200
    })
}else{
    var port = new SerialPort(type_port_here, {
        baudRate:115200
    })
}
//Create parser
let parser = new Readline();
port.pipe(parser);
//Import express for http server
let express = require('express');
//Import socket for client2server connection
let socket = require('socket.io');
//Init http server
let app = express();
let server = app.listen(80);
//Link socket to server
let io = socket(server);

var inter = false;

var shootData = 0;
//Use /web/ folder as static-folder for the http server
app.use(express.static('web'));

console.log("TurtleNET is running...");
//On client connect to server:
io.on('connection', function (socket) {
    //Print msg
    console.log("Client connected");
    //On JavaScript send packet, named distance, this function is called
    socket.on('nosePos',function (data) {
                                                      //Print data from JS in console
        //console.log(data);
        //sendData(data);
        if (!inter) {
          inter = true;
          //setInterval(console.log(data), 1000);
          setInterval(function () {
            port.write("X" + shootData.mx.toString() + "Y" + shootData.my.toString()+"S"+shootData.shoot.toString());
            //port.write("X20" + "Y40");
            if(printCoordsInConsole) {
                console.log(shootData);
            }
          },100);
          //sendData(data)
        }
        shootData = data;
        //console.log(data);
        //setInterval(sendData(data), 1000);
    })
    //On client disconnect from server:
    socket.on('disconnect',function () {
        //Print msg
        console.log("Client disconnected");
        shootData.mx = 90;
        shootData.my = 90;
    })
})
port.on('open', function () {
    console.log("Connected to Arduino-Port");
    if(logPortData){
        port.on('data', function (data) {
            console.log("Data: "+data);
        })
    }
    port.on('close', function () {
        console.log("Disconnected from Arduino-Port");
    })
})

//function to send commands to the arduino on the defined port
function sendData(data) {
  /*
    if(this.port != null && this.parser != null){

        if(bufferData){
            port.write(Buffer.from(data.mx));
            console.log(data.mx);
        }else{
            port.write(data.mx);
            console.log(data.mx);
        }
    }
    */
    //port.write("X" + toString(data.mx) "Y" + toString(data.my));
    port.write("X" + data.mx.toString());
    //setInterval(port.write("X" + data.mx.toString()), 1000);
    //console.log(data.mx.toString());

}
function sendStuff(shootData) {
  port.write("X" + shootData.mx.toString());
}

//setInterval(port.write("X" + data.mx.toString()), 1000);
//setInterval(sendStuff(), 1000);
