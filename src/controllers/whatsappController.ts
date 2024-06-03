import { Request, Response } from "express";
import { MessageProcessor } from "../application/MessageProcessor";
// import { VerifyRegistrationStepUseCase } from '../domain/usecases/VerifyRegistrationStepUseCase';
// import { RegisterStepUseCase } from '../domain/usecases/RegisterStepUseCase';
// import { ChatGptService } from '../infrastructure/services/ChatGptService';
// import { WhatsappService } from '../infrastructure/services/WhatsappService';
// import { User } from "../domain/entities/User";


export class WhatsappController {
    private readonly messageProcessor: MessageProcessor;

    constructor(
        // verifyRegistrationStepUseCase: VerifyRegistrationStepUseCase,
        // registerStepUseCase: RegisterStepUseCase,
        // chatGptService: ChatGptService,
        // whatsappService: WhatsappService,
        messageProcessor: MessageProcessor
    ) {
        this.messageProcessor = messageProcessor
        // new MessageProcessor(
        //     verifyRegistrationStepUseCase,
        //     registerStepUseCase,
        //     chatGptService,
        //     whatsappService,
        // );
    }

    public async verifyToken(req: Request, res: Response): Promise<void> {
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

    public async receiveMessage(req: Request, res: Response): Promise<void> {
        let number: string;
        try {

            const entry = req.body["entry"][0];
            const changes = entry["changes"][0];
            const value = changes["value"];
            const messageObject = value["messages"];

            if (typeof messageObject !== "undefined") {
                
                const messages = messageObject[0];
                number = messages["from"];
                console.log("nuemro a enviar: ", number);
                socket.emit('numeroWpp', number);
                const text = this.GetTextUser(messages);
                // const userId = messages["id"]; // Replace with actual ID generation logic
                const phoneNumber = messages["from"]; // Extracted from the incoming message (replace with your logic)
                // const stepsCompleted: number[] = []; // Initially empty

                console.log(`${number}: Dice: ${text}`);
                if (text !== "") {
                    const dataSend = {
                        de: messageObject[0].from,
                        para: "+573102605806",
                        mensaje: messageObject[0].text.body
                    }
                    socket.emit('mensaje-personal', dataSend);
                    await this.messageProcessor.processMessage(text, phoneNumber);
                }
            }

            res.send("MESSAGE_RECEIVED");
        } catch (e) {
            res.status(400).send("MESSAGE_NOT_RECEIVED");
        }
    }

    private GetTextUser(messages: any): string {
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
                }
                break;
            case "audio":
                console.log("respuesta a enviar al recibir un audio");
                return "undefined";
            case "image":
                return "undefined";
            default:
                break;
        }

        return text;
    }

}

