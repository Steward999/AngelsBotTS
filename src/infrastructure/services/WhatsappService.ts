import { Message } from '../../models/whatsappModel';

export interface WhatsappService {
  sendMessage(messageText: Message): Promise<void>;
}