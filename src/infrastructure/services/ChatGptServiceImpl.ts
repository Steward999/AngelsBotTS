import { ChatGptService } from './ChatGptService';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import AIClass from './GTP-Completions';

export class ChatGptServiceImpl implements ChatGptService {
  private ai: AIClass;

  constructor(apiKey: string,) {
    
    this.ai = new AIClass(apiKey, 'gpt-3.5-turbo');
  }

  async getResponse(message: string, systemPrompt?: string): Promise<string> {
    const chatMessages: ChatCompletionMessageParam[] = [];
    // Añadir el mensaje del role de system si se proporciona
  if (systemPrompt) {
    chatMessages.push({
      role: 'system',
      content: systemPrompt,
    });
  } else {
    chatMessages.push({
      role: 'system',
      content: "Eres un asistente virtual de la agencia Angels Streamers Agency, Ayudas a las chicas a que realizen el paso a paso que se les envia para registrarse en la app. da respuestas cortas y faciles de entender. y las apps que esta maneja, solo responde preguntas sobre la agencia y las apps que esta maneja. Se amigable con las chicas. usa un tono amigable, puedes enviar emojis",
    });
  }

  // Añadir el mensaje del usuario
  chatMessages.push({ role: 'user', content: message });
  
  const response = await this.ai.createChat(chatMessages);

    // const response = await this.ai.createChat([
    //     {
    //       role: 'system',
    //       content: "Eres un asistente virtual de la agencia Angels Streamers Agency, Ayudas a las chicas a que realizen el paso a paso que se les envia para registrarse en la app. da respuestas cortas y faciles de entender. y las apps que esta maneja, solo responde preguntas sobre la agencia y las apps que esta maneja. Se amigable con las chicas. usa un tono amigable, puedes enviar emojis",
    //     },
    //     {role: "user", content: message},
    //   ]);

    if (response === null) {
      // Manejar el caso cuando la respuesta es nula
      return 'Error al obtener la respuesta de ChatGPT';
    }

    return response;
  }

  async getEmbedding(message: string): Promise<number[] | string> {
    

    const response = await this.ai.createEmbedding(message, 'text-embedding-ada-002');

    if (response === null) {
      // Manejar el caso cuando la respuesta es nula
      return 'Error al obtener la respuesta de ChatGPT';
    }

    return response;
  }

  async getAvailableApps(): Promise<string> {
    // Aquí puedes interactuar con tu base de datos vectorial para obtener la lista de aplicaciones disponibles
    const availableApps = ['LIVU', 'YAAR', 'OtherApp1', 'OtherApp2'];
    const response = `Bienvenido(a), estas son las aplicaciones disponibles para registrarse:\n\n${availableApps.join('\n')}\n\nPor favor, selecciona una aplicación para iniciar el proceso de registro.`;
    const responseGPT = this.getResponse(response);
    return responseGPT;
   }
}