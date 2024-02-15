import { Buffer } from "buffer";

export function decodeJWT(token: string) {
    const tokenDecodablePart = token.split('.')[1];
    const decoded = Buffer.from(tokenDecodablePart, 'base64').toString();
    return JSON.parse(decoded);
}
