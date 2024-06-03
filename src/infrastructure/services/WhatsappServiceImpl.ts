import { WhatsappService } from './WhatsappService';
import { Message } from '../../models/whatsappModel';
import https from 'https';

export class WhatsappServiceImpl implements WhatsappService {
  async sendMessage(messageText: Message): Promise<void> {
    const data = JSON.stringify(messageText); // Use the Message object directly

    const options: https.RequestOptions = {
      host: "graph.facebook.com",
      path: "/v19.0/269869649537102/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer EAAFRn16c60UBO0AyLbZA76MkSBBtxXO3ZBCzEoFJUZBM7mVxlstRsUvZBeaaGJN3HANc3SCZBYuogeGBDopNsCbwEABIWV1PXIwoWxEj6te1Jy6eZALrhMhiQwpBabNiyDwHR2gSZCKhgucz5C04hSRZCq7TGZA6XP3pUwdqRoJBVLj41jjZAsu4Ybgyvr2KCraQGYJ1xeZB7fYOQweshBc",
      },
    };

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.write(data);
    req.end();
  }
}