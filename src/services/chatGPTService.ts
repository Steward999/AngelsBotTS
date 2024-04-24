import OpenAI from "openai";
import fetch from "node-fetch";
require('dotenv').config();

const apiKey: string | undefined = process.env.apiKeyOpenAI;

// const openai = new OpenAI();

let assistantId: string | null = null;
let currentThreadId: string | null = null;

async function GetMessageChatGPT(text: string): Promise<string> {
    console.log(apiKey);
    if (!assistantId) {
        let existAssistants = false;
        //   const listAssitants = await openai.beta.assistants.list({
        //     order: "desc",
        //     limit: "20",
        //   });

        const listAssitants = await fetch("https://api.openai.com/v1/assistants", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v1"
            },
            // body: JSON.stringify()
        }).then(response => response.json())
            .then(data => {
                data.data.forEach((assistant: { name: string; id: string; }) => {
                    if (assistant.name.includes("Angels Bot")) {
                        assistantId = assistant.id;
                        existAssistants = true;
                    }
                    console.log("Envia la peticion de listar los asitentes");                    
                    
                });
                return data;
            })
            .catch(error => {
                console.error("Error al realizar la solicitud:", error);
            });
        if (!existAssistants) {
            await CreateAssistant();
        }
    }

    if (!currentThreadId) {
        const thread = await fetch("https://api.openai.com/v1/threads", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v1"
            },
            body: JSON.stringify({})
        }).then(response => response.json())
            .then(data => {
                currentThreadId = data.id;
                return data;
            })
            .catch(error => {
                console.error("Error al realizar la solicitud:", error);
            });
    }

    //Añado un mensaje al hilo
    const message = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v1"
        },
        body: JSON.stringify({ role: "user", content: text })
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });

    //Ejecutar el asistente
    const run = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v1"
        },
        body: JSON.stringify({ assistant_id: assistantId, additional_instructions: "..." })
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });

    // Paso 5: Verifica el estado de la ejecución
    let runStatus = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${run.id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v1"
        },
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });

    // Espera hasta que la ejecución esté completada
    while (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${run.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v1"
            },
        }).then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Error al realizar la solicitud:", error);
            });
    }

    //Listo los mensajes en el hilo
    const messages = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v1"
        },
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });

    messages.data.forEach((message: { role: string; content: { [x: string]: { value: string; }; }[]; }) => {
        console.log(`${message.role}: ${message.content[0].value}`);
    });
    const lastMessage = messages.data[0];
    console.log("Ultimo mensaje que se envia");
    console.log(`${lastMessage.role}: ${lastMessage.content[0].text.value}`);
    return lastMessage.content[0].value;
}

async function CreateAssistant() {
    const assistant = await fetch("https://api.openai.com/v1/assistants", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v1"
        },
        body: JSON.stringify({
            name: "Angels Bot",
            model: "gpt-3.5-turbo",
            instructions: "You are helpful assistant. Ayudas a las chicas a que realizen el paso a paso que se les envia para registrarse en la app. da respuestas cortas y faciles de entender. Siempre que sea el primer mensaje dile esto a la chica: 🪽Hola linda ,Hablas con  🤖AngelsBot tu Asistente virtual. ✨️Nos encantaria saber en que aplicación estas interesada. Por favor indicame la App de tu interes. \nApp Livu yaar ( Chicas de 18 a 60 años. NO APLICAN CHICAS QUE ESTEN EN VENEZUELA)\nApp Hiti (chicas de 18 a 60 años) \nApp Olive ( chicas de 18 a 60 años) \nApp Salsa ( chicas de 18 a 34 años) \nApp superlive ( chicas de 18 a 50 años) \no dime si Quieres saber más del trabajo.",
            // tools: [{ type: "code_interpreter" }],
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            assistantId = data.id;

            return data;
            // myConsole.log("Respuesta de ChatGPT: " + data.choices[0].message.content);

            // if (data.choices.length >= 0) {
            //   console.log("respuetsa GPT: "+data.choices[0].message.content);

            //   dataResponse = data.choices[0].message.content;

            // } else {
            //   dataResponse = null;
            // }
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });
}

export {GetMessageChatGPT}