import express, { Application, Request, Response } from "express";
import { Server as HttpServer, createServer } from 'http';
import apiRouter from "./routes/routes";
// import { User } from './domain/entities/User';

// Services and Use Cases (assuming appropriate implementations)
// import { ChatGptService } from './infrastructure/services/ChatGptService';
// import { WhatsappService } from './infrastructure/services/WhatsappService';
// import { VerifyRegistrationStepUseCase } from './domain/usecases/VerifyRegistrationStepUseCase';
// import { RegisterStepUseCase } from './domain/usecases/RegisterStepUseCase';
// import { ChatGptServiceImpl } from "./infrastructure/services/ChatGptServiceImpl";
// import { WhatsappServiceImpl } from "./infrastructure/services/WhatsappServiceImpl";
// import { VerifyRegistrationStepUseCaseImpl } from "./domain/usecases/VerifyRegistrationStepUseCaseImpl";
// import { RegisterStepUseCaseImpl } from "./domain/usecases/RegisterStepUseCaseImpl";

// Other Dependencies
import { MongoDatabase } from "./data/mongoDB";
// import { UserRepositoryImpl } from "./domain/repositories/UserRepositoryImpl";
// import { MessageProcessor } from "./application/MessageProcessor";
import { Socket } from "./controllers/socketController";
import { WhatsappServiceImpl } from "./infrastructure/services/WhatsappServiceImpl";
// import { WhatsappController } from "./controllers/whatsappController";
require('dotenv').config();

async function main() {
//   // Configure and initialize services and use cases
//   const apiKey = process.env.OPENAI_API_KEY;
//   const chatGptService = new ChatGptServiceImpl(apiKey!);
//   const whatsappService = new WhatsappServiceImpl();
//   const verifyRegistrationStepUseCase = new VerifyRegistrationStepUseCaseImpl(new UserRepositoryImpl());
//   const registerStepUseCase = new RegisterStepUseCaseImpl(new UserRepositoryImpl());

  await MongoDatabase.connect({
    mongoUrl: 'mongodb+srv://bayronstewardmaldonadogomez:raoKLAYzwRzl2V5g@angelsstreameragency.eakqebc.mongodb.net/?retryWrites=true&w=majority&appName=AngelsStreamerAgency/AngelsBot'
  });

  // Initialize Express app
  const app: Application = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const httpServer = createServer(app);

//   // Create MessageProcessor with dependencies (dependency injection)
//   const messageProcessor = new MessageProcessor(
//     verifyRegistrationStepUseCase,
//     registerStepUseCase,
//     chatGptService,
//     whatsappService
//   );

//   const controller = new WhatsappController(
//     messageProcessor,
    
//   );

  // Mount routes with messageProcessor as dependency
  app.use("/whatsapp", apiRouter);

  const portString: string | undefined = process.env.PORT || "3000";
  const PORT: number = parseInt(portString, 10);

  httpServer.listen(PORT, () => {
    console.log("El puerto es: " + PORT);
  });
  const whatsappService = new WhatsappServiceImpl();
  const socketInstance = new Socket(whatsappService);
  socketInstance.InitIo();
  // InitIo();
}

main();

// import express, { Application, Request, Response } from "express";
// import apiRouter from "./routes/routes";
// require('dotenv').config();

// import { Server as HttpServer, createServer } from 'http';
// import { MongoDatabase } from "./data/mongoDB";



// const app: Application = express();
// const bodyParser = require("body-parser");
// const httpServer = createServer(app);
// MongoDatabase.connect({mongoUrl: 'mongodb+srv://bayronstewardmaldonadogomez:raoKLAYzwRzl2V5g@angelsstreameragency.eakqebc.mongodb.net/?retryWrites=true&w=majority&appName=AngelsStreamerAgency/AngelsBot'});


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const portString: string | undefined = process.env.PORT || "3000";
// const PORT: number = parseInt(portString, 10);

// app.use(express.json());

// app.use("/whatsapp", apiRouter);

// httpServer.listen(3000, () => {
//     console.log("El puerto es: " + PORT)
// });

// // InitIo();
