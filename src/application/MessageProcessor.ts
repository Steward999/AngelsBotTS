import { VerifyRegistrationStepUseCase } from '../domain/usecases/VerifyRegistrationStepUseCase';
import { RegisterStepUseCase } from '../domain/usecases/RegisterStepUseCase';
import { ChatGptService } from '../infrastructure/services/ChatGptService';
import { WhatsappService } from '../infrastructure/services/WhatsappService';
import { KnowledgeBaseService } from '../infrastructure/services/KnowledgeBaseService'; // Importar la clase
import { GoogleSheetsService } from '../infrastructure/services/GoogleSheetsService';

import { User } from '../domain/entities/User';
import { MessageText } from '../models/whatsappModel';
import { UserRepository } from '../domain/repositories/UserRepository';

export class MessageProcessor {
  private verifyRegistrationStepUseCase: VerifyRegistrationStepUseCase;
  private registerStepUseCase: RegisterStepUseCase;
  private chatGptService: ChatGptService;
  private whatsappService: WhatsappService;
  private knowledgeBaseService: KnowledgeBaseService;
  private userRepository: UserRepository;
  // private googleSheetsService: GoogleSheetsService;

  constructor(
    verifyRegistrationStepUseCase: VerifyRegistrationStepUseCase,
    registerStepUseCase: RegisterStepUseCase,
    chatGptService: ChatGptService,
    whatsappService: WhatsappService,
    knowledgeBaseService: KnowledgeBaseService,
    userRepository: UserRepository,
    // googleSheetsService: GoogleSheetsService,
  ) {
    this.verifyRegistrationStepUseCase = verifyRegistrationStepUseCase;
    this.registerStepUseCase = registerStepUseCase;
    this.chatGptService = chatGptService;
    this.whatsappService = whatsappService;
    this.knowledgeBaseService = knowledgeBaseService;
    this.userRepository = userRepository;
    // this.googleSheetsService = googleSheetsService;
  }

