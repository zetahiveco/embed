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



export async function getTestVariables(organizationId: string) {
    const prisma = Database.getInstance();

    return await prisma.testVariable.findMany({
        where: {
            organizationId: organizationId
        }
    })

}


export async function createTestVariable(name: string, value: string, organizationId: string) {
    const prisma = Database.getInstance();

    const exists = await prisma.testVariable.findFirst({
        where: {
            name: name,
            organizationId: organizationId
        }
    })

    if (exists) {
        throw new Error("variable exists");
    }

    await prisma.testVariable.create({
        data: {
            name: name,
            value: value,
            organizationId: organizationId
        }
    })

    return;
}


export async function deleteTestVariable(id: string, organizationId: string) {
    const prisma = Database.getInstance();

    return await prisma.testVariable.delete({
        where: {
            id: id,
            organizationId: organizationId
        }
    })

}


export async function generateRenderToken(key: string, variables: Array<{ name: string, value: string }> = [], organizationId: string = "") {

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
        resourceId: organizationId,
        variables: variables
    }, process.env["SIGNING_SECRET"] as string, { expiresIn: tokenExpiry.getTime() });

    return token;

}
