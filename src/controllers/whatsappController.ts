import fs from "fs";
import { Request, Response } from "express";
import { Process } from "../shared/processMessage";
import { io } from "socket.io-client";
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));

const serverAddress = "https://e9d6-190-96-158-246.ngrok-free.app/";
const socket = io(serverAddress);

const VerfyToken = (req: Request, res: Response) => {
    try {
        const accessToken = process.env.accessToken;
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (challenge != null && token != null && token == accessToken) {
            console.log("Token correcto");
            
            res.send(challenge);
        } else {
            res.status(400).send("Token incorrecto");
        }

    } catch (e: any) {
        res.status(400).send(e.message);
    }

}

const RecivedMessage = async (req: Request, res: Response) => {
    let number: string;
    try {
        const entry = req.body["entry"][0];
        const changes = entry["changes"][0];
        const value = changes["value"];
        const messageObject = value["messages"];

        if (typeof messageObject !== "undefined") {
            const messages = messageObject[0];
            number = messages["from"];
            const text = GetTextUser(messages);
            // myConsole.log(`${number}: Dice: ${text}`);
            console.log(`${number}: Dice: ${text}`);
            if (text !== "") {
                
                await Process(text, number);
            }
        }

        res.send("EVENT_RECEIVED");
    } catch (e) {
        // myConsole.log("Error al recibir el mensaje de " + number, " Error:" + e);
        res.send("EVENT_RECEIVED");
    }
}

function GetTextUser(messages: any): string {
    let text = "";
    const typeMessage = messages["type"];
    switch (typeMessage) {
        case "text":
            text = messages["text"]["body"];
            break;
        case "interactive":
            const interactiveObject = messages["interactive"];
            const typeInteractive = interactiveObject["type"];

            if (typeInteractive == "button_reply") {
                text = interactiveObject["button_reply"]["title"];

            } else if (typeInteractive == "list_reply") {
                text = interactiveObject["list_reply"]["title"];
                myConsole.log(text);
            } else {
                myConsole.log("Sin mensaje")
            }
            break;
        case "audio":
            // const model = whatsappModel.MessageText("Por el momento no puedo escuchar audios, por favor escríbeme", number);
            console.log("respuesta a enviar al recibir un audio");
            // console.log(model);
            // whatsappService.sendMessageWhatsApp(model);
            return "undefined";
            break;
        case "image":
            // const model = whatsappModel.MessageText("Por el momento no puedo procesar imagenes, por favor escríbeme", number);
            // whatsappService.sendMessageWhatsApp(model);
            return "undefined";
            break;
        default:
            myConsole.log("No llego ningun mensaje")
            break;
    }

    return text;
}

export { VerfyToken, RecivedMessage };