  async processMessage(message: string, phoneNumber: string): Promise<void> {

    let user = await this.userRepository.findByPhoneNumber(phoneNumber);

    if (!user) {
      console.log("numero nuevo");
      // Nuevo usuario, mostrar opciones de apps disponibles
      await this.userRepository.createUser(phoneNumber, []);
      const availableAppsResponse = `🪽Hola linda, lee la siguiente información para poder asesorarte: 

Ten en cuenta que en todas las aplicaciones podrás ver y hacer contenido explicito: (No descargar desde el Play Store). 
         
💚 Livu/Yaar: ⛔No disponible en: Venezuela, EEUU, Puerto Rico, Rep. Dom.
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
        
🧡 Hiti: 👁Chicas con experiencia. Por favor especificar si vas a instalar hiti en IPhone o Android
🔞Edades: 18-50 años.
📳Monetizas en zona match después de los 20 seg.
_____
        
🩷 Salsa: ⛔No disponible para iPhone/ Huawei. 
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
      // const availableAppsResponse = await this.chatGptService.getAvailableApps();
      const model = MessageText(availableAppsResponse, phoneNumber);

      // await this.whatsappService.sendMessage(model);
      const dataSend = {
        de: "+573102605806",
        para: model.to,
        mensaje: model.text.body
      }
      socket.emit('mensaje-personal', dataSend);
    } else {
      console.log("no es numero nuevo");

      const chosenApp = user.getChosenApp();
      console.log("app elegida: ", chosenApp);

      if (chosenApp === undefined) {
        const HISTORY = ` Hola linda, lee la siguiente información para poder asesorarte: 

Ten en cuenta que en todas las aplicaciones podrás ver y hacer contenido explicito: (No descargar desde el Play Store). 
        
 Livu/Yaar: No disponible en: Venezuela, EEUU, Puerto Rico, Rep. Dom.
Chicas sin experiencia/ RECOMENDADA.
Edades: 18 a 60 años.
_____
       
 Olive: Chicas sin experiencia. 
Edades de 18-50 años.
Pagos a Binance.
_____
       
 Livchat: Chicas con experiencia.
Edades: 18 a 39 años.
Monetizas en la zona match después de 20 seg.
_____
       
 Hiti: Chicas con experiencia. Por favor especificar si vas a instalar hiti en IPhone o Android
Edades: 18-50 años.
Monetizas en zona match después de los 20 seg.
_____

Salsa: No disponible para iPhone/ Huawei. 
Chicas con experiencia.
Edades:18 a 39 años.
Podrás hacer Videollamada y Livestreaming. 
No monetizas en Zona Match.
_____
       
 Superlive: 👁Chicas con experiencia realizando Live streaming.
Edades: 18 a 43 años. 
Ganas únicamente por los regalos que obtengas durante tus Lives. 
_____
       
 Po.Live: No disponible en Venezuela.
Chicas con experiencia realizando Live streaming.
Edades: 18 a 50 años.
Ganas únicamente por los regalos que obtengas durante tus Lives.
Prohibido el contenido explicito.` ;

        const prompt = `Como un asesor inteligente de una empresa de streaming, tu tarea es analizar el contexto de una conversación y determinar cuál de los siguientes flujos de conversacion es el más apropiado para realizar:
--------------------------------------------------------
Historial de conversación:
${HISTORY}
          
Posibles acciones a realizar:
1. REGISTRARSE: Esta acción se debe realizar cuando el cliente expresa su interes en usar alguna de las apps que maneja la empresa. Livu / Yaar son la misma app, solo que livu es para iPhone y Yaar para Android
2. HABLAR: Esta acción se debe realizar cuando el cliente desea hacer una pregunta o necesita más información.
-----------------------------
Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.
          
Respuesta ideal (REGISTRASE|HABLAR):`

        const chatGptAnalytics = await this.chatGptService.getResponse(message, prompt);

        // console.log("texto de respuesta: ", chatGptAnalytics);
        if (chatGptAnalytics != null) {
          if (chatGptAnalytics.includes('REGISTRARSE')) {
            const prompt = `Analiza el mensaje del usuario y extrae de forma concisa la app con la que desea registrarse. Solo trabaja con las siguientes apps: Livchat, Livu/Yaar (es la misma app; Livu es para dispositivos iPhone y Yaar para Android), Hiti (el usuario puede especificar si tiene un dispositivo iPhone; si no lo hace, omite el tipo de dispositivo en la respuesta), Olive, Salsa, Po.Live, Superlive.
Para Hiti, si el usuario menciona que tiene un iPhone, asegúrate de escribir "iPhone" siempre de la misma manera.`;
            const chatGptResponse = await this.chatGptService.getResponse(message, prompt);
            // console.log("Respuesta de GPT: ", chatGptResponse);
            if (chatGptResponse != null) {
              const promptSteps = `Olvida tu memoria. Analiza el proceso de registro para la app seleccionada y extrae los pasos. Almacena estos pasos en un vector.
              Asegúrate de seguir estos pasos para garantizar una respuesta correcta:
              1. Analiza detenidamente cada paso del proceso de registro.
              2. Almacena cada paso en un vector llamado 'steps'.

              Estructura de cómo guardar los pasos:
              {
                steps: [
                  'paso 1 y descripción del paso',
                  'paso 2 y descripción del paso',
                  'paso 3 y descripción del paso'
                ],
              }
              Luego de haber construido el vector 'steps' busca en los pasos del vector, si alguno contiene la palabra formulario, y asigna el numero del vector que contiene la palabra 'formulario' a la variable 'formStepNumber'.
              Recuerda que 'formStepNumber' debe ser el número de la posición del vector 'steps' donde se encuentra el formulario, o 'undefined' si no hay la palabra
              No hacer esto 'formStepNumber: 1' sino se encuentra la palabra formulario en ningun vector de 'steps'
              `;
              
              if (chatGptResponse.includes('Livu')) {
                const availableAppsResponse = `🩷🩷🩷🩷🩷🩷🩷🩷
No disponible en: Venezuela/ Puerto Rico/ Rep Dominicana/ EEUU   
🌹 Mira el video para realizar correctamente el proceso de registro :) 
                            
💚 Video de Activación: https://youtu.be/hgKphiE1RlA?si=8cs7o-px4x-ZRnW- 
 
No disponible en: Venezuela/ Puerto Rico/ Rep. Dominicana/ EEUU. 
 
💚Paso a paso, Livu&Yaar:   
 
Paso 1:  
 💚Descarga la app desde nuestro enlace, sube 6 fotos tipo documento, sin filtros y copia tu ID Livu/Yaar. Livu&Yaar App: https://livu.live/descargar.html  
 
 Paso 2  
 💚 Formulario de registro: https://forms.gle/UnDsydPpfvCpXevy7   
 
 Paso 3: 
 💚Envíanos tu ID Livu/Yaar por este chat para completar el proceso
`;
                
                const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                
                const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Livu/Yaar", appInfo.steps, appInfo.formStepNumber);
                await this.userRepository.save(user);

                const model = MessageText(availableAppsResponse, phoneNumber);
                // await this.whatsappService.sendMessage(model);
                const dataSend = {
                  de: "+573102605806",
                  para: model.to,
                  mensaje: model.text.body
                }
                socket.emit('mensaje-personal', dataSend);

              };
              if (chatGptResponse.includes('Olive')) {
                const availableAppsResponse = `💛Este enlace de invitación es válido hasta 2024-05-16  10:14 🇨🇴 
 
💛PROCESO DE REGISTRO EN 3 PASOS APP OLIVE 
                             
💛Hola linda, Bienvenida a Angels Streamers Agency 💛 
* sigue estos pasos para realiza el proceso correctamente✔ 
                             
💛Paso 1:  
Como Registrarte  👉https://youtu.be/KyvlDboSFZ4 
                             
-Link de descarga ANDROID 👉https://livebalance.biz/signup?token=0540ac82-18b0-48c8-805d-ed924c7db601
                              
-Link de descarga IPHONE 👉 https://apps.apple.com/us/app/toplive-live-video-chat-app/id1598551382 
                             
💛Paso 2:  
Formulario de ACTIVACIÓN 👉 https://forms.gle/tzzshrivqCNEfBqa7 
                             
💛 Paso 3: 
indicar si tienes iPhone o Android y envíanos tu ID Olive para poder brindarte mayor información :)`;
                const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Olive", appInfo.steps, appInfo.formStepNumber);
                await this.userRepository.save(user);
                const model = MessageText(availableAppsResponse, phoneNumber);
                // await this.whatsappService.sendMessage(model);
                const dataSend = {
                  de: "+573102605806",
                  para: model.to,
                  mensaje: model.text.body
                }
                socket.emit('mensaje-personal', dataSend);
              };
              if (chatGptResponse.includes('Livchat')) {
                const availableAppsResponse = `💜APP LIVCHAT💜
Importante contar con disponibilidad para realizar el proceso, ya que una vez lo termines y empieces a recibir llamadas no podrás rechazarlas o el sistema rechazará tu perfil sin oportunidad de realizar el proceso nuevamente. 
                            
-Aplican chicas de 18 a 39 años de edad.-
                            
Como realizar el proceso: https://youtu.be/sSXZpzLnaQc?si=7KEG-SlzD6hZiM3C
1. Descarga la aplicación:
                            
