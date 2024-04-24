import { BackendResponse } from '../models/BackendResponse';

const baseURL: String = "https://7c79-190-96-238-73.ngrok-free.app/";

export async function checkPhoneNumber(number: string): Promise<BackendResponse> {
    try {
        const response = await fetch(`${baseURL}api/login/numero`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "numero":number })
        });
        const data: BackendResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error al verificar el número de teléfono:", error);
        const dataerror: BackendResponse = {"ok": false}
        return dataerror;
    }
}

export async function addPhoneNumber(number: string): Promise<BackendResponse> {
    try {
        const response = await fetch(`${baseURL}api/login/Crearnumero`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "numero":number })
        });
        
        const data: BackendResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error al agregar el número de teléfono:", error);
        const dataerror: BackendResponse = {"ok": false}
        return dataerror;
    }
}
