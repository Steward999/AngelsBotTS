// import { io, Socket } from "socket.io-client";
// import { Server as HttpServer } from 'http';
// import { io } from "../app";
import { checkPhoneNumber } from "../data/datasource";
require('dotenv').config();

import socketIO from 'socket.io-client';



// import { Server } from 'socket.io';
// let socket: Socket;

// let socket: any; 

declare global {
    var socket: any;
  }


async function InitIo() {
    
    const serverAddress = "https://69b3-191-104-230-232.ngrok-free.app/";

    
    let response = await checkPhoneNumber("573102605806");
    let token = response["token"];
    console.log(token);

    const socket = socketIO(serverAddress, {
        query: { "x-token": token }
    });


    globalThis.socket = socket;


    // io.opts.query = { "x-token": token };
    // console.log(io.io.opts.query);
    
    // Manejar eventos de conexión
    socket.on('prueba', (data:any) => {

        console.log('Conectado al servidor de sockets');
        console.log(data);
        
    });


    // Manejar eventos de desconexión
    socket.on('disconnect', () => {
        console.log('Desconectado del servidor de sockets');
    });


}


export {InitIo}

// io.on("connection", (socket) => {
//     console.log(`socket ${socket.id} connected`);
  
//     // send an event to the client
//     socket.emit("foo", "bar");
  
//     socket.on("foobar", () => {
//       // an event was received from the client
//     });
  
//     // join the room named "room1"
//     socket.join("room1");
  
//     // broadcast to everyone in the room named "room1"
//     io.to("room1").emit("hello");
  
//     // upon disconnection
//     socket.on("disconnect", (reason) => {
//       console.log(`socket ${socket.id} disconnected due to ${reason}`);
//     });
//   });