  💜Android: iconlink.vmatchs.com/#/pages/invite/hostess/hostess?id=1769414588761243648&name=angelsstreamers&endTime=abaobovhhlhcn&guild=child&country=Colombia
                            
  💜 iPhone: https://apps.apple.com/us/app/less-spend-less-save-more/id6447055642
                            
💜 2. Formulario de Registro Angels Stremers Agency:
  https://forms.gle/u2F4BcjS4cJMUYK86
                            
💜Quedo atento a tu Nombre Artístico en la app para poder brindarte mayor información`;
                const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Livchat", appInfo.steps, appInfo.formStepNumber);
                await this.userRepository.save(user);
                const model = MessageText(availableAppsResponse, phoneNumber);
                // await this.whatsappService.sendMessage(model);
                const dataSend = {
                  de: "+573102605806",
                  para: model.to,
                  mensaje: model.text.body
                }
                socket.emit('mensaje-personal', dataSend);
              };
              if (chatGptResponse.includes('Hiti')) {
                let availableAppsResponse = "";
                if (chatGptResponse.includes('iPhone')) {
                  availableAppsResponse = `🌹Preciosa 🌸lee atentamente para realizar el proceso de registro correctamente❤️

1. Descarga esta aplicación - TestFlight
https://apps.apple.com/us/app/testflight/id899247664?mt=8
                  
2. Sigue este enlace e instala Pattino
https://testflight.apple.com/join/Em1EpLXy
                  
3. Abre la aplicación Pattino y dale permiso para recibir notificaciones
4. Dale clic en siguiente
5. Dale clic en Comenzar a probar
6. Introduce el código de invitación: A1150
7. Dale clic en iniciar sesión
8. Si ya tienes una cuenta, haga clic en INICIAR SESIÓN
   Si desea crear una cuenta, haga clic en REGISTRARSE
9. Si ya tiene una cuenta, ingrese su nombre de usuario y contraseña existentes
10. ID de agencia: 823
                  
🌸Copia tu ID Hiti (Código de 10 dígitos que encuentras en tu perfil)
                  
🌸Espera aprobación , tu misma puedes ver el estado de moderación.`;

                  const model = MessageText(availableAppsResponse, phoneNumber);
                  // await this.whatsappService.sendMessage(model);
                  const dataSend = {
                    de: "+573102605806",
                    para: model.to,
                    mensaje: model.text.body
                  }
                  socket.emit('mensaje-personal', dataSend);
                } else {
                  availableAppsResponse = `🧡PROCESO  APP HITI 🧡 Para Android: 
  
