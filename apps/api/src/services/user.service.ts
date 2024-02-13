import { PrismaClient, UserRoleType } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "./email.service";
import { generateOTP } from "../utils/otp";

export async function sendEmailInvite(email: string, role: UserRoleType) {
    const prisma = new PrismaClient();

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (user) {
        throw new Error("user already exists");
    }

    const otp = generateOTP(6);

    const link = `${process.env.INSTANCE_CLIENT_URL}/auth/accept-invite?email=${email}&otp=${otp}`;

    const userInvite = await prisma.userInvite.findFirst({
        where: {
            email: email
        }
    })

    const newExpiryDate = new Date();

    newExpiryDate.setDate(newExpiryDate.getHours() + 48);

    if (userInvite) {
        await prisma.userInvite.update({
            where: {
                id: userInvite.id
            },
            data: {
                email: email,
                otp: otp,
                expiresAt: newExpiryDate,
                role: role
            }
        })
    } else {
        await prisma.userInvite.create({
            data: {
                email: email,
                otp: otp,
                expiresAt: newExpiryDate,
                role: role
            }
        })
    }

    await sendEmail(
        email,
        `You've been invited to the app`,
        `Hi, \nYou've been added to the app.\nUse this link ${link} to join the app.\nWith Regards,\nTeam.`
    )

    return;
}


export async function verifyUserInvite(email: string, otp: string) {
    const prisma = new PrismaClient();
    const userInvite = await prisma.userInvite.findFirst({
        where: {
            email: email
        }
    })

    if (userInvite && userInvite.otp === otp) {
        await prisma.userInvite.delete({
            where: {
                email: email
            }
        })
        return { status: true, role: userInvite.role };
    }

    return { status: false, role: null };
}

export async function createUser(name: string, email: string, role: UserRoleType, password: string) {
    const prisma = new PrismaClient();
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name: name,
            email: email,
            role: role,
            password: hashedPassword
        }
    });

    return;
}

export async function generateAccessTokens(email: string, password: string) {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!user) {
        throw new Error("user not found")
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("invalid credentials");
    }

    const accessTokenExpiry = new Date();
    accessTokenExpiry.setMinutes(accessTokenExpiry.getMinutes() + 30);

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setMinutes(refreshTokenExpiry.getHours() + 12);


    const accessToken = jwt.sign({
        user_id: user.id,
        token_type: "access_token"
    }, process.env["SIGNING_SECRET"] as string, {
        expiresIn: accessTokenExpiry.getTime()
    });

    const refreshToken = jwt.sign({
        user_id: user.id,
        token_type: "refresh_token"
    }, process.env["SIGNING_SECRET"] as string, {
        expiresIn: refreshTokenExpiry.getTime()
    });

    return {
        "access_token": accessToken,
        "refresh_token": refreshToken
    }

}

export function refreshAccessToken(refreshToken: string) {
    const refreshDecoded: any = jwt.verify(
        refreshToken,
        process.env["SIGNING_SECRET"] as string
    );

    const accessTokenExpiry = new Date();
    accessTokenExpiry.setMinutes(accessTokenExpiry.getMinutes() + 30);

    const accessToken = jwt.sign({
        user_id: refreshDecoded.user_id,
        token_type: "access_token"
    }, process.env["SIGNING_SECRET"] as string, {
        expiresIn: accessTokenExpiry.getTime()
    });

    return accessToken;
}

export async function deleteUser(userId: string) {
    const prisma = new PrismaClient();
    await prisma.user.delete({
        where: {
            id: userId
        }
    });
    return;
}
