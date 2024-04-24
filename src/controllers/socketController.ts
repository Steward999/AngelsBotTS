// import { io, Socket } from "socket.io-client";
// import { Server as HttpServer } from 'http';
// import { io } from "../app";
import { checkPhoneNumber } from "../data/datasource";
require('dotenv').config();

const serverAddress = "https://7c79-190-96-238-73.ngrok-free.app/";



// let socket: Socket;


async function InitIo(io:any) {
    
    let response = await checkPhoneNumber("573102605806");
    let token = response["token"];
    console.log(response);
    
    io.io.opts.query = { "x-token": token };

    // io = io(serverAddress, {
    //     query: { "x-token":token }
    // });

    // Manejar eventos de conexión
    io.on('prueba', (data:any) => {

        console.log('Conectado al servidor de sockets');
        console.log(data);
        
    });


    // Manejar eventos de desconexión
    // socket.on('disconnect', () => {
    //     console.log('Desconectado del servidor de sockets');
    // });


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