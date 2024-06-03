export interface Message {
    messaging_product: string;
    // recipient_type: string,
    to: string;
    text: {
        preview_url: boolean;
        body: string;
    };
    type: string;
}

// Function to create a Message object
export function MessageText(textResponse: string, number: string): Message {
    const data: Message = {
        messaging_product: "whatsapp",
        // recipient_type: "individual",
        to: number,
        text: {
            preview_url: true,
            body: textResponse,
        },
        type: "text",
    };

    return data;
}
