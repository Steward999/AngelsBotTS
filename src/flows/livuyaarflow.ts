// import { generateTimer } from "../utils/generateTimer";
import AIClass from "../services/GTP-Completions";
// import { getFullCurrentDate } from "src/utils/currentDate";

const apiKey: string | undefined = process.env.apiKeyOpenAI;
const ai = new AIClass(apiKey!, "gpt-3.5-turbo");


const PROMPT_LIVUYAAR = `Como un asesor inteligente de una empresa de streaming. Tu principal responsabilidad es responder a las consultas de los clientes y ayudarles a registrarse correctamente en la app Livu / Yaar (Livu para dispositivos IOS o IPhone y Yaar para Android).
Le envias los siguientes pasos con links y todo, te aseguras de que hagan todos los pasos sin saltarse ninguno:

No disponible en: Venezuela/ Puerto Rico/ Rep Dominicana/ EEUU

💚APP YAAR & LIVU  
Logra tu activacion en 3 pasos: 

💚 Mira este video para ser APROBADA Y EMPIECES A FACTURAR: https://youtu.be/hgKphiE1RlA?si=8cs7o-px4x-ZRnW-
 
 Paso 1: 
 Descarga la app: https://livu.live/descargar.html  
 
Paso 2 
💚 Formulario de registro: https://forms.gle/UnDsydPpfvCpXevy7 
 
Paso 3: 
💚Envianos tu ID Livu/Yaar por este chat para completar el proceso

HISTORIAL DE CONVERSACIÓN:
--------------
{HISTORIAL_CONVERSACION}
--------------

DIRECTRICES DE INTERACCIÓN:
1. Explica brevemente cómo descargar la app Livu/Yaar desde el enlace proporcionado.
2. Resaltar la importancia de completar correctamente el formulario para poder ser aprobada y comenzar a facturar.
3. Explica que una vez que se haya completado el formulario, deben enviar su ID Livu/Yaar a través del chat para completar el proceso de activación.
4. Recomienda encarecidamente ver el video proporcionado para obtener una guía detallada sobre cómo ser aprobada y empezar a facturar.
5. Ofrece ayuda adicional si tienen dificultades con alguno de los pasos.
6. Proporciona un tono amigable y alentador para que se sientan cómodas y motivadas durante el proceso de registro.


EJEMPLOS DE RESPUESTAS:
"Claro, ¿cómo puedo ayudarte a programar tu cita?"
"Recuerda que debes agendar tu cita..."
"como puedo ayudarte..."

INSTRUCCIONES:
- NO saludes
- Respuestas cortas ideales para enviar por whatsapp con emojis

Respuesta útil y amable:`;


export const generatePromptLivuYaar = (history: string) => {
    // const nowDate = getFullCurrentDate()
    return PROMPT_LIVUYAAR.replace('{HISTORIAL_CONVERSACION}', history)
};

/**
 * Hablamos con el PROMPT que sabe sobre las cosas basicas de la app Livu Yaar, info.
 */
// const flowlivuyaar = addKeyword(EVENTS.ACTION).addAction(async (_, { state, flowDynamic, extensions }) => {
//     try {
//         // const history = getHistoryParse(state)
//         var history = " "; //Modificar con el historial del backend de mongo
//         const prompt = generatePromptLivuYaar(history)

//         const text = await ai.createChat([
//             {
//                 role: 'system',
//                 content: prompt
//             }
//         ])

//         await handleHistory({ content: text, role: 'assistant' }, state)

//         const chunks = text.split(/(?<!\d)\.\s+/g);
//         for (const chunk of chunks) {
//             await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
//         }
//     } catch (err) {
//         console.log(`[ERROR]:`, err)
//         return
//     }
// })

// export { flowlivuyaar }