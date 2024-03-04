import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function verifyUserAuth(req: Request, res: Response, next: NextFunction) {
    try {
        let token: any = jwt.verify(req.headers.authorization?.split(" ")[1] as string, process.env.SIGNING_SECRET as string);
        res.locals.user = token.userId;
        next();
    } catch (err) {
        res.status(401).json({ detail: `unable to authenticate user` });
        return;
    }
}

export function publicRenderAuth(req: Request, res: Response, next: NextFunction) {
    try {
        let token: any = jwt.verify(req.headers.authorization?.split(" ")[1] as string, process.env.SIGNING_SECRET as string);
        res.locals.resource = token.resourceId;
        res.locals.variables = token.variables;
        next();
    } catch (err) {
        res.status(401).json({ detail: `unable to authenticate user` });
        return;
    }
}
