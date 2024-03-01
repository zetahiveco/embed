import { MemberRoleType } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "./email.service";
import { generateOTP } from "../utils/otp";
import Database from "../storage/db";

export async function sendEmailInvite(email: string, organizationId: string, role: string) {

    const prisma = Database.getInstance();

    let isNewUser = true;

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (user) {
        const member = await prisma.member.findFirst({
            where: {
                userId: user.id,
                organizationId: organizationId
            }
        })

        if (member) {
            throw new Error("member already exists");
        }

        isNewUser = false;
    }

    const otp = generateOTP(6);

    let userInvite = await prisma.userInvite.findFirst({
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
                organizationId: organizationId,
                role: role as MemberRoleType
            }
        })
    } else {
        userInvite = await prisma.userInvite.create({
            data: {
                email: email,
                otp: otp,
                expiresAt: newExpiryDate,
                organizationId: organizationId,
                role: role as MemberRoleType
            }
        })
    }

    const link = `${process.env.INSTANCE_CLIENT_URL}/admin/auth/accept-invite?isNewUser=${isNewUser}&email=${email}&otp=${otp}&inviteId=${userInvite.id}`;

    await sendEmail(
        email,
        `You've been invited to the app`,
        `Hi, \nYou've been added to the app.\nUse this link ${link} to join the app.\nWith Regards,\nTeam.`
    )

    return;
}


export async function verifyUserInvite(id: string, email: string, otp: string) {
    const prisma = Database.getInstance();
    const userInvite = await prisma.userInvite.findFirst({
        where: {
            id: id,
            email: email
        }
    })

    if (userInvite && userInvite.otp === otp) {
        await prisma.userInvite.delete({
            where: {
                id: id
            }
        })
        return { status: true, role: userInvite.role, organizationId: userInvite.organizationId };
    }

    return { status: false, role: null, organizationId: "" };
}


export async function checkIfUserExists(email: string) {
    const prisma = Database.getInstance();
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (user) {
        return user.id.toString();
    }
    return null;
}


export async function createUser(name: string, email: string, password: string, role: string, company: string = "", organizationId: string = "") {

    if (!company && !organizationId) {
        throw new Error(`either the company name or organization must be provided`)
    }

    const prisma = Database.getInstance();
    const hashedPassword = await bcrypt.hash(password, 10);

    let userId = await checkIfUserExists(email);

    return await prisma.$transaction(async (trx) => {

        if (!userId) {
            const user = await trx.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword
                }
            });
            userId = user.id;
        }

        if (!organizationId) {
            const organization = await trx.organization.create({
                data: {
                    name: company
                }
            })

            organizationId = organization.id;
        }

        await trx.member.create({
            data: {
                organizationId: organizationId,
                userId: userId,
                role: role as MemberRoleType
            }
        })
    })
}

export async function generateAccessTokens(email: string, password: string) {
    const prisma = Database.getInstance();
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
        userId: user.id,
        tokenType: "accessToken"
    }, process.env["SIGNING_SECRET"] as string, {
        expiresIn: accessTokenExpiry.getTime()
    });

    const refreshToken = jwt.sign({
        userId: user.id,
        tokenType: "refreshToken"
    }, process.env["SIGNING_SECRET"] as string, {
        expiresIn: refreshTokenExpiry.getTime()
    });

    return { accessToken, refreshToken }

}

export function refreshAccessToken(refreshToken: string) {
    const refreshDecoded: any = jwt.verify(
        refreshToken,
        process.env["SIGNING_SECRET"] as string
    );

    const accessTokenExpiry = new Date();
    accessTokenExpiry.setMinutes(accessTokenExpiry.getMinutes() + 30);

    const accessToken = jwt.sign({
        userId: refreshDecoded.userId,
        tokenType: "accessToken"
    }, process.env["SIGNING_SECRET"] as string, {
        expiresIn: accessTokenExpiry.getTime()
    });

    return accessToken;
}


export async function fetchOrganizations(userId: string) {
    const prisma = Database.getInstance();
    return await prisma.member.findMany({
        where: {
            userId: userId
        },
        include: {
            organization: {
                select: {
                    name: true
                }
            }
        }
    })
}

export async function fetchMembers(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.member.findMany({
        where: {
            organizationId: organizationId
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })
}

export async function getUser(userId: string) {
    const prisma = Database.getInstance();
    return await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    })
}


export async function fetchUserInvites(organizationId: string) {
    const prisma = Database.getInstance();
    return await prisma.userInvite.findMany({
        where: {
            organizationId: organizationId
        },
        select: {
            email: true,
            role: true,
            expiresAt: true
        }
    })
}


export async function deleteUserInvite(inviteId: string, organizationId: string) {
    const prisma = Database.getInstance();

    return await prisma.userInvite.delete({
        where: {
            id: inviteId,
            organizationId: organizationId
        }
    })
}


export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
    const prisma = Database.getInstance();
    const user = await prisma.user.findFirstOrThrow({
        where: {
            id: userId
        }
    })
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        throw new Error("invalid password");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashPassword
        }
    })
}


export async function sendPasswordResetRequest(email: string) {
    const prisma = Database.getInstance();


    const otp = generateOTP(6);

    await prisma.user.update({
        where: {
            email: email
        },
        data: {
            passwordResetOtp: otp
        }
    })

    const link = `${process.env.INSTANCE_CLIENT_URL}/admin/auth/reset-password?email=${email}&otp=${otp}`;

    await sendEmail(
        email,
        `Link to reset your password`,
        `Hi,\nUse this link ${link} to reset your password.\nWith Regards,\nTeam.`
    )

    return;
}


export async function resetPassword(email: string, otp: string, password: string) {
    const prisma = Database.getInstance();

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: email
        }
    });

    if (user.passwordResetOtp && user.passwordResetOtp !== otp) {
        throw new Error("invalid otp");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return await prisma.user.update({
        where: {
            email: email
        },
        data: {
            password: hashPassword,
            passwordResetOtp: null
        }
    })
}

