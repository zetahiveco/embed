import { NextFunction, Request, Response } from "express";
import Database from "../storage/db";

export async function verifyMembership(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers["organization-id"]) {
            res.status(403).json({ detail: `no organization id found` });
            return;

        }
        const prisma = Database.getInstance();
        const member = await prisma.member.findFirst({
            where: {
                organizationId: req.headers["organization-id"] as string,
                userId: res.locals.user
            }
        })
        if (!member) {
            throw new Error(`not part of organization`)
        }
        res.locals.organization = req.headers["organization-id"];
        res.locals.role = member.role;
        next();
    } catch (err) {
        res.status(403).json({ detail: `you're not part of this organization` });
        return;
    }
}

export function checkIfOrganizationAdmin(_: Request, res: Response, next: NextFunction) {
    if (res.locals.role !== "ADMIN") {
        res.status(403).json({ detail: `you don't have sufficient permissions` });
        return;

    }
    next();
}
