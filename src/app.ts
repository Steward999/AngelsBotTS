import express, { Application, Request, Response } from "express";
import apiRouter from "./routes/routes";
// import { createServer, Server as htt } from "http";
// import { Socket } from "socket.io";
require('dotenv').config();

import { Server as HttpServer, createServer } from 'http';
import { MongoDatabase } from "./data/mongoDB";
// import { io,  } from "socket.io-client";
import socketIO from 'socket.io-client';

import { InitIo } from "./controllers/socketController";


const app: Application = express();
const bodyParser = require("body-parser");
const httpServer = createServer(app);
MongoDatabase.connect({mongoUrl: 'mongodb+srv://bayronstewardmaldonadogomez:raoKLAYzwRzl2V5g@angelsstreameragency.eakqebc.mongodb.net/?retryWrites=true&w=majority&appName=AngelsStreamerAgency/AngelsBot'});
// const io = new Server(httpServer);




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const portString: string | undefined = process.env.PORT || "3000";
const PORT: number = parseInt(portString, 10);




app.use(express.json());

app.use("/whatsapp", apiRouter);

httpServer.listen(3000, () => {
    console.log("El puerto es: " + PORT)
});
// app.listen(PORT, () => console.log("El puerto es: " + PORT));

const serverAddress = "https://7c79-190-96-238-73.ngrok-free.app/";

// const socket = io(serverAddress);
// Asignar el objeto socket globalmente
const io = socketIO(serverAddress);
// (global as any).io = socket;

// export { io };
InitIo(io);