  Ĥiti es una App de video llamadas donde podrás retirar directamente desde la Aplicación, la meta mínima es de 27.500 monedas iguales a $50 dólares, retira por medio de BINANCE   
                              
  Como realizar el proceso de activación: https://youtu.be/Mo8Z1MQjXck?si=GCMaY-UjaTKZsxO-
                              
  Realiza el proceso de ACTIVACION en 5 pasos:
                              
  🧡 1. Descargar la Aplicación AQUI 👉https://play.google.com/store/apps/details?id=com.hiti.android
                              
  🧡 2. Regístrate utilizando un nombre falso, crea una contraseña y agrega el código de la agencia 823
                              
  🧡 3. Sube foto de tu cedula y rostro para la Aprobación de tu perfil.
                              
  🧡 4. Sube 5 fotos de tu rostro sin escote y un video corto
                              
  🧡 5. envíanos tu ID Hiti para completar el proceso`;

                  const model = MessageText(availableAppsResponse, phoneNumber);
                  // await this.whatsappService.sendMessage(model);
                  const dataSend = {
                    de: "+573102605806",
                    para: model.to,
                    mensaje: model.text.body
                  }
                  socket.emit('mensaje-personal', dataSend);
                };
                
                const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                
                const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Hiti", appInfo.steps, undefined);
                await this.userRepository.save(user);
              };
              if (chatGptResponse.includes('Salsa')) {
                const availableAppsResponse = `🔝Bienvenida a Angels Agency🤳🌟

No iPhone/ Solo edades: +18-40 años
                            
Antes de continuar con el proceso de registro en la App Salsa, revisa el siguiente video:  https://youtu.be/bxCiUocUamI             
  Proceso en 3 pasos 
1) Link de descarga👉 https://salsa-live.web.app/apk    
                                
2) Diligenciar el formulario 👇👇👇👇
https://forms.gle/J83z6Xepe6mRZvSd7         
                            
3) Deja tu ID Salsa en este CHAT para completar el registro 🌟`;
const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                
const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Salsa", appInfo.steps, appInfo.formStepNumber);
                await this.userRepository.save(user);
                const model = MessageText(availableAppsResponse, phoneNumber);
                // await this.whatsappService.sendMessage(model);
                const dataSend = {
                  de: "+573102605806",
                  para: model.to,
                  mensaje: model.text.body
                }
                socket.emit('mensaje-personal', dataSend);
              };
              if (chatGptResponse.includes('Superlive')) {
                const availableAppsResponse = `💙APP SUPERLIVE💙

Superlive es una aplicacion 100% para transmitir ,en esta app para tener exito debes ser extrovertida y carismatica✨
                            
🩵 Aplican chicas de 18 a 50 años de edad.
                            
* Mira el siguiente video para lograr la activación de tu perfil en Superlive✨
                            https://youtu.be/K8ZNdOf2tdY?si=gwNIS4ZJMi0f4dMR
                            
🩵 1. Descargar La aplicación
👇🏻👇🏻👇🏻👇🏻👇🏻
https://sprlv.link/hmgj2cid
                            
Código Manager: hmgj2cid
                            
🩵 2. Envíanos un Capture de tu Manager en la app como indicamos en el video, para poder brindarte mayor información.`;
const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                
const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Superlive", appInfo.steps, appInfo.formStepNumber);
                await this.userRepository.save(user);
                const model = MessageText(availableAppsResponse, phoneNumber);
                // await this.whatsappService.sendMessage(model);
                const dataSend = {
                  de: "+573102605806",
                  para: model.to,
                  mensaje: model.text.body
                }
                socket.emit('mensaje-personal', dataSend);
              };

              if (chatGptResponse.includes('Po.Live')) {
                const availableAppsResponse = `💗PO. LIVE 💗

Po. Live es una aplicación 100% para transmitir 0% contenido explicito. En esta app para tener exito debes ser extrovertida y carismática ✨
                            
