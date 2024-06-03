// import { io, Socket } from "socket.io-client";
// import { Server as HttpServer } from 'http';
// import { io } from "../app";
import { checkPhoneNumber } from "../data/datasource";
require('dotenv').config();
import socketIO from 'socket.io-client';
import { WhatsappServiceImpl } from "../infrastructure/services/WhatsappServiceImpl";
import { MessageText } from "../models/whatsappModel";



// import { Server } from 'socket.io';
// let socket: Socket;

// let socket: any; 

declare global {
    var socket: any;
  }


class Socket {
    private whatsappService: WhatsappServiceImpl;

constructor(whatsappService: WhatsappServiceImpl,) {
  // Crear una instancia del servicio
  this.whatsappService = whatsappService;
}
    async InitIo(){



        const serverAddress = "https://38de-179-1-198-40.ngrok-free.app/";
    
        
        let response = await checkPhoneNumber("573102605806");
        console.log(response["ok"]);
        
        if (response["ok"] != false) {
            let token = response["token"];
            console.log(token);
        
            const socket = socketIO(serverAddress, {
                query: { "x-token": token }
            });
        
        
            globalThis.socket = socket;
            
        }
    
    
        // io.opts.query = { "x-token": token };
        // console.log(io.io.opts.query);
        
        // Manejar eventos de conexión
        socket.on('prueba', (data:any) => {
    
            console.log('Conectado al servidor de sockets');
            console.log(data);
            
        });
    
        //Recibir mensaje desde la plataforma
        socket.on('mensaje-bot', (data:any) => {
    
            console.log('Mensaje recibido desde la plataforma');
            console.log(data);
            const messageModel = MessageText(data.mensaje, data.para);
            this.whatsappService.sendMessage(messageModel);
            
        });
    
        // socket.emit('numeroWpp', (data:any) => {
    
        //     console.log('Conectado al servidor de sockets');
        //     console.log(data);
            
        // });
    
    
        // Manejar eventos de desconexión
        socket.on('disconnect', () => {
            console.log('Desconectado del servidor de sockets');
        });
    }


}


export {Socket}