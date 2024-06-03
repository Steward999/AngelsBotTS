import express, { Router } from "express";
import { WhatsappController } from "../controllers/whatsappController";
import { MessageProcessor } from '../application/MessageProcessor';
import { ChatGptServiceImpl } from "../infrastructure/services/ChatGptServiceImpl";
import { WhatsappServiceImpl } from "../infrastructure/services/WhatsappServiceImpl";
import { VerifyRegistrationStepUseCaseImpl } from "../domain/usecases/VerifyRegistrationStepUseCaseImpl";
import { RegisterStepUseCaseImpl } from "../domain/usecases/RegisterStepUseCaseImpl";
import { UserRepositoryImpl } from "../domain/repositories/UserRepositoryImpl";
import { KnowledgeBaseService } from '../infrastructure/services/KnowledgeBaseService';
import { KnowledgeBaseServiceImpl } from '../infrastructure/services/KnowledgeBaseServiceImpl';

require('dotenv').config();

const router: Router = express.Router();
const apiKey: any = process.env.apiKeyOpenAI;
// console.log(apiKey);
const userRepository = new UserRepositoryImpl(); // Crear una instancia de UserRepositoryImpl

const chatGptService = new ChatGptServiceImpl(apiKey!);
  const whatsappService = new WhatsappServiceImpl();
  const verifyRegistrationStepUseCase = new VerifyRegistrationStepUseCaseImpl(userRepository, chatGptService);
  const registerStepUseCase = new RegisterStepUseCaseImpl(userRepository);
  const knowledgeBaseService = new KnowledgeBaseServiceImpl(chatGptService);
// Create MessageProcessor with dependencies (dependency injection)
const messageProcessor = new MessageProcessor(
  verifyRegistrationStepUseCase,
  registerStepUseCase,
  chatGptService,
  whatsappService,
  knowledgeBaseService,
  userRepository,
);

const controller = new WhatsappController(
  messageProcessor,
  
);

router
  .get("/", (req, res) => controller.verifyToken(req, res)) // En TypeScript, cuando se pasa una función como manejador de eventos (como lo estás haciendo con controller.receiveMessage en las rutas), se pierde el contexto de this
  .post("/", (req, res) => controller.receiveMessage(req, res));

export default router;
