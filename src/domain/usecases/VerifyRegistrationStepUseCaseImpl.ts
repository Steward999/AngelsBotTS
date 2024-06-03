import { ChatGptService } from './../../infrastructure/services/ChatGptService';
import { VerifyRegistrationStepUseCase } from './VerifyRegistrationStepUseCase';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class VerifyRegistrationStepUseCaseImpl implements VerifyRegistrationStepUseCase {
  private userRepository: UserRepository;
  private chatGptService: ChatGptService;

  constructor(userRepository: UserRepository, chatGptService: ChatGptService) {
    this.userRepository = userRepository;
    this.chatGptService = chatGptService;
  }

  async execute(message: string, userParam: User): Promise<boolean> {
    const lastStepIndex = userParam.steps!.length - 1;
    const lastStepContent = userParam.steps![lastStepIndex]; // Esto será 'Paso 4'
    console.log("ultimo paso: "+lastStepContent);

    const prompt = `Determina si el siguiente mensaje del usuario cumple con las instrucciones del paso "${lastStepContent}":

Mensaje del usuario: ${message}
Si el mensaje del usuario es un numero, analizar si coincide con los parametros del ID de la app elegida, sino seguir las indicaciones del ultimo paso
Posibles respuestas: cumple, no cumple`;

    const chatGptResponse = await this.chatGptService.getResponse(prompt);
    console.log("Respuest si cumple el ultimo paso: ", chatGptResponse);

    if (chatGptResponse.includes('cumple')) {
      return true;
    } else {
      return false;
    }
    // const existingUser = await this.userRepository.findByPhoneNumber(userParam.phoneNumber);

    // if (!existingUser) {
    //   throw new Error('User not found');
    // }
    //Logica para saber si el mensaje corresponde a lo solicitado en el ultimo paso
    //Agregar logica para verificar si el paso de registro fue completado
    // return stepForm;
  }
}