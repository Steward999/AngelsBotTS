interface Usuario {
    nombre?: string;
    numero: string;
    online: boolean;
    uid: string;
}
export interface BackendResponse {
    ok: boolean;
    usuario?: Usuario;
    token?: string;
}