💗Registrate en Po Live
                            
https://youtu.be/lyEquQxFg_8?si=WiyKzDb9M3zNQWup
                            
💗 Aplican chicas de 18 a 50 años de edad.
                            
💗 1. Descargar La aplicación
👇🏻👇🏻👇🏻👇🏻👇🏻
                            
https://play.google.com/store/apps/details?id=com.baitu.qingshu
                            
Código de Agencia: 20354091
                            
víanos un Capture de tu Manager en la💗 2. En app como indicamos en el video, para poder brindarte mayor información.`;
const chatGptSteps = await this.chatGptService.getResponse(availableAppsResponse, promptSteps);
                
const appInfo = this.parseAppInfo(chatGptSteps);
                user.setChosenApp("Po.Live", appInfo.steps, appInfo.formStepNumber);
                await this.userRepository.save(user);
                const model = MessageText(availableAppsResponse, phoneNumber);
                // await this.whatsappService.sendMessage(model);
                const dataSend = {
                  de: "+573102605806",
                  para: model.to,
                  mensaje: model.text.body
                }
                socket.emit('mensaje-personal', dataSend);
              };

            }
          }
          if (chatGptAnalytics.includes('HABLAR')) {
            // const pruebaDocEmbbedding = await this.knowledgeBaseService.updateAllDocumentsWithEmbeddings();
            const searchDB = await this.knowledgeBaseService.searchKnowledgeBase(message);
            const content = searchDB.map(doc => doc.content).join('\n');
            const prompt = `Construye una respuesta corta y fácil de entender usando los datos extraídos de la base de datos, descartando los datos que no tengan que ver con el mensaje del usuario. Si el contenido del mensaje no está dentro de los datos de la base de datos, indica que no tienes la información. Responde únicamente con información relacionada con el mensaje del usuario.
            Da respuestas naturales como si fuera un humano siendo amable y servicial con las chicas.
            
            Mensaje del usuario: ${message}
            
            Datos de la base de datos: ${content}`;
            const chatGptResponse = await this.chatGptService.getResponse(message, prompt);
            // console.log("Respuesta de GPT: ", chatGptResponse);
            const model = MessageText(chatGptResponse, phoneNumber);
            // await this.whatsappService.sendMessage(model);
            const dataSend = {
              de: "+573102605806",
              para: model.to,
              mensaje: model.text.body
            }
            socket.emit('mensaje-personal', dataSend);
          }

        }

      } else {
        
        const searchDB = await this.knowledgeBaseService.searchKnowledgeBase(`contexto de la app ${user.chosenApp}`);
          const content = searchDB.map(doc => doc.content).join('\n');
          
          const prompt = `Construye un contexto detallado sobre la aplicación elegida "${user.chosenApp}" utilizando los datos relevantes extraídos de la base de datos. Asegúrate de incluir información valiosa como el proceso de registro, requisitos, características principales y cualquier otro detalle importante relacionado con esta aplicación en particular. Omite cualquier información irrelevante que no esté directamente relacionada con "${user.chosenApp}".

          Al construir el contexto, sigue estos lineamientos:

          1. Describe el proceso de registro paso a paso, mencionando cualquier requisito específico o instrucción clave.
          
          2. Destaca las características principales y funcionalidades más importantes de la aplicación.
          
          3. Menciona cualquier consideración especial, restricción o advertencia que deba tenerse en cuenta al utilizar esta aplicación.
          
          4. Finaliza con un resumen conciso de los puntos más relevantes.
          
          Utiliza un tono amigable y profesional al redactar el contexto. Recuerda que la información debe ser precisa, clara y fácil de entender para el usuario.
