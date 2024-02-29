import Database from "../storage/db";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

export async function getApiKeys(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.apiKey.findMany({
        where: {
            organizationId: organizationId
        }
    })
}

export async function createApiKey(name: string, organizationId: string) {
    const prisma = Database.getInstance();
    await prisma.apiKey.create({
        data: {
            name: name,
            apiKey: v4().toString(),
            organizationId: organizationId
        }
    })
    return;
}


export async function deleteApiKey(key: string, organizationId: string) {
    const prisma = Database.getInstance();
    await prisma.apiKey.delete({
        where: {
            apiKey: key,
            organizationId: organizationId
        }
    })
    return;
}


export async function generateRenderToken(key: string, organizationId: string = "") {

    if (!organizationId) {
        const prisma = Database.getInstance();
        const apiKey = await prisma.apiKey.findFirstOrThrow({
            where: {
                apiKey: key,
            }
        })
        organizationId = apiKey.organizationId.toString()
    }

    const tokenExpiry = new Date();
    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 5);


    const token = jwt.sign({
        resourceId: organizationId
    }, process.env["SIGNING_SECRET"] as string, { expiresIn: tokenExpiry.getTime() });

    return token;

}
