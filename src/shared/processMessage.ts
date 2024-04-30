import { MessageText } from "../models/whatsappModel";
import { sendMessageWhatsApp } from "../services/whatsappService";
import { GetMessageChatGPT } from "../services/chatGPTService";
import { MensajeModel } from "../models/chatModel";
import { } from "../flows/livuyaarflow"
import { addPhoneNumber, checkPhoneNumber } from "../data/datasource";
// import { socket } from "../controllers/socketController";
// import { InitIo, socket } from '../controllers/socketController';

import AIClass from "../services/GTP-Completions"
// import { Socket } from "socket.io-client";
require('dotenv').config();

const apiKey: string | undefined = process.env.apiKeyOpenAI;
var welcome: boolean = true;


async function Process(textUser: string, number: string) {
  textUser = textUser.toLowerCase();
  var models: string[] = [];
  const ai = new AIClass(apiKey!, "gpt-3.5-turbo");

  try {
    const isntPhoneNumberRegistered = await addPhoneNumber(number);
    console.log(isntPhoneNumberRegistered);
    
    if (isntPhoneNumberRegistered.ok) {
      // El número de teléfono ya está registrado en la base de datos
      

      //Luego colocar una condicion si ya ese numero ha elegido un flujo y no volver a enrar a tenerminar el flujo si no se ermina el anterior
      const prompt = `Como un asesor inteligente de una empresa de streaming, tu tarea es analizar el contexto de una conversación y determinar cuál de los siguientes flujos de conversacion es el más apropiado para realizar:
        --------------------------------------------------------
        Historial de conversación:
        {HISTORY}
        
        Posibles acciones a realizar:
        1. REGISTRARSE EN UNA APP: Esta acción se debe realizar cuando el cliente expresa su interes en usar alguna de las apps que maneja la empresa.
        2. HABLAR: Esta acción se debe realizar cuando el cliente desea hacer una pregunta o necesita más información.
        -----------------------------
        Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.
        
        Respuesta ideal (REGISTRASE EN UNA APP|HABLAR):`

      const text = await ai.createChat([
        {
          role: 'system',
          content: prompt
        }
      ])
      console.log("texto de respuesta: ", text);
      if (text != null) {
        // if (text.includes('HABLAR')) return gotoFlow()
        // if (text.includes('AGENDAR')) return gotoFlow(welcome)

      }
    } else {
      // El número de teléfono ya está registrado en la base de datos
      const isPhoneNumberRegistered = await checkPhoneNumber(number);
      console.log("Data devuelta del numero registrado");
      
      console.log(isPhoneNumberRegistered);
      if (isPhoneNumberRegistered.ok) {
        // const messageJson = { numero: number, mensaje: textUser }
        // socket.emit('numeroWpp', messageJson);

   
        const prompt = `🪽Hola linda, lee la siguiente información para poder asesorarte: 

        Ten en cuenta que en todas las aplicaciones podrás ver y hacer contenido explicito: (No descargar desde el Play Store). 
         
        💚 LivuYaar: ⛔No disponible en: Venezuela, EEUU, Puerto Rico, Rep. Dom.
        👁 Chicas sin experiencia/ RECOMENDADA.
        🔞Edades: 18 a 60 años.
        _____
        
        💛 Olive: 👁Chicas sin experiencia. 
        🔞Edades de 18-50 años.
        💸Pagos a Binance.
         _____
        
        💜 Livchat: 👁Chicas con experiencia.
        🔞Edades: 18 a 39 años.
        📳Monetizas en la zona match después de 20 seg.
        _____
        
        🧡 Hiti: 👁Chicas con experiencia.
        🔞Edades: 18-50 años.
        📳Monetizas en zona match después de los 20 seg.
        _____
        
        🩷 App Salsa: ⛔No disponible para iPhone/ Huawei. 
        👁Chicas con experiencia.
        🔞Edades:18 a 39 años.
        🦄Podrás hacer Videollamada y Livestreaming. 
        📳No monetizas en Zona Match.
        _____
        
        💙 Superlive: 👁Chicas con experiencia realizando Live streaming.
        🔞Edades: 18 a 43 años. 
        🎁Ganas únicamente por los regalos que obtengas durante tus Lives. 
         _____
        
        💗 Po.Live: ⛔No disponible en Venezuela.
        👁Chicas con experiencia realizando Live streaming.
        🔞Edades: 18 a 50 años.
        🎁Ganas únicamente por los regalos que obtengas durante tus Lives.
        🚫Prohibido el contenido explicito.`

        const text = await ai.createChat([
          {
            role: 'system',
            content: prompt
          }
        ])

        if (text != null) {
          // if (text.includes('HABLAR')) return gotoFlow()
          // if (text.includes('AGENDAR')) return gotoFlow(welcome)
          // console.log("texto de respuesta: ", text);
          // var model = MessageText(text!, number);
          // models.push(model);
  
        }
      }
     

    }
  } catch (error) {
    console.error("Error al verificar el número de teléfono:", error);
  }

  //#region sin ChatGPT
  // if (textUser.includes("hola")) {
  //     //Saludo
  //     var model = MessageText("Hola linda. Bienvenida a Angles Agency", number);
  //     models.push(model);
  //     console.log("Model push: "+ models);
  // }else if (textUser.includes("gracias")) {
  //     //Agradecimiento
  //     var model = MessageText("Gracias a ti por contactarnos linda", number);
  //     models.push(model);
  // }
  // else if (textUser.includes("adios") ||
  // textUser.includes("adiós") ||
  // textUser.includes("bye") ||
  // textUser.includes("me voy")) {
  //     //Agradecimiento
  //     var model = MessageText("Nos vemos linda", number);
  //     models.push(model);
  // }else{
  //     //No entiende
  //     var model = MessageText("No entiendo linda", number);
  //     models.push(model);
  // }
  //#endregion

  //#region con ChatGPT
  // if (IsQuestionAboutAgency(textUser)) {
  //     console.log("Entra a la pregunta en process");
  //     const resultChatGPT = await getCompanyInfoFromFile(textUser);
  //     if (resultChatGPT != null) {
  //         myConsole.log("Respuesta a "+number+": "+resultChatGPT);
  //         var model = MessageText(resultChatGPT, number);
  //         models.push(model);
  //     } else {
  //         var model = MessageText("Lo siento algo salio mal, intentalo mas tarde", number);
  //         models.push(model);
  //     }

  // } else {

  console.log("Entra al proceesMesage");

  // console.log(`${number}: Dice: ${textUser}`);
  // {
  //     de: number,
  //     para: 573102605806,
  //     message: string,
  // }
  // const resultChatGPT = await GetMessageChatGPT(textUser);

  // console.log("Respuesta a "+number+": "+resultChatGPT);


  // if (resultChatGPT != null) {
  //     // myConsole.log("Respuesta a "+number+": "+resultChatGPT);
  //     var model = MessageText(resultChatGPT, number);
  //     models.push(model);
  // } else {
  //     var model = MessageText("Lo siento algo salio mal, intentalo mas tarde", number);
  //     models.push(model);
  // }
  // }
  //#endregion

  models.forEach(model => {
    sendMessageWhatsApp(model);
  });
}

// Usar la funcion para detectar la intencion de pregunta y luego enviarlo al modelo entrenado de chatGPT para responder preguntas
// function IsQuestionAboutAgency(textUser: string): boolean {
//     const agencyKeywords: string[] = ["agencia", "app","binance","advcash", "servicios", "información","informacion", "pago", "saber más sobre", "explicar", "Bancos", "novia virtual"];
//     for (const keyword of agencyKeywords) {
//         if (textUser.toLowerCase().includes(keyword)) {
//             return true;
//         }
//     }
//     return false;
// }

export { Process };