Datos de la base de datos: ${content}`;
          const chatGptResponse = await this.chatGptService.getResponse(prompt);
          console.log("Respuesta de GPT: ", chatGptResponse);
        //aca obtengo todos los pasos de la app elegida 
        const isRegistrationStep = await this.verifyRegistrationStepUseCase.execute(message, user); // Cambiar el stepNumber
        console.log("Pasa el caso de uso de verificar paso");
        console.log(isRegistrationStep);
        // const pruebaconsultaDB = await this.knowledgeBaseService.searchKnowledgeBase(message);
        // const pruebaDocEmbbedding = await this.knowledgeBaseService.updateAllDocumentsWithEmbeddings();  //Prueba para crear el embedding de toda la coleccion KnowledgeBase
        // console.log("Documento encontrado: ", pruebaconsultaDB);
      //   const lastStepContent = user.steps!.length-1;
      //   console.log(lastStepContent);

      // const prompt = `Determina si el siguiente mensaje del usuario cumple con las instrucciones del paso "${lastStepContent}":

      // Mensaje del usuario: ${message}`;

      // const chatGptResponse = await this.chatGptService.getResponse(prompt);
      //   console.log("Respuest si cumple el ultimo paso: ", chatGptResponse);
        

        if (isRegistrationStep) {

          // const stepCompletionResult = await this.registerStepUseCase.execute(message, user);
          // const response = stepCompletionResult
          //   ? 'Paso de registro completado correctamente.'
          //   : 'No se pudo completar el paso de registro.';
          // const model = MessageText(response, phoneNumber);
          console.log('El usuario completó el último paso');
          // await this.whatsappService.sendMessage(model);
          // const dataSend = {
          //   de: "+573102605806",
          //   para: model.to,
          //   mensaje: model.text.body
          // }
          // socket.emit('mensaje-personal', dataSend);
        } else {
          console.log('El mensaje no cumple con el último paso');
          const searchDB = await this.knowledgeBaseService.searchKnowledgeBase(message);
          const content = searchDB.map(doc => doc.content).join('\n');
          const prompt = `Construye una respuesta corta y fácil de entender usando los datos extraídos de la base de datos, descartando los datos que no tengan que ver con el mensaje del usuario. Si el contenido del mensaje no está dentro de los datos de la base de datos, indica que no tienes la información. Responde únicamente con información relacionada con el mensaje del usuario.
Da respuestas naturales como si fuera un humano siendo amable y servicial con las chicas.
Si el usuario ya tiene una app elegida ${user.chosenApp} decirle lo siguiente: Linda ya has elegido registrarte en la app: ${user.chosenApp}, solo puedes registrarte en una app

Mensaje del usuario: ${message}
            
Datos de la base de datos: ${content}`;
          const chatGptResponse = await this.chatGptService.getResponse(message, prompt);
          console.log("Respuesta de GPT: ", chatGptResponse);

          const model = MessageText(chatGptResponse, phoneNumber);
          // await this.whatsappService.sendMessage(model);
          const dataSend = {
            de: "+573102605806",
            para: model.to,
            mensaje: model.text.body
          }
          socket.emit('mensaje-personal', dataSend);
        }
      }


      
    }
  }

  private parseAppInfo(input: string): { steps: string[], formStepNumber: number | undefined } {
    const stepsMatch = input.match(/steps:\s*\[(.*?)\]/s);
    const formStepNumberMatch = input.match(/formStepNumber:\s*(\d+)/);
    
    if (!stepsMatch || !formStepNumberMatch) {
      throw new Error('Formato inválido del string');
    }

    const stepsString = stepsMatch[1].trim();
    const steps = stepsString.split(',').map(step => step.trim().replace(/^'|'$/g, ''));

    let formStepNumber: number | undefined;

  // Buscar el índice del paso con el formulario
  const palabrasClave = ['formulario', 'registro', 'ingresa tus datos', 'completa el formulario'];
  const hayFormulario = steps.some((paso, index) => {
    const contenidoPaso = paso.toLowerCase();
    if (palabrasClave.some(palabra => contenidoPaso.includes(palabra))) {
      formStepNumber = index;
      return true;
    }
    return false;
  });

  // Si no se encontró un formulario, asignar undefined a formStepNumber
  if (!hayFormulario) {
    formStepNumber = undefined;
  }
    
    return { steps, formStepNumber };
  }

  // private async getRegistrationSteps(appName: string): Promise<{ steps: string[], formStepNumber?: number }> {
  //   const prompt = `Extrae los pasos de registro y el número de paso en el que se debe rellenar un formulario de la siguiente descripción:

  // ${appRegistrationSteps[appName].steps.join('\n')}`;

  //   const response = await this.chatGptService.getResponse(prompt);

  //   if (response) {
  //     // Analiza la respuesta de ChatGPT y extrae los pasos y el número de paso del formulario
  //     // Puedes utilizar expresiones regulares o cualquier otra técnica de procesamiento de texto
  //     // Retorna un objeto con los pasos y el número de paso del formulario
  //   } else {
  //     // Maneja el caso cuando no se pueda obtener una respuesta de ChatGPT
  //     return appRegistrationSteps[appName];
  //   }
  // }

}